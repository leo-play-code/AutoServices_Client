// SELECT
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import { 
    Box,
    useTheme
} from "@mui/material";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import UserImage from './UserImage';

import PriorityHighIcon from '@mui/icons-material/PriorityHigh';


export const SelectDropdown = ({
    label,
    value,
    fulldata,
    changefunc,
    error,
    type,
    sx,
    disabled,
    size,
    logo,
    otherfunc
})=>{
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;

    return(
        <FormControl 
            sx={sx}
        >
            <InputLabel
                size={size}
                sx={{color:error&&"#d32f2f"}}>{label}</InputLabel>
                <Select
                    value={value||""}
                    label={label}
                    onChange={(e)=>{
                        try{
                            changefunc(e.target.value)
                        }catch{

                        }
                        try{
                            otherfunc(e.target.value)
                        }catch{}
                        
                    }}
                    defaultValue=""
                    error = {error}
                    disabled = {disabled}
                    size={size}
                >
                    {
                        !type?(
                            fulldata.map(data=>{
                                return  <MenuItem key={data} value={data}>{data}</MenuItem>
                            })
                        ):
                        (
                            Object.entries(fulldata).map(([key,value])=>{
                                if (type === 'color'){
                                    return  (
                                        <MenuItem key={key} value={key}>
                                            <Box
                                                width="100%"
                                                display="flex"
                                                gap="0.5rem"
                                                justifyContent="space-between"
                                            >
                                                <Box>
                          
                                                    {
                                                        logo==="PriorityHighIcon"?(
                                                            <PriorityHighIcon 
                                                                sx={{fontSize:"15px",color:key}}
                                                            />
                                                        ):(
                                                            <BookmarkIcon 
                                                            sx={{fontSize:"15px",color:key}}
                                                            />
                                                        )
                                                    }
                                                </Box>
                                                <Box>
                                                    {value}
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    )
                                }
                                
                            })
                        )
                           
                        
                            
                        

                    }
                </Select>
                {error && <FormHelperText sx={{color:"#d32f2f"}}>required</FormHelperText>}
                
        </FormControl>
    )
}
// type = color
export const FormSelectColorDropdown = (
    {
        label,
        name,
        setFieldValue,
        value,
        error,
        sx,
        fulldata,
        disabled,
        size,
        logo,
        otherfunc
    }
)=>{
    function changefunc(newvalue){
        setFieldValue(name,newvalue)       
    }
    return(
        <SelectDropdown 
            value={value}
            label={label}
            fulldata={fulldata}
            changefunc = {changefunc}
            error = {error}
            type = {'color'}
            sx={sx}
            disabled={disabled}
            size = {size}
            logo={logo}
            otherfunc={otherfunc}
        />
    )
}


// type = default
export const FormSelectDropdown = ({
    label,
    name,
    setFieldValue,
    value,
    fulldata,
    error,
    sx,
    disabled,
    size
})=>{

    function changefunc(newvalue){
        setFieldValue(name,newvalue)       
    }
    return(
        <SelectDropdown 
            value={value}
            label={label}
            fulldata={fulldata}
            changefunc = {changefunc}
            error = {error}
            sx={sx}
            disabled={disabled}
            size={size}
        />
    )
}
