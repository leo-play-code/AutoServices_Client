import { 
    Box,
    useMediaQuery,
    TextField,
    Typography,
    Button,
    IconButton

} from "@mui/material"
import WidgetWrapper from "../../components/WidgetWrapper";
import {Formik} from "formik";
import * as yup from "yup";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import {FormSearchDropdown} from "../../components/SearchDropdown";
import { useEffect,useContext } from 'react';
import {FormSelectDropdown,FormSelectColorDropdown} from "../../components/Select";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import Tooltip from '@mui/material/Tooltip';
import {DropdownContainer,Dropdown} from '../../components/dropdown';
import FlexBetween from "../../components/Flexbetween";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { CkeditorInput } from "../../components/CkeditorInput";
import SaveIcon from '@mui/icons-material/Save';
import DeleteModalWidget from '../widgets/DeleteModalWidget';
import { UpdateFormModel, GetOneFormModel } from '../../api/formmodel';
import { GetUserAllFormData, UpdateFormData ,GetAllFormData} from "../../api/formdata";
import { StoreContext } from "../../state/store";
import { setLocalforms } from "../../state";
const updateFormModel = async(formdict,values,updateformdict) => {
    //  只能update Array
    for (const key in formdict['selectdata']){
        const {field,fulldata,relation } = formdict['selectdata'][key]
        if (field === 'searchselect'){
            const selectitem = values['selectdata-'+key]
            if (selectitem.replaceAll(' ','') !== ''){
                if (relation){
                    const relation_list = relation.split("-");
                    if (relation_list[0] === 'selectdata'){
                        const targetname = relation_list[0]+'-'+relation_list[1]
                        var targetvalue = values[targetname]
                    }else{
                        const targetname = relation_list[1]
                        var targetvalue = values[targetname]
                    }
                    if (Array.isArray(fulldata[targetvalue])){
                        if (!fulldata[targetvalue].includes(selectitem)){
                            fulldata[targetvalue].push(selectitem)
                        }
                    }else{
                        fulldata[targetvalue] = [selectitem]
                    }
                }else{
                    if (!fulldata.includes(selectitem)){
                        fulldata.push(selectitem)
                    }
                }
            }
        }
    }
    for (const key in formdict['schema']){
        const {field,fulldata,relation } = formdict['schema'][key]
        if (field === 'searchselect'){
            const selectitem = values[key]
            if (selectitem.replaceAll(' ','') !== ''){
                if (relation){
                    const relation_list = relation.split("-");
                    if (relation_list[0] === 'selectdata'){
                        const targetname = relation_list[0]+'-'+relation_list[1]
                        var targetvalue = values[targetname]
                    }else{
                        const targetname = relation_list[1]
                        var targetvalue = values[targetname]
                    }
                    if (Array.isArray(fulldata[targetvalue])){
                        if (!fulldata[targetvalue].includes(selectitem)){
                            fulldata[targetvalue].push(selectitem)
                        }
                    }else{
                        fulldata[targetvalue] = [selectitem]
                    }
                    
                }else{
                    if (!fulldata.includes(selectitem)){
                        fulldata.push(selectitem)
                    }
                }
            }
        }
    }
    updateformdict(formdict);
}


