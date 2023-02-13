import BodyBox from "../../components/bodyBox"
import { 
    Box,
    useMediaQuery,
    IconButton,
    Typography,

} from "@mui/material";
import Navbar from "../navbar";
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { GoogleSheetGetSheetMap } from "../../api/googlesheet";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SheetProfile } from "./SheetProfile";
import { useContext,useRef } from 'react';
import { StoreContext } from '../../state/store';
import { GoogleSheetGetData } from "../../api/googlesheet";
import { TableWidget } from './TableWidget';

// icon 
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FilterWidget from "./FilterWidget";
import WidgetWrapper from '../../components/WidgetWrapper';

const GooglesheetPage = () =>{
    const [sheetlist,setSheetlist] = useState(undefined);
    const {storegooglelist} = useContext(StoreContext);
    const [googlelist,setGooglelist] = storegooglelist;
    const {docID} = useParams();
    const thisgooglesheet = googlelist.filter((sheet)=>sheet['_id']===docID)[0];
    const token = useSelector((state)=>state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1230px)");
    const WindowWidth = useSelector((state)=>state.width);
    const [disabled,setDisabled] = useState(false);
    const [screen,setScreen] = useState('part');
    const WindowHeight = useSelector((state)=>state.height);
    const [sheetdata,setSheetData] = useState([]);
    const tablechildRef = useRef();
    const tableRef = useRef();
    const GetSheetList = async()=>{
        const data = await GoogleSheetGetSheetMap(token,docID)
        setSheetlist(data['data'])
    }

    const setFieldValue = async(name,value) =>{
        setDisabled(true)
        var sheetID = null 
        if (value !== null){
            const sheetinfo = sheetlist.filter((sheet)=>sheet['name']===value)[0];
            sheetID = sheetinfo['sheetID']
        }        
        
        if (value !== null){
            const data =  await GoogleSheetGetData(token,thisgooglesheet['docID'],sheetID)
            setSheetData(data)
        }
        setDisabled(false)
    }
    
    

    useEffect(()=>{
        if (sheetlist === undefined){
            GetSheetList()
        }
    },[docID,sheetdata])
    return (
        <Box>
            <Navbar />
            <BodyBox
                padding="2rem 2%"
                display={isNonMobileScreens?"flex":"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >{
                ((screen!=="full")&&(
                    <Box 
                        flexBasis={isNonMobileScreens?"26%":undefined}
                        mb="1.5rem"
                        
                    >
                        <Box
                            position={isNonMobileScreens?"fixed":""}
                            width={isNonMobileScreens?(WindowWidth*0.23):"inherit"}
                        >
                            {sheetlist!==undefined&&<SheetProfile 
                                sheetname={thisgooglesheet['name']} 
                                sheetlist={sheetlist}
                                setFieldValue= {setFieldValue}
                                disabled = {disabled}
                            />}
                                <WidgetWrapper
                                    mt="1.1rem"
                                >
                                    <FilterWidget SheetData = {sheetdata}/>
                                </WidgetWrapper>
                        </Box>
                    </Box>
                ))
                }
                    
                    <Box
                        flexBasis={isNonMobileScreens?((screen==="full")?"99%":"75%"):undefined}
                        mb="1.5rem"
                    > 
                        <Box
                            sx={{
                                maxHeight:WindowHeight*0.85,
                                // overflow:"scroll"
                            }}
                            position={isNonMobileScreens?"fixed":""}
                            width={isNonMobileScreens?((screen==="full")?WindowWidth*0.95:WindowWidth*0.70):"inherit"}
                            ref = {tableRef}
                        >

                            {(sheetdata.length>0)&&
                                <TableWidget 
                                    SheetData = {sheetdata}
                                    ref = {tablechildRef}
                                    
                                />}
                        </Box>
                        {
                            (sheetdata.length>0)&&(
                                <Box
                                    sx={{
                                        position:"relative"
                                    }}
                                >
                                    {(screen==="full")?(
                                        <IconButton
                                            onClick={()=>setScreen('part')}
                                            sx={{
                                                position:"fixed",
                                                right:"1rem",
                                                top:"7rem",
                                                zIndex:"9"
                                            }}
                                        >
                                            <FullscreenExitIcon 
                                                fontSize='large'
                                            />
                                        </IconButton>
                                    ):(
                                        <IconButton
                                            onClick={()=>setScreen('full')}
                                            sx={{
                                                position:"fixed",
                                                right:"1rem",
                                                top:"7rem",
                                                zIndex:"9"
                                            }}
                                        >
                                            <FullscreenIcon 
                                                fontSize='large'
                                            />
                                        </IconButton>
                                    )}
                                </Box>
                            )
                        }
                        {
                            (sheetdata['error']!==undefined)&&
                            (<Box>
                                <Typography
                                    fontWeight="700"
                                    fontSize={"2rem"}
                                    color="#E74C3C"
                                >
                                    Error : {sheetdata['error']}
                                </Typography>

                            </Box>)
                        }
                        
                    </Box>
            </BodyBox>
        </Box>
        
    )


}

export default GooglesheetPage;