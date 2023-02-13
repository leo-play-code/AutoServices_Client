import { 
    Box,
    useMediaQuery,
    Toolbar,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Typography,
    IconButton,
    Tooltip,
    Button,
    Slide,
    TextField,
    InputBase,
    Checkbox,
    Grow
} from "@mui/material"
import BodyBox from "../../components/bodyBox"
import FlexBetween from "../../components/Flexbetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import Navbar from "../navbar";

import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import FlexBetweenTop from '../../components/FlexBetweenTop';
import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import { useState,useEffect,useContext } from "react";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { setnewGoogleSheet } from "../../state";


import importGIF from "../../assets/完整介紹影片.gif"
import {GoogleSheetDetectData, GoogleSheetGetData , GoogleSheetSaveData,GoogleSheetAllList} from "../../api/googlesheet";
import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import checkimage from "../../assets/check.png";
import { StoreContext } from '../../state/store';
import { useDispatch } from 'react-redux';
const Step1 = ({toggleNextStep,toggleLastStep}) =>{
    const googleaccount = "googlesheetapi@charged-audio-376300.iam.gserviceaccount.com"
    const [copybool,setCopybool] = useState(false);
    const toggleCopy = () =>{
        navigator.clipboard.writeText(googleaccount);
        setCopybool(true)
    }
    useEffect(()=>{
    },[copybool])
    return (
            <Box>
                <FlexBetween>
                    <FlexBetween
                        gap="1.5rem"
                    >
                        <Typography
                            fontWeight={"500"}
                            fontSize="1rem"
                        >
                            複製此 Google Account :
                        </Typography>
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween
                >
                    <FlexBetween
                        gap="1rem"
                    >
                        <Typography
                            sx={{
                                visibility: 'visible',
                                my: 2,
                                p: 1,
                                bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                                color: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                border: '1px solid',
                                borderColor: (theme) =>
                                theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                            }}
                        >
                            {googleaccount}
                        </Typography>
                        {
                            copybool?
                                <Tooltip
                                    title="重新複製"
                                >
                                    <IconButton
                                        onClick={()=>toggleCopy()}
                                    >
                                        <CheckIcon 
                                            color="success"
                                        />
                                    </IconButton>
                                </Tooltip>
                               
                                
                                :(
                                    <Tooltip
                                        title="複製"
                                    >
                                        <IconButton
                                            onClick={()=>toggleCopy()}
                                        >
                                        <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                )
                        }
                        
                    </FlexBetween>
                </FlexBetween>
                <FlexBetween
                    mt="17rem"
                >
                    <Box>

                    </Box>
                    <Button
                        variant="contained"
                        onClick={toggleNextStep}
                    >
                        下一步
                    </Button>
                </FlexBetween>
            </Box>
    )
}
const Step2 = ({toggleNextStep,toggleLastStep}) =>{
    return(
        <Box>
            <FlexBetween>
                <FlexBetween
                    gap="1.5rem"
                >
                    <Typography
                        fontWeight={"500"}
                        fontSize="1rem"
                    >
                        將此Google Account 加入至要讀取的Google Sheet : 
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <Box
                mt="2rem"
                ml="2.5rem"
            >
                <img 
                    src={importGIF} 
                    alt="教學"
                    width="500"
                />
            </Box>
            <FlexBetween
                mt="1.5rem"
                >
                    <Box>

                    </Box>
                    <FlexBetween
                        gap="0.5rem"
                    >
                        <Button
                            variant="contained"
                            onClick={toggleLastStep}
                        >
                            上一步
                        </Button>
                        <Button
                            variant="contained"
                            onClick={toggleNextStep}
                        >
                            下一步
                        </Button>
                    </FlexBetween>
                </FlexBetween>
        </Box>
    )
}
const Step3 = ({toggleNextStep,toggleLastStep}) =>{
    const {storegooglelist} = useContext(StoreContext);
    const [googlelist,setGooglelist] = storegooglelist;
    const token = useSelector((state)=>state.token)
    const [url,setUrl] = useState("");
    const [detectbool,setDetectbool] = useState(false);
    const [name,setName] = useState("");
    const [namebool,setNamebool] = useState(false);
    const [urlerror,setUrlerror] = useState(false);
    const [savebool,setSavebool] = useState(false);
    const [urlerrortext,setUrlerrortext] = useState("辨識失敗")
    const dispatch = useDispatch();
    const toggleSave = async() =>{
        setSavebool('loading')
        var urlsplit = url
        urlsplit = urlsplit.split("/d/")
        urlsplit = urlsplit[1]
        urlsplit = urlsplit.split('/edit#gid=');
        const data = await GoogleSheetSaveData(token,urlsplit[0],urlsplit[1],{"name":name})
        if (!data['error']){
            setSavebool(true)
            toggleNextStep()
            dispatch(
                setnewGoogleSheet({
                    newgooglesheet:data
                })
            )
            const tempgooglelist = [...googlelist];
            tempgooglelist.push(data);
            setGooglelist(tempgooglelist);
                
        }else{
            if (data['error'].includes('name')){
                setNamebool(true)
            }
        }
    }
    const CheckUrl = async() =>{
        setUrlerror(false)
        setDetectbool('loading')
        try{
            var urlsplit = url
            urlsplit = urlsplit.split("/d/")
            urlsplit = urlsplit[1]
            urlsplit = urlsplit.split('/edit#gid=');
            if (urlsplit.length!=2){
                setUrlerrortext("辨識失敗")
                setUrlerror(true)
                setDetectbool(false)
            }else{
                const data = await GoogleSheetDetectData(token,urlsplit[0],urlsplit[1]);
                if (data['result']){
                    setDetectbool(true)
                    setUrlerror(false)
                }else if(data['error'].includes('Doc')){
                    setUrlerrortext("此 Google Sheet 已經上傳了")
                    setUrlerror(true)
                    setDetectbool(false)
                }
            }
        }catch{
            setUrlerrortext("辨識失敗")
            setUrlerror(true)
            setDetectbool(false)
        }
    }   
    useEffect(()=>{
        
    },[urlerror])
    return (
        <Box
            width="540px"
        >
            <FlexBetween>
                <FlexBetween
                    gap="1.5rem"
                >
                    <Typography
                        fontWeight={"500"}
                        fontSize="1rem"
                    >
                        將要上傳的Google Sheet 連結貼在下方欄位 :
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <FlexBetween
                mt="1rem"
            >
                <TextField 
                    placeholder="https://docs.google.com/"
                    onChange={e=>{setUrl(e.target.value)}}
                    fullWidth
                    size = "small"
                    color="info"
                    disabled={(typeof detectbool !== 'string')&&detectbool}
                    error={urlerror}
                />
                {
                    (detectbool==='loading')&&(
                        <CircularProgress 
                            size={30}
                        />
                    )
                }

                {
                    (detectbool===true)&&(
                        <CheckIcon 
                            color="success"
                            fontSize="large"
                        />
                    )
                }

                {
                    (detectbool===false)&&(
                        <Button
                            variant="contained"
                            onClick= {
                                ()=>{
                                    CheckUrl()
                                }
                            }
                        >
                            辨識
                        </Button>
                    )
                }

                
        
            </FlexBetween>
            {urlerror&&(
                <FlexBetween>
                    <Box
                        mt="0.2rem"
                        ml="0.5rem"
                    >
                        <Typography
                            color="#E74C3C"
                            sx={{
                                fontSize:"0.1rem"
                            }}
                            fontWeight={"500"}
                        >
                            {urlerrortext}
                        </Typography>
                </Box>
                </FlexBetween>
            )}


            <FlexBetween
                mt="1rem"
            >
                <Typography
                    fontWeight={"500"}
                    fontSize="1rem"
                >
                    幫你的Google Sheet 取名吧 !
                </Typography>
            </FlexBetween>
            <FlexBetween
                mt="1rem"
            >
                <TextField 
                    placeholder="名字"
                    onChange={e=>{setName(e.target.value)}}
                    fullWidth
                    size = "small"
                    color="info"
                    required = {true}
                    error = {namebool}
                    helperText={namebool&&"名字錯誤,不可空白,或是名字已被使用,我懶得做兩次搜尋自己猜是哪個問題"}
                />
            </FlexBetween>

            <FlexBetween
                mt="12.5rem"
            >
                <Box>

                </Box>
                <FlexBetween
                    gap="0.5rem"
                >
                    <Button
                        variant="contained"
                        onClick={toggleLastStep}
                    >
                        上一步
                    </Button>
                    {
                        (savebool==='loading')?(
                            <CircularProgress 
                                size={30}
                            />
                        ):(
                            <Button
                                variant="contained"
                                onClick={()=>toggleSave()}
                                disabled ={(( detectbool === 'loading' || detectbool === false)||name.replaceAll(' ','')==='')?true:false}
                            >
                                確認
                            </Button>
                        )
                    }
                    
                </FlexBetween>
            </FlexBetween>
      
        </Box>
    )
}
const Step4 = ({toggleNextStep,toggleLastStep}) =>{
    const navigate = useNavigate();
    const newgooglesheet = useSelector((state)=>state.newgooglesheet);
    const toggleFoward = async() =>{
        navigate(`/googlesheet/${newgooglesheet['_id']}/view`)   
    }
    return(
        <Box
            width="540px"
        >
            <FlexBetween>
                <FlexBetween
                    gap="1.5rem"
                >
                    <Typography
                        fontWeight={"500"}
                        fontSize="1rem"
                    >
                       恭喜你成功建立新的Google Sheet 表單連結 !!
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <Box
                sx={{
                    
                }}
                ml="10rem"
                mt="5rem"
            >
                <img 
                    src={checkimage} 
                    alt="完成" 
                    width="200"
                />
            </Box>
            <FlexBetween
                mt="4rem"
            >
                <Box>

                </Box>
                <FlexBetween
                    gap="0.5rem"
                >
                    <Button
                        variant="contained"
                        onClick={()=>navigate("/home")}
                        color = "success"
                    >
                        完成
                    </Button>
                    <Button
                        variant="contained"
                        onClick={()=>toggleFoward()}
                    >
                        前往
                    </Button>
                    
                </FlexBetween>
            </FlexBetween>
        </Box>
    )
}

