import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery, Typography, Box, useTheme, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlexBetween from '../../components/Flexbetween';
import { CkeditorInput, createMarkup } from "../../components/CkeditorInput";
import UserImage from '../../components/UserImage';
import FlexBetweenTop from '../../components/FlexBetweenTop';
import { ColorTag } from '../../components/ColorTag';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Dropdown, DropdownContainer } from '../../components/dropdown';
import EditIcon from '@mui/icons-material/Edit';
import { setFormModels, setLocalforms, webpath } from '../../state';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModalWidget from './DeleteModalWidget';
import { useEffect,useState,useRef } from 'react';
import { Collapse,Grow,Zoom} from '@mui/material';
import { BasicModal } from '../../components/modal';
import FormModel from '../formdataviewpage/Form';
import FormDataViewPage from '../formdataviewpage/index';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FormModelClone from '../clonePage/FormModel';
import { extractUrlFromString } from '../formmodelviewpage/TableWidget2';
const colorDict = {
    "red":"#E74C3C",
    "orange":"#E67E22",
    "yellow":"#F1C40F",
    "green":"#2ECC71",
    "blue":"#3498DB",
    "purple":"#9B59B6"
}
const betterFullTime = (y,m,d,h,M,s) =>{
    if (s<10){
        s = `0${s}`;
    }
    if (m<10){
        m = `0${m}`;
    }
    if (h<10){
        h = `0${h}`;
    }
    if (d<10){
        d = `0${d}`;
    }
    if (M<10){
        M = `0${M}`;
    }
    const fullTime = `${y}年${m}月${d}日 ${h}:${M}:${s}`;
    return fullTime;
}

