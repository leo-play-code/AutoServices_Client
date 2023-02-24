import { useState,useEffect } from 'react';

import { Box, TextField, Typography, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import FlexBetween from './Flexbetween';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin, setLogout, setSettings, urlpath } from '../state';
import { loginAPI,registerAPI } from '../api/auth';


export const Login = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [method,setMethod] = useState("login");
    const [account,setAccount] = useState("");
    const [password,setPassword] = useState("");
    const [errormsg,setErrormsg] = useState("");
    const [errorbool,setErrorbool] = useState(false);
    const [name,setName] = useState("");
    const togglelogin = async(event)=>{
        event.preventDefault();
        const values = {"email":account}
        const loggedIn =  await loginAPI(values);
        console.log(loggedIn)
        if (loggedIn.error){
            setErrormsg('尚未註冊')
            setErrorbool(true)
        }else if(loggedIn.msg){
            setErrorbool(true)
            setErrormsg('尚未授權請通知管理者')
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
    const toggleregister = async(event)=>{
        event.preventDefault();
        const values = {"email":account,"password":password,"Name":name,"picturePath":"","password":password};
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
    useEffect(()=>{
        
    },[])
    return(
        <Box
            mt="2rem"
        >
           
            {
                (method==="login")?(
                    <form onSubmit={togglelogin}>
                    <TextField
                        label={"帳號"}
                        onChange={(e)=>setAccount(e.target.value)}
                        value={account}
                        name={"帳號"}
                        sx = {{minWidth:"100%",maxLength: 100}}
                        placeholder={"**************@gmail.com"}
                    />
                    <FlexBetween
                        ml="0.5rem"
                        mt="0.5rem"
                    >
                        {errorbool&&<Typography
                            fontSize={"0.5rem"}
                            fontWeight={"500"}
                            color="#C0392B"
                        >{errormsg}
                        </Typography>}
                    </FlexBetween>
                    <Box
                        mt="1rem"
                    >
                        <TextField
                            label={"密碼"}
                            onChange={(e)=>setPassword(e.target.value)}
                            value={password}
                            name={"密碼"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"*********"}
                            type="password"
                        />
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            登入
                        </Button>
                        <Box
                            mt="0.5rem"
                            
                        >
                            <FlexBetween>
                                <Box>

                                </Box>
                                <FlexBetween
                                    gap="0.01rem"
                                >
                                    <Typography
                                    >
                                        尚未有帳號？
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="warning"
                                        onClick={()=>setMethod('register')}
                                    >
                                        註冊
                                    </Button>
                                </FlexBetween>
                            </FlexBetween>
                        
                        </Box>
                    </Box>
                    </form>
                ):(method==="register")?(
                    <form onSubmit={toggleregister}>
                        <TextField
                            label={"名稱"}
                            onChange={(e)=>setName(e.target.value)}
                            value={name}
                            name={"名稱"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"Leo"}
                            required={true}
                        />
                        <Box
                            mt="2rem"
                        >
                            <TextField
                                label={"帳號"}
                                onChange={(e)=>setAccount(e.target.value)}
                                value={account}
                                name={"帳號"}
                                sx = {{minWidth:"100%",maxLength: 100}}
                                placeholder={"**************@gmail.com"}
                            />
                        </Box>
                        <Box
                            mt="2rem"
                        >
                            <TextField
                                label={"密碼"}
                                onChange={(e)=>setPassword(e.target.value)}
                                value={password}
                                name={"密碼"}
                                sx = {{minWidth:"100%",maxLength: 100}}
                                placeholder={"*********"}
                                type="password"
                            />
                        </Box>
                        <Box
                            mt="1rem"
                        >
                            <Button
                                variant="contained"
                                color="warning"
                                type="submit"
                            >
                                註冊
                            </Button>
                            <Box
                                mt="0.5rem"
                                
                            >
                                <FlexBetween>
                                    <Box>

                                    </Box>
                                    <FlexBetween
                                        gap="0.01rem"
                                    >
                                        <Typography
                                        >
                                            已有帳號？
                                        </Typography>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={()=>setMethod('login')}
                                        >
                                            登入
                                        </Button>
                                    </FlexBetween>
                                </FlexBetween>
                            
                            </Box>
                        </Box>
                    </form>
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

                            
                        </Box>
                    
                    </Box>
                )   
            }
            
        </Box>
        
    )
}

export const Logout = ({child}) =>{
    const dispatch = useDispatch();
    const togglelogout = ()=>{
        console.log('logout successfully')
        dispatch(
            setLogout()
        );
    }
    return(
        <Box
            onClick={()=>togglelogout()}
        >
            {child}
        </Box>
    )
}