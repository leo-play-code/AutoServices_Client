
import BodyBox from '../../components/bodyBox';
import { Box,useMediaQuery } from '@mui/material';
import Navbar from '../navbar/index';
import { useSelector } from 'react-redux';
import SettingDialog from './SettingDialog';
import { useState } from 'react';
import {PostSetting} from './SettingItem/FormSetting';



const SettingPage = () =>{
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const width = useSelector((state)=>state.width);
    const [title,setTitle] = useState("");
    const toggleTitle = (value) =>{
        setTitle(value)
    }

    return (
        <Box>
            <Navbar />
            <BodyBox
                padding="2rem 6%"
                display={isNonMobileScreens?"flex":"block"}
                gap="1.5rem"
            >
                <Box 
                    flexBasis={isNonMobileScreens?"20%":undefined}
                    mb="1.5rem"
                    
                >
                    <SettingDialog toggleTitle={toggleTitle} />
                    

                </Box>
                
                {(title==="貼文顯示方式")&&<PostSetting title={title}/>}

            </BodyBox>
        </Box>
        
    )
}





export default SettingPage;