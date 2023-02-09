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

const filter = createFilterOptions();




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
    disabled
})=>{
    const {storeUserlist} = useContext(StoreContext);
    const [userlist,setUserlist] = storeUserlist;
 
    return (
        <Autocomplete
            clearOnBlur
            name={name}
            sx={sx}
            options={userlist}
            size = {size}
            autoHighlight
            onChange={(event, newValue) => {
                console.log('newvalue',newValue)
                try{
                    setFieldValue(name,newValue['Name'])
                }catch{
                    if(newValue === null){
                        setFieldValue(name,"")
                    }
                }
            }}
            onInputChange={(event, newInputValue, reason) => {
                if (newInputValue === ""){
                    // setFieldValue(name,null)
                }
            }}


            filterOptions={(options, params) => {
                const { inputValue } = params;
                const filtered = options.filter((option)=>(option['Name'].toLowerCase()).includes(inputValue.toLowerCase()))
                return filtered;
            }}
            getOptionLabel={(option) => {

                if (value ===""){
                    return ""
                }else{
                    return option.Name;
                }
            }}
            renderOption={(props, option) => (
                <Box 
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
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Choose a ${label}`}
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
