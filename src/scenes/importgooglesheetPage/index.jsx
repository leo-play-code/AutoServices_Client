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
import { useState,useEffect } from "react";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import importGIF from "../../assets/完整介紹影片.gif"



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
    const [url,setUrl] = useState("");
    const [savebool,setSavebool] = useState(true);
    const [name,setName] = useState("");
    const [urlerror,setUrlerror] = useState(false);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const CheckUrl = () =>{
        try{
            var urlsplit = url
            urlsplit = urlsplit.split("/d/")
            urlsplit = urlsplit[1]
            urlsplit = urlsplit.split('/edit#gid=');
            if (urlsplit.length!=2){
                setUrlerror(true)
            }else{

            }
        }catch{
            setUrlerror(true)
        }
        

    }   
    useEffect(()=>{
        
    },[url])
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
                />
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
        
            </FlexBetween>
            <FlexBetween>
                
            </FlexBetween>
            <FlexBetween
                mt="1rem"
            >
                <Typography
                    fontWeight={"500"}
                    fontSize="1rem"
                >
                    是否要儲存此Google Sheet 連結 ?
                </Typography>
                
            </FlexBetween>
            <FlexBetween
                sx={{
                    position:"relative"
                }}
            >
                <Checkbox

                    onChange={(e)=>setSavebool(!savebool)}
                    {...label}
                    defaultChecked
                    sx={{ '& .MuiSvgIcon-root': { fontSize: 20 },
                        position:"relative",
                        right:"0.65rem"
                    }}
                />
            </FlexBetween>
            {
                savebool&&(
                    <>
                        <FlexBetween
                            mt="0.5rem"
                        >
                            <Typography
                                fontWeight={"500"}
                                fontSize="1rem"
                            >
                                為你的Google Sheet 取名吧 !
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
                            />
                        </FlexBetween>
                    </>
                )
            }
            <FlexBetween
                mt="8rem"
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
                        確認
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
        [4,<Step3 toggleNextStep={toggleNextStep} toggleLastStep={toggleLastStep}/>],
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
                    onClick={()=>setSelectstep(step['pri'])}
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