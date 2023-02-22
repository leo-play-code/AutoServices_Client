import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { maxHeight } from '@mui/system';
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



export const TableWidget = forwardRef(({
    formname,
    changeNumber,
    mousePosition
},ref)=>{
    const user = useSelector((state)=>state.user);
    const token = useSelector((state)=>state.token);
    const {storeformmodels,storeforms} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const localforms = useSelector((state)=>state.forms);
    const [forms,setForms] = storeforms;
    const filter = useSelector((state)=>state.filter)[formname];
    const formmodel = formmodels.filter(form=>form.name === formname)[0];
    const isNonmobile = useMediaQuery("(min-width:900px)");
    const windowwidth = useSelector((state)=>state.width);
    const windowheight = useSelector((state)=>state.height);
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
                                const {_id,data} = rowdata;
                                const body = []
                                body.push(
                                    <TableCell
                                        key = {_id+"_edit"}
                                        
                                    >
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
                                )
                                for (const key in formmodel['schema']){
                                    
                                    const {label,field,fulldata,logo} = formmodel['schema'][key]
                                    
                                    if (field === "select-color"){
                                    
                                        const color = data[key]
                                        const value = fulldata[data[key]]
                                        var cell = (
                                            <ColorTag 
                                                color={color}
                                                value={value}
                                                logo={logo}
                                            />
                                        )
                                    }else if (field !== "blank"){
                               
                                        var cell = (<span 
                                            className="CkeditorInput"
                                            dangerouslySetInnerHTML={createMarkup(data[key].replaceAll('\n','<br>'))}
                                        >
                                        
                                        </span>)
                 
                                    }
                                    const copydata = data[key].replace(/<\/p>/g, '\n').replace(/<p>/g, '');
                                    if (field !== "blank"){
                                        if (key === "pin"){
                                            if ((_id+"-"+key) === rowToEdit && rowToClick === (_id+"-"+key)){
                                                var item = <TableCell
                                                    onCopy ={()=>toggleCopy(copydata)}
                                                    key={_id+"-"+key}
                                                    // sx={{fontWeight:"500",fontSize:"1rem"}}
                                                    sx={{
                                                        fontSize:fontsize,
                                                        fontWeight:"500",
                                                        "&>span>p>a":{
                                                            color:linkcolor
                                                        },
                                                        border:"solid #5DADE2",
                                                        boxShadow: "0px 2px 2px 0px"
                                                
                                                    }}
                                                    onContextMenu={(e)=>handleClick(e,data[key])}
                                                >
                                                    <InputBase 
                                                        sx={{
                                                            fontWeight:"500",
                                                            fontSize:fontsize,
                                                        }}
                                                        value={dataEdit} 
                                                        rows ={5} 
                                                        multiline={true}  
                                                        onChange={(e)=>setDataEdit(e.target.value)}    
                                                    />
    
                                                </TableCell>
                                            }else if(rowToClick === (_id+"-"+key)){
                                                var item = <TableCell
                                                    onCopy ={()=>toggleCopy(copydata)}
                                                    onDoubleClick= {()=>{
                                                        setRowToEdit(_id+"-"+key);
                                                        setDataEdit(data[key]);
                                                        setOriginalData(data[key])
                                                    }}
                                                    onClick = {(e)=>{
                                                        UpdateJira(e,_id+"-"+key)
                                                    }}
                                                    onContextMenu={(e)=>{handleClick(e,data[key]);UpdateJira(e,_id+"-"+key)}}
                                                    key={_id+"-"+key}
                                                    sx={{
                                                        fontSize:fontsize,
                                                        fontWeight:"500",
                                                        "&>span>p>a":{
                                                            color:linkcolor
                                                        },
                                                        border:"solid #5DADE2",
                                                        boxShadow: "0px 2px 2px 0px"
                                                    }}
                                                >
                                                    {cell}
                                                </TableCell>
                                            }
                                            
                                            else{
                                                var item = <TableCell
                                                    onCopy ={()=>toggleCopy(copydata)}
                                                    onDoubleClick= {()=>{
                                                        setRowToEdit(_id+"-"+key);
                                                        setDataEdit(data[key]);
                                                        setOriginalData(data[key])
                                                    }}
                                                    onContextMenu={(e)=>{handleClick(e,data[key]);UpdateJira(e,_id+"-"+key)}}
                                                    onClick = {(e)=>{
                                                        UpdateJira(e,_id+"-"+key)
                                                    }}
                                                    key={_id+"-"+key}
                                                    sx={{
                                                        fontSize:fontsize,
                                                        fontWeight:"500",
                                                        "&>span>p>a":{
                                                            color:linkcolor
                                                        }
                                                
                                                    }}
                                                >
                                                    {cell}
                                                </TableCell>
                                            }
                                        }else{
                                            if (rowToClick === _id+"-"+key){
                                                var item = <TableCell
                                                    onCopy ={()=>toggleCopy(copydata)}
                                                    onClick = {(e)=>{
                                                        UpdateJira(e,_id+"-"+key)
                                                    }}
                                                    onContextMenu={(e)=>{handleClick(e,data[key]);UpdateJira(e,_id+"-"+key)}}
                                                    key={_id+"-"+key}
                                                    sx={{
                                                        fontSize:fontsize,
                                                        fontWeight:"500",
                                                        "&>span>p>a":{
                                                            color:linkcolor
                                                        },
                                                        border:"solid #5DADE2",
                                                        boxShadow: "0px 2px 2px 0px"
                                                    }}
                                                >
                                                    {cell}
                                                </TableCell>
                                            }else{
                                                var item = <TableCell
                                                    onCopy ={()=>toggleCopy(copydata)}
                                                    key={_id+"-"+key}
                                                    onClick = {(e)=>{
                                                        UpdateJira(e,_id+"-"+key)
                                                    }}
                                                    onContextMenu={(e)=>{handleClick(e,data[key]);UpdateJira(e,_id+"-"+key)}}
                                                    sx={{
                                                        fontSize:fontsize,
                                                        fontWeight:"500",
                                                        "&>span>p>a":{
                                                            color:linkcolor
                                                        },
                                                        
                                                    }}
                                                >
                                                    {cell}
                                                </TableCell>
                                            }
                                            
                                        }
                                        
                                        
                                        body.push(item)
                                    }
                                
                                }
                                body.push(
                                    <TableCell
                                        key={_id+"_comment"}
                                    >
                                        <BasicModal 
                                            title={
                                                <Tooltip title="回覆">
                                                <FlexBetween
                                                    gap="0.5rem"
                                                    sx={{
                                                        "&:hover":{
                                                            cursor:"pointer",
                                                            color:"#28B463",
                                                            transition: "all .1s ease",
                                                        }
                                                    }}
                                                >
                                                        <ChatBubbleOutlineIcon />
                                                        <Typography
                                                            fontWeight="500"
                                                        >
                                                            {rowdata['comments'].length}
                                                        </Typography>
                                                </FlexBetween>
                                            </Tooltip>
                                            }
                                            body={
                                                <>
                                                    <CommentWidget 
                                                        formdata = {rowdata}
                                                        commentwidthrate = {0.55}
                                                        ckwidth = {isNonmobile?"700px":windowwidth*0.7}
                                                    />
                                                </>
                                            }
                                        />
                                    </TableCell>
                                )
                                body.push(
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
                                )
                                return (
                                <TableRow
                                    onClick={()=>{
                                        if (selectrow === _id){
                                            setSelectrow("")
                                        }else{
                                            setSelectrow(_id)
                                        }
                                    }}
                                    key={_id}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        cursor:"default",
                                        backgroundColor:(selectrow===_id)?
                                            cardcolor
                                            :alt
                                    }}
                                >
                                    {body}
                                </TableRow>)
                            })
                        }

                    </TableBody>
            
                </Table>
            </TableContainer>
        </Paper>
        
    );
})




