import { useState,useRef,useEffect,useImperativeHandle,forwardRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import FlexBetween from './Flexbetween';
import {IconButton} from '@mui/material';
import { useSelector } from 'react-redux';




const fullstyle={
    width:"100%",
    height:"100%",
    bgcolor: 'background.paper',
    overflow:"scroll",
    p: 4,
}





export const BasicModal = forwardRef(({
    title,
    body,
    modelsx
},ref)=> {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const isNonmobile = useMediaQuery("(min-width:900px)");
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const windowheight = useSelector((state)=>state.height);
    const style = {
        // position: 'absolute',
        // top: "50%",
        // left: '50%',
        // transform: 'translate(-50%, -50%)',
        height:windowheight,
        m:"0 auto",
        width:"900px",
        overflow:"scroll",
        bgcolor: 'background.paper',
        borderRadius:"10px",
        boxShadow: 24,
        p: 4,
    };

    useImperativeHandle(ref, () => ({
        handleClose: () => {
            setOpen(false);
        }
    }));
    return (
        <div>
            <Box onClick={handleOpen}>{title}</Box>
            <Modal
                open={open}
                // 點擊旁邊關閉
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
            <Box sx={modelsx?modelsx:(isNonmobile?style:fullstyle)}>
                <FlexBetween>
                    <IconButton
                        sx={{
                            position:"relative",
                            right:"20px",
                            bottom:"10px"
                        }}
                        onClick={handleClose}
                    >
                        {
                            isNonmobile?(
                                <CloseIcon 
                                    sx={{
                                        fontSize:"30px",
                                        color:dark
                                    }}
                                />
                            ):(
                                
                                <ArrowBackIcon 
                                    sx={{
                                        fontSize:"30px",
                                        color:dark
                                    }}
                                />
                            )
                        }
                        
                        
                    </IconButton>
                </FlexBetween>
                <Box
                    sx={{
                        // overflow:"scoll",
                        // maxHeight:"500px",
                    }}
                >
                    {body}
                </Box>
                {/* <Typography id="modal-modal-title" variant="h6" component="h2">
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                </Typography> */}
            </Box>
            </Modal>
        </div>
    );
})

