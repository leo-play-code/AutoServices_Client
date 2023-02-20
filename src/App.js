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
import { FetchToStore } from "./state/store";

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
                            <Route path="/googlesheet/:docID/view" element={isAuth ?<FetchToStore><GooglesheetPage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/googlesheet/create" element={isAuth ? <FetchToStore><ImportgooglesheetPage /></FetchToStore>:<Navigate to="/" />}  />
                            <Route path="/home" element={isAuth ?<FetchToStore><HomePage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/form/:formname" element={isAuth ?<FetchToStore><FormModelPage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/formmodel/form/:formname" element={isAuth ? <FetchToStore><FormModelViewPage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/table" element={isAuth ? <FetchToStore><TablePage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/search" element={isAuth ?<FetchToStore><SearchPage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/formdata/:formdataid" element={isAuth ? <FetchToStore><FormDataViewPage /></FetchToStore>:<Navigate to="/" />} />
                            <Route path="/settings" element={isAuth? <FetchToStore><SettingPage /></FetchToStore>: <Navigate to="/" />} />
                            {/* <Route path="*" element={isAuth ?<Page404 />:<Navigate to="/" />} /> */}
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
