
import { urlpath } from "../state";

export const GetAllFormData = async(token,time)=>{
    console.log('GetAllFormData')
    const response = await fetch(urlpath+`formdata/GetAll/${time}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}
export const GetOneFormData = async(token,formdataID) =>{
    console.log('GetOneFormData')
    const response = await fetch(urlpath+`formdata/GetOne/${formdataID}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}

export const GetFormModelAll = async(token,formmodelID) =>{
    console.log('GetFormModelAll')
    const response = await fetch(urlpath+`formdata/GetFormModelAll/${formmodelID}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}

export const GetFormModelPart = async(token,skip,limit)=>{
    console.log("GetFormModelPart")
    const response = await fetch(urlpath+`formdata/GetFormModelPart/${skip}/${limit}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
   
    const data = await response.json()
    // console.log('data',data)
    return data

}

export const GetUserAllFormData = async(token,userID) =>{
    console.log('GetUserAllFormData')
    const response = await fetch(urlpath+`formdata/GetUserAll/${userID}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json()
    return data
}


export const CreateComment = async(token,formdataID,comments) =>{
    console.log('CreateComment')
    const response = await fetch(urlpath+`formdata/CreateComment/${formdataID}`,
    {
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(comments)
    })
    const data = await response.json()
    return data
}

export const UpdateComment = async(token,formdataID,commentlist)=>{
    console.log('UpdateComment')
    const response = await fetch(urlpath+`formdata/UpdateComment/${formdataID}`,
    {
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(commentlist)
    })
    const data = await response.json();
    return data
}

export const CreateFormData = async(token,values,userID,formmodelID) =>{
    console.log('CreateFormData')
    const response = await fetch(urlpath+`formdata/Create/${userID}/${formmodelID}`,
        {
            method:"PATCH",
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

export const UpdateFormData = async(token,values,userID,formdataID)=>{
    console.log('UpdateFormData')
    const response = await fetch(urlpath+`formdata/update/${userID}/${formdataID}`,
        {
            method:"PATCH",
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

export const DeleteFormData = async(token,formdataID) =>{
    console.log('DeleteFormData')
    const response = await fetch(urlpath+`formdata/Delete/${formdataID}`,{
        method:"DELETE",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json();
    return data
}


export const GetFormDataCount = async(token,id) =>{
    const response = await fetch(urlpath+`formdata/GetFormModel/FormData/count/${id}`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json();
    return data
}

// temp
export const Temp = async(token)=>{
    const response = await fetch(urlpath+`formdata/temp`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    })
    const data = await response.json();
    console.log('temp data',data)
    return data
}