import WidgetWrapper from "../../components/WidgetWrapper";
import FlexBetween from "../../components/Flexbetween";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import NoteIcon from '@mui/icons-material/Note';
import { 
    Typography,
    Divider,
    Button,
    IconButton,
    Tooltip

} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import TableViewIcon from '@mui/icons-material/TableView';
import { useTheme } from '@emotion/react';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import { useState, useContext, useEffect } from 'react';
import { setFilterMode } from "../../state";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { StoreContext } from "../../state/store";
import { GetFormDataCount } from "../../api/formdata";
import CircularProgress from '@mui/material/CircularProgress';


export const FormProfileWidget = ({
    formname,
})=>{
    



    const {storeformmodels,storeforms} = useContext(StoreContext);
    const [forms,setForms] = storeforms;
    const thisformdata = forms.filter((form)=>form['form']['name'] === formname)



    const modelforms = forms.filter((form)=>form['form']['name']===formname);
    const [formmodels,setFormmodels] = storeformmodels;
    const formmodel = formmodels.filter((form)=>form['name']===formname)[0];
    const navigate = useNavigate();
    const filtermode = useSelector((state)=>state.filtermode);
    const theme = useTheme();
    const dark = theme.palette.neutral.dark;
    const dispatch = useDispatch();
    const token = useSelector((state)=>state.token)
    const getCount = async() =>{
        const data = await GetFormDataCount(token,formmodel['_id'])
        const tempformmodel = {...formmodel}
        tempformmodel['count'] = data['count']
        const tempformmodels = formmodels.filter((formmodel)=>formmodel['name']!==formname)
        tempformmodels.push(tempformmodel)
        setFormmodels(tempformmodels)

    }
    
    useEffect(()=>{
        // if (!formmodel['count']){
        //     getCount()
        // }
        
    },[])
    return(
        <WidgetWrapper>
            
            <FlexBetween
                pb="1.1rem"
            >
                <FlexBetween gap="1.5rem">
                    <NoteIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                        fontSize="1rem"
                    >
                        {formname}
                    </Typography>
                </FlexBetween>
                {(filtermode === "post")?(
                    <Tooltip
                        title = "資料庫型態"
                >
                    <IconButton
                        onClick={()=>{
                            dispatch(
                                setFilterMode({
                                    filtermode:"table"
                                })
                            )
                        }}
                    >
                        <TableViewIcon 
                            sx={{fontSize:"25px",color:dark}}
                        />
                    </IconButton>
                </Tooltip>
                ):(
                    <Tooltip
                        title = "貼文型態"
                >
                    <IconButton
                        onClick={()=>{
                            dispatch(
                                setFilterMode({
                                    filtermode:"post"
                                })
                            )
                        }}
                    >
                        <DynamicFeedIcon 
                            sx={{fontSize:"25px",color:dark}}
                        />
                    </IconButton>
                </Tooltip>
                )}
                
               
            </FlexBetween>
            <Divider />
            <FlexBetween
                p="1rem 0rem"
            >
                <FlexBetween gap="1.5rem">
                    <ListAltOutlinedIcon 
                        sx={{fontSize:"25px"}}
                    />
                    <Typography
                        fontWeight="700"
                    >
                        {(formmodels.length>0)
                        ?(
                            `${formmodel['number']}則貼文`
                        ):("Loading....")
                        }
                        
                    </Typography>
                </FlexBetween>
                {(formmodels.length>0)&&(formmodel['number']>forms.length)&&(
                    <>
                        {/* <Typography
                            fontWeight="700"
                        >
                            加載中
                        </Typography> */}
                        <CircularProgress color="success" size={30} />
                    </>
                   
                    
                )}
            </FlexBetween>
            <FlexBetween
                p="0.1rem 0rem"
            >
                <FlexBetween
                    gap="1rem"
                >
                    <CreateIcon 
                        sx={{
                            fontSize:"25px"
                        }}
                    />
                    <Button
                        onClick={()=>navigate(`/form/${formname}`)}
                    >
                        <Typography
                            fontWeight="700"
                        >
                            添加表單
                        </Typography>
                    </Button>
                    
                </FlexBetween>
            </FlexBetween>
        </WidgetWrapper>    
    )
}


