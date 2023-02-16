import BookmarkIcon from '@mui/icons-material/Bookmark';

import { Box } from '@mui/material';
import FlexBetween from './Flexbetween';


export const ColorTag = ({color,value})=>{
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
    return (
        <FlexBetween>
            <FlexBetween
                gap="1rem"
                position="relative"
            >
                <Box
                    position="relative"
                    top="0.2rem"
                >
                    <BookmarkIcon 
                        sx={{fontSize:"15px",color:colorDict[color]}}
                    />
                </Box>
                <Box>
                    {value}
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}