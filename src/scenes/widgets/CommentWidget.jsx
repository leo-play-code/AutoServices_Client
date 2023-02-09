import { Box } from "@mui/system"
import { useDispatch,useSelector } from "react-redux";
import { useState,useEffect,useRef,useContext } from "react";
import { setForms } from "../../state";
import FlexBetween from "../../components/Flexbetween";
import { 
    Typography,
    IconButton,
    Divider, 
    Tooltip
} from "@mui/material";
import UserImage from "../../components/UserImage";
import { CkeditorInput,createMarkup } from "../../components/CkeditorInput";
import SendIcon from '@mui/icons-material/Send';
import { DateFormat } from "./PostBodyWidget";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CreateComment, UpdateComment } from '../../api/formdata';
import { StoreContext } from '../../state/store';
export const CommentItem = ({
    num,
    comment,
    RefreshCommentlist,
    commentlist,
    ckwidth,
})=>{
    const user = useSelector((state)=>state.user);
    const dt = new Date();
    const [mode,setMode] = useState('view');
    const [commentdata,setCommentdata] = useState(comment['comments']);
    const [compareTime,createTime] = DateFormat(comment['createTime'],dt);
    const EditComment = () =>{
        setMode('edit')
    }
    const DeleteComment = () =>{
        const tempcommentlist = [...commentlist]
        tempcommentlist.splice(num,1)
        RefreshCommentlist(tempcommentlist)
    }
    const changeComment = (value) =>{
        setCommentdata(value)
    }
    
    const saveComment = () =>{
        const tempcomment = {...comment}
        const tempcommentlist = [...commentlist]
        tempcomment['edit'] = true
        tempcomment['comments'] = commentdata
        tempcommentlist[num] = tempcomment
        RefreshCommentlist(tempcommentlist);
        setMode('view')
    }
    const cancelComment = () =>{
        setMode('view')
        setCommentdata(comment['comments']);
    }

    return (
        <Box mt="1rem">
            {
                (mode==='view')?(
                    <>
                        <FlexBetween
                            sx={{
                                position:"relative"
                            }}
                        >
                            <FlexBetween 
                                gap="1.5rem"
                                sx={{
                                    position:"relative"
                                }}
                            >

                                <Typography
                                    component={'span'}
                                    sx={{
                                        position:"absolute",
                                        top:"0px",
                                        left:"0px"
                                        
                                    }}
                                >
                                    <UserImage image={comment['user']['picturePath']} size={"40px"} />
                                </Typography>
                                <Box
                                    sx={{
                                        position:"relative",
                                        top:"0px",
                                        left:"60px"
                                    }}
                                >
                                    <span 
                                        className="CkeditorInput"
                                        
                                        dangerouslySetInnerHTML={createMarkup(comment['comments'])}
                                    >
                                    </span>
                                    {comment['edit']&&<Typography>(已編輯)</Typography>}
                                </Box>
                            </FlexBetween>
                            <FlexBetween
                                gap="0.01rem"
                                sx={{
                                    position:"absolute",
                                    top:"-10px",
                                    right:"0px"
                                }}
                            >
                                {
                                    (user["_id"]===comment['user']["_id"])&&(
                                        <>
                                            <Tooltip
                                                title = "編輯評論"
                                            >
                                                <IconButton
                                                    onClick={()=>EditComment()}
                                                >
                                                    <EditIcon 
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip
                                                title ="刪除評論"
                                            >
                                                <IconButton
                                                    onClick={()=>DeleteComment()}
                                                >
                                                    <DeleteIcon 
                                                        fontSize="small"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            </FlexBetween>
                        </FlexBetween>
                        <FlexBetween
                            mb="0.5rem"
                        >
                            <Typography
                                sx={{
                                    position:"relative",
                                    top:"0px",
                                    left:"60px"
                                }}
                            >
                                {compareTime}
                            </Typography>
                            <Typography>
                                {createTime}
                            </Typography>
                        </FlexBetween>
                    </>
                ):
                (
                    <>
                    <FlexBetween
                        mt="1.5rem"
                        mb="1.5rem"
                        sx={{
                            position:"relative"
                        }}
                    >
                        <FlexBetween
                            gap="1.5rem"
                            sx={{
                                position:"relative"
                            }}
                        >
                            <Typography
                                component={'span'}
                                sx={{
                                    position:"absolute",
                                    top:"0px",
                                    left:"0px"
                                    
                                }}
                            >
                                <UserImage image={comment['user']['picturePath']} size={"40px"} />
                            </Typography>
                            <Box
                                sx={{
                                    position:"relative",
                                    top:"0px",
                                    left:"60px"
                                }}
                                width={"100%"}
                            >
                                
                                <CkeditorInput 
                                    label = {"你的回覆"}
                                    value = {commentdata}
                                    name = {"comment"}
                                    otherfunc = {changeComment}
                                    sx = {{width:"10px"}}
                                    setheight ={"150px"}
                                />
                            </Box>
                            
                        </FlexBetween>
                        <FlexBetween
                            sx={{
                                position:"absolute",
                                top:"-10px",
                                right:"0px"
                            }}
                        >
                           
                            <IconButton
                                sx={{
                                    "&:hover":"",
                                }}
                                onClick={()=>saveComment()}
                                disabled={(commentdata.replaceAll(" ","")!=="")?false:true}
                            >
                                <SaveIcon 
                                    fontSize = "small"
                                />
                            </IconButton>
                            <IconButton
                                onClick={()=>cancelComment()}
                            >
                                <CancelIcon 
                                    fontSize= "small"    
                                />
                            </IconButton>
                        </FlexBetween>
                    </FlexBetween>
                    </>
                )
            }
           
            <Divider />
        </Box>
    )
}

export const CommentWidget = ({
    formdata,
    ckwidth="100%",
    commentwidthrate = 1
}) =>{
    const {storeforms,storeuserforms} = useContext(StoreContext);
    const [userforms,setUserforms] = storeuserforms;
    const [forms,setForms] = storeforms;
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token);

    const commentbody = [];
    const dispatch = useDispatch();
    const [comment,setComment] = useState("");
    const [data,setData] = useState(formdata);
    const [commentlist,setCommentlist] = useState(data['comments']);
    const windowheight = useSelector((state)=>state.height);
    const messagesEndRef = useRef();
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" ,block:"end"})
    }
    const changeComment = (value) =>{
        setComment(value)
    }



    const RefreshCommentlist = async(newcommentlist) =>{
        setCommentlist(newcommentlist)
        const form = await UpdateComment(token,data["_id"],newcommentlist)
        setData(form)
        // userforms update
        if (formdata['creator']['_id']===_id){
            const tempuserforms = [...userforms];
            tempuserforms.find((Form) => Form['_id'] == formdata['_id']).comments = form['comments']
            setUserforms(tempuserforms)
        }
        try{
            const tempforms = [...forms];
            tempforms.find((Form) => Form['_id'] == formdata['_id']).comments = form['comments'];
            setForms(tempforms)
        }catch{
            
        }

    }
    for (const key in commentlist){
        const item = 
            <Box
                key = {key}
            >
                <CommentItem
                    comment = {commentlist[key]}
                    num = {key}
                    RefreshCommentlist = {RefreshCommentlist}
                    commentlist = {commentlist}
                    ckwidth = {ckwidth}
                />
            </Box>
        commentbody.push(item);
    }
    const sendComment = async()=>{
        const comments = {"user":_id,"comments":comment};
        setComment("")
        const form = await CreateComment(token,data["_id"],comments);
        setCommentlist(form['comments'])
        setData(form)
        // userforms update
        if (formdata['creator']['_id']===_id){
            const tempuserforms = [...userforms];
            tempuserforms.find((Form) => Form['_id'] == formdata['_id']).comments = form['comments']
            setUserforms(tempuserforms)
        }
        try{
            const tempforms = [...forms];
            tempforms.find((Form) => Form['_id'] == formdata['_id']).comments = form['comments'];
            setForms(tempforms)
        }catch{
            
        }
  


    }
    useEffect(()=>{
        scrollToBottom()
    },[commentlist])
    return (
        <Box>
            <Box
                maxHeight={windowheight*commentwidthrate}
                overflow="scroll"
            >
                {commentbody}
                <Box
                    ref={messagesEndRef}
                >
                </Box>
            </Box>
            
            <FlexBetween
                mt="1.5rem"
            >
                <FlexBetween
                    gap="1.5rem"
                    sx={{
                        position:"relative"
                    }}
                >
                    <Typography
                        component={'span'}
                        sx={{
                            position:"absolute",
                            top:"0px",
                            left:"0px"
                            
                        }}
                    >
                        <UserImage image={picturePath} size={"40px"} />
                    </Typography>
                    <Box
                        sx={{
                            position:"relative",
                            top:"0px",
                            left:"60px"
                        }}
                        width={ckwidth}
                    >
                        
                        <CkeditorInput 
                            label = {"你的回覆"}
                            value = {comment}
                            name = {"comment"}
                            otherfunc = {changeComment}
                            sx = {{width:"10px"}}
                            setheight ={"150px"}
                        />
                    </Box>
                    
                </FlexBetween>
                
            </FlexBetween>
            <FlexBetween>
                <Box></Box>

                <IconButton
                    sx={{
                        "&:hover":"",
                        color:"#5499C7"
                    }}
                    onClick={sendComment}
                    disabled={(comment.replaceAll(" ","")!=="")?false:true}
                >
                    <SendIcon />
                </IconButton>
            </FlexBetween>
        </Box>
    )
}