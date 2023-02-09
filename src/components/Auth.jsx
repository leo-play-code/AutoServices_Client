import {GoogleLogin,GoogleLogout} from '@leecheuk/react-google-login';
import { useState,useEffect } from 'react';
import {gapi} from 'gapi-script';
import { Box, Typography, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FlexBetween from './Flexbetween';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin, setLogout, setSettings, urlpath } from '../state';
import { loginAPI,registerAPI } from '../api/auth';

const client_id = "667677336183-12pk3bho54v6b4mh128tci1ph2pcse52.apps.googleusercontent.com";
export const Login = ()=>{
    const [method,setMethod] = useState("login");
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function onSuccess(res){
        const data = res.profileObj;
        const values = {"email":data.email}
        const loggedIn =  await loginAPI(values);
        console.log('loggedIn=',loggedIn)
        if(loggedIn){
            if (loggedIn.msg){
                console.log('didnt exist')
                setMethod("register")
            }else if(loggedIn.user.allow==false){
                setMethod("register wait")
            }else{
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token:loggedIn.token,
                    })
                );
                dispatch(
                    setSettings({
                        settings:loggedIn.user['setting']
                    })
                )
                navigate("/home");
            }
        }
    }
    async function register(res){
        const data = res.profileObj;
        const values = {"email":data.email,"Name":data.name,"picturePath":data.imageUrl};
        const loggedIn = await registerAPI(values);
        if (loggedIn){
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token:loggedIn.token,
                })
            );
            setMethod("register wait")
        }
        
    }

    function registerfailure(){
        console.log('fail to register')
    }
    function onFailure(){
        console.log('fail to login')
    }
    function logoutregisterwait(){
        dispatch(
            setLogout()
        )
        setMethod("login")
    }

    useEffect(()=>{
        function start(){
            gapi.client.init({
                clientId:client_id,
                scope: ""
            })
        }
        gapi.load('client:auth2',start);
    })
    return(
        <Box>
            {(method=="login")?(
                <GoogleLogin
                    clientId={client_id}
                    render={(renderProps) => (
                    <Box textAlign="center">
                        <Button variant="contained" color="info" onClick={renderProps.onClick}>
                            <FlexBetween>
                                <FlexBetween 
                                    gap="0.75rem" 
                                    borderRadius="1.5rem"
                                >
                                    <GoogleIcon 
                                        sx= {{fontSize:"20px"}}
                                    />
                                    <Typography 
                                        fontWeight="500"
                                    >
                                        Google 登錄
                                    </Typography>
                                </FlexBetween>
                            </FlexBetween>
                        </Button>
                    </Box>  
                )}
                buttonText = "Login with Google"
                onSuccess = {onSuccess}
                onFailure = {onFailure}
                cookiePolicy = {'single_host_origin'}
                isSignedIn = {true}
            />)
            
            :((method=="register")?
            (
                <GoogleLogin
                    clientId={client_id}
                    render={(renderProps) => (
                        <Box textAlign="center">
                            <Button variant="contained" color="warning" onClick={renderProps.onClick}>
                                <Typography 
                                    fontWeight="500"
                                >
                                    Register
                                </Typography>
                            </Button>
                        </Box>  
                    )}
                    buttonText = "Register with Google"
                    onSuccess = {register}
                    onFailure = {registerfailure}
                    cookiePolicy = {'single_host_origin'}
                    isSignedIn = {true}
                />
            ):(
                <Box>
                    <Box textAlign="center">
                        <Button variant="contained" color="warning" disabled={true} >
                            <Typography 
                                fontWeight="500"
                            >
                                等候授權
                            </Typography>
                        </Button>
                    </Box>  
                    <Box mt="1rem">
                        <GoogleLogout 
                            clientId ={client_id}
                            render={(renderProps) => (
                                <Button onClick={renderProps.onClick}>
                                    登出
                                </Button>
                            )}
                            buttonText = {"登出"}
                            onLogoutSuccess ={logoutregisterwait}
                        />
                        
                    </Box>
                   
                </Box>
         
                
            ))
            
            }

        </Box>
    )
}

export const Logout = ({child}) =>{
    const dispatch = useDispatch();
    const onSuccess = ()=>{
        console.log('logout successfully')
        dispatch(
            setLogout()
        );
    }
    const onFailure = ()=>{
        console.log("Logout fail")
    }
    return(
        <div className="">
            <GoogleLogout 
                clientId ={client_id}
                render={(renderProps) => (
                    <Box
                        onClick={renderProps.onClick} 
                    >
                        {child}
                    </Box>
                )}
                buttonText = {"登出"}
                onLogoutSuccess ={onSuccess}
                onFailure = {onFailure}
            />
        </div>
    )
}