import { useTheme } from "@emotion/react";
import { Box,Typography,useMediaQuery } from "@mui/material"
import { useParams } from "react-router-dom";
import WidgetWrapper from "../../components/WidgetWrapper";
import Navbar from "../navbar";
import FormModel from "./Form";


const FormModelPage = ()=>{
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const theme = useTheme();
    const {formname} = useParams();
    return(

        <Box>
            <Navbar />
            <FormModel formname={formname}/>
        </Box>

       
    )
}

export default FormModelPage;