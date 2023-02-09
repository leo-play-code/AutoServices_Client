
import { Typography,Box, Divider } from '@mui/material';
import FlexBetween from '../../components/Flexbetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@emotion/react';
const SettingDialog = ({
    toggleTitle
}) =>{
    const theme = useTheme();
    const dropdowncolor = theme.palette.other.dropdown;
    const titlelist = [
        "貼文顯示方式",
        "個人設定",
        "顯示模式",
        "其他"
    ]
    const settingItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px",
        padding:"0.5rem 1rem"
    }
    

    return (
        <WidgetWrapper>
            {titlelist.map(data=>
                <FlexBetween
                    key = {data}
                    mb="0.75rem"
                    sx={settingItemStyle}
                    onClick={()=>toggleTitle(data)}
                >
                    <Typography
                        fontWeight="700"
                    >
                        {data}
                    </Typography>
                    <Box>
                        <ArrowForwardIcon 
                        />
                    </Box>
                </FlexBetween>
            )}
        </WidgetWrapper>
    )
}


export default SettingDialog;