const Step = ({steporder,toggleNextStep,toggleLastStep})=>{
    const StepMap = new Map([
        [1,<Step1 toggleNextStep={toggleNextStep} toggleLastStep={toggleLastStep}/>],
        [2,<Step2 toggleNextStep={toggleNextStep} toggleLastStep={toggleLastStep}/>],
        [3,<Step3 toggleNextStep={toggleNextStep} toggleLastStep={toggleLastStep}/>],
        [4,<Step4 toggleNextStep={toggleNextStep} toggleLastStep={toggleLastStep}/>],
    ])
    const windowHeight = useSelector((state)=>state.width)

    return (
        <>

            <Box
                mt="1rem"
            >
               {StepMap.get(steporder)}
            </Box>
        </>
    )
}

const ImportgooglesheetPage = () =>{

    const StepDict = [
        {"pri":1,"sec":"複製Account"},
        {"pri":2,"sec":"將此Google Account加入到目標Google Sheet"},
        {"pri":3,"sec":"將要載入的Google Sheet 連結載入"},
        {"pri":4,"sec":"前往"}
    ]
    const [selectstep,setSelectstep] = useState(1);
    const theme = useTheme();
    const toggleNextStep = ()=>{
        setSelectstep(selectstep+1)
    }
    const toggleLastStep = ()=>{
        setSelectstep(selectstep-1)
    }
    const drawer = (
        <div>
          <List
            sx={{
                backgroundColor:theme.palette.background.alt,
            }}
          >
            {StepDict.map((step) => (
              <ListItem key={step['pri']} disablePadding
                    sx={{
                        backgroundColor:(selectstep>=step['pri']?"#52BE80":"#5499C7"),
                        cursor:"default",
                        padding:"20px 0px"
                    }}
              >
                <ListItemButton
                    // onClick={()=>setSelectstep(step['pri'])}
                    sx={{
                        cursor:"default",
                    }}
                >
                    <ListItemText 
                        primaryTypographyProps={{fontSize:"1rem",fontWeight:"500"}}
                        primary={`Step${step['pri']}`} 
                        secondaryTypographyProps={{fontSize:"0.3rem"}}
                        secondary ={
                            step['sec']
                        }
                    />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
    );
    useEffect(()=>{

    },[selectstep])
    return(
        <Box>
            <Navbar />
            <BodyBox
                padding="3rem 0"
            >
                <Box 
                    maxWidth="800px"
                    margin= "0 auto"
                >
                    <Box
                        sx={{
                            backgroundColor:theme.palette.background.alt,
                            borderRadius:"0.75rem",
                            
                        }}
                    >
                        <FlexBetween>
                            <FlexBetweenTop
                                gap="1rem"
                            >
                                <Box
                                    maxWidth={"10rem"}
                                    sx={{
                                        backgroundColor:"#5499C7",
                                        borderRadius:"0.75rem 0rem 0rem 0.75rem"   
                                    }}
                                >
                                    {drawer}
                                </Box>
                                <Box
                                    sx={{
                                        padding:"1.5rem 1.5rem 0.75rem 1.5rem",
                                    }}
                                >
                                    <Step 
                                        steporder={selectstep}
                                        toggleNextStep = {toggleNextStep}
                                        toggleLastStep = {toggleLastStep}    
                                    />
                                </Box>
                            </FlexBetweenTop>
                            
                        </FlexBetween>
                    </Box>
                </Box>
   
            </BodyBox>
        </Box>
    )
}

export default ImportgooglesheetPage ;