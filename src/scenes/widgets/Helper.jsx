import { 
    Box, 
    Typography,
    Divider,
} from "@mui/material";
import FlexBetween from "../../components/Flexbetween";
// ICON
import HandymanIcon from '@mui/icons-material/Handyman';
import AddBoxIcon from '@mui/icons-material/AddBox';
import FileCopyIcon from '@mui/icons-material/FileCopy';
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
            <FlexBetween
                // mt="0.5rem"
                mb="0.2rem"
            >
                <Typography
                    fontSize={"1rem"}
                    fontWeight={"500"}
                
                >
                    2023/03/15
                </Typography>
            </FlexBetween>
            {/* <Divider /> */}
            <FlexBetween
                mt="0.4rem"
            >  
                <AddBoxIcon 
                    sx={{color:"#2ECC71"}}
                />
                <Typography
                    fontWeight={"500"}
                >
                    增加桌面可直接編輯Jira Number 以及 Priority
                </Typography>
            </FlexBetween>
            <FlexBetween
                // mt="0.5rem"
                mb="0.2rem"
            >
                <Typography
                    fontSize={"1rem"}
                    fontWeight={"500"}
                
                >
                    2023/03/20
                </Typography>
            </FlexBetween>
            {/* <Divider /> */}
            <FlexBetween
                mt="0.4rem"
            >  
                <AddBoxIcon 
                    sx={{color:"#2ECC71"}}
                />
                <Typography
                    fontWeight={"500"}
                >
                    添加Clone Buglist 的功能 點擊此圖 <FileCopyIcon sx={{color:"#F5B041"}}/> 即可Clone
                </Typography>
            </FlexBetween>
            <FlexBetween
                // mt="0.5rem"
                mb="0.2rem"
            >
                <Typography
                    fontSize={"1rem"}
                    fontWeight={"500"}
                
                >
                    2023/03/22
                </Typography>
            </FlexBetween>
            {/* <Divider /> */}
            <FlexBetween
                mt="0.4rem"
            >  
                <AddBoxIcon 
                    sx={{color:"#2ECC71"}}
                />
                <Typography
                    fontWeight={"500"}
                >
                    網址可點擊(orange color)
                </Typography>
            </FlexBetween>
            
        </Box>
    )
}


export default Helper ;