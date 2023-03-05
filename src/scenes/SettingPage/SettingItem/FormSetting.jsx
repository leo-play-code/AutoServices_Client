import WidgetWrapper from "../../../components/WidgetWrapper";
import FlexBetween from '../../../components/Flexbetween';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography,useMediaQuery } from '@mui/material';
import { useTheme } from '@emotion/react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState,useContext } from "react";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { setSettings, urlpath } from "../../../state";
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { UpdateSetting } from "../../../api/user";
import { StoreContext } from '../../../state/store';

export const PostSetting = ({title})=>{
    const {storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;

    
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token);

    const [form,setForm] = useState(undefined); 
    const theme = useTheme();
    const dropdowncolor = theme.palette.other.dropdown;
    const dispatch = useDispatch();
    const mysetting = useSelector((state)=>state.settings);

    
    const changeSettings = async(formname,key) =>{
        // change target
        const changedict = {}
        console.log('mysetting',mysetting)
        if (mysetting[title][formname][key]===undefined){
            changedict[key] = true
        }else{
            
        }
        for (const keyitem in mysetting[title][formname]){
            if (key === keyitem ){
                changedict[keyitem] = !mysetting[title][formname][keyitem]
            }else{
                changedict[keyitem] = mysetting[title][formname][keyitem]
            }
        }
        
        // second dict
        const seconddict = {}
        for (const formnameitem in mysetting[title]){
            if (formnameitem === formname){
                seconddict[formnameitem] = changedict
            }else{
                seconddict[formnameitem] = mysetting[title][formnameitem]
            }
        }

        //  out dict
        const thirddict = {}
        for (const titleitem in mysetting){
            if (titleitem === title){
                thirddict[titleitem] = seconddict
            }else{
                thirddict[titleitem] = mysetting[titleitem]
            }
        }
        dispatch(
            setSettings({
                settings:thirddict
            })
        )
        const data = await UpdateSetting(token,thirddict,_id)
    }
    const settingItemStyle = {
        "&:hover":{
            cursor:"pointer",
            backgroundColor:dropdowncolor
        },
        borderRadius:"5px",
        padding:"0.5rem 1rem"
    }
    return (
        <>
            <Box
                flexBasis={isNonMobileScreens?"20%":undefined}
                mb="1.5rem"
            >
                <WidgetWrapper
                >
                    {formmodels.map(form=>
                        <FlexBetween
                            key={form['_id']}
                            mb="0.75rem"
                            sx={settingItemStyle}
                            onClick={()=>setForm(form)}
                        >
                            <Typography
                                fontWeight="600"
                            >
                                {form['name']}
                            </Typography>
                            <Box>
                                <ArrowForwardIcon 
                                />
                            </Box>
                        </FlexBetween>    
                    )}
                </WidgetWrapper>
            </Box>
            {   
                (form!==undefined)&&(
                    <Box
                        flexBasis={isNonMobileScreens?"20%":undefined}
                        mb="1.5rem"
                    >
                        <WidgetWrapper>
                            {Object.entries(form['schema']).map(([key,value])=>{
                                const {label,field} = value
                                if(field!=='blank'){
                                    
                                    if (mysetting[title][form['name']][key]){
                                        var viewItem = 
                                        <RemoveRedEyeIcon 
                                            sx={{
                                                color:"#27AE60"
                                            }}
                                        />
                                    }else{
                                        
                                        var viewItem = 
                                        <VisibilityOffIcon
                                            sx={{
                                                color:"#E74C3C"
                                            }}
                                        />
                                    }
                                    return(
                                        <FlexBetween
                                            key={key}
                                            mb="0.75rem"
                                            sx={settingItemStyle}
                                            onClick ={()=>changeSettings(form['name'],key)}
                                        >
                                            <FlexBetween
                                                gap="1.5rem"
                                            >
                                                <DragHandleIcon />
                                                <Box>
                                                    <FlexBetween>
                                                        <Typography
                                                            fontWeight="600"
                                                        >
                                                            {label}
                                                        </Typography>
                                                    </FlexBetween>
                                                </Box>
                                                
                                             
                                            </FlexBetween>
                                            
                                            <Box>
                                                
                                               {viewItem}
                                            </Box>
                                        </FlexBetween>    
                                    )
                                }
                            })}
                        </WidgetWrapper>
                    </Box>
                )
            }
        </>
    )
}

