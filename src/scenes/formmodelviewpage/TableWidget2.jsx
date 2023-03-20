import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { maxHeight, width } from '@mui/system';
import { createMarkup } from '../../components/CkeditorInput';
import { ColorTag } from '../../components/ColorTag';
import { useState, useEffect,useContext,useRef,useImperativeHandle,forwardRef } from 'react';
import { useMediaQuery, Typography,Button, IconButton,Tooltip,Box ,Divider, InputBase} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { webpath } from '../../state';
import { BasicModal } from '../../components/modal';
import { CommentWidget } from '../widgets/CommentWidget';
import FlexBetween from '../../components/Flexbetween';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteModalWidget from '../widgets/DeleteModalWidget';
import { StoreContext } from '../../state/store';
import { setLocalforms } from '../../state';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { UpdateFormData } from '../../api/formdata';
import FormModel from '../formdataviewpage/Form';
import FormDataViewPage from '../formdataviewpage/index';
import Badge from '@mui/material/Badge';
import { UserSearchDropdown } from '../../components/SearchDropdown';
import { FormSelectColorDropdown } from '../../components/Select';
import FormModelClone from '../clonePage/FormModel';
import FileCopyIcon from '@mui/icons-material/FileCopy';

export const DragComponents = ({compnonent,sx}) =>{
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const handleDragStart = (e) =>{
        // e.preventDefault();
        console.log("Start");
    }
    const handleDrag = (e) =>{
        // e.preventDefault();
        console.log("Dragging...");
        console.log('x=',e.clientX,'y=',e.clientY)
        setX(e.clientX)
    }
    const handleDragEnd = (e)=>{
        // e.preventDefault();
        console.log("Ended");
    }
    useEffect(()=>{

    },[])
    return(
        <Box
            sx={{
                position:"relative"
            }}
        >
            <Box
                draggable
                onDragStart={(e)=>{handleDragStart(e)}}
                onDrag={(e)=>{handleDrag(e)}}
                onDragEnd={(e)=>{handleDragEnd(e)}}
                sx={sx}
                left={x}
            >
                {compnonent}
            </Box>
        </Box>
        
    )
}



const TabelCellEditable = ({
    id,
    data,
    schema,
    handleCellClick,
    selected,
    name
})=>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token);
    const {storeforms} = useContext(StoreContext);
    const [forms,setForms] = storeforms;
    const toggleCopy = (data) =>{
        navigator.clipboard.writeText(data)
    }
    const theme = useTheme();
    const linkcolor = theme.palette.other.link;

    
    const [mode,setMode] = useState("view")
    const [value,setValue] = useState(data)
    
    
    const {field,fulldata,label,logo} = schema;
    const changeValue = (newValue) =>{
        setValue(newValue)
    }
    if (mode==="edit"){
        if (selected===false){
            
            setMode("view")
            // update local form 
            var temp = forms.filter((form)=>form['_id']===id)[0];
            temp['data'][name] = value;
            const form = UpdateFormData(token,temp['data'],_id,id);
        }
    }
    return (
        <TableCell
            onClick = {(e)=>{
                handleCellClick(id+'-'+label)
            }}
            onDoubleClick= {()=>{
                if (field.includes("select")){
                    if (label==="狀態" || label==="Priority"){
                        setMode("edit")
                    }
                }else if(label==="Jira Number"){
                    setMode("edit")
                }
                
            }}
            onCopy ={()=>toggleCopy(value)}
            sx={{
                fontSize:"1rem",
                fontWeight:"500",
                "&>span>p>a":{
                    color:linkcolor
                },
                border:selected&&"solid #5DADE2",
                width:"100%",
                height:"100%",
            }}


        >
            {
                (mode==="view")&&(
                    (field==="select-color")?(
                        <ColorTag 
                            color={value}
                            value={fulldata[value]}
                            logo={logo}
                        />
                    ):(
                        <span 
                            className="CkeditorInput"
                            dangerouslySetInnerHTML={createMarkup(value.replaceAll('\n','<br>'))}
                        ></span>
                    )
                )
            }
            {(mode==="edit")&&(field==="text")&&(
                <InputBase 
                    sx={{
                        fontWeight:"500",
                        fontSize:"1rem",
                        width:"100%"
                    }}
                    value={value} 
                    // rows ={5} 
                    multiline={true}  
                
                    onChange={(e)=>setValue(e.target.value)}    
                />
            )}
            {/* {(mode==="edit")&&(field==="user")&&(
                <UserSearchDropdown 
                    label={label}
                    value={value} 
                    size="small"
                    sx={{width:"250px"}}
                    otherfunc = {changeValue}
                />
            )} */}
            {(mode==="edit")&&(field.includes("select"))&&(field.includes("color"))&&(
                <FormSelectColorDropdown
                    label={label}
                    otherfunc = {changeValue}
                    value = {value}
                    fulldata = {fulldata}
                    size = "small"
                    logo={logo}
                />
            )}

        </TableCell>
    )
}




