import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from 'react-redux';
import Navbar from "../navbar";
import ProfileWidget from "../widgets/ProfileWidget";

import RecentFormWidget from "../widgets/RecentFormWidget";
import { useEffect,useState,useContext } from "react";
import { urlpath } from "../../state";
import { useDispatch } from "react-redux";


import { useParams } from 'react-router-dom';
import BodyBox from '../../components/bodyBox';
import { CommentWidget } from "../widgets/CommentWidget";
import WidgetWrapper from "../../components/WidgetWrapper";
import FormModel from "./Form";
import { StoreContext } from '../../state/store';
const FormDataViewPage = ()=>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const token = useSelector((state)=>state.token);
    const {formdataid} = useParams();

    
    const forms = useSelector((state)=>state.forms);
    const [data,setData] = useState(forms.filter(form=>form["_id"]===formdataid)[0]);
    const windowheight = useSelector((state)=>state.height);
    const windowwidth = useSelector((state)=>state.width);
    useEffect(()=>{

    },[])
    return (
        <Box>
            <Navbar />
            <BodyBox 
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreens?"flex":"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box 
                    flexBasis={isNonMobileScreens?"26%":undefined}
                    mb="1.5rem"
                >
                    
                </Box>
                <Box
                    flexBasis={isNonMobileScreens?"42%":undefined}
                    mb="1.5rem"
                >
                    <FormModel 
                        formdata={data}
                    
                    />
                </Box>
                <Box
                    flexBasis={isNonMobileScreens?"26%":undefined}
                >
                    <WidgetWrapper
                        maxHeight = {windowheight*0.85}
                        overflow = "scroll"
                    >
                        <CommentWidget 
                            formdata = {data}
                            ckwidth = {isNonMobileScreens?windowwidth*0.17:windowwidth*0.6}
                            commentwidthrate = {0.6}
                        />
                    </WidgetWrapper>
                   
                </Box>
            </BodyBox>
        </Box>
    )
}

export default FormDataViewPage;