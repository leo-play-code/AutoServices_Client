import { useParams } from 'react-router-dom';
import BodyBox from '../../components/bodyBox';
import { useMediaQuery,
    Box,

} from '@mui/material';
import Navbar from '../navbar';
import { useContext } from 'react';
import { StoreContext } from '../../state/store';
import { useSelector } from 'react-redux';
import FilterWidget from '../widgets/FilterWidget';
import WidgetWrapper from '../../components/WidgetWrapper';
import { FormProfileWidget } from '../formmodelviewpage/FormProfileWidget';
import { useEffect } from 'react';
import ShowData from './ShowData';

const FormModelViewPage = () =>{
    const isNonMobileScreens = useMediaQuery("(min-width:1230px)");
    const {formname} = useParams();
    const WindowWidth = useSelector((state)=>state.width);
    const {storeforms,storeformmodels} = useContext(StoreContext);
    const [formmodels,setFormmodels] = storeformmodels;
    const filtermode = useSelector((state)=>state.filtermode);
    const formmodel = formmodels.filter((form)=>form['name']===formname)[0];

    useEffect(()=>{
        
    },[filtermode])
    return (
        <Box>
            <Navbar />
            <BodyBox
                padding="2rem 2%"
                display={isNonMobileScreens?"flex":"block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box 
                    flexBasis={isNonMobileScreens?"26%":undefined}
                    mb="1.5rem"
                    
                >
                    <Box
                        position={isNonMobileScreens?"fixed":""}
                        width={isNonMobileScreens?(WindowWidth*0.23):"inherit"}
                    >
                        {(formmodel!==undefined)&&<FormProfileWidget 
                            formname = {formname}
                        />}
                        <WidgetWrapper
                            mt="1.1rem"
                        >
                            <FilterWidget formname={formname} />
                        </WidgetWrapper>
                    </Box>
                </Box>
                
                <Box
                    flexBasis={isNonMobileScreens?"42%":undefined}
                    mb="1.5rem"
                >
                    <ShowData filtermode={filtermode}/>

                </Box>
                
                            


            </BodyBox>
        </Box>
    )
}

export default FormModelViewPage;