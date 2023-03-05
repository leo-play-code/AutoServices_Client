import ReactDOMServer from 'react-dom/server';
import { Box, useTheme,useMediaQuery,Typography} from '@mui/material';
import Logo from "../assets/logo.jpeg"
import WidgetWrapper from './WidgetWrapper';
import FlexBetween from './Flexbetween';
import { useEffect, useState } from 'react';


export const Mailstring = ({
    children
})=>{
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)")
    return(
        <Box
            width={isNonMobileScreens ? "50%" : "93%"}
            maxWidth="700px"
            // p="1rem"
            m="5rem auto"
            backgroundColor={theme.palette.background.alt}

        >
            <Box
                p="2rem 1rem"
            >
                <Box
                    textAlign={"center"}
                >
                    <FlexBetween 
                    >
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
                
                {children}
            </Box>
        </Box>
    )
}
// export const ResetPasswordMail = ({
//     ipInfo,
//     verifynumber,
// })=>{
    
    
//     return (
//         <Box>
//             <Mailstring>
//                 <Box
//                     mt="1.5rem"
//                 >
//                     <Typography
//                         fontWeight={"700"}
//                         fontSize= "1.2rem"
//                     >
//                         Reset Your Password
//                     </Typography>
//                 </Box>
//                 <Box
//                     mt="1.2rem"
//                 >
//                     <Typography
//                         fontWeight={"500"}
//                         fontSize="0.9rem"
//                     >
//                         請確認此地址為本人
//                     </Typography>
//                     <Box
//                         mt="0.5rem"
//                         sx={{
//                             backgroundColor:"#EAEDED"
//                         }}
//                         p="0.5rem"
//                     >
//                         {ipInfo && (
//                             <Typography
//                                 fontWeight={"500"}
//                             >
//                                 IP Location: {ipInfo.city} {ipInfo.region}, {ipInfo.country} <br />
//                                 IP: {ipInfo.ip}
//                             </Typography>
//                         )}
//                     </Box>
//                     <Box
//                         mt="1.2rem"
//                     >
//                         <Typography
//                             fontWeight={"500"}
//                             fontSize="0.9rem"
//                             mb="0.5rem"
//                         >
//                             Verification code:
//                         </Typography>
//                         <Typography
//                             fontWeight={"500"}
//                             fontSize="1.2rem"
//                             color="#0176B9"
//                             mb="0.5rem"
//                         >
//                             {verifynumber}
//                         </Typography>
//                         <Typography
//                             fontWeight={"500"}
//                             fontSize="0.75rem"
//                         >
//                             The verification code will expire after you refresh the page. Do not share your code with anyone. 
//                         </Typography>
//                     </Box>
//                     <Box
//                         mt="2rem"
//                     >
//                         <Typography
//                             sx={{
//                                 fontStyle: 'italic'
//                             }}
//                             fontWeight={"500"}
//                             fontSize="0.76rem"
//                         >
//                             This is an automated message, please do not reply.
//                         </Typography>
//                     </Box>
                    
                
//                 </Box>
//             </Mailstring>
            
//         </Box>
//     )
// }




export const ResetPasswordMail = ({
    ipInfo,
    verifynumber,
  }) => {
    return (
      <div>
            <div style={{ margin: '1.5rem 0' }}>
            <Typography
                style={{ fontWeight: 700, fontSize: '1.2rem' }}
            >
                Reset Your Password
            </Typography>
            </div>
            <div style={{ margin: '1.2rem 0' }}>
            <Typography style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                請確認此地址為本人
            </Typography>
            <div
                style={{
                marginTop: '0.5rem',
                backgroundColor: '#EAEDED',
                padding: '0.5rem',
                }}
            >
                {ipInfo && (
                <Typography style={{ fontWeight: 500 }}>
                    IP Location: {ipInfo.city} {ipInfo.region}, {ipInfo.country}{' '}
                    <br />
                    IP: {ipInfo.ip}
                </Typography>
                )}
            </div>
            <div style={{ margin: '1.2rem 0' }}>
                <Typography
                style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem' }}
                >
                Verification code:
                </Typography>
                <Typography
                style={{ fontWeight: 500, fontSize: '1.2rem', color: '#0176B9', marginBottom: '0.5rem' }}
                >
                {verifynumber}
                </Typography>
                <Typography style={{ fontWeight: 500, fontSize: '0.75rem' }}>
                The verification code will expire after you refresh the page. Do not share your code with anyone. 
                </Typography>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <Typography
                style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '0.76rem' }}
                >
                This is an automated message, please do not reply.
                </Typography>
            </div>
            </div>
      </div>
    );
  };
  