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

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Fragment, useState,useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import {FormSearchDropdown,UserSearchDropdown} from "../../components/SearchDropdown";
import { useEffect } from 'react';
import {FormSelectDropdown,FormSelectColorDropdown} from "../../components/Select";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import Tooltip from '@mui/material/Tooltip';
import {DropdownContainer,Dropdown} from '../../components/dropdown';
import FlexBetween from "../../components/Flexbetween";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { urlpath } from "../../state";
import { useNavigate } from 'react-router-dom';
import { CkeditorInput } from "../../components/CkeditorInput";
import BodyBox from '../../components/bodyBox';
import { CreateFormData } from '../../api/formdata';
import { GetOneFormModel, UpdateFormModel } from '../../api/formmodel';
import { StoreContext } from "../../state/store";
import { registerAPI } from "../../api/auth";
// icon 
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

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


const FormModel = ({formname,toggleScreen,screen})=>{
    const {storeuserforms,storeforms,storeformmodels,storeUserlist} = useContext(StoreContext);
    const [userforms,setUserforms] = storeuserforms;
    const [formmodels,setFormmodels] = storeformmodels;
    const [userlist,setUserlist] = storeUserlist;
    const [forms,setForms] = storeforms;
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const [formdict,setFormdict] = useState({});
    const token = useSelector((state)=>state.token);
    const [initvalue,setInitvalue] = useState({});
    const [schema,setSchema] = useState({});
    const [body,setBody] = useState([]);
    const isNonMobileScreens = useMediaQuery("(min-width:1700px)");
    const isNonmobile = useMediaQuery("(min-width:700px)");
    const {palette} = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state)=>state.user);
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const navigate = useNavigate();
    const dark = theme.palette.neutral.dark;
    const getFormModel = async()=>{
        if (formmodels.length>0){
            var data = formmodels.filter((formmodel)=>formmodel['name']===formname)[0]
        }else{
            var data = await GetOneFormModel(token,formname)
        }
        setFormdict(data)
        getInitValue(data)
    }
    const createFormDataDB = async(values,userid,formid) =>{

        const form = await CreateFormData(token,values,userid,formid)
        try{
            const tempuserforms = [...userforms];
            tempuserforms.unshift(form)
            setUserforms(tempuserforms)
        }catch{}
        try{
            const tempforms = [...forms];
            tempforms.unshift(form)
            setForms(tempforms)
        }catch{
            
        }
        
    }
    const updateformdict  = (newdict) =>{
        setFormdict(newdict)
    }
    const getInitValue = (data)=>{
        const newinitvalue = {};
        const newschema = {};
        for( const key in data['schema']){
            const {field,relation,initvalue} = data['schema'][key];
            if (data['schema'][key]['auto']){
                if (data['schema'][key]['field'] === 'user'){
                    newinitvalue[key]=user.Name;
                }else if (data['schema'][key]['field'] === 'time'){
                    const date = new Date();
                    const futureDate = date.getDate();
                    date.setDate(futureDate);
                    const todaydate = date.toLocaleDateString('en-CA');
                    newinitvalue[key]=todaydate;
                }
            }else if(field !== 'blank'){
                if (relation){
                    newinitvalue[key] = ""
                }else{
                    newinitvalue[key]=data['schema'][key]['initvalue'];
                }
            }
            
            /* SCHEMA */
            if (data['schema'][key]['type']==='string' && data['schema'][key]['required']===true){
                newschema[key]= yup.string().required("required");
            }else if(field !== 'blank'){
                newschema[key]= yup.string()
            }
        }
        for (const key in data['selectdata']){
            const {initvalue} = data['selectdata'][key]
            newinitvalue['selectdata-'+key] = initvalue;
            newschema['selectdata-'+key] = yup.string();
        }
        setInitvalue(newinitvalue);
        setSchema(yup.object().shape(newschema));
    }
    const handleFormSubmit = async(values,onSubmitProps)=>{
        updateFormModel(formdict,values,updateformdict);
        const tempformdict = {...formdict}
        tempformdict['number'] = formdict['number']+=1
        UpdateFormModel(token,tempformdict,formdict['name']);
        CreateUser(values)
        setFormmodels(formmodels.map(obj => {
            if (obj.name === tempformdict['name']) {
              return { ...obj, ...tempformdict};
            } else {
              return obj;
            }
          }));
        const newValues = {}
        for (const key in values){
            if (key.includes("&:blank") || key.includes("selectdata-")){
                delete values[key]
            }else{
                const {label,field} = formdict['schema'][key]
                if (field !== 'ckeditor'){
                    newValues[key] = values[key];
                }else{
                    newValues[key] = values[key];
                }
                
            }
        }

        createFormDataDB(newValues, user['_id'],formdict['_id'])
        onSubmitProps.resetForm()
        // navigate("/home")
    }

    const CreateUser = async(values) =>{
        for (const key in formdict['schema']){
            const {label,field} = formdict['schema'][key]
            if (field === 'user'){
                if (userlist.filter((user)=>user['Name']===values[key]).length === 0){
                    const data = await registerAPI({"email":`${values[key]}@tempory.com`,"Name":values[key],"picturePath":""})   
                    const tempuserlist = [...userlist];
                    tempuserlist.push(data['savedUser'])
                    setUserlist(tempuserlist)
                }
            }  
        
        }
        
    }


    // FormMenu Function
    function CopyAll(values){
        var copycontent = ``
        for (const key in values){
            if (key.includes('selectdata')&&values[key]!==""){
                const name = key.replaceAll('selectdata-','')
                const {label,setup} = formdict['selectdata'][name]
                if (setup['label']==true){
                    copycontent+=`${label}: ${values[key]}\n`
                }else{
                    copycontent+=`${values[key]}`
                }
                
            }
        }
        navigator.clipboard.writeText(copycontent)
        updateFormModel(formdict,values,updateformdict)
    }

    function CopyEach(key,values){
        const {label,setup} = formdict['selectdata'][key]
        const newkey = 'selectdata-'+key
        if (setup['label']==true){
            var copycontent = `${label}: ${values[newkey]}`
        }else{
            var copycontent = `${values[newkey]}`
        }
        
        navigator.clipboard.writeText(copycontent)
        updateFormModel(formdict,values,updateformdict)
    }
    useEffect(()=>{
        getFormModel();
    },[])
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
                    {/* <BodyBox 
                        // padding="2rem 6%"
                        display={isNonMobileScreens?"flex":"block"}
                        gap="0.5rem"
                        justifyContent="space-between"
                    > */}
                        {/* <Box flexBasis={isNonMobileScreens?"30%":undefined} >
                        </Box> */}
                      
                        
                        {/* <Box 
                            flexBasis={isNonMobileScreens?"40%":undefined}
                        > */}
                            <WidgetWrapper
                                maxWidth="100%"
                                m="1rem auto"
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
                                        gap="1.5rem"
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
                                                                const {sx,label,relation,field,fulldata} = value
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
                                                                            if (targetvalue === ""){
                                                                                var disabled = true;
                                                                            }
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
                                    {
                                        (screen==="part")?(
                                            <IconButton
                                                onClick={()=>{toggleScreen("full")}}
                                            >
                                                <FullscreenIcon />
                                            </IconButton>
                                        ):(
                                            <IconButton
                                                onClick={()=>{toggleScreen("part")}}
                                            >
                                                <FullscreenExitIcon />
                                            </IconButton>
                                        )
                                    }
                                    </FlexBetween>
                                    
                                </FlexBetween>
                                {/* FORM BODY */}
                                <Box
                                    mt="1rem"
                                    display="grid"
                                    gap="30px"
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
                                                    const  {fulldata,disabled,field,label,multiline,sx,rows,relation,initvalue,logo} = value;
                                                    if (field === "text"){
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
                                                            disabled={disabled}
                                                        />)
                                                    }else if(field === "user"){                            
                                                        return <UserSearchDropdown 
                                                            key = {key}
                                                            label={label}
                                                            name={key}
                                                            value={values[key]}
                                                            disabled ={disabled}
                                                            sx={sx}
                                                            defaultbool = {true}
                                                            setFieldValue={setFieldValue}
                                                            handleBlur = {handleBlur}
                                                            helperText = {touched[key]&&errors[key]}
                                                        />
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
                                                                disabled={disabled}
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
                                                                    logo={logo}
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
                                                                disabled = {disabled}
                                                                error={Boolean(touched[key])&&Boolean(errors[key])}
                                                            />
                                                        )
                                                    }
                                            }))
                                            :""
                                        }
                                </Box>
                                <Box
                                    sx={{m:"1rem 0"}}
                                    textAlign="center"
                                >
                                    <Button 
                                        type="submit"
                                        sx={{
                                            backgroundColor:palette.primary.main,
                                            color:"white",
                                            "&:hover":{
                                                color:palette.primary.main
                                            }
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </WidgetWrapper>
                           
                        {/* </Box>
                        <Box 
                            flexBasis={isNonMobileScreens?"30%":undefined}
                        >
                        </Box> */}
                    {/* </BodyBox> */}
                </form>
            )}
        </Formik>
    )
}

export default FormModel;