const FormModel = ({
    formdata
})=>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const localforms = useSelector((state)=>state.forms);
    const {storeforms,storeuserforms,storeformmodels} = useContext(StoreContext);
    const [forms,setForms] = storeforms;
    const [userforms,setUserforms] = storeuserforms;
    const [formmodels,setFormmodels] = storeformmodels;
    const formname = formdata["form"]["name"]
    const [editable,setEditable] = useState(false);
    const [formdict,setFormdict] = useState({});
    const token = useSelector((state)=>state.token);
    const [initvalue,setInitvalue] = useState({});
    const [schema,setSchema] = useState({});
    const [body,setBody] = useState([]);
    const isNonMobileScreens = useMediaQuery("(min-width:1700px)");
    const isNonmobile = useMediaQuery("(min-width:700px)");
    const {palette} = useTheme();
    const user = useSelector((state)=>state.user);
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const navigate = useNavigate();
    const dark = theme.palette.neutral.dark;
    const dispatch = useDispatch();
    const getFormModel = async(data)=>{
        const formmodel = formmodels.filter((formmodel)=>formmodel['name']===formname)[0]
        setFormdict(formmodel)
        getInitValue(data)
    }

    const toggleupdatedata = async(values,token,userid,formdataid) =>{
        const tempforms = [...localforms].filter((form)=>form['_id']!=formdata['_id']);    
        const tempform = {...formdata}
        tempform['data'] = values;
        tempforms.push(tempform);
        dispatch(
            setLocalforms({
                forms:tempforms
            })
        )
        const form = await UpdateFormData(token,values,userid,formdataid);
        if (formdata['creator']['_id']===_id){
            try{
                const tempuserforms = [...userforms];
                tempuserforms.find((Form) => Form['_id'] == formdata['_id'])['data'] = tempform['data']
                setUserforms(tempuserforms)
            }catch{
                const tempuserforms = await GetUserAllFormData(token,_id)
                setUserforms(tempuserforms)
            }
            
        }
        try{
            const tempstoreforms = [...forms];
            tempstoreforms.find((Form) => Form['_id'] == formdata['_id']).data = tempform['data'];
            setForms(tempstoreforms)
        }catch{
            if (forms.length>0){
                const tempuserforms = await GetAllFormData(token)
                setForms(tempuserforms)
            }
            
        }
        
            
  
        

    }
    const updateformdict  = (newdict) =>{
        setFormdict(newdict)
    }
    const getInitValue = (data)=>{
        const newinitvalue = {};
        const newschema = {};
        for( const key in data['data']){
            const {field,relation} = data['form']['schema'][key];
            const initvalue = data['data'][key];
            if(field !== 'blank'){
                if (field === "text"){
                    const modifydata = data['data'][key].replaceAll("<br />","\n")
                    newinitvalue[key]=modifydata
                }else{
                    newinitvalue[key]=data['data'][key]
                }
                

            }
            
            /* SCHEMA */
            if (data['form']['schema'][key]['type']==='string' && data['form']['schema'][key]['required']===true){
                newschema[key]= yup.string().required("required");
            }else if(field !== 'blank'){
                newschema[key]= yup.string()
            }
        }
        for (const key in data['form']['selectdata']){
            const {initvalue} = data['form']['selectdata'][key]
            newinitvalue['selectdata-'+key] = initvalue;
            newschema['selectdata-'+key] = yup.string();
        }
        setInitvalue(newinitvalue);
        setSchema(yup.object().shape(newschema));
    }
    const handleFormSubmit = async(values,onSubmitProps)=>{
        updateFormModel(formdict,values,updateformdict);
        const data = await UpdateFormModel(token,formdict,formdict['name'])
        const newValues = {}
        for (const key in values){
            if (!(key.includes("&:blank") || key.includes("selectdata-"))){
                const {label,field} = formdict['schema'][key]
                if (field !== 'ckeditor'){
                    newValues[key] = values[key].replaceAll('\n','<br />');
                }else{
                    newValues[key] = values[key];
                }
            }
        }
        
        toggleupdatedata(newValues,token, user['_id'],formdata['_id'])
        setEditable(false)
        
    }

    // FormMenu Function
    function CopyAll(values){
        var copycontent = ``
        for (const key in values){
            if (key.includes('selectdata')&&values[key]!==""){
                const name = key.replaceAll('selectdata-','')
                copycontent+=`${formdict['selectdata'][name]['label']}: ${values[key]}\n`
            }
        }
        navigator.clipboard.writeText(copycontent)
        updateFormModel(formdict,values,updateformdict)
    }
    function CopyEach(key,values){
        const newkey = 'selectdata-'+key
        const copycontent = `${formdict['selectdata'][key]['label']}: ${values[newkey]}`
        navigator.clipboard.writeText(copycontent)
        updateFormModel(formdict,values,updateformdict)
    }
    useEffect(()=>{
        getFormModel(formdata);
    },[localforms,storeformmodels])
    return(
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={initvalue}
            validationSchema={schema}
            enableReinitialize = {true}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                setFieldValue,
                resetForm,
            })=>(
                <form onSubmit={handleSubmit}>
                    
                            <WidgetWrapper
                                maxWidth="700px"
                                m="0rem auto"
                                
                            >   
                            
                                {/* FORM TITLE */}
                                <FlexBetween >
                                    <Box
                                        mb="0.5rem"  
                                    >
                                        <Typography
                                            fontWeight="800"
                                            fontSize="2.5rem"
                                            maxWidth="200px"
                                        >   
                                            {formname}
                                        </Typography>
                                        
                                    </Box>
                                    <FlexBetween
                                        gap="1rem"
                                    >
                                        <Box 
                                            textAlign="end"
                                        >
                                            <Dropdown 
                                                ref_active = {true}
                                                title = "補充"
                                                label = {
                                                    <CallToActionIcon sx={{color:dark}}/>
                                                }
                                                child ={
                                                    <DropdownContainer
                                                    >
                                                        <DropdownContainer
                                                                sx={{top:"0.25rem",right:"-2.5rem",padding:"1rem 1rem",paddingLeft:"1rem"}}
                                                                fontSize="1rem"
                                                                backgroundColor={alt}
                                                                width="15rem"
                                                        >
                                                            {
                                                                ((formdict['selectdata']!==undefined))?
                                                                (Object.entries(formdict['selectdata']).map(([key, value]) => {
                                                                    const {sx,label,usage,relation,field,fulldata} = value
                                                                    var disabled = false;
                                                                    if (field === 'searchselect'){
                                                                        if (relation){
                                                                            const relation_list = relation.split("-");
                                                                            if (relation_list[0] === 'selectdata'){
                                                                                const targetname = relation_list[0]+'-'+relation_list[1]
                                                                                var targetvalue = values[targetname]
                                                                            }else{
                                                                                const targetname = relation_list[1]
                                                                                var targetvalue = values[targetname]
                                                                            }
                                                                            if (fulldata[targetvalue]){
                                                                                var finallist = fulldata[targetvalue]
                                                                                
                                                                            }else{
                                                                                var finallist = []
                                                                                var disabled = true;
                                                                            }
                                                                        }else{
                                                                            var finallist = fulldata
                                                                        }
                                                                        const newkey = 'selectdata-'+key
                                                                        var placeholder = ``
                                                                        if (relation){
                                                                            const relation_list =  relation.split("-")
                                                                            placeholder += `關聯 ${formdict[relation_list[0]][relation_list[1]]['label']}`
                                                                        }
                                                                        return(
                                                                            <Box
                                                                                width="100%"
                                                                                key={key}
                                                                                display="flex"
                                                                                mt="1rem"
                                                                                justifyContent="space-between"
                                                                            >
                                                                                <Box
                                                                                    flexBasis="95%"                            
                                                                                >
                                                                                    <FormSearchDropdown 
                                                                                        size = {"small"}
                                                                                        label={label}
                                                                                        fulldata={finallist}
                                                                                        name={newkey}
                                                                                        value={values[newkey]}
                                                                                        setFieldValue={setFieldValue}
                                                                                        handleBlur={handleBlur}
                                                                                        sx={sx}
                                                                                        placeholder={placeholder}
                                                                                        disabled = {disabled}
                                                                                    />
                                                                                </Box>
                                                                                <Box
                                                                                    flexBasis="5%"
                                                                                    textAlign="end"
                                                                                >
                                                                                    <Tooltip
                                                                                        title="複製"
                                                                                    >
                                                                                        <IconButton
                                                                                            onClick={()=>CopyEach(key,values)}
                                                                                        >
                                                                                            <ContentCopyIcon 
                                                                                                sx={{fontSize:"15px",color:dark}}
                                                                                            />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                
                                                                                </Box>
                                                                            </Box> 
                                                                            )
                                                                    }

                                                                }))
                                                                :""
                                                            }
                                                            <Box>
                                                                <Tooltip title="複製全部內容">
                                                                    <IconButton
                                                                        onClick={()=>CopyAll(values)}
                                                                    >
                                                                        <FileCopyIcon 
                                                                            sx={{fontSize:"15px",color:dark}}
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>
                                                            
                                                        </DropdownContainer>
                                                    </DropdownContainer>
                                                }
                                            />
                                        </Box>
                                        {!editable?(
                                            <Tooltip
                                                title = "編輯"
                                            >
                                                <IconButton
                                                    onClick={()=>setEditable(true)}
                                                >
                                                    <EditIcon 
                                                        sx={{
                                                            color:"#E74C3C",
                                                        }}
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        ):
                                        (
                                            <Button
                                                type="submit"
                                            >
                                                <Tooltip
                                                    title="儲存"
                                                >
                                                    <SaveIcon 
                                                        sx={{
                                                            color:"#52BE80",
                                                        }}
                                                    />
                                                </Tooltip>
                                                
                                            </Button>
                                        )}
                                        <Box>
                                        <DeleteModalWidget 
                                            formdata = {formdata}
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
                                            otherfunc = {
                                                ()=>{
                                                    navigate("/home")
                                                }
                                            }
                                            />
                                        </Box>
                                    </FlexBetween>
                                    
                                </FlexBetween>
                                {/* FORM BODY */}
                                <Box
                                    mt="1rem"
                                    display="grid"
                                    gap="30px"
                                    pb="1rem"
                                    // repeat(4) = 分4等分,最長12
                                    gridTemplateColumns="repeat(4,minmax(0,1fr))"
                                    sx={{
                                        "&>div":{
                                            gridColumn:isNonmobile?undefined:"span 4"
                                        }
                                    }}
                                >               
                                        {
                                            ((formdict['schema']!==undefined))?
                                                (Object.entries(formdict['schema']).map(([key, value]) => {
                                                    const  {fulldata,disabled,field,label,multiline,sx,rows,relation,initvalue} = value;
                                                    if (field === "text"){
                                                        if (relation){
                                                            const relation_list = relation.split("-")
                                                            if (relation_list[0] === 'selectdata'){
                                                                const targetname = relation_list[0]+'-'+relation_list[1]
                                                                var targetvalue = values[targetname]
                                                            }else{
                                                                const targetname = relation_list[1]
                                                                var targetvalue = values[targetname]
                                                            }
                                                            if (typeof initvalue === 'object'){
                                                                var beforedata = '';
                                                                if (values[key]){
                                                                    for (const initkey in initvalue){
                                                                        if (values[key].includes(initvalue[initkey]) && initvalue[initkey] !== '' ){
                                                                            var beforedata = initvalue[initkey];
                                                                        }
                                                                    }
                                                                }
                                                                if (beforedata !== ''){
                                                                    values[key] = values[key].replaceAll(beforedata,initvalue[targetvalue])
                                                                }else{
                                                                    values[key] = initvalue[targetvalue] +''+values[key]
                                                                }
                                                            }
                                                            var placeholder = ``
                                                            if (relation){
                                                                // const relation_list =  data[key]['relation'].split("-")
                                                                // placeholder += `關聯 ${data[relation_list[0]][relation_list[1]]['label']}`
                                                            } 
                                                            return(<TextField
                                                                key = {key}
                                                                label={label}
                                                                multiline={multiline}
                                                                rows={rows}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values[key]||""}
                                                                name={key}
                                                                error={Boolean(touched[key])&&Boolean(errors[key])}
                                                                helperText = {touched[key]&&errors[key]}
                                                                sx={sx}
                                                                disabled={editable?(typeof disabled === 'object')?disabled[targetvalue]:disabled:true}
                                                                placeholder={placeholder}
                                                            />)
                                                        }else{
                                                            return (<TextField
                                                                key = {key}
                                                                label={label}
                                                                multiline={multiline}
                                                                rows={rows}
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                value={values[key]||""}
                                                                name={key}
                                                                error={Boolean(touched[key])&&Boolean(errors[key])}
                                                                helperText = {touched[key]&&errors[key]}
                                                                sx={sx}
                                                                disabled={editable?disabled:true}
                                                            />)
                                                        }
                                                        
                                                    }else if(field === "user"){
                                                        return (<TextField
                                                            key = {key}
                                                            label={label}
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values[key]||""}
                                                            name={key}
                                                            error={Boolean(touched[key])&&Boolean(errors[key])}
                                                            helperText = {touched[key]&&errors[key]}
                                                            sx={sx}
                                                            disabled={editable?disabled:true}
                                                        />)
                                                    }else if(field === "time"){
                                                        return (<LocalizationProvider 
                                                            key = {key}
                                                            dateAdapter={AdapterDayjs}>
                                                            <DesktopDatePicker
                                                                label={label}
                                                                inputFormat="YYYY/MM/DD"
                                                                value={values[key]||""}
                                                                onBlur={handleBlur}
                                                                name={key}
                                                                onChange={(value)=>setFieldValue(key,value,true)}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                helperText = {touched[key]&&errors[key]}
                                                                sx={sx}
                                                                disabled={editable?disabled:true}
                                                            />
                                                        </LocalizationProvider>)
                                                    }else if((field!==undefined)&&field.includes("select")&&field !== "searchselect"){
                                                
                                                        if (field.includes("color")){
                                                           return (
                                                                <FormSelectColorDropdown 
                                                                    key = {key}
                                                                    label={label}
                                                                    name ={key}
                                                                    setFieldValue = {setFieldValue}
                                                                    value = {values[key]}
                                                                    error={Boolean(touched[key])&&Boolean(errors[key])}
                                                                    sx={sx}
                                                                    fulldata = {fulldata}
                                                                    helperText = {touched[key]&&errors[key]}
                                                                    handleBlur={handleBlur}
                                                                    disabled={editable?disabled:true}
                                                                />
                                                           )
                                                        }else{
                                                            return (<FormSelectDropdown 
                                                                key = {key}
                                                                label={label}
                                                                fulldata={fulldata}
                                                                name={key}
                                                                value={values[key]}
                                                                sx={sx}
                                                                setFieldValue={setFieldValue}
                                                                error={Boolean(touched[key])&&Boolean(errors[key])}
                                                                handleBlur={handleBlur}
                                                                helperText = {touched[key]&&errors[key]}
                                                                disabled={editable?disabled:true}
                                                            />)
                                                        }
                                                        
                                                    }else if(field === "searchselect"){
                                                        return (<FormSearchDropdown 
                                                            key = {key}
                                                            label={label}
                                                            fulldata={fulldata}
                                                            name={key}
                                                            value={values[key]}
                                                            sx={sx}
                                                            setFieldValue={setFieldValue}
                                                            error={Boolean(touched[key])&&Boolean(errors[key])}
                                                            handleBlur={handleBlur}
                                                            helperText = {touched[key]&&errors[key]}
                                                            disabled = {editable?disabled:true}
                                                        />)
                                                    }else if(field === "blank"){
                                                        return (
                                                            <Box
                                                                key = {key}
                                                                sx={sx}
                                                            >
                                                            </Box>
                                                        )
                                                       
                                                    }else if(field === 'ckeditor'){
                                                        return (
                                                            <CkeditorInput 
                                                                key = {key}
                                                                name={key}
                                                                label = {label}
                                                                value = {values[key]||""}
                                                                setFieldValue = {setFieldValue}
                                                                handleChange = {handleChange}
                                                                handleBlur = {handleBlur}
                                                                sx = {sx}
                                                                disabled = {editable?disabled:true}
                                                                error={Boolean(touched[key])&&Boolean(errors[key])}
                                                            />
                                                        )
                                                    }
                                            }))
                                            :""
                                        }
                                </Box>
                            </WidgetWrapper>
                </form>
            )}
        </Formik>
    )
}

export default FormModel;