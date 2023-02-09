import { urlpath } from "../state";

export const GetOneFormModel = async(token,formname)=>{
    console.log('GetOneFormModel')
    const response = await fetch(`${urlpath}formmodel/GetOne/${formname}`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
    const data = await response.json();
    return data
}


export const GetAllFormModel = async(token)=>{
    console.log('GetAllFormModel')
    const response = await fetch(`${urlpath}formmodel/GetAll`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )
    const data = await response.json();
    return data
}

export const CreateFormModel = async(token,values)=>{
    console.log('CreateFormModel')
    const response = await fetch(`${urlpath}formmodel/Create`,
        {
            method:"POST",
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify(values),
        }
    )
    const data = await response.json();
    return data
}

export const DeleteFormModel = async(token,formname) =>{
    console.log('DeleteFormModel')
    const response = await fetch(urlpath+`formmodel/Delete/${formname}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json();
    return data
}

export const UpdateFormModel = async(token,values,formname)=>{
    console.log('UpdateFormModel')
    const response = await fetch(urlpath+`formmodel/Update/${formname}`,
        {
            method:"POST",
            headers:{
                Authorization: `Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify(values),
        }
    )
    const data = await response.json();
    return data
}