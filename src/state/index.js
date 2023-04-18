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
    newgooglesheet:{},

};
export const ColumnDefault = new Map([
    [1,"A"],
    [2,"B"],
    [3,"C"],
    [4,"D"],
    [5,"E"],
    [6,"F"],
    [7,"G"],
    [8,"H"],
    [9,"I"],
    [10,"J"],
    [11,"K"],
    [12,"L"],
    [13,"M"],
    [14,"N"],
    [15,"O"],
    [16,"P"],
    [17,"Q"],
    [18,"R"],
    [19,"S"],
    [20,"T"],
    [21,"U"],
    [22,"V"],
    [23,"W"],
    [24,"X"],
    [25,"Y"],
    [26,"Z"], 
])



export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setMode:(state)=>{
            state.mode = state.mode === "light"?"dark":"light";
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
        setnewGoogleSheet:(state,action)=>{
            state.newgooglesheet = action.payload.newgooglesheet;
        },



    }
})

export const {setMode,setLogin,setLogout,setLocalforms,setScreen,setFormModels,setSettings,setUserList,setFilter,setFilterMode,setnewGoogleSheet} = authSlice.actions;
export default authSlice.reducer;

// export const urlpath = "http://localhost:6001/";
export const urlpath = "http://220.133.157.4:6001/"
// export const urlpath = "https://autoservices-api.onrender.com/";





// export const webpath = "http://localhost:8000/";
// export const webpath = "https://autoservices.onrender.com/"