export const TableWidget = forwardRef(({
    formname,
    changeNumber,
    mousePosition
},ref)=>{
    const [selectedCellId, setSelectedCellId] = useState(null);
    const handleCellClick = (cellId) => {
        setSelectedCellId(cellId);
    };
    const WindowWidth = useSelector((state)=>state.width);
    const windowheight = useSelector((state)=>state.height);
    // console.log('effect table widget2')
    const user = useSelector((state)=>state.user);
    const token = useSelector((state)=>state.token);
    const {storeformmodels,storeforms} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const [forms,setForms] = storeforms;
    const filter = useSelector((state)=>state.filter)[formname];
    const formmodel = formmodels.filter(form=>form.name === formname)[0];
    const isNonmobile = useMediaQuery("(min-width:900px)");
    const {schema,selectdata} = formmodel;
    const theme = useTheme();
    const cardcolor = theme.palette.other.card;
    const [selectrow,setSelectrow] = useState("");
    const navigate = useNavigate();
    const dark = theme.palette.neutral.dark;
    const alt  = theme.palette.background.alt;
    const dispatch = useDispatch();
    // test render init 10 and then render 50 and render all 
    const [shownum,setShownum] = useState(30);
    const [showlist,setShowlist] = useState([]);
    const [filterformfull,setFilterformfull] = useState([]);
    const [loadingbool,setLoadingbool] = useState(false);
    const [scrolltoTop,setScrolltoTop] = useState(false);
    const linkcolor = theme.palette.other.link;

    // cell fontsize
    const fontsize = "1rem";
    // click on table
    const [rowToEdit, setRowToEdit] = useState(null);
    const [dataEdit,setDataEdit] = useState("");
    const [oringaldata,setOriginalData] = useState("");
    const [rowToClick,setRowToClick] = useState(null);
    const [screen,setScreen] = useState('part');
    const toggleScreen = (value)=>{
        setScreen(value);
    }
    // right click componenets
    
    // top ref
    const TopRef = useRef();
    // width set
    const tempwidthdict = {}
    for (const key in schema){
        const {field,sx} = schema[key]
        if (field !== "blank"){
            var len = sx['gridColumn']
            var len = parseInt(len.replaceAll('span ',''))
            tempwidthdict[key] = len*100
            
        }
    }
    const dropdowncolor = theme.palette.other.dropdown;
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }

    useImperativeHandle(ref, () => ({

        updateShownum() {
            var newshownum = shownum+20;
            setShownum(newshownum);
            if (newshownum>=filterformfull.length){
                setLoadingbool(false)   
            }
        },

        getnumber(){
            return showlist.length
        }

        
    }));
    const DeleteForm = (id)=>{
        const tempfilterformfull = filterformfull.filter((form)=>form['_id']!== id);
        setFilterformfull(tempfilterformfull)
    }
    const scrollToTop = () => {
        TopRef.current?.scrollIntoView({ behavior: "instant" ,block:"end"})
    }

    const FilterFormList = () =>{
        var thisfullformlist = forms.filter(form=>form['form']['name']===formname)
        var filterform = thisfullformlist
        if (filter){
            try{
                for(const key in schema){
                    const {field} =  schema[key]
                    if (field !== 'blank'){
                        if (field !== 'time'){
                            if (filter[key].replaceAll(" ","") !== ""){
                                filterform = filterform.filter(form=>(form['data'][key].toLowerCase().replaceAll(" ","")).includes(filter[key].toLowerCase().replaceAll(" ","")))            
                            }
                        }else{
                            if (typeof filter[key+"from"] === "number"){
                                filterform = filterform.filter(form=>(Date.parse(form['data'][key])>=filter[key+"from"]))            
                            }
                            if (typeof filter[key+"to"] === "number"){
                                filterform = filterform.filter(form=>(Date.parse(form['data'][key])<=filter[key+"to"]))  
                            }
                        }
                        
                    } 
                }
                if (filter['creator'].replaceAll(" ","") !== ""){
                    filterform = filterform.filter(form=>(form['creator']['Name'].replaceAll(" ","")).includes(filter['creator'].replaceAll(" ","")))
                }
                setFilterformfull(filterform);
                setShowlist(filterform.slice(0,20))
                if (filterformfull.length !== filterform.length){
                    setShownum(20)
                    // scrollToTop()
                    setScrolltoTop(true)
                }
                UpdateShowlist(filterform)
                
                changeNumber(filterform.length)
            }catch{
                setFilterformfull(forms);
                setShowlist(forms.slice(0,20))
                if (filterformfull.length !== forms.length){
                    setShownum(20)
                    // scrollToTop()
                    setScrolltoTop(true)
                }
                UpdateShowlist(forms)
                changeNumber(forms.length)
            }
            setLoadingbool(false)
        }
    }

    const UpdateJira = (e,key)=>{
        // console.log('key',key,'rowtoEdit',rowToEdit)
        if (e.nativeEvent.button === 0) {
            mousePosition(null,null,"")
        }
        if (rowToEdit !== key){
            if (rowToEdit !== null){
                const formid = rowToEdit.replaceAll('-pin','')
                // console.log('forms',forms)
                const tempforms = [...forms]
                const tempform = tempforms.filter((tempform)=>tempform['_id']===formid)[0]
                tempform['data']['pin'] = dataEdit
                UpdateFormData(token,tempform['data'],user['_id'],formid)
                setForms(tempforms)
                setRowToEdit(null)
            }
            
        }
        setRowToClick(key)
        
    }
    const UpdateShowlist = (filterformfull)=>{
        if (filterformfull.length>0){
            setShowlist(filterformfull.slice(0,shownum))
        }
        if (scrolltoTop){
            scrollToTop()
            setScrolltoTop(false)
        }
    }

    const handleClick = (e,value) => {
        // 右鍵功能
        // console.log('e.nativeEvent.button',e.button)
        if (e.nativeEvent.button === 0) {
            console.log('Left click');
        } else if (e.nativeEvent.button === 2) {
            // console.log('Right click',e.clientX,e.clientY);
            mousePosition(e.clientX,e.clientY,value)
            // console.log(value)
        }
    };
    const toggleCopy = (value) =>{
        navigator.clipboard.writeText(value)
    }
    
    useEffect(()=>{
        UpdateShowlist(filterformfull)
        if (forms.length>0 ){
            FilterFormList()
        }
       
        
    },[forms,filter,shownum])
    return (
        
        <Paper>
            <TableContainer component={Paper} sx={{
                overflow: "initial",
            }}

            >
                <Table 
                    sx={{ 
                        minWidth: 650, 
                        
                    }}
                    stickyHeader
                    
                >
                    <TableHead                    
                        ref={TopRef} 
                    >
                        <TableRow
                            sx={{
                                position:"relative"
                            }}
                        >
                            <TableCell
                            
                            >
                                <FlexBetween>
                                    <Box></Box>
                                    <Box
                                        color="rgb(224, 224, 224)"
                                        sx={{
                                            // cursor:"col-resize",
                                            position:"relative",
                                            left:"1rem"
                                        }}
                                    >|</Box>
                                </FlexBetween>

                            </TableCell>
                            <TableCell
                            
                            >
                                <FlexBetween>
                                    <Box></Box>
                                    <Box
                                    >Clone</Box>
                                </FlexBetween>

                            </TableCell>
                            {Object.entries(formmodel['schema']).map(([key,value])=>{
                                const {field,label} = value;
                                if (field !== 'blank'){
                                    return  <TableCell key={key}
                                                sx={{
                                                    minWidth:tempwidthdict[key],
                                                    
                                                }}
                                            >
                                                <FlexBetween>
                                                    <Box>{label}</Box>
                                                </FlexBetween>
                                            </TableCell>
                                }
                            })}
                            <TableCell>
                                <FlexBetween>
                                    <Box>
                                    訊息
                                    </Box>
                                    <Box
                                        color="rgb(224, 224, 224)"
                                        sx={{
                                            // cursor:"col-resize",
                                            position:"relative",
                                            left:"1rem"
                                        }}
                                    >|</Box>
                                </FlexBetween>
                            </TableCell>
                            <TableCell>刪除</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        
                    >
                        {
                            showlist.map((rowdata)=>{
                                const {_id} = rowdata;
                                return (
                                    <TableRow
                                        key={_id}
                                        sx={{
                                            backgroundColor:alt,
                                            cursor:"default",
                                        }}
                                    >
                                        <TableCell
                                            key = {_id+"_edit"}
                                            
                                        >
                                            <BasicModal 
                                                modelsx = {{
                                                    m:'auto' ,
                                                    width:(window.innerWidth>1900)?window.innerWidth*0.7:window.innerWidth,
                                                    overflow:"scroll",
                                                    bgcolor: 'background.paper',
                                                    borderRadius:"10px",
                                                    boxShadow: 24,
                                                    p: 4,
                                                    mt : window.innerHeight*0.002,
                                                    maxHeight:window.innerHeight*0.95
                                                }}
                                                title={
                                                    <Tooltip
                                                        title="編輯"
                                                    >
                                                    <IconButton>
                                                        <EditIcon 
                                                            sx={{
                                                                color:'#2ECC71'
                                                            }}
                                                        />
                                                    </IconButton>
                                                    </Tooltip>
                                                }
                                                body={
                                                    <>
                                                        <FormDataViewPage 
                                                            formdataid={_id}
                                                        />
                                                    </>
                                                }
                                            />
                                            
                                        </TableCell>
                                        <TableCell>
                                        <BasicModal
                                            modelsx = {{
                                                m:'auto' ,
                                                width: (screen==="part")?"900px":window.innerWidth, 
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
                                                    <Tooltip
                                                        title="Clone"
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
                                                        
                                                    </Tooltip>
                                                    

                                                                    
                                                </FlexBetween>
                                            </FlexBetween>
                                
                                            }
                                            body={
                                                <FormModelClone 
                                                    formname={rowdata['form']['name']}
                                                    toggleScreen= {toggleScreen}
                                                    screen = {screen}
                                                    formdata= {rowdata['data']}
                                                />
                                            }
                                        />

                                        </TableCell>
                                        {Object.entries(schema).map(([key,value])=>{
                                            const cellvalue = rowdata['data'][key]
                                            return (
                                                <TabelCellEditable 
                                                    key = {key}
                                                    name={key}
                                                    data = {cellvalue}
                                                    id = {_id}
                                                    schema = {formmodel['schema'][key]}
                                                    handleCellClick={handleCellClick}
                                                    selected={selectedCellId===(_id+'-'+formmodel['schema'][key]['label'])}
                                                />
                                            )
                                        })}

                                        <TableCell
                                            key={_id+"_comment"}
                                        >
                                            <BasicModal 
                                                title={
                                                    <Tooltip title="回覆">
                                                        <Badge 
                                                            sx={{
                                                                "&:hover":{
                                                                    cursor:"pointer",
                                                                    color:"#28B463",
                                                                    transition: "all .1s ease",
                                                                }
                                                            }}
                                                            badgeContent={rowdata['comments'].length} color="primary">
                                                            <ChatBubbleOutlineIcon color="action" size={"large"}/>
                                                        </Badge>

                                                </Tooltip>
                                                }
                                                body={
                                                    <>
                                                        <CommentWidget 
                                                            formdata = {rowdata}
                                                            commentwidthrate = {0.55}
                                                            ckwidth = {isNonmobile?"700px":WindowWidth*0.7}
                                                        />
                                                    </>
                                                }
                                            />
                                        </TableCell>
                                        <TableCell
                                            key = {_id+"_delete"}
                                        >
                                            <DeleteModalWidget 
                                                formdata = {rowdata}
                                                title = {
                                                    <Tooltip
                                                        title ="刪除"
                                                    >
                                                        <IconButton>
                                                            <DeleteIcon 
                                                                sx= {{
                                                                    color:"#E74C3C"
                                                                }}
                                                            />  
                                                        </IconButton>
                                                    </Tooltip>
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                                
                        }

                    </TableBody>
            
                </Table>
            </TableContainer>
        </Paper>
        
    );
})




