import { urlpath } from "../state";

export const GetAllUser = async(token) =>{
    console.log('GetAllUser')
    const response = await fetch(urlpath+"users/GetAll",{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}


export const GetOneUser = async(token,userID) =>{
    console.log('GetOneUser')
    const response = await fetch(urlpath+`users/GetOne/${userID}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}

export const UpdateSetting = async(token,values,userID)=>{
    console.log('UpdateSetting')
    const response = await fetch(urlpath+`users/UpdateSetting/${userID}`,
    {
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(values)
    })
    const data = await response.json()
    return data
}