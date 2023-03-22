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
import * as XLSX from 'xlsx';

function transformData(data,schema) {

  
    return data.map(({ data }) => {
        const transformedData = {};
        for (const key in data) {
            const {fulldata,field} = schema[key]
            if (field === 'select-color'){
                var realdata = fulldata[data[key]]
            }else{
                var realdata = data[key]
            }
            if (key in schema) {

                transformedData[schema[key]['label']] = realdata;
            } else {
                transformedData[key] =realdata;
            }
        }
        return transformedData;
    });
  }

function exportToExcel(data,schema) {
    // const newValue = transformData(data,schema)
    // const worksheet = XLSX.utils.json_to_sheet(newValue.reduce((acc, item) => {
    //     return [...acc, {...item}];
    // }, []));


    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'AutoServices');
    // XLSX.writeFile(workbook, 'AutoServices.xlsx');
    const newValue = transformData(data, schema);
    const worksheet = XLSX.utils.json_to_sheet(
        newValue.reduce((acc, item) => {
        return [...acc, { ...item }];
        }, [])
    );

   // Get column data as array of arrays
    const columnData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Determine length of longest string in each column
    const columnLengths = columnData.map((column) => {
    return column.reduce((maxLength, cell) => {
        const cellLength = (cell || '').toString().length;
        return Math.max(maxLength, cellLength);
    }, 0);
    });
    // Add column lengths to worksheet
    worksheet['!cols'] = columnLengths.map((length) => ({ width: 20}));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AutoServices');
    XLSX.writeFile(workbook, 'AutoServices.xlsx');
}


const FilterWidget = ({
    formname,
    filterform=undefined
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
        if (filter[formname]){

        }else{
            dispatch(
                setFilter({
                    filter:newfilter
                })
            )
        }
        
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



        getSchema()

        
    },[formmodels,schema])
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
                                        {filterform !== undefined&&(
                                            <Typography
                                                fontWeight={"600"}
                                            >
                                                {filterform.length} 筆資料
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
                                    <FlexBetween
                                        mt="1rem"
                                    >
                                        <Box></Box>
                                        <FlexBetween
                                            gap="1rem"
                                        >
                                            <Button
                                                onClick={()=> exportToExcel(filterform,schema)}
                                                type="submit"
                                                sx={{
                                                    backgroundColor:"#229954",
                                                    color:"white",
                                                    "&:hover":{
                                                        color:"#229954"
                                                    }
                                                }}
                                                mr="1rem"
                                            >
                                                Export
                                            </Button>
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
                                        </FlexBetween>
                                    </FlexBetween>
                                    {/* <Box
                                        sx={{m:"1rem 1rem"}}
                                        textAlign="end"
                                    >
                                        
                                        
                                    </Box> */}
                                </Box>
                            </Box>
                        </form>
                    )}
                    
        
                
           
        </Formik>
    )
}

export default FilterWidget;