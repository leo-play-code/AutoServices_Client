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
import FlexBetween from "../../components/Flexbetween";
import FlexBetweenTop from '../../components/FlexBetweenTop';
const FormDataViewPage = ({formdataid})=>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const {storeforms,storeuserforms,storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const token = useSelector((state)=>state.token);
    // const {formdataid} = useParams();

    const [screen,setScreen] = useState('part')
    const [forms,setForms] = storeforms;
    const data = forms.filter(form=>form["_id"]===formdataid)[0]
    const windowheight = useSelector((state)=>state.height);
    const windowwidth = useSelector((state)=>state.width);
    const toggleScreen = (value)=>{
        setScreen(value)
    }
    useEffect(()=>{

    },[forms])
    return (
        // <Box>
        //     <Navbar />
            <Box 
                width="100%"
            >
                <Box
                    sx={{
                        display:(screen==="part")&&"flex",
                        justifyContent:(screen==="part")&&"space-between",
                        alignItems:(screen==="part")&&"flex-start"
                    }}
                >
                    {
                        (data!==undefined)&&(formmodels.length>0)&&( <FormModel 
                            formdata={data}
                            toggleScreen= {toggleScreen}
                            screen = {screen}
                        />)
                    }
                    

                    <WidgetWrapper
                        maxHeight = {windowheight*0.85}
                        maxWidth = {windowwidth*0.4}
                        overflow = "scroll"
                        width={windowwidth*0.3}
                        sx={{
                            display:(screen==="full")&&"none"
                        }}
                    >
                        {
                            (data!==undefined)&&(formmodels.length>0)&&(
                                <CommentWidget 
                                    formdata = {data}
                                    ckwidth = {isNonMobileScreens?windowwidth*0.17:windowwidth*0.6}
                                    commentwidthrate = {0.55}
                                />
                            )
                        }
                        
                    </WidgetWrapper> 
                </Box>
                    

       

                   
  
            </Box>
        // </Box>
    )
}

export default FormDataViewPage;