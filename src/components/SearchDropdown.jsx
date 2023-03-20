import {useState,useEffect,useContext} from "react";
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import FlexBetween from "./Flexbetween";
import { IconButton,Box } from "@mui/material";
import { useTheme } from '@emotion/react';
import UserImage from "./UserImage";
import { useSelector } from 'react-redux';
import { urlpath } from "../state";
import { useDispatch } from 'react-redux';
import { setUserList } from "../state";
import { StoreContext } from '../state/store';
import { registerAPI } from "../api/auth";
const filter = createFilterOptions();


export const NormalSearchDropdown = ({
    fulldata,
    name,
    sx,
    setFieldValue,
    disabled
}) => {
    return (
        <Autocomplete
            disablePortal
            options={fulldata.map((option)=>option.name)}
            sx={sx}
            onChange={(event, newValue) => {
                setFieldValue(name,newValue)
            }}
            renderInput={(params) => <TextField {...params} label={name} />}
            disabled = {disabled}
        />
    );
  }

export const SearchDropdown=({
    sx,
    label,
    value,
    name,
    error,
    handleBlur,
    helperText,
    fulldata,
    changefunc,
    size,
    placeholder,
    disabled,
    deleteable,
    type
})=>{
    // const [value, setValue] = useState(null);
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const DeleteItem = (option)=>{
        const deleteindex = fulldata.indexOf(option)
        fulldata.splice(deleteindex,1)
        changefunc("")
    }
    return (
        <Autocomplete
            size={size}
            name={name}
            value={value||""}
            onChange={(event, newValue) => {
                
                if(newValue){
                    if (newValue.includes("Add")){
                        newValue = newValue.replaceAll('Add ','').replaceAll('"','')
                        
                    }
                }else{
                    newValue = ""
                }
                if (typeof newValue === 'string') {
                    changefunc(newValue)
                    
                } else if (newValue && newValue.inputValue) {
                    changefunc( newValue.inputValue)
                } else {
                    changefunc(newValue)
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== '' && !isExisting) {
                    filtered.push(`Add "${inputValue}"`)
                }
                return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={fulldata}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === 'string') {
                    if (option.includes("Add")){
                        option = option.replaceAll('Add ','').replaceAll('"','')
                        
                    }
                    
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.title;
            }}
            renderOption={(props, option) => 

                    deleteable?(
                        <li 
                            key={option}
                        >
                            <Box
                                width="100%"
                                display="flex"
                                gap="0.5rem"
                                justifyContent="space-between"
                                
                            >
                                <Box 
                                    {...props}
                                    flexBasis="90%"
                                >
                                {option}
                                </Box>
                                <Box
                                    flexBasis="10%"
                                >
                                    <IconButton
                                        onClick={()=>DeleteItem(option)}
                                    >
                                        <DeleteIcon sx={{fontSize:"15px",color:dark}}/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </li>  
                    ):(
                        <li 
                            key={option}
                            {...props}
                        >
                            <Box
                                width="100%"
                                display="flex"
                                gap="0.5rem"
                                justifyContent="space-between"  
                            >
                                {option}
                            </Box>
                        </li>  
                    )
                
                
            }
            sx={sx}
            freeSolo
            renderInput={(params) => (
                <TextField 
                    {...params} 
                    label={label} 
                    error={error}
                    onBlur={handleBlur}
                    helperText={helperText}
                    placeholder={placeholder}
                    
                />
            )}
            disabled = {disabled}
        />
    );
}


export const UserSearchDropdown = ({
    sx,
    label,
    name,
    value,
    size,
    setFieldValue,
    disabled,
    handleBlur,
    helperText,
    defaultbool = false,
    otherfunc
})=>{
    const user = useSelector((state)=>state.user);
    const {storeUserlist} = useContext(StoreContext);
    const [userlist,setUserlist] = storeUserlist;
    const CreateUser = async(newValue)=>{
        const data = await registerAPI({"Name":newValue['Name'],"picturePath":newValue['picturePath'],"email":newValue['Name']+"@tempory.com","password":"123"})
        setUserList([...userlist,data])
        return data
    }
    return (
        <Autocomplete
            clearOnBlur
            name={name}
            sx={sx}
            options={userlist}
            size = {size}
            autoHighlight
            onChange={(event, newValue) => {
                if(newValue){
                    if(!newValue['_id']){
                        CreateUser(newValue)
                    }
                }
                try{
                    setFieldValue(name,newValue['Name'])
                }catch{
                    if(newValue === null){
                        setFieldValue(name,"")
                    }
                }
                try{
                    otherfunc(newValue['Name'])
                }catch{
                    
                }
            }}

            defaultValue={defaultbool&&user}

            isOptionEqualToValue={(option, value) => option.id === value.id}


            filterOptions={(options, params) => {
                const { inputValue } = params;
                const filtered = options.filter((option)=>(option['Name'].toLowerCase()).includes(inputValue.toLowerCase()))
                const isExists = options.filter((option)=>(option['Name'].toLowerCase()) == (inputValue.toLowerCase()))
                if (inputValue !== '' && isExists.length==0) {
                    filtered.push({"Name":inputValue,"picturePath":""})
                }
                return filtered;
            }}
            getOptionLabel={(option) => {
                
                if (option.Name === undefined){
                    return ""
                }else{
                    return option.Name;
                }
                
            }}
            renderOption={(props, option) => {
                
                return <Box 
                    component="li" 
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }} 
                    gap="1rem"
                    {...props}
                    // key 要在props之後不然會被override
                    key = {option.Name}
                    justifyContent="space-between"
                >
                    <UserImage image={option['picturePath']} size="25px" />

                    {option.Name}
                </Box>
            }}
            renderInput={(params) => (
                
                <TextField
                    {...params}
                    label={`Choose a ${label}`}
                    onBlur={handleBlur}
                    helperText={helperText}
                    // inputProps={{
                    //     ...params.inputProps,
                    //     autoComplete: 'new-password', // disable autocomplete and autofill
                    // }}
                />
            )}
            disabled = {disabled}
        />
    )
}


export const FormSearchDropdown = ({
    sx,
    label,
    value,
    name,
    setFieldValue,
    error,
    handleBlur,
    helperText,
    fulldata,
    otherfunc,
    size,
    placeholder,
    disabled,
    deleteable=true
})=>{
    function changefunc(newvalue){
        setFieldValue(name,newvalue)
        try{
            otherfunc(newvalue)
        }catch{}
    }
    return(
        <SearchDropdown 
            sx={sx}
            label={label}
            value={value}
            name={name}
            error={error}
            handleBlur={handleBlur}
            helperText={helperText}
            fulldata={fulldata}
            changefunc={changefunc}
            size ={size}
            placeholder={placeholder}
            disabled = {disabled}
            deleteable = {deleteable}
        />
    )
}
