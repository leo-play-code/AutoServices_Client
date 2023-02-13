
import { urlpath } from '../state/index';

export const GoogleSheetGetData = async(token,docID,sheetID) =>{
    console.log('GoogleSheetGetData')
    const response = await fetch(`${urlpath}googlesheet/GetData/${docID}/${sheetID}`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`
            }    
        }
    )
    const data = await response.json();
    return data;
}

export const GoogleSheetDetectData = async(token,docID,sheetID)=>{
    console.log('GoogleSheetDetectData');
    const response = await fetch(`${urlpath}googlesheet/DetectData/${docID}/${sheetID}`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        }
    )
    const data = await response.json();
    return data;
}

export const GoogleSheetSaveData = async(token,docID,sheetID,values)=>{
    console.log('GoogleSheetSaveData');
    const response = await fetch(`${urlpath}googlesheet/SaveData/${docID}/${sheetID}`,
    {
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(values),
    }
    )
    const data = await response.json();
    return data;
}

export const GoogleSheetGetSheetMap = async(token,docID)=>{
    console.log('GoogleSheetGetSheetMap');
    const response = await fetch(`${urlpath}googlesheet/GetSheetMap/${docID}`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        }
    )
    const data = await response.json();
    return data;
}
export const GoogleSheetAllList = async(token)=>{
    console.log('GoogleSheetAllList');
    const response = await fetch(`${urlpath}googlesheet/GetAllList`,
        {
            method:"GET",
            headers:{
                Authorization:`Bearer ${token}`,
            },
        }
    )
    const data = await response.json();
    return data;
}