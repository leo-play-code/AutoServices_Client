import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    mode:"light",
    user:null,
    token:null,
    width:window.innerWidth,
    height:window.innerHeight,
    forms:[],
    formmodels:{},
    formmodellist:[],
    settings:{},
    userlist:[],
    filter : {},
    filtermode:"post",
    fetchbool:false
};

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode = state.mode == "light"?"dark":"light";
        },
        setLogin:(state,action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout:(state)=>{
            state.user = null;
            state.token = null;
        },
        setLocalforms:(state,action) =>{
            state.forms = action.payload.forms;
        },
        setScreen:(state,action) =>{
            state.width = action.payload.width;
            state.height = action.payload.height;
        },
        setFormModels:(state,action) =>{
            state.formmodels = action.payload.formmodels;
            state.formmodellist = action.payload.formmodellist;
        },
        setSettings:(state,action)=>{
            state.settings = action.payload.settings;
        },
        setUserList:(state,action)=>{
            state.userlist = action.payload.userlist;
        },
        setFilter:(state,action)=>{
            state.filter = action.payload.filter;
        },
        setFilterMode:(state,action)=>{
            state.filtermode = action.payload.filtermode;
        },
        setFetchBool:(state,action)=>{
            state.fetchbool = action.payload.fetchbool;
        }


    }
})

export const {setMode,setLogin,setLogout,setLocalforms,setScreen,setFormModels,setSettings,setUserList,setFilter,setFilterMode,setFetchBool} = authSlice.actions;
export default authSlice.reducer;

// export const urlpath = "http://localhost:6001/";
export const urlpath = "https://autoservices-api.onrender.com/";




// export const webpath = "http://localhost:8000/";
// export const webpath = "https://autoservices.onrender.com/"



