

import axios from 'axios'
import { useContext } from 'react';
import { createContext } from 'react';
import {useNavigate} from "react-router-dom"
import {useUser, useAuth} from '@clerk/clerk-react'
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import { useEffect } from 'react';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // All Hooks must be called at the top level first
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();
    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);

    // Non-Hook code after all Hooks
    const currency = import.meta.env.VITE_CURRENCY || "$";

    const fetchUser = async () =>{
        try {

            //debug
            const token = await getToken();
            console.log("Token retrieved:", token ? "EXISTS" : "MISSING");

            //end debug
            const {data} = await axios.get('/api/user', {headers: {Authorization: `Bearer ${await getToken()}`}})
            
            if(data.success){
                setIsOwner(data.role === "HotelOwner");
                setSearchedCities(data.recentSearchCities);
            }else{
                console.log(data.message)
                // setTimeout(() =>{fetchUser()}, 5000 )
            }
        } catch (error) {
            toast.error(error.message)
        }
    };


    //whenever user is changed, do fetch User
    useEffect(()=>{
        if(user){
            fetchUser();
        }
    },[user])

    const value = {
        currency,
        navigate,
        user,
        getToken,
        isOwner, setIsOwner,
        showHotelReg, setShowHotelReg,
        searchedCities, setSearchedCities,
        axios
    }

    
    return (
        <AppContext.Provider value={value}>

            {children}
        </AppContext.Provider>
    )
}

export const UseAppContext = () =>{
    return useContext(AppContext);
}