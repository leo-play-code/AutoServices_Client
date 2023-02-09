import { urlpath } from "../state";

export const loginAPI =  async(values) =>{
    console.log('loginAPI')
    const response = await fetch(
        `${urlpath}auth/login`,
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(values),
        }
    );
    const data = await response.json()
    return data;
}

export const registerAPI = async(values) =>{
    console.log('registerAPI')
    const response = await fetch(
        `${urlpath}auth/register`,
        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(values),
        }
    );
    const data = await response.json()
    return data;
}