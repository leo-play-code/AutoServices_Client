import React, { createContext, useState,useContext,useEffect} from "react";
import { GetAllFormData, GetUserAllFormData,GetFormModelPart, Temp } from "../api/formdata";
import { GetAllUser } from '../api/user';
import { useSelector, useDispatch } from 'react-redux';
import { Box } from '@mui/material';
import { GetAllFormModel } from "../api/formmodel";
import {setFetchBool} from ".";
import { GoogleSheetAllList } from "../api/googlesheet";
export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {  
    const [forms, setForms] = useState([]);
    const [userlist,setUserlist] = useState([]);
    const [userforms,setUserforms] = useState([]);
    const [formmodels,setFormmodels] = useState([]);
    const [googlelist,setGooglelist] = useState([]);
    const [fetchbool,setFetchbool] = useState(false);
    const [fetchtime,setFetchtime] = useState(0);
    const store ={
        storeforms: [forms, setForms],
        storeUserlist : [userlist,setUserlist],
        storeuserforms : [userforms,setUserforms],
        storeformmodels : [formmodels,setFormmodels],
        storegooglelist : [googlelist,setGooglelist],
        storefetchbool : [fetchbool,setFetchbool] ,
        storefetchtime : [fetchtime,setFetchtime]
    };
    return (
        <StoreContext.Provider value={store}>
           {children}
        </StoreContext.Provider>
       );
};


export const FetchToStore = ({children}) =>{
    const { _id, Name, picturePath,allow } = useSelector((state) => state.user);
    const token = useSelector((state)=>state.token)
    const {storeuserforms,storeUserlist,storeforms,storeformmodels,storegooglelist,storefetchbool,storefetchtime} = useContext(StoreContext);
    const [userforms,setUserforms] = storeuserforms;
    const [forms,setForms] = storeforms;
    const [userlist,setUserlist] = storeUserlist;
    const [formmodels,setFormmodels] = storeformmodels;
    const [googlelist,setGooglelist] = storegooglelist;
    const [fetchbool,setFetchbool] = storefetchbool;
    const [fetchtime,setFetchtime] =  storefetchtime;
    const dispatch = useDispatch();
    
    const cleanformlist = (formlist)=>{
        const formdict = {}
        for (const item in formlist){
            const {_id,data,history,comments} = formlist[item]
            formdict[_id]={'or_data':data,'or_comments':comments}
        }
        return formdict;
    }


    const getUserFormData = async()=>{
        const data = await GetUserAllFormData(token,_id)
        
        setUserforms(data);
    }
    const getAllFormData = async()=>{
        
        

        const data = await GetAllFormData(token,fetchtime);
        if (data.length>0){
            const merged = [];

            // Loop through each dictionary in A and add it to the merged list
            for (const a_dict of forms) {
                merged.push({...a_dict});
            }

            // Loop through each dictionary in B
            for (const b_dict of data) {
                let found = false;
                // Check if the dictionary already exists in merged and update it if necessary
                for (const merged_dict of merged) {
                    if (merged_dict._id === b_dict._id) {
                        merged_dict.data = b_dict.data;
                        merged_dict.comments = b_dict.comments;
                        merged_dict.history = b_dict.history;
                        found = true;
                        break;
                    }
                }

                // If the dictionary doesn't exist in merged, add it
                if (!found) {
                    merged.push({...b_dict});
                }
            }
            setForms(merged)
        }else{

        }
        
        

        const now = new Date();
        var currentTime = now.getTime();
        setFetchtime(currentTime)
        

    }
    const getAllUserlist = async()=>{
        const data = await GetAllUser(token);
        data.sort((a, b) =>new Date(b['data']['time']) - new Date(a['data']['time']))
        setUserlist(data)
    }
    const getFormmodels = async()=>{
        const data = await GetAllFormModel(token);
        setFormmodels(data);
    }
    const dataFetch = async () => {

        setFetchbool(true)
        const result = (
            await Promise.all([
                GetUserAllFormData(token,_id),
                GetAllUser(token),
                GetAllFormModel(token),
                // GetFormModelPart(token,"63c9dbf2c5f4e1a3919c12a5",0,30),
                GetFormModelPart(token,0,30),
                GoogleSheetAllList(token)
            ])
        ).map((r) => r);
  
        // and waiting a bit more - fetch API is cumbersome
        const [userforms, userlist,formmodels,forms,googlelist] = await Promise.all(
            result
        );
        // when the data is ready, save it to state
        userforms.sort((a, b) =>new Date(b['data']['time']) - new Date(a['data']['time']))
        forms.sort((a, b) =>new Date(b['data']['time']) - new Date(a['data']['time']))
        setUserforms(userforms);
        setUserlist(userlist);
        setFormmodels(formmodels);
        setForms(forms)
        setGooglelist(googlelist)
    };
    // console.log('userform length',userforms);
    // console.log('userlist length',userlist.length);
    // console.log('forms length',forms);
    // console.log('formmodels length',formmodels);

    
    useEffect(()=>{

        if (!fetchbool && userlist.length<1){
            dataFetch()
            getAllFormData()
        }

        // Set interval to fetch data every 10 seconds
        const intervalId = setInterval(() => {
            
            getAllFormData()
        }, 20000);
    
        // Clean up interval on unmount
        return () => clearInterval(intervalId);
       

        // if (!fetchbool && userforms.length<1){
        //     getUserFormData()
        // }
        // if (!fetchbool && forms.length<1){
        //     getAllFormData()
        // }
        // if (!fetchbool && userlist.length<1){
        //     getAllUserlist();
        // }
        // if (!fetchbool && formmodels.length<1){
        //     getFormmodels();
        // }
        
    },[forms])

    return(
        <Box>
            {children}
        </Box>
        
    )

}