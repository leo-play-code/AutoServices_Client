import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from 'react-redux';
import { useEffect,useRef,useContext,useState } from "react";

import PostWidget from '../widgets/PostWidget';
import { StoreContext } from '../../state/store';
import { Box } from "@mui/system";
import CircularProgress from '@mui/material/CircularProgress';


const MyformWidget = ()=>{
     // useContext 
    const {storeuserforms} = useContext(StoreContext);
    const [userforms,setUserforms] = storeuserforms;
    // top ref
    const TopRef = useRef();



    const scrollToTop = () => {
        TopRef.current?.scrollIntoView({ behavior: "instant" ,block:"end"})
    }
    const formpostref = useRef();
    // test render init 10 and then render 50 and render all 
    const [shownum,setShownum] = useState(10);
    const [showlist,setShowlist] = useState([]);
    const [loadingbool,setLoadingbool] = useState(false);
    
    const handleScroll = ()=>{
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        if (bottom) {
            if (shownum <= userforms.length){
                var newshownum = shownum+10;
                setShownum(newshownum);
            }else{
                var newshownum = userforms.length
            }
            if (newshownum>=userforms.length){
                setLoadingbool(false)   
            }
        }
    }

    const UpdateShowlist = ()=>{
        if (userforms.length>0){
            setShowlist(userforms.slice(0,shownum))
            if (shownum<userforms.length){
                setLoadingbool(true)
            }else{
                setLoadingbool(false)
            }
        }
    }
    useEffect(()=>{
        if (shownum > showlist.length ){
            UpdateShowlist()
        }
        
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });
        
       
    },[userforms,shownum])



    


    return (
        <>
            <Box
                ref={TopRef}
            >
            </Box>
            <Box
            >
                {(userforms.length>0)&&(
                    showlist.map(data=>{
                    return (
                        <WidgetWrapper 
                            key={data['_id']}
                            mb="1rem"    
                            ref = {formpostref}
                        >
                            
                            <PostWidget 
                                form={data}
                            />
                
                            
                        </WidgetWrapper>
                    )
                    }))
                }
            </Box>
            <Box 
                alignItems="center"
                justifyContent="center"
                textAlign="center"    
                className={loadingbool?"":"hidden"}
            >
                <CircularProgress />
            </Box>
        </>
    )
}

export default MyformWidget;