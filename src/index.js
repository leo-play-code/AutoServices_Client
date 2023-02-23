import dotenv from "dotenv";

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from './state';
import { configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';
// import {disableReactDevTools} from '@fvilers/disable-react-devtools';
import { StoreProvider } from './state/store';

// if (process.env.NODE_ENV === 'production') disableReactDevTools();
dotenv.config();


const persistConfig = {key:"root",storage,version:1};
const persistedReducer = persistReducer(persistConfig,authReducer);
const store = configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware(
            {
                serializableCheck:{
                    ignoreActions:[FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER],
                }
            }
        )
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <Provider store={store}>
            <StoreProvider>
                <PersistGate loading={null} persistor={persistStore(store)}>
                    <App />
                </PersistGate>
            </StoreProvider>
        </Provider>
    // </React.StrictMode>
);



