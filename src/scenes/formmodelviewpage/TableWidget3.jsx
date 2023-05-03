
import { useState, useEffect,useContext,useRef,useImperativeHandle,forwardRef } from 'react';
import { StoreContext } from '../../state/store';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FlexBetween from '../../components/Flexbetween';
import { BasicModal } from '../../components/modal';
import { useTheme } from '@emotion/react';
import { useMediaQuery, Typography,Button, IconButton,Tooltip,Box ,Divider, InputBase,Badge} from '@mui/material';
import DeleteModalWidget from '../widgets/DeleteModalWidget';
import FormModelClone from '../clonePage/FormModel';
import { CommentWidget } from '../widgets/CommentWidget';
import { FormSelectColorDropdown } from '../../components/Select';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateFormData } from '../../api/formdata';
import { createMarkup } from '../../components/CkeditorInput';
import { ColorTag } from '../../components/ColorTag';

// api
import { GetNewFormData } from '../../api/formdata';

// icon
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import FormDataViewPage from '../formdataviewpage/index';

export const extractUrlFromString =(value)=>{
    if (value !== undefined){
        var newvalue = value;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return newvalue.replaceAll(urlRegex, '<a href="$&" target="_blank">$&</a>');
    }else{
        return ""
    }
   
}

const TabelCellEditable = ({
    id,
    data,
    schema,
    handleCellClick,
    selected,
    name,
    forms
})=>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token);
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
    
    useEffect(()=>{
        const newform = forms.filter(form=>form['_id']===id)[0]
        if (newform['data'][name]!==value){
            setValue(newform['data'][name])
        }
    },[forms])
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
                            dangerouslySetInnerHTML={createMarkup(extractUrlFromString(value).replaceAll('\n','<br>'))}
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

export function TableWidget({
    formname
}) {
    const [selectedCellId, setSelectedCellId] = useState(null);
    const handleCellClick = (cellId) => {
        setSelectedCellId(cellId);
    };
    const filter = useSelector((state)=>state.filter)[formname];
    const token = useSelector((state)=>state.token);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [forms,setForms] = useState([]);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // get form data
    const {storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    // var thisfullformlist = forms.filter(form=>form['form']['name']===formname)
    const formmodel = formmodels.filter(form=>form.name === formname)[0];
    const {schema,selectdata} = formmodel;
    const tempwidthdict = {}
    for (const key in schema){
        const {field,sx} = schema[key]
        if (field !== "blank"){
            var len = sx['gridColumn']
            var len = parseInt(len.replaceAll('span ',''))
            if (len===1){
                tempwidthdict[key] = len*50
            }else{
                if (key.includes('system')|| key.includes('link') || key.includes('testcase') ){
                    tempwidthdict[key] = len*100
                }
                else if(key.includes('chinese') || key.includes('title')){
                    tempwidthdict[key] = len*150
                }else{  
                    tempwidthdict[key] = len*200

                }
                
            }
        }
    }
    // theme
    const theme = useTheme();
    const alt  = theme.palette.background.alt;
    console.log('forms = ',forms)
    const dropdowncolor = theme.palette.other.dropdown;
    const dropdownItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px"
    }

    // close modal
    const handleCloseModal = ()=>{
        childRef.current.handleClose();
    }

    const childRef = useRef();
    const [screen,setScreen] = useState('part');
    const toggleScreen = (value)=>{
        setScreen(value);
    }

    // screen
    const isNonmobile = useMediaQuery("(min-width:900px)");
    const WindowWidth = useSelector((state)=>state.width);
    const windowheight = useSelector((state)=>state.height);

    // get form data
    const GetFormData = async()=>{
        console.log(filter,page,rowsPerPage)
        const formdata = await GetNewFormData(token,rowsPerPage*page,rowsPerPage,filter)
        console.log('formdata',formdata)
        setForms(formdata)
    }

    useEffect(()=>{
        GetFormData()
    },[filter,page,rowsPerPage])
    return (

        <Paper sx={{ width: '100%', overflow: 'hidden'}}>
        <TableContainer sx={{ maxHeight: '1500px'}}>
            <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow
                        sx={{
                            position:"relative",
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
                                    sx={{fontSize:"1rem"}}
                                >Clone</Box>
                            </FlexBetween>

                        </TableCell>
                        <TableCell>
                            <FlexBetween>
                                <Box
                                    sx={{fontSize:"1rem"}}
                                >
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
                        {Object.entries(formmodel['schema']).map(([key,value])=>{
                            const {field,label} = value;
                            if (field !== 'blank'){
                                return  <TableCell key={key}
                                            sx={{
                                                minWidth:tempwidthdict[key],
                                                Width:200,
                                                fontSize:"1rem"
                                            }}
                                        >
                                            <FlexBetween>
                                                <Box>{label}</Box>
                                            </FlexBetween>
                                        </TableCell>
                            }
                        })}
                        <TableCell
                            sx={{
                                fontSize:"1rem"
                            }}
                        >刪除</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {forms
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rowdata) => {
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
                                ref={childRef}
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
                                        closeModal={handleCloseModal}
                                    />
                                }
                            />
                            </TableCell>
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
                            {Object.entries(schema).map(([key,value])=>{
                                const {field} = value;
                                if (field !=='blank'){
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
                                            forms={forms}
                                        />
                                    )
                                }
                                
                            })}

                            
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
                })}
            </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={formmodel['number']}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </Paper>

    );
}