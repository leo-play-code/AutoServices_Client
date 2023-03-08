import { 
    Box,
} from "@mui/system";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FlexBetween from "../../components/Flexbetween";
import { 
    Divider, 
    Typography,
    Button,
    useMediaQuery,
    IconButton
} from "@mui/material";
import { useSelector } from 'react-redux';
import { Formik } from "formik";
import { useState,useEffect,useContext } from "react";
import * as yup from "yup";
import { setFilter } from "../../state";
// Date Time

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TextField } from '@mui/material';
import { FormSearchDropdown, UserSearchDropdown } from "../../components/SearchDropdown";
import { FormSelectColorDropdown,FormSelectDropdown } from "../../components/Select";
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { simpleDateFormmat } from './PostBodyWidget';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../state/store';

const FilterWidget = ({
    formname,
    number=""
}) =>{
    const {storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const [schema,setSchema] = useState({});
    

    const dispatch = useDispatch();
    const [initalvalue,setInitalvalue] = useState({});
    


    const [initschema,setInitschema] = useState({});
    const isNonMobileScreens = useMediaQuery("(min-width:1230px)");
    const {palette} = useTheme();
    const windowwidth = useSelector((state)=>state.width);
    const windowheight = useSelector((state)=>state.height);
    const filter = useSelector((state)=>state.filter);
    const navigate = useNavigate();
    const getSchema = () =>{
        if (formmodels.length>0){
            const thisformmodel = formmodels.filter((formmodel)=>formmodel['name'] === formname)[0];
            setSchema(thisformmodel['schema']);
            getInitValue()
        }
    }

    const handleReset = (resetForm,setFieldValue) =>{
        const newvalues = {};
        for (const key in schema){
            const {field,label} = schema[key]
            if (field === 'time'){
                const fromkey = key+"from"
                const tokey = key+"to"
                newvalues[key+"from"] = ""
                newvalues[key+"to"] = ""
                // setFieldValue(fromkey,"",true)
                // setFieldValue(tokey,"",true)
            }else if (field!== 'blank'){
                newvalues[key] = ""
                setFieldValue(key,"")
            }
        }
        newvalues['creator'] = "";
        const newfilter = {...filter}
        newfilter[formname] = newvalues
        dispatch(
            setFilter({
                filter:newfilter
            })
        )
        resetForm()
        // window.location.reload(false)
    }
    const  filterwidthMobile= {
        width:windowwidth/2
    }
    const filterwidthNonMobile= {
        width:windowwidth/10
    }
    const getInitValue = () =>{
        const newinitvalue = {}
        const newinitschema = {}
        for (const key in schema){
            
            const {field,type} = schema[key]
            if (field !== 'blank'){
                if (field === "time"){
                    newinitvalue[key+"from"] = ""
                    newinitvalue[key+"to"] = ""
                }else{
                    newinitvalue[key] = ""
                }
                
                if (type === "string"){
                    if (field === "time"){
                        newinitschema[key+"from"] = yup.string()
                        newinitschema[key+"to"] = yup.string()
                    }else{
                        newinitschema[key] = yup.string()
                    }
                }
            }
        }
        newinitvalue['creator'] = ""
        newinitschema['creator'] = yup.string()

        setInitalvalue(newinitvalue);
        setInitschema(yup.object().shape(newinitschema));
        const newfilter = {...filter}
        newfilter[formname] = newinitvalue
        dispatch(
            setFilter({
                filter:newfilter
            })
        )
    }
    const handleFilter = (values,onSubmitProps) =>{
        // console.log('values=',values)
        const newvalues = {};
        for (const key in schema){
            const {field,label} = schema[key]
            if (field === 'time'){
                if (values[key+"from"] !== "" && (filter[formname][key+"from"] !== values[key+"from"])){
                    newvalues[key+"from"] = Date.parse(values[key+"from"])
                }else{
                    newvalues[key+"from"] = ""
                }
                if (values[key+"to"] !== "" && (filter[formname][key+"to"] !== values[key+"to"])){
                    newvalues[key+"to"] = Date.parse(values[key+'to'])
                }else{
                    newvalues[key+"to"] = ""
                }
            }else if (field!== 'blank'){
                newvalues[key] = values[key]
            }
        }
        newvalues['creator'] = values['creator']
        const newfilter = {...filter}
        newfilter[formname] = newvalues
        dispatch(
            setFilter({
                filter:newfilter
            })
        )
    }

    useEffect(()=>{
        // getInitValue();
        getSchema()
    },[formmodels,schema])
    // },[formmodels,schema])
    return(
        <Formik
            onSubmit = {handleFilter}
            initialValues = {initalvalue}
            validationSchema={initschema}
            enableReinitialize = {true}
        >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        resetForm,
                        setFieldValue,
                        handleSubmit,
                    })=>(
                        <form onSubmit={handleSubmit}>
                             <Box>
                                <FlexBetween
                                    pb="1.1rem"
                                >
                                    <FlexBetween
                                        gap="1.5rem"
                                    >
                                        <FilterAltIcon 
                                            sx={{fontSize:"25px"}}
                                        />
                                        <Typography
                                            fontWeight="700"
                                            fontSize="1rem"
                                        >
                                            Filter
                                        </Typography>
                                    </FlexBetween>
                                    <FlexBetween
                                        gap="1.5rem"
                                    >
                                        {number !== ""&&(
                                            <Typography
                                                fontWeight={"600"}
                                            >
                                                {number} 筆資料
                                            </Typography>
                                        )}
                                       
                                        <IconButton
                                            onClick={()=>{
                                                handleReset(resetForm,setFieldValue);
                                            }}
                                        >
                                            <RestartAltIcon 
                                                sx={{fontSize:"25px"}}
                                            />
                                        </IconButton>
                                    </FlexBetween>
                                </FlexBetween>
                                <Divider />
                                <Box>
                                    <Box
                                        maxHeight={windowheight*0.4}
                                        overflow="scroll"
               
                                    >
                                        {
                                            Object.entries(schema).map(([key,data])=>{
                                                const {field,fulldata,label,logo} = data;
                                                if (field !== 'blank'){
                                                    if (field === 'text' || field === 'ckeditor'){
                                                        var item = <TextField
                                                            label={label}
                                                            onChange={handleChange}
                                                            value={values[key]||""}
                                                            name={key}
                                                            size="small"
                                                            sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                        />
                                                    }else if(field === 'searchselect'){
                                                        var item =<FormSearchDropdown 
                                                            label={label}
                                                            fulldata={fulldata}
                                                            name={key}
                                                            value={values[key]}
                                                            sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                            size="small"
                                                            setFieldValue={setFieldValue}
                                                            deleteable = {false}
                                                        />
                                                    }else if((field!==undefined)&&field.includes("select")&&field !== "searchselect"){
                                                        if (field.includes("color")){
                                                            var item = 
                                                                <FormSelectColorDropdown 
                                                                    label={label}
                                                                    name ={key}
                                                                    setFieldValue = {setFieldValue}
                                                                    value = {values[key]}
                                                                    sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                                    fulldata = {fulldata}
                                                                    size = "small"
                                                                    logo={logo}
                                                                />
                                                        }else{
                                                            var item = 
                                                            <FormSelectDropdown 
                                                                label={label}
                                                                fulldata={fulldata}
                                                                name={key}
                                                                value={values[key]}
                                                                setFieldValue={setFieldValue}
                                                                size = "small"
                                                                sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                            />
                                                        }
                                                    }else if(field === "time"){
                                                        const fromkey = key+"from"
                                                        const tokey = key+"to"
                                                        var item =(

                                                        <Box
                                                            key = {key}
                                                        >
                                                            <FlexBetween
                                                                // mt="1rem"
                                                            >
                                                                {/* <Typography
                                                                    fontWeight="700"
                                                                >
                                                                    {label+" Start"}
                                                                </Typography> */}
                                                                <LocalizationProvider 
                                                                    dateAdapter={AdapterDayjs}>
                                                                    <DesktopDatePicker
                                                                        label={"Start"}
                                                                        inputFormat="YYYY/MM/DD"
                                                                        value={values[fromkey]||""}
                                                                        name={fromkey}
                                                                        onChange={(value)=>{
                                                                            
                                                                            if (value !== null){
                                                                                setFieldValue(fromkey,value,true)
                                                                            }else{
                                                                                setFieldValue(fromkey,"",true)
                                                                            }
                                                                        }}
                                                                        renderInput={(params) => <TextField 
                                                                                {...params} 
                                                                                size = "small"
                                                                                sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                                                error={false}
                                                                                
                                                                        />}
                                                                    />
                                                                </LocalizationProvider>
                                                            </FlexBetween>
                                                            <FlexBetween
                                                                mt="1rem"
                                                            >
                                                                {/* <Typography
                                                                    fontWeight="700"
                                                                >
                                                                    {label+" End"}
                                                                </Typography> */}
                                                                <LocalizationProvider 
                                                                    
                                                                    dateAdapter={AdapterDayjs}>
                                                                    <DesktopDatePicker
                                                                        label={"End"}
                                                                        inputFormat="YYYY/MM/DD"
                                                                        value={values[tokey]||""}
                                                                        name={tokey}
                                                                        onChange={(value)=>{
                                                                            
                                                                            if (value !== null){
                                                                                setFieldValue(tokey,value,true)
                                                                            }else{
                                                                                setFieldValue(tokey,"",true)
                                                                            }
                                                                        }}
                                                                        renderInput={(params) => <TextField 
                                                                                {...params} 
                                                                                size = "small"
                                                                                sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                                                error={false}
                                                                        />}
                                                                        
                                                                    />
                                                                </LocalizationProvider>
                                                            </FlexBetween>
                                                        </Box>
                                                        
                                                
                                                            
                                                        )
                                                    }else if(field === 'user'){
                                                        var item = 
                                                            <UserSearchDropdown 
                                                                label={label}
                                                                name={key}
                                                                value={values[key]}
                                                                sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                                size="small"
                                                                setFieldValue={setFieldValue}
                                                            />
                                                    }
                                                    return (
                                                        <FlexBetween
                                                            key= {key}
                                                            mt="1rem"
                                                        >
                                                            <Typography
                                                                fontWeight="700"
                                                            >
                                                                {label}
                                                            </Typography>
                                                            {item}
                                                        </FlexBetween>
                                                    )
                                                }
                                            })
                                        }
                                        <FlexBetween
                                            mt="1rem"
                                            key= {"Creator"}
                                        >
                                            <Typography
                                                fontWeight="700"
                                            >
                                                創建者
                                            </Typography>
                                            <UserSearchDropdown 
                                                label={"Creator"}
                                                name={"creator"}
                                                value={values["creator"]}
                                                sx ={isNonMobileScreens?filterwidthNonMobile:filterwidthMobile}
                                                size="small"
                                                setFieldValue={setFieldValue}
                                            />
                                        </FlexBetween>
                                    </Box>
                                    
                                    <Box
                                        sx={{m:"1rem 0"}}
                                        textAlign="end"
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
                                            Filter
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </form>
                    )}
                    
        
                
           
        </Formik>
    )
}

export default FilterWidget;