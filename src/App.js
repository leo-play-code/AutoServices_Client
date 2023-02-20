import { BrowserRouter,Navigate,Routes,Route } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";




import {useMemo} from "react";
// useSelector 抓取 static 裏面設定的值
import { useSelector } from "react-redux";
// CssBaseline = reset css ; themeprovide = 設定theme
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Page404 from "./scenes/errorPage";
import SearchPage from './scenes/searchPage/index';
import FormModelPage from './scenes/formmodelPage/index';

import FormDataViewPage from './scenes/formdataviewpage/index';
import SettingPage from "./scenes/SettingPage";
import FormModelViewPage from './scenes/formmodelviewpage/index';
import GooglesheetPage from "./scenes/googlesheetviewPage";
import ImportgooglesheetPage from './scenes/importgooglesheetPage/index';
import TablePage from './scenes/TablePage/index';
// import FormModelViewPage from './scenes/formmodelviewpage2/index';


function App() {
    const mode = useSelector((state)=>state.mode);
    const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode]);
    const isAuth = Boolean(useSelector((state)=>state.token));
    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                        <Routes>
                            <Route path="/" element={<LoginPage/>} />
                            <Route path="/googlesheet/:docID/view" element={isAuth ?<GooglesheetPage />:<Navigate to="/" />} />
                            <Route path="/googlesheet/create" element={isAuth ? <ImportgooglesheetPage />:<Navigate to="/" />}  />
                            <Route path="/home" element={isAuth ?<HomePage />:<Navigate to="/" />} />
                            <Route path="/form/:formname" element={isAuth ?<FormModelPage />:<Navigate to="/" />} />
                            <Route path="/formmodel/form/:formname" element={isAuth ? <FormModelViewPage />:<Navigate to="/" />} />
                            <Route path="/table" element={isAuth ? <TablePage />:<Navigate to="/" />} />
                            <Route path="/search" element={isAuth ?<SearchPage />:<Navigate to="/" />} />
                            <Route path="/formdata/:formdataid" element={isAuth ? <FormDataViewPage />:<Navigate to="/" />} />
                            <Route path="/settings" element={isAuth? <SettingPage />: <Navigate to="/" />} />
                            {/* <Route path="*" element={isAuth ?<Page404 />:<Navigate to="/" />} /> */}
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
