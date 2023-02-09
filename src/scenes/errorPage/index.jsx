import {Link, useNavigate} from 'react-router-dom';
import { 
    Box,
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import FlexBetween from "../../components/Flexbetween";

const Page404 = () =>{
    const theme = useTheme();
    const navigate = useNavigate();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    return (
        <Box>
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                maxWidth="700px"
                p="2rem"
                m="2rem auto"
                mt="20rem"
            >
                <Typography 
                    fontWeight="500" 
                    variant="h1" 
                    fontSize="5rem"
                    sx={{}}
                    mb="1.5rem"
                    color="#0176B9"
                    
                >
                    404
                </Typography>

                <Typography
                    ml="0.5rem"
                    variant="h3"
                    fontWeight="500"
                >
                    Sorry! The page you're looking for cannot be found
                </Typography>

                <FlexBetween  mt="1rem" ml="0.5rem" gap="0.75rem">
                    <Typography
                        
                        variant="h5"
                        fontWeight="500"
                        
                        sx={{
                            "&:hover":{
                                cursor:"pointer"
                            }
                        }}
                        onClick={()=>navigate("/home")}
                        color="red"
                    >
                        Back to HomePage
                    </Typography>
                </FlexBetween>
   
                
            </Box>
        </Box>
    )
}
export default Page404;