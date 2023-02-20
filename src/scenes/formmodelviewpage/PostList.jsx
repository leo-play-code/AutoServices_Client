import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector } from 'react-redux';
import { useEffect,useState,useContext,useRef } from "react";
import PostWidget from '../widgets/PostWidget';
import { GetFormModelAll } from "../../api/formdata";
import { StoreContext } from '../../state/store';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/system";
import { GetFormModelPart } from "../../api/formdata";




export const PostList= ({
    formname,
    formlist,
    changeNumber
}) =>{




    const {storeformmodels,storeforms} = useContext(StoreContext);
    const [forms,setForms] = storeforms;
    const [formmodels,setFormmodels] = storeformmodels;
    const { _id } = useSelector((state) => state.user);
    const filter = useSelector((state)=>state.filter)[formname];

  
    
    const {schema,selectdata,number} = formmodels.filter(form=>form.name === formname)[0];
    const token = useSelector((state)=>state.token);
    const dt = new Date();


    // test render init 10 and then render 50 and render all 
    const [shownum,setShownum] = useState(20);
    const [showlist,setShowlist] = useState([]);
    const [filterformfull,setFilterformfull] = useState([]);
    const [loadingbool,setLoadingbool] = useState(false);
    // top ref
    const TopRef = useRef();
    const scrollToTop = () => {
        TopRef.current?.scrollIntoView({ behavior: "instant" ,block:"end"})
    }

    const FilterFormList = () =>{
        var thisfullformlist = formlist.filter(form=>form['form']['name']===formname)
        var filterform = thisfullformlist
        if (filter){
            try{
                for(const key in schema){
                    const {field} =  schema[key]
                    if (field !== 'blank'){
                        if (field !== 'time'){
                            if (filter[key].replaceAll(" ","") !== ""){
                                filterform = filterform.filter(form=>(form['data'][key].replaceAll(" ","")).includes(filter[key].replaceAll(" ","")))            
                            }
                        }else{
                            if (typeof filter[key+"from"] === "number"){
                                filterform = filterform.filter(form=>(Date.parse(form['data'][key])>=filter[key+"from"]))            
                            }
                            if (typeof filter[key+"to"] === "number"){
                                filterform = filterform.filter(form=>(Date.parse(form['data'][key])<=filter[key+"to"]))  
                            }
                        }
                        
                    } 
                }
                if (filter['creator'].replaceAll(" ","") !== ""){
                    filterform = filterform.filter(form=>(form['creator']['Name'].replaceAll(" ","")).includes(filter['creator'].replaceAll(" ","")))
                }
                if (filterformfull.length !== filterform.length){
                    setShownum(20)
                    scrollToTop()
                }
                setFilterformfull(filterform);
                setShowlist(filterform.slice(0,20))
                changeNumber(filterform.length)

            }catch{
                if (filterformfull.length !== formlist.length){
                    setShownum(20)
                    scrollToTop()
                }
                setFilterformfull(formlist);
                setShowlist(formlist.slice(0,20))
                changeNumber(formlist.length)
            }
            setLoadingbool(false)
        }
    }
    const handleScroll = async()=>{
        const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
        if (bottom) {
            var newshownum = shownum+20;
            setShownum(newshownum);
            if (newshownum>=filterformfull.length){
                setLoadingbool(false)   
            }
        }
    }
    const UpdateShowlist = ()=>{
        if (filterformfull.length>0){
            setShowlist(filterformfull.slice(0,shownum))
            if (shownum < filterformfull.length){
                setLoadingbool(true)
            }else{
                setLoadingbool(false)
            }
            
        }
    }
    useEffect(()=>{
        if (formlist.length>0 ){
            FilterFormList()
        }
        if (shownum > showlist.length && filterformfull.length>shownum){
            UpdateShowlist()
        }
        window.addEventListener('scroll', handleScroll, {
            passive: true
        });
      
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
        

    },[formlist,filter,shownum,forms])
    return (
        <>
            
            <Box
                ref={TopRef}
            >
            </Box>
            {formlist&&(
                showlist.map(data=>{
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