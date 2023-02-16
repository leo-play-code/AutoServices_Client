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
export const SelectDropdown = ({
    label,
    value,
    fulldata,
    changefunc,
    error,
    type,
    sx,
    disabled,
    size
})=>{
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const colorDict = {
        "red":"#E74C3C",
        "orange":"#E67E22",
        "yellow":"#F1C40F",
        "green":"#2ECC71",
        "blue":"#3498DB",
        "purple":"#9B59B6",
        "#16A085":"#16A085",
        "#F39C12":"#F39C12"
    }
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
                        changefunc(e.target.value)
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
                                                    <BookmarkIcon 
                                                        sx={{fontSize:"15px",color:colorDict[key]}}
                                                    />
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
        size
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
