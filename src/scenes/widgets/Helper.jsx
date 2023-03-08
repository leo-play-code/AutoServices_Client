import { 
    Box, 
    Typography,
    Divider,
} from "@mui/material";
import FlexBetween from "../../components/Flexbetween";
// ICON
import HandymanIcon from '@mui/icons-material/Handyman';
const Helper = ()=>{
    return(
        <Box>
            <FlexBetween
                // mt="0.5rem"
                mb="0.2rem"
            >
                <Typography
                    fontSize={"1rem"}
                    fontWeight={"500"}
                
                >
                    2023/03/06
                </Typography>
            </FlexBetween>
            {/* <Divider /> */}
            <FlexBetween
                mt="0.4rem"
            >  
                <HandymanIcon 
                    sx={{color:"#E74C3C"}}
                />
                <Typography
                    fontWeight={"500"}
                >
                    修復PC和OS Version 無法添加新的機種的問題
                </Typography>
            </FlexBetween>
        </Box>
    )
}


export default Helper ;