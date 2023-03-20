import { useState,useEffect,useRef,useContext } from "react";
import { BasicModal } from "../../components/modal";
import FormModel from "../formmodelPage/Form";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery,
    InputLabel,
    NativeSelect
} from '@mui/material';
import { 
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material";
import SettingsIcon from '@mui/icons-material/Settings';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import Logo from "../../assets/logo.jpeg";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/Flexbetween";
import UserImage from "../../components/UserImage";
import { setFormModels, setMode, setScreen, setUserList } from "../../state";
import {DropdownContainer,Dropdown,Dropdownlabel} from '../../components/dropdown';
import { Logout } from "../../components/Auth2";
import Tooltip from '@mui/material/Tooltip';
import StorageIcon from '@mui/icons-material/Storage';
import { GetAllFormModel } from "../../api/formmodel";
import { StoreContext, FetchToStore } from '../../state/store';
import DownloadIcon from '@mui/icons-material/Download';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import Helper from "../widgets/Helper";

const FormItem = ({searchvalue , formlist})=>{
    const windowheight = useSelector((state)=>state.height);
    const windowWidth = useSelector((state)=>state.width);
    const navigate = useNavigate();
    const [formfilter,setFormfilter] = useState(formlist)
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const dropdowncolor = theme.palette.other.dropdown;
    const [screen,setScreen] = useState('part');
    const toggleScreen = (value)=>{
        setScreen(value);
    }
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }
    useEffect(()=>{
        const newform = formlist.filter(each=>each.toLowerCase().replaceAll(' ','').includes(searchvalue.toLowerCase().replaceAll(' ','')))
        setFormfilter(newform)
    },[searchvalue])
    const handleCloseModal = ()=>{
        childRef.current.handleClose();
    }

    const childRef = useRef();
    return(
        <Box>
            {
            formfilter.map(
                form=>
                <BasicModal 
                    ref={childRef}
                    key={form}
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
                            key={form}
                            mt="0.25rem" 
                            sx={dropdownItemStyle}
                        >   
                            <FlexBetween
                                gap="1.5rem"
                            >
                                <IconButton
                                    sx={{
                                        fontSize:"15px",
                                        "&:hover":{backgroundColor:dropdowncolor}
                                    }}
                                >
                                    <ListAltOutlinedIcon 
                                        sx={{fontSize:"15px",color:dark}}
                                    />
                                </IconButton>
                
                                
                                <Typography
                                    fontWeight="700"
                                >
                                    {form}
                                </Typography>
                            </FlexBetween>
                        </FlexBetween>   
                    }
                    body={
                        <FormModel 
                            formname={form}
                            toggleScreen= {toggleScreen}
                            screen = {screen}
                            closeModal={handleCloseModal}
                        />
                    }
                    
                />
            ) 
        }        
        </Box>
    )
}

const SheetItem = ({searchvalue,sheetlist}) =>{
    const navigate = useNavigate();
    const [sheetfilter,setSheetfilter] = useState(sheetlist);
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const dropdowncolor = theme.palette.other.dropdown;
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }
    useEffect(()=>{
        const newform = sheetlist.filter(each=>each['name'].toLowerCase().replaceAll(' ','').includes(searchvalue.toLowerCase().replaceAll(' ','')))
        setSheetfilter(newform)
    },[searchvalue])
    return(
        
        <Box>
            {
            sheetfilter.map(
                form=>
                    <FlexBetween
                        key={form['_id']}
                        mt="0.25rem" 
                        sx={dropdownItemStyle}
                        onClick={()=>{navigate(`/googlesheet/${form['_id']}/view`)}}
                    >   
                        <FlexBetween
                            gap="1.5rem"
                        >
                    
                            <IconButton
                                sx={{
                                    fontSize:"15px",
                                    "&:hover":{backgroundColor:dropdowncolor}
                                }}
                            >
                                <ListAltOutlinedIcon 
                                    sx={{fontSize:"15px",color:dark}}
                                />
                            </IconButton>
            
                            
                            <Typography
                                fontWeight="700"
                            >
                                {form['name']}
                            </Typography>
                        </FlexBetween>
                    </FlexBetween>   
                ) 
            }        
            <FlexBetween
                mt="0.25rem" 
                sx={dropdownItemStyle}
                onClick={()=>{navigate(`/googlesheet/create`)}}
            >   
                <FlexBetween
                    gap="1.5rem"
                >
            
                    <IconButton
                        sx={{
                            fontSize:"15px",
                            "&:hover":{backgroundColor:dropdowncolor}
                        }}
                    >
                        <DownloadIcon 
                            sx={{fontSize:"15px",color:dark}}
                        />
                    </IconButton>
    
                    
                    <Typography
                        fontWeight="700"
                    >
                        引入 Google Sheet
                    </Typography>
                </FlexBetween>
            </FlexBetween>   
        </Box>
    )
}


