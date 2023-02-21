import BookmarkIcon from '@mui/icons-material/Bookmark';

import { Box } from '@mui/material';
import FlexBetween from './Flexbetween';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

export const ColorTag = ({color,value,logo})=>{

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
                    {
                        logo==="PriorityHighIcon"?(
                            <PriorityHighIcon 
                                sx={{fontSize:"15px",color:color}}
                            />
                        ):(
                            <BookmarkIcon 
                            sx={{fontSize:"15px",color:color}}
                            />
                        )
                    }
                    
                </Box>
                <Box>
                    {value}
                </Box>
            </FlexBetween>
        </FlexBetween>
    )
}