import { IconButton, Typography, useTheme,Box } from '@mui/material';
import FlexBetween from './Flexbetween';
import WidgetWrapper from './WidgetWrapper';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled } from '@mui/system';

const RightClickFlexBetween = styled(FlexBetween)({
    // "&:hover":{
    //     cursor:"pointer",
    //     backgroundColor:dropdowncolor
    // },
    // "&:active":{
    //     cursor:"pointer",
    //     backgroundColor:dropdownactivecolor
    // },
    // padding="0.5rem"
})

const RightClick = ({
    x,
    y,
    value,
    tool
}) =>{
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const dropdowncolor = theme.palette.other.dropdown;
    const dropdownactivecolor = theme.palette.other.dropdownactive;

    const copy = () =>{
        // console.log('copy value',value)
        navigator.clipboard.writeText(value)
    }
    const showHistory = ()=>{
        console.log('history')
    }
    return (
        <Box
            width="200px"
            position="absolute"
            top={y}
            left={x}
            sx={{
                zIndex:"1000",
                backgroundColor:alt,
                padding:"0.75rem",
                borderRadius:"0.4rem",
                boxShadow:'0px 8px 16px 0px rgba(0,0,0,0.5)',
            }}
            
        >
            {tool.includes('copy')&&(
                <FlexBetween
                    onClick={copy}
                    sx={{
                        "&:hover":{
                            cursor:"pointer",
                            backgroundColor:dropdowncolor
                        },
                        "&:active":{
                            cursor:"pointer",
                            backgroundColor:dropdownactivecolor
                        }
                    }}
                    padding="0.5rem"
                >
                    <FlexBetween
                        gap="1rem"
                    >
                        <ContentCopyIcon 
                            />

                            <Typography
                                fontWeight={700}
                            >
                                複製
                            </Typography>
                    </FlexBetween>
                </FlexBetween>
            )}
            {tool.includes('history')&&(
                <FlexBetween
                    onClick={
                        showHistory
                    }
                >

                </FlexBetween>
            )}
        </Box>
    )
}

export default RightClick ;
