import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from 'react-redux';
import Navbar from "../navbar";
import ProfileWidget from "../widgets/ProfileWidget";
import MyformWidget from "./MyformWidget";
import RecentFormWidget from "../widgets/RecentFormWidget";
import { useEffect,useState,useContext } from "react";
import { useDispatch } from "react-redux";
import { setForms,setUserList } from "../../state";
import BodyBox from '../../components/bodyBox';
import { GetAllUser } from '../../api/user';
import { GetAllFormData, GetUserAllFormData } from '../../api/formdata';
import { FetchToStore, StoreContext } from '../../state/store';
const HomePage = ()=>{
    // useContext 

    


    
    // home method
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1230px)");
    const token = useSelector((state)=>state.token);
    const width = useSelector((state)=>state.width);
    return (
        
            <Box>
            <Navbar />
            <BodyBox
                padding="2rem 2%"
                display={isNonMobileScreens?"flex":"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box 
                    flexBasis={isNonMobileScreens?"26%":undefined}
                    mb="1.5rem"
                    
                >
                    <Box
                        position={isNonMobileScreens?"fixed":""}
                        width={isNonMobileScreens?(width*0.23):"inherit"}
                    >
                        <ProfileWidget userId={_id} />
                    </Box>
                </Box>
                <Box
                    flexBasis={isNonMobileScreens?"42%":undefined}
                    mb="1.5rem"
                >
                   
                    <MyformWidget />
                
                </Box>
                <Box
                    flexBasis={isNonMobileScreens?"26%":undefined}
                >
                    <Box
                        position={isNonMobileScreens?"fixed":""}
                        width={isNonMobileScreens?(width*0.23):"inherit"}
                    >
                     <RecentFormWidget />   
                    </Box>
                    
                </Box>

            </BodyBox>
        </Box>

        
    )
}

export default HomePage;