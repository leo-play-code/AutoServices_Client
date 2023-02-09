import { Box, Typography } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from 'react-redux';
import { useEffect,useContext } from "react";
import FlexBetween from "../../components/Flexbetween";
import { DateFormat } from "./PostBodyWidget";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { StoreContext } from '../../state/store';



const RecentFormWidget = ()=>{
    const {storeformmodels,storeforms} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const [forms,setForms] = storeforms;
    const dt = new Date();
    const theme = useTheme();
    const dropdowncolor = theme.palette.other.dropdown;
    const navigate = useNavigate();

    useEffect(()=>{

    },[formmodels])
    return (
        <WidgetWrapper>
            {(formmodels.length>0)&&formmodels.map((form)=>
                <FlexBetween
                    key = {form['name']}
                    sx={{
                        cursor:"pointer",
                        "&:hover":{
                            backgroundColor:dropdowncolor
                        }
                    }}
                    borderRadius="5px"
                    p="0.7rem 1rem" 
                    onClick = {()=>{navigate(`/formmodel/form/${form['name']}`)}}
                    mb="0.5rem"
                >
                    <Typography
                        fontWeight="500"
                        
                    >
                        #{form['name']}
                    </Typography>
                    <Typography
                        fontWeight="500"
                    >
                        {(form['number']!==undefined)?`${form['number']}貼文`:"Loading..."}
                    </Typography>
                    <Typography
                        fontWeight="500"
                    >
                    </Typography>
                </FlexBetween>
            
            )}
            
        </WidgetWrapper>
   )
}

export default RecentFormWidget;