function MyComponent({data}) {
    const url = extractUrlFromString(data);
    const escapedUrl = url.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const content = createMarkup(escapedUrl.replaceAll('\n', '<br>'));
  
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  
  


export const simpleDateFormmat = (rawdate,method="Date") =>{
    var date = new Date(rawdate);
    var todaydate = new Date(todaydate);
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    var h = date.getHours();
    var M = date.getMinutes();
    var s = date.getSeconds();
    const fullTime = betterFullTime(y,m,d,h,M,s);
    return fullTime
}

export const DateFormat = (rawdate,todaydate) =>{
    var date = new Date(rawdate);
    var todaydate = new Date(todaydate);
    var d = date.getDate();
    var m = date.getMonth()+1;
    var y = date.getFullYear();
    var h = date.getHours();
    var M = date.getMinutes();
    var s = date.getSeconds();
    
   
    const fullTime = betterFullTime(y,m,d,h,M,s);
    if (y === todaydate.getFullYear()){
        if (m === (todaydate.getMonth()+1)){
            if (d === todaydate.getDate()){
                if (h === todaydate.getHours()){
                    if (M === todaydate.getMinutes()){
                        return [`${todaydate.getSeconds()-s}秒鐘前`,fullTime];
                    }else{
                        return [`${todaydate.getMinutes()-M}分鐘前`,fullTime];
                    }
                }else{
                    return [`${todaydate.getHours()-h}小時前`,fullTime];
                }
            }else{
                return [`${todaydate.getDate()-d}天前`,fullTime];
            }
        }else{
            return [`${todaydate.getMonth()+1-m}個月前`,fullTime];
        }
    }else{
        return [`${todaydate.getFullYear()-y}年前`,fullTime];
    }
}

export const PostBody = ({
    data,
    formmodel,
    showlimit = true
})=>{

    useEffect(()=>{

    },[showlimit])
    const mysetting = useSelector((state)=>state.settings);
    const viewsetup = (mysetting===undefined || mysetting['貼文顯示方式']===undefined)?{}:mysetting['貼文顯示方式'][data['form']['name']];
    const theme = useTheme();
    const cardcolor = theme.palette.other.card;
    const linkcolor = theme.palette.other.link;
    const body = []; 
    for (const key in formmodel){
        const {label,field,fulldata,logo} = formmodel[key]
        if (field === 'select-color'){
            const color = data['data'][key]
            const value = fulldata[data['data'][key]]
            var bodyitem = (
                <ColorTag 
                    color={color}
                    value={value}
                    logo={logo}
                />
            )
        }else{
            var bodyitem = (<span 
                className="CkeditorInput"
                dangerouslySetInnerHTML={createMarkup(extractUrlFromString(data['data'][key]).replaceAll('\n','<br>'))}
            >
            </span>)
        }
        if (showlimit){
            if (viewsetup[key]){
                const item = 
                        <Box
                            key = {key}
                            sx={{
                                backgroundColor:cardcolor,
                                borderRadius:"5px"
                                
                            }}
                            mt="0.5rem"
                            p="0.2rem 0.5rem"
                        >
                            <FlexBetween
                            >
                                <FlexBetweenTop 
                                    gap="1.5rem"
                                >
                                    <Typography
                                        fontWeight="700"
                                        mb="0.25rem"
                                    >
                                        {label} :
                                    </Typography>
                                    <Box
                                        sx={{
                                            "&>span>p>a":{
                                                color:linkcolor
                                            }
                                        }}
                                    >
                                        {bodyitem}
                                        
                                    </Box>
                                </FlexBetweenTop>
                            </FlexBetween>
                            
                        </Box>
                body.push(item)
            }
        }else{

            const item = 
                    <Box
                        key = {key}
                        sx={{
                            backgroundColor:cardcolor,
                            borderRadius:"5px"
                            
                        }}
                        mt="0.5rem"
                        p="0.2rem 0.5rem"
                    >
                        <FlexBetween
                        >
                            <FlexBetweenTop 
                                gap="1.5rem"
                            >
                                <Typography
                                    fontWeight="700"
                                    mb="0.25rem"
                                >
                                    {label} :
                                </Typography>
                                <Box
                                    sx={{
                                        "&>span>p>a":{
                                            color:linkcolor
                                        }
                                    }}
                                >
                                    {bodyitem}
                                    
                                </Box>
                            </FlexBetweenTop>
                        </FlexBetween>
                        
                    </Box>
            body.push(item)
            
        }
        
    }
    return (
        <Box>
            {
                showlimit?(
                    <Collapse
                        in={showlimit}
                       
                    >
                        {body}
                    </Collapse>
                ):
                <Box>
                    {body}
                </Box>
            }
        </Box>
        
    )
}



export const PostBodyWidget = ({
    compareTime,
    data,
    scrollable = false,
    showlimit
})=>{

    // const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const localforms = useSelector((state)=>state.forms);
    const dispatch = useDispatch();
    const windowWidth = useSelector((state)=>state.width);
    const {Name,picturePath} = data['creator']
    const [screen,setScreen] = useState('part');
    const toggleScreen = (value)=>{
        setScreen(value);
    }
    

    const mysetting = useSelector((state)=>state.settings);
    const navigate = useNavigate();
    const theme = useTheme();
    const windowheight = useSelector((state)=>state.height);
    const windowwidth = useSelector((state)=>state.width);
    const formmodel = data['form']['schema'];
    const dark = theme.palette.neutral.dark;
    const alt = theme.palette.background.alt;
    const dropdowncolor = theme.palette.other.dropdown;
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }
    const scrollstyle = {
        maxHeight : windowheight*0.36,
        overflow : "scroll"
    }
    const handleCloseModal = ()=>{
        childRef.current.handleClose();
    }

    const childRef = useRef();

    return(
        <Box
        >
            <FlexBetween
                mb="0.25rem"
            >
                <FlexBetween
                    gap="1.5rem"
                >
                    <UserImage image={picturePath} size={"40px"} />
                    <Typography
                        fontWeight="700"
                    >
                        {Name}
                    </Typography>
                </FlexBetween>
                <Typography>
                    {compareTime}
                </Typography>
            </FlexBetween>
            <FlexBetween>
                <FlexBetween
                    gap="1.5rem"
                >
                    <Typography
                        fontWeight="500"
                        onClick = {()=>{navigate(`/formmodel/form/${data["form"]["name"]}`)}}
                        sx={{
                            "&:hover":{
                                cursor:"pointer"
                            },
                            color:"#5499C7"
                            
                        }}
                    >
                        @{data["form"]["name"]}
                    </Typography>
                </FlexBetween>
                <FlexBetween
                    gap="1rem"
                >
                    <BasicModal
                        ref={childRef}
                        modelsx = {{
                            m:'auto' ,
                            width: (screen==="part")?"900px":windowWidth, 
                            overflow:"scroll",
                            bgcolor: 'background.paper',
                            borderRadius:"10px",
                            boxShadow: 24,
                            p: 4,
                            mt : windowheight*0.002,
                            // mb : windowheight*0.0002
                            maxHeight:windowheight*0.95
                        }}
                        title={
                            <FlexBetween
                                sx={dropdownItemStyle}
                            >
                                <FlexBetween
                                    gap="2.5rem"
                                    
                                >
                                <IconButton
                                    sx={{
                                        fontSize:"20px",
                                        "&:hover":{backgroundColor:dropdowncolor},
                                    }}
                                >
                                    <FileCopyIcon 
                                        sx={{color:"#F5B041",fontSize:"20px"}}
                                    />
                                </IconButton>

                                                
                            </FlexBetween>
                        </FlexBetween>
            
                        }
                        body={
                            <FormModelClone 
                                formname={data['form']['name']}
                                toggleScreen= {toggleScreen}
                                screen = {screen}
                                formdata= {data['data']}
                                closeModal={handleCloseModal}

                            />
                        }
                    />
                    <BasicModal
                        
                        modelsx = {{
                            m:'auto' ,
                            width:(windowwidth>1900)?windowwidth*0.7:windowwidth,
                            overflow:"scroll",
                            bgcolor: 'background.paper',
                            borderRadius:"10px",
                            boxShadow: 24,
                            p: 4,
                            mt : windowheight*0.002,
                            maxHeight:windowheight*0.95
                        }}
                        title={
                            <FlexBetween
                                sx={dropdownItemStyle}
                            >
                                <FlexBetween
                                    gap="2.5rem"
                                    
                                >
                                <IconButton
                                    sx={{
                                        fontSize:"20px",
                                        "&:hover":{backgroundColor:dropdowncolor},
                                    }}
                                >
                                    <EditIcon 
                                        sx={{color:"#E74C3C",fontSize:"20px"}}
                                    />
                                </IconButton>

                                                
                            </FlexBetween>
                        </FlexBetween>
            
                        }
                        body={
                            <FormDataViewPage 
                                formdataid={data['_id']}
                            />
                        }
                    />
                </FlexBetween>
                
            </FlexBetween>

            <Box
                mt="0.5rem"
                sx={scrollable?scrollstyle:{}}
            >
                <PostBody 
                    formmodel = {formmodel}
                    data = {data}
                    showlimit = {showlimit}
                />
            </Box>
 
        </Box>
    )
}

