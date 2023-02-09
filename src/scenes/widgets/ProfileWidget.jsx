import { Box, useTheme,IconButton, Typography, Divider } from '@mui/material';
import FlexBetween from '../../components/Flexbetween';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserImage from '../../components/UserImage';

// icon
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import { StoreContext } from '../../state/store';


const ProfileWidget = ({userId})=>{
    const {storeuserforms,storeUserlist,storeforms,storeformmodels} = useContext(StoreContext);
    const [userforms,setUserforms] = storeuserforms;
    const user = useSelector((state)=>state.user);
    const {Name , picturePath,email} = user;
    const {palette} = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state)=>state.token);


    useEffect(()=>{

    },[userforms])


    
    return (
        <WidgetWrapper
            
        >
            <FlexBetween
                pb="1.1rem"
            >
                <FlexBetween gap="1.5rem">
                    <UserImage image={picturePath} size={"40px"} />
                    <Typography
                        fontWeight="700"
                    >
                        {Name}
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <Divider />
            <FlexBetween 
                p="1rem 0.4rem"
            >
                <FlexBetween gap="2.1rem">
                    <ContactMailIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                    >
                            {email}
                    </Typography>
                </FlexBetween>
            </FlexBetween>
            <FlexBetween
                p="0.1rem 0.4rem"
            >
                <FlexBetween
                    gap="2.1rem"
                >
                    <ListAltOutlinedIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                    >
                        {userforms.length>0?userforms.length:0}
                    </Typography>
                </FlexBetween>
                
            </FlexBetween>
        </WidgetWrapper>
    )
}
export default ProfileWidget;