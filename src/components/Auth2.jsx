import { useState,useEffect,useMemo } from 'react';

import { Box, IconButton, TextField, Typography, useTheme,Button } from '@mui/material';

import FlexBetween from './Flexbetween';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin, setLogout, setSettings, urlpath } from '../state';
import { loginAPI,registerAPI, resetpassword, sendVerifyNumber } from '../api/auth';
import { toast } from 'react-toastify';
import VerifyButton from './VerifyButton';
import { ResetPasswordMail } from './MailHtml';
import ReactDOMServer from 'react-dom/server';
// ICON
import LoginIcon from '@mui/icons-material/Login';
import GoogleIcon from '@mui/icons-material/Google';



function generateRandomNumber() {
    var data = Math.floor(Math.random() * 900000) + 100000;
    data = data.toString()
    return data
}
  


export const Login = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [method,setMethod] = useState("login");
    const [verifyans,setVerifyans] = useState("");
    const [accountlock,setAccountlock] = useState(false);
    const [ipInfo, setIpInfo] = useState(null);

    const [FormData,setFormData] = useState({
        name:"",
        account:"",
        password:"",
        verifynumber:"",
        password2:""
    });
    const [FormError,setFormError] = useState({
        name:false,
        account:false,
        password:false
    });

    useMemo(()=>{
        for (const item in FormData){
            setFormError(prevState => ({ ...prevState, [item]: false }));
        }
    },[method])

    const [FormErrorMsg,setFormErrorMsg] = useState({
        name:"不可空白",
        account:"不可空白",
        password:"不可空白",
        verifynumber:"不可空白",
        password2:"不可空白"
    });
    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        if (name === "verifynumber"){
            const numericValue = value.replace(/[^0-9]/g, ''); // only allow numbers
            if (numericValue.length <= 6) {
                setFormData({ ...FormData, [name]: numericValue });
            }

        }else{
            setFormData({ ...FormData, [name]: value });
        }
    }
    const handleInputError = () =>{
        var error = false
        for (const item in FormData){
            setFormErrorMsg(prevState => ({...prevState,[item]:"不可空白"}))
            const value = FormData[item].replaceAll(' ','');
            if (value === ''){
                setFormError(prevState => ({ ...prevState, [item]: true }));
                if (method === 'login'){
                    if (item === "account" || item === "password"){
                        error = true
                    }
                }else if (method === 'register'){
                    if (item === "name" || item === "account" || item === "password"){
                        error = true
                    }
                }else if (method === 'verifynumber'){
                    if (item === "account" || item === "verifynumber"){
                        error = true
                    }
                }else if (method === "resetpassword"){
                    if (item === "account" || item === "password" || item === "password2"){
                        error = true
                    }
                }
            }else{
                setFormError(prevState => ({ ...prevState, [item]: false }));
                if (item === 'account'){
                    if (!value.includes('@')){
                        setFormError(prevState => ({ ...prevState, [item]: true }));
                        setFormErrorMsg(prevState => ({...prevState,[item]:"帳號必須是email"}))
                        error = true
                    }
                } 
            }
        }
        return error
    }

    
    const togglelogin = async(event)=>{
        event.preventDefault();
        const error = handleInputError()
        if (!error){
            const values = {"email":FormData.account,"password":FormData.password}
            try{
                const loggedIn =  await loginAPI(values);
                if (loggedIn.error){
                    toast.error(loggedIn.error);
                }else if(loggedIn.msg){
                    toast.error(loggedIn.msg);
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
                    toast.success('Login Successfully')
                    
                }
                
            }catch(error){
                toast.error('無法連結到伺服器API');
            }
        }
    }

    const toggleregister = async(event)=>{
        event.preventDefault();
        const error = handleInputError()
        if (!error){
            const values = {"email":FormData.account,"password":FormData.password,"Name":FormData.name,"picturePath":""};
            const loggedIn = await registerAPI(values);
            console.log('loggedIn.error',loggedIn.error)
            if (loggedIn.error){
                toast.error(loggedIn.error);
                
            }else{
                dispatch(
                    setLogin({
                        user: loggedIn.user,
                        token:loggedIn.token,
                    })
                );
                toast.success('註冊成功,等待管理者授權')
                setMethod("wait register")
            }
        }
    }
    const toggleverify = async(event)=>{
        event.preventDefault()
        const error = handleInputError()
        if (!error){
            if (FormData.verifynumber === verifyans && verifyans !== ""){
                setMethod("resetpassword")
            }else{
                setFormError(prevState => ({ ...prevState, ['verifynumber']: true }));
                setFormErrorMsg(prevState => ({...prevState,['verifynumber']:"驗證碼錯誤"}))
            }
        }
    }

    const togglereset = async(event)=>{
        event.preventDefault();
        const error = handleInputError()
        if(!error){
            const {password,password2} = FormData;
            if (password === password2){
                const data = await resetpassword(FormData)
                if (data.error){
                    toast.error(data.error)
                }else{
                    toast.success(data.msg)
                    setMethod("login")
                }
            }else{
                setFormError(prevState => ({ ...prevState, ['password2']: true }));
                setFormErrorMsg(prevState => ({...prevState,['password2']:"確認密碼不一樣"}))
            }
        }
    }
    const GetVerifyNumber = async()=>{        
        const verifynumber = generateRandomNumber();
        // var htmlstring = ResetPasswordMail({ipInfo:ipInfo,verifynumber :verifynumber});
        const emailHtml = ReactDOMServer.renderToString(
            <ResetPasswordMail ipInfo={ipInfo} verifynumber={verifynumber} />
        );


        const data = await sendVerifyNumber(FormData.account,{ htmlbody: emailHtml });
        if (data.error){
            toast.error(data.error)
        }else{
            setVerifyans(verifynumber)
            setAccountlock(true)
        }
    }

    useEffect(()=>{
        const fetchIpInfo = async () => {
            const response = await fetch('https://ipinfo.io/json?token=89674be276b71f');
            const data = await response.json();
            setIpInfo(data);
        };
       
        if (ipInfo === null){
            fetchIpInfo();
        }
    },[])
    return(
        <Box
            mt="2rem"
        >
            {(method === 'login')&&(
                <form onSubmit={togglelogin}>
                <Box
                    textAlign="center"
                >
                    <Typography
                        fontWeight="800" 
                        variant="h4" 
                        sx={{mb:"1.5rem"}}
                        color="#7F8C8D"
                    >
                        Login
                    </Typography>
                </Box>
                <TextField
                    label={"帳號"}
                    onChange= {handleInputChange}
                    value={FormData.account}
                    name={"account"}
                    sx = {{minWidth:"100%",maxLength: 100}}
                    placeholder={"**************@gmail.com"}
                    error = {FormError['account']}
                    helperText={FormError['account']&&FormErrorMsg['account']}
                />
                <Box
                    mt="1rem"
                >
                    <TextField
                        label={"密碼"}
                        onChange={handleInputChange}
                        value={FormData.password}
                        name={"password"}
                        sx = {{minWidth:"100%",maxLength: 100}}
                        placeholder={"*********"}
                        type="password"
                        error = {FormError['password']}
                        helperText={FormError['password']&&FormErrorMsg['password']}
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
                            <FlexBetween
                                gap="0.01rem"
                            >
                                <Typography
                                    onClick = {
                                        ()=>setMethod("verifynumber")
                                    }
                                    sx={{
                                        "&:hover":{
                                            cursor:"pointer",
                                            color:"#5DADE2"
                                        }
                                    }}
                                >
                                    忘記密碼？
                                </Typography>
                            </FlexBetween>
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
            )}

            {(method === 'register')&&(
                <form onSubmit={toggleregister}>
                    <Box
                        textAlign="center"
                    >
                        <Typography
                            fontWeight="800" 
                            variant="h4" 
                            sx={{mb:"1.5rem"}}
                            color="#7F8C8D"
                        >
                            Register
                        </Typography>
                    </Box>
                    <TextField
                        label={"名稱"}
                        onChange={handleInputChange}
                        value={FormData.name}
                        name={"name"}
                        sx = {{minWidth:"100%",maxLength: 100}}
                        placeholder={"Leo"}
                        error = {FormError['name']}
                        helperText={FormError['name']&&FormErrorMsg['name']}
                        disabled = {(method=== "wait register")?true:false}
                    />
                    <Box
                        mt="1rem"
                    >
                        <TextField
                            label={"帳號"}
                            onChange={handleInputChange}
                            value={FormData.account}
                            name={"account"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"**************@gmail.com"}
                            error = {FormError['account']}
                            helperText={FormError['account']&&FormErrorMsg['account']}
                            disabled = {(method=== "wait register")?true:false}
                        />
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <TextField
                            label={"密碼"}
                            onChange={handleInputChange}
                            value={FormData.password}
                            name={"password"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"*********"}
                            type="password"
                            error = {FormError['password']}
                            helperText={FormError['password']&&FormErrorMsg['password']}
                            disabled = {(method=== "wait register")?true:false}
                        />
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <Button
                            variant="contained"
                            color="warning"
                            type="submit"
                            disabled = {(method=== "wait register")?true:false}
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
            )}

            {(method === 'verifynumber')&&(
                <form onSubmit={toggleverify}>
                    <Box
                        textAlign="center"
                    >
                        <Typography
                            fontWeight="800" 
                            variant="h4" 
                            sx={{mb:"1.5rem"}}
                            color="#7F8C8D"
                        >
                            Reset Password
                        </Typography>
                    </Box>
                    <TextField
                        label={"帳號"}
                        onChange= {handleInputChange}
                        value={FormData.account}
                        name={"account"}
                        sx = {{minWidth:"100%",maxLength: 100}}
                        placeholder={"**************@gmail.com"}
                        error = {FormError['account']}
                        helperText={FormError['account']&&FormErrorMsg['account']}
                        disabled = {accountlock}
                    />
                    <FlexBetween
                        mt="1rem"
                    >
                        <TextField
                            label={"驗證碼"}
                            onChange= {handleInputChange}
                            value={FormData.verifynumber}
                            name={"verifynumber"}
                            sx = {{minWidth:"80%"}}
                            maxLength={6}
                            error = {FormError['verifynumber']}
                            helperText={FormError['verifynumber']&&FormErrorMsg['verifynumber']}
                            autoComplete = "off"
                        />
                        <VerifyButton 
                            otherfunc={
                               GetVerifyNumber
                            }
                            disabled = {(FormData.account.replaceAll(' ','')==='')?true:false}
                        />
                    </FlexBetween>
                    <Box
                        mt="1rem"
                    >
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            確認
                        </Button>
                        <Box
                            mt="0.5rem"
                            
                        >
                            <FlexBetween>
                                <FlexBetween
                                    gap="0.01rem"
                                >
                                    <Typography
                                        onClick = {
                                            ()=>setMethod("resetpassword")
                                        }
                                    >

                                    </Typography>
                                </FlexBetween>
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
            )}

            {(method=== 'resetpassword')&&(
                <form onSubmit={togglereset}>
                    <Box
                        textAlign="center"
                    >
                        <Typography
                            fontWeight="800" 
                            variant="h4" 
                            sx={{mb:"1.5rem"}}
                            color="#7F8C8D"
                        >
                            Reset Password
                        </Typography>
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <TextField
                            label={"密碼"}
                            onChange={handleInputChange}
                            value={FormData.password}
                            name={"password"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"*********"}
                            type="password"
                            error = {FormError['password']}
                            helperText={FormError['password']&&FormErrorMsg['password']}
                        />
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <TextField
                            label={"確認密碼"}
                            onChange={handleInputChange}
                            value={FormData.password2}
                            name={"password2"}
                            sx = {{minWidth:"100%",maxLength: 100}}
                            placeholder={"*********"}
                            type="password"
                            error = {FormError['password2']}
                            helperText={FormError['password2']&&FormErrorMsg['password2']}
                        />
                    </Box>
                    <Box
                        mt="1rem"
                    >
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            確認
                        </Button>
                        
                    </Box>
                </form>
            )}

            {(method === 'wait register')&&(
                <Box>
                    <Typography
                        fontWeight={"700"}
                        fontSize="2rem"
                    >
                        Congratuation !!
                    </Typography>           
                    <FlexBetween
                        mt="2rem"
                    >
                        <Box></Box>
                        <FlexBetween>
                            <Typography>
                                授權完成？    
                            </Typography>
                            <IconButton
                                onClick={()=>setMethod("login")}
                            >
                                <LoginIcon 
                            
                                />
                            </IconButton>     
                        </FlexBetween>   
                    </FlexBetween>     
                </Box>
            )}
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