const Navbar = ({
})=>{
    const {storeformmodels,storegooglelist} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const sheetlist = [];
    const [googlelist,setGooglelist] = storegooglelist;
    for (const num in googlelist){
        sheetlist.push(googlelist[num])
    }

    const formlist = [];
    for (const num in formmodels){
        formlist.push(formmodels[num].name);
    }

    const [isshowform,setisshowform] = useState(false);
    const [formsearchvalue,setFormsearchvalue] = useState("");
    const [sheetsearchvalue,setSheetsearchvalue] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state)=>state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:700px)");
    const token = useSelector((state)=>state.token);
    const theme = useTheme();
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;
    const width = useSelector((state)=>state.width);
    const dropdowncolor = theme.palette.other.dropdown;
    const fullName = `${user.Name}`;
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }

    function toggleCreateform(){
        setisshowform(!isshowform)
        setFormsearchvalue("")
    }
    const formRef = useRef();
    const formbtnRef = useRef();

    
    useEffect(()=>{
        const closedropdown_effect =e =>{
            var temp = false;
            for(var num in e.path){
                temp = temp || (e.path[num]===formRef.current) || (e.path[num]===formbtnRef.current)
                if (temp===true){return}
            }
            if (!temp){
                setisshowform(false)
            }
        }
        function handleResize() {
            dispatch(
                setScreen({
                    width:window.innerWidth,
                    height:window.innerHeight,
                })
            )
            
        }
        
        window.addEventListener("resize", handleResize)  
        handleResize()
        document.body.addEventListener('click',closedropdown_effect);  
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },[])
    return(
        <FetchToStore>
        <FlexBetween 
            p="1rem 3%" 
            backgroundColor={alt}
            position="fixed"
            width = {width}
            zIndex="10"
        >
            <FlexBetween gap="1rem">

                <Box
                    onClick={()=>{navigate("/home")}}
                    sx={{
                        "&:hover":{
                            cursor:"pointer"
                        }
                    }}
                >
                    <img 
                        src={Logo}  
                        alt="logo"
                        width="55px"    
                    />
                </Box>
                <Typography 
                    fontWeight="bold"
                    fontSize="25px"
                    color="#0176B9"
                    onClick={()=>{navigate("/home")}}
                    sx={{
                        "&:hover":{
                            cursor:"pointer"
                        }
                    }}
                >
                    AutoServices
                </Typography>
            </FlexBetween>

            {isNonMobileScreens?
            (
                <FlexBetween gap="1.5rem">
                    {/* TIP Help */}

                    <Dropdown
                        ref_active={ false }
                        title = {"更新內容"}
                        label = {
                            <QuestionMarkIcon 
                                 sx={{fontSize:"25px",color:dark}}
                            />
                        }
                        child = {
                            <DropdownContainer
                                sx={{top:"0.25rem",right:"-2.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                fontSize="1rem"
                                backgroundColor={alt}
                                width="25rem"
                            >   
                                <Helper />
                                
                            </DropdownContainer>
                        }
                    />
                    {/* BRIGHT MODE */}
                    <Tooltip title="顯示模式">
                        <IconButton
                            onClick={()=>{dispatch(setMode())}}
                            sx={{fontSize:"25px"}}    
                        >
                            {theme.palette.mode==="dark" ?
                                (<DarkMode sx={{fontSize:"25px"}}/>)
                                :
                                (<LightMode sx= {{color:dark,fontSize:"25px"}}/>)
                            }
                        </IconButton>
                    </Tooltip>

                    
                    

                    
                    <Dropdown
                        ref_active = {true}
                        title = {"創建表單"}
                        label ={
                            <CreateNewFolderIcon 
                            sx={{fontSize:"25px",color:dark}}
                            />
                        }
                        child={
                            <DropdownContainer
                                sx={{top:"0.25rem",right:"-2.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                fontSize="1rem"
                                backgroundColor={alt}
                                width="15rem"
                            >   
                                <FlexBetween
                                    backgroundColor={neutralLight}
                                    borderRadius="9px"
                                    gap="3rem"
                                    padding="0.1rem 1.5rem"
                                >
                                    <InputBase 
                                        placeholder="Search.."
                                        onChange={e=>{setFormsearchvalue(e.target.value)}}
                                    />
                                </FlexBetween>
                                <FormItem searchvalue={formsearchvalue} formlist ={formlist}/>
                                
                            </DropdownContainer>
                        }
                    >
                    </Dropdown>
                    

                    <Dropdown
                        ref_active={ false }
                        title = {"Google Sheet 引入"}
                        label = {
                            <StorageIcon 
                                sx={{color:dark,fontSize:"25px"}}
                            />
                        }
                        child = {
                            <DropdownContainer
                                sx={{top:"0.25rem",right:"-2.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                fontSize="1rem"
                                backgroundColor={alt}
                                width="15rem"
                            >   
                                <FlexBetween
                                    backgroundColor={neutralLight}
                                    borderRadius="9px"
                                    gap="3rem"
                                    padding="0.1rem 1.5rem"
                                >
                                    <InputBase 
                                        placeholder="Search.."
                                        onChange={e=>{setSheetsearchvalue(e.target.value)}}
                                    />
                                </FlexBetween>
                                <SheetItem searchvalue={sheetsearchvalue} sheetlist ={sheetlist}/>
                                
                            </DropdownContainer>
                        }
                    >



                    </Dropdown>
                    {/* SEARCH */}
                    {/* <Tooltip title="資料庫搜尋">
                        <IconButton
                            sx={{fontSize:"25px"}}
                            onClick={()=>{navigate("/googlesheet")}}
                        >
                            <Search 
                                sx={{color:dark,fontSize:"25px"}}
                            />
                            <StorageIcon 
                                sx={{color:dark,fontSize:"25px"}}
                            />
                        </IconButton>
                    </Tooltip> */}
                

                    {/* USER */}
                    <Box >
                        <Dropdown
                            ref_active ={false}
                            title = {"User Info"}
                            label={<UserImage size={"40px"} image={user.picturePath}/>}
                            child={
                                <DropdownContainer
                                    sx={{top:"0.25rem",right:"-2.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                    fontSize="1rem"
                                    backgroundColor={alt}
                                    width="15rem"
                                >
                                    <FlexBetween>
                                        <FlexBetween gap="1.5rem">
                                            <UserImage size={"40px"} image={user.picturePath}/>
                                            <Typography
                                                fontWeight="700"
                                            >
                                                {fullName}
                                            </Typography>
                                        </FlexBetween>
                                    </FlexBetween>

                                    <FlexBetween
                                        mt="0.75rem"
                                        sx={dropdownItemStyle}
                                        onClick={()=>navigate("/settings")}
                                    >
                                        <FlexBetween gap="1.5rem">
                                            <IconButton
                                                sx={{
                                                    fontSize:"25px",
                                                    "&:hover":{backgroundColor:dropdowncolor}
                                                }}
                                            >
                                                <SettingsIcon 
                                                    sx={{fontSize:"25px",color:dark}}
                                                />
                                            </IconButton>
                                            <Typography 
                                                width="9rem"
                                                fontWeight="700"
                                            >
                                                設定
                                            </Typography>
                                        </FlexBetween>
                                    </FlexBetween>
                                    <FlexBetween 
                                        mt="0.75rem"
                                        sx={dropdownItemStyle}
                                    >
                                        <Logout 
                                            child={
                                                <FlexBetween gap="1.5rem">
                                                    
                                                    <IconButton
                                                        sx={{
                                                            fontSize:"25px",
                                                            "&:hover":{backgroundColor:dropdowncolor}
                                                        }}
                                                    >
                                                        <LogoutIcon 
                                                            sx={{fontSize:"25px",color:dark}}
                                                        />
                                                    </IconButton>
                                                    <Typography 
                                                        width="9rem"
                                                        fontWeight="700"
                                                    >
                                                        登出 
                                                    </Typography>
                                                </FlexBetween>
                                            }
                                        />
                                        
                                    </FlexBetween>
                                </DropdownContainer>
                            }
                        >
                        </Dropdown>
                    </Box>
                </FlexBetween>
            ):
            (
                <FlexBetween gap="1.5rem">

                    <Dropdown 
                        ref_active = {false}
                        title = "Menu"
                        label={ <Menu />}
                        child={
                            <DropdownContainer
                                sx={{top:"0.25rem",right:"-1.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                fontSize="1rem"
                                backgroundColor={alt}
                                width="15rem"
                            >
                                <FlexBetween>
                                    <FlexBetween gap="1.5rem">
                                        <UserImage size={"40px"} image={user.picturePath}/>
                                        <Typography
                                            fontWeight="700"
                                        >{fullName}
                                        </Typography>
                                    </FlexBetween>
                                </FlexBetween>

                                {
                                    isshowform&&(
                                        <DropdownContainer 
                                            ref={formRef}
                                            sx={{top:"7rem",right:"0rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                            fontSize="1rem"
                                            backgroundColor={alt}
                                            width="15rem"
                                        
                                        >
                                            <FlexBetween
                                                backgroundColor={neutralLight}
                                                borderRadius="9px"
                                                gap="3rem"
                                                padding="0.1rem 1.5rem"
                                            >
                                                <InputBase 
                                                    placeholder="Search.."
                                                    onChange={e=>{setFormsearchvalue(e.target.value)}}
                                                />
                                            </FlexBetween>
                                            <FormItem searchvalue={formsearchvalue} formlist = {formlist}/>
                                        </DropdownContainer>
                                    )
                                }
                            
                                <FlexBetween  
                                    mt="0.75rem" 
                                    sx={dropdownItemStyle}
                                    onClick={toggleCreateform}
                                    ref={formbtnRef}
                                >
                                    <FlexBetween gap="1.5rem">
                                        <IconButton
                                            sx={{
                                                fontSize:"25px",
                                                "&:hover":{backgroundColor:dropdowncolor}
                                            }}
                                        >
                                            <CreateNewFolderIcon 
                                                sx={{fontSize:"25px",color:dark}}
                                            />
                                        </IconButton>
                                        <Typography
                                            fontWeight="700"
                                        >創建表單
                                        </Typography>
                                    </FlexBetween>
                                </FlexBetween>
    
                                <FlexBetween 
                                    mt="0.75rem" 
                                    sx={dropdownItemStyle}
                                    onClick={()=>{navigate("/googlesheet")}}
                                >
                                    <FlexBetween gap="1.5rem">
                                        <IconButton
                                            sx={{
                                                fontSize:"25px",
                                                "&:hover":{backgroundColor:dropdowncolor},
                                            }}
                                        >
                                            {/* <Search 
                                                sx={{color:dark,fontSize:"25px"}}
                                            /> */}
                                            <StorageIcon 
                                                sx={{color:dark,fontSize:"25px"}}
                                            />
                                        </IconButton>
                                        <Typography
                                            fontWeight="700"
                                        >
                                            資料庫搜尋
                                        </Typography>
                                    </FlexBetween>
                                </FlexBetween>
        
                                <FlexBetween 
                                    mt="0.75rem" 
                                    sx={dropdownItemStyle}
                                    onClick={()=>{dispatch(setMode())}}    
                                >
                                    <FlexBetween gap="1.5rem" >
                                        <IconButton
                                            sx={{
                                                fontSize:"25px",
                                                "&:hover":{backgroundColor:dropdowncolor}
                                            }}      
                                        >
                                            {theme.palette.mode==="dark" ?
                                                (<DarkMode sx={{fontSize:"25px"}}/>)
                                                :
                                                (<LightMode sx= {{color:dark,fontSize:"25px"}}/>)
                                            }
                                        </IconButton>
                                        <Typography
                                            fontWeight="700"
                                        >顯示模式
                                        </Typography>
                                    </FlexBetween>
                                </FlexBetween>

                                {/* Settings */}
                                <FlexBetween 
                                    mt="0.75rem" 
                                    sx={dropdownItemStyle}
                                    onClick={()=>navigate("/settings")}    
                                >
                                    <FlexBetween gap="1.5rem" >
                                        <IconButton
                                            sx={{
                                                fontSize:"25px",
                                                "&:hover":{backgroundColor:dropdowncolor}
                                            }}      
                                        >
                                            <SettingsIcon 
                                                sx={{color:dark,fontSize:"25px"}}
                                            />
                                        </IconButton>
                                        <Typography
                                            fontWeight="700"
                                        >設定
                                        </Typography>
                                    </FlexBetween>
                                </FlexBetween>

                                <FlexBetween 
                                        mt="0.75rem"
                                        sx={dropdownItemStyle}
                                        pl="0.3rem"

                                    >
                                        <Logout 
                                            child={
                                                <FlexBetween gap="1.5rem">
                                                    <IconButton
                                                        sx={{
                                                            fontSize:"25px",
                                                            "&:hover":{backgroundColor:dropdowncolor}
                                                        }}
                                                    >
                                                        <LogoutIcon 
                                                            sx={{fontSize:"20px",color:dark}}
                                                        />
                                                    </IconButton>
                                                    <Typography 
                                                        width="9rem"
                                                        fontWeight="700"
                                                    >
                                                        登出 
                                                    </Typography>
                                                </FlexBetween>
                                            }
                                        />
                                </FlexBetween>
                                
                            </DropdownContainer>
                        }
                    />
                </FlexBetween>
            )}
            
        </FlexBetween>
        </FetchToStore>
    )
}



export default Navbar;
