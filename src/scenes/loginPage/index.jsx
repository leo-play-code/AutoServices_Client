import { 
    Box,
    Typography,
    useTheme,
    useMediaQuery
} from "@mui/material";
import Logo from "../../assets/logo.jpeg";
import { Login } from "../../components/Auth2";
import FlexBetween from "../../components/Flexbetween";
import Management from '../../assets/management.png'
const LoginPage = ()=>{
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    return(
        <Box>
            <Box 
                width="100%" 
                backgroundColor={theme.palette.background.alt} 
                p="1rem 6%" textAlign="center">
                <FlexBetween >
                    <FlexBetween gap="1rem">
                        <Box>
                        <img 
                            src={Logo}  
                            alt="logo"
                            width="55px"    
                        />
                        </Box>
                        <Typography 
                            fontWeight="bold"
                            fontSize="25px"
                            color="#0176B9"
                        >
                            AutoServices
                        </Typography>
                    </FlexBetween>
                </FlexBetween>
            </Box>

            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                maxWidth="500px"
                p="2rem"
                m="5rem auto"
                borderRadius="1.5rem"
                backgroundColor={theme.palette.background.alt}
                textAlign="center"
            >
                <Typography 
                    fontWeight="800" 
                    variant="h3" 
                    sx={{mb:"1.5rem"}}
                    color="#0176B9"
                >
                    Welcome to AutoServices !
                </Typography>
                <Login />
            </Box>
            {/* <Box textAlign="center">
                <img 
                    src={Management} 
                    alt="management picture" 
                    style={{objectFit:"cover"}}
                    width={isNonMobileScreens?"500rem":"300rem"}
                />
            </Box> */}
        </Box>
    
    )
}

export default LoginPage;