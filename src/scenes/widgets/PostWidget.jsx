import { 
    Box,
    Divider,
    Typography,
    useMediaQuery,
    Button,
    Collapse,
    useTheme
} from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector, useDispatch } from 'react-redux';
import FlexBetween from "../../components/Flexbetween";
import { Fragment,useState,useEffect,useRef } from "react";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import {BasicModal} from "../../components/modal";
import Tooltip from '@mui/material/Tooltip';
import {PostBodyWidget,DateFormat} from './PostBodyWidget';
import { CommentWidget } from "./CommentWidget";




const PostWidget = ({form}) =>{
    const todaydate =  new Date();
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const [data,setData] = useState(form);
    const [compareTime,fullTime] = DateFormat(data['createdAt'],todaydate);
    const [scollbool,setScrollbool] = useState(true);
    const childref = useRef();
    const windowwidth = useSelector((state)=>state.width);
    const isNonmobile = useMediaQuery("(min-width:900px)");
    const [postshowlimit,setPostshowlimit] = useState(true);

    useEffect(()=>{
        setData(form)
    },[form,postshowlimit])
    return(
        <Box
            
        >
            <PostBodyWidget
                compareTime={compareTime}
                data = {data}
                showlimit={postshowlimit}
            />
            <FlexBetween
                mt="0.5rem"
            >
                <Box></Box>
                <Typography
                    sx={{
                        "&:hover":{
                            cursor:"pointer",
                            color:"#5499C7"
                        }
                    }}
                    onClick={()=>setPostshowlimit(!postshowlimit)}
                >
                    {postshowlimit?(<>Read More ... </>):(<>Close</>)}
                    
                </Typography>
            </FlexBetween>
            <FlexBetween
                mt="0.5rem"
            >
                
                    <FlexBetween
                        gap="1.5rem"
                    >
                        <BasicModal 
                            ref = {childref}
                            title={
                                <Tooltip title="回覆">
                                <FlexBetween
                                    gap="0.5rem"
                                    sx={{
                                        "&:hover":{
                                            cursor:"pointer",
                                            color:"#28B463",
                                            transition: "all .1s ease",
                                        }
                                    }}
                                >
                                        <ChatBubbleOutlineIcon />
                                        <Typography
                                            fontWeight="500"
                                        >
                                            {data['comments'].length}
                                        </Typography>
                                </FlexBetween>
                            </Tooltip>
                            }
                            body={
                                <>
                                    <PostBodyWidget 
                                        compareTime={compareTime}
                                        data = {data}
                                        scrollable = {scollbool}
                                        showlimit = {false}
                                    />
                                    
                                    <FlexBetween
                                        mt="1rem"
                                        mb="0.5rem"
                                    >
                                        <Box></Box>
                                        <Typography>
                                            {fullTime}
                                        </Typography>
                                    </FlexBetween>
                                    <Divider /> 
                                    <CommentWidget 
                                        formdata = {data}
                                        commentwidthrate = {0.25}
                                        ckwidth = {isNonmobile?"700px":windowwidth*0.7}
                                    />
                            
                                </>
                            }
                        />
                    </FlexBetween>
           
                <Typography>
                    {fullTime}
                </Typography>
            </FlexBetween>
              
            
        </Box>
    )
    
}

export default PostWidget;