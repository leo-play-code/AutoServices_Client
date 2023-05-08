import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from 'react-redux';
import { useEffect,useState,useContext,useRef } from "react";
import PostWidget from '../widgets/PostWidget';
import { GetFormModelAll } from "../../api/formdata";
import { StoreContext } from '../../state/store';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/system";
import { GetFormModelPart } from "../../api/formdata";

import { GetNewFormData } from "../../api/formdata";


export const PostList= ({
    formname,
}) =>{


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [forms,setForms] = useState([]);

    const {storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;

    const filter = useSelector((state)=>state.filter)[formname];

  
    
    const {schema,selectdata,number} = formmodels.filter(form=>form.name === formname)[0];
    const token = useSelector((state)=>state.token);
    const dt = new Date();



    const [loadingbool,setLoadingbool] = useState(false);
    // top ref
    const TopRef = useRef();
    const scrollToTop = () => {
        TopRef.current?.scrollIntoView({ behavior: "instant" ,block:"end"})
    }
    const handleScroll = async()=>{
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        if (bottom) {
            setRowsPerPage(rowsPerPage+20)
        }
    }
    // get form data
    const GetFormData = async()=>{
        setLoadingbool(true)
        const formdata = await GetNewFormData(token,rowsPerPage*page,rowsPerPage,filter)
        setForms(formdata)
    }
    useEffect(()=>{
        GetFormData()
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });
      
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },[filter,rowsPerPage])
    return (
        <>
            
            <Box
                ref={TopRef}
            >
            </Box>
            {(
                forms.map(data=>{
                return (
                    <WidgetWrapper 
                        key={data['_id']}
                        mb="1rem"    
                    >
                        <PostWidget 
                            form={data}
                            todaydate={dt}
                        />
                    </WidgetWrapper>
                )
                }))
            }
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