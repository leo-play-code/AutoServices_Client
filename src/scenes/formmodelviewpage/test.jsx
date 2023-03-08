
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useEffect,useState,useContext,useRef } from 'react';
import BodyBox from '../../components/bodyBox';
import Navbar from '../navbar/index';
import {Box} from "@mui/material";
import { FormProfileWidget } from './FormProfileWidget';
import { PostList } from './PostList';
import WidgetWrapper from '../../components/WidgetWrapper';
import FilterWidget from '../widgets/FilterWidget';
import ReactVirtualizedTable from './TableWidget';
import {TableWidget} from './TableWidget';
import { GetAllUser } from '../../api/user';
import { GetFormModelAll } from '../../api/formdata';
import { StoreContext } from '../../state/store';

// icon 
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import RightClick from '../../components/RightClick';
import Form_Table from '../../components/Table_Max';



const FormModelViewPage = () =>{
    
    // useContext 
    const {storeforms,storeformmodels} = useContext(StoreContext);
    const [forms,setForms] = storeforms;
    const [formmodels,setFormmodels] = storeformmodels;

    const {formname} = useParams();
    const formmodel = formmodels.filter((form)=>form['name']===formname)[0];
    const isNonMobileScreens = useMediaQuery("(min-width:1230px)");
    const filtermode = useSelector((state)=>state.filtermode);
    const token = useSelector((state)=>state.token);
    const tableRef = useRef();
    const tablechildRef = useRef();
    const [screen,setScreen] = useState('part');
    const [number,setNumber] = useState(undefined);
    const [x,setX] = useState(null);
    const [y,setY] = useState(null);
    const [copyvalue,setCopyvalue] = useState("");
    console.log('formmodel',formmodel)

    const changeNumber = (value)=>{
        setNumber(value)
    }
    console.log('formmodelviewpage')

    useEffect(()=>{


        
    },[screen,forms,filtermode])
    return(
        <Box>
            <Navbar />
            {
                (x!==null && filtermode === "table")&&(
                    <RightClick 
                        x={x} 
                        y={y}
                        value = {copyvalue}
                        tool={['copy']}       
                    />
                )
            }
            <BodyBox
                padding="2rem 2%"
                display={isNonMobileScreens?"flex":"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                {/* {
                    ((screen!=="full")&&( */}
                        <Box 
                            flexBasis={isNonMobileScreens?"26%":undefined}
                            mb="1.5rem"
                            sx={{
                                "display":(screen==="full")&&"none"
                            }}
                        >
                            <Box
                                position={isNonMobileScreens?"fixed":""}
                                width={isNonMobileScreens?(window.innerWidth*0.23):"inherit"}
                            >
                                {(formmodel!==undefined)&&<FormProfileWidget 
                                    formname = {formname}
                                />}
                                <WidgetWrapper
                                    mt="1.1rem"
                                >
                                    <FilterWidget formname={formname} number= {number}/>
                                </WidgetWrapper>
                            </Box>
                        </Box>
                    {/* ))
                }
                 */}
                {(filtermode==="post")?(
                    <>
                    <Box
                        flexBasis={isNonMobileScreens?"42%":undefined}
                        mb="1.5rem"
                      
                    >
                        {(forms.length>0 && formmodel!==undefined)&&
                            <PostList 
                                formname = {formname}
                                formlist = {forms}
                                changeNumber={changeNumber}
                            />
                        }
                    </Box>
                    <Box
                        flexBasis={isNonMobileScreens?"26%":undefined}
                    >
                        <Box
                            position={isNonMobileScreens?"fixed":""}
                            width={isNonMobileScreens?(window.innerWidth*0.23):"inherit"}
                        >
                        </Box>
                        
                    </Box>
                    </>
                ):(
                   <>
                        <Box
                            flexBasis={isNonMobileScreens?((screen==="full")?"99%":"75%"):undefined}
                            mb="1.5rem"
                            
                        >
                            <Box
                                width={(screen==="full")?window.innerWidth*0.95:window.innerWidth*0.70}
                            >
                                {formmodel !== undefined&&(
                                    <Form_Table 
                                        formlist={forms}
                                        sx={{maxHeight:window.innerHeight*0.85}}
                                        formmodel = {formmodel}
                                    />
                                )}
                            </Box>
                            
                           
     
                            
                            <Box
                                sx={{
                                    position:"relative"
                                }}
                            >
                                {(screen==="full")?(
                                    <IconButton
                                        onClick={()=>{
                                            setScreen('part');
                                            
                                        }}
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
                                        onClick={()=>{
                                            setScreen('full');
                                            
                                    }}
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
                        </Box>
                        <Box
                            position={"fixed"}
                            bottom="3rem"
                            right="3rem"
                            fontWeight={"600"}
                        >
                            {number} 筆資料
                        </Box>
                        
                   </>
                )}
                

            </BodyBox>
        </Box>
      
    )


}

export default FormModelViewPage;