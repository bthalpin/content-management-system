'use client'
import React, { createContext, useContext, useState } from "react";

type MainContextTypes = {
    alert: {message: string, success: boolean} | null;
    setAlert: React.Dispatch<React.SetStateAction<{message: string, success: boolean} | null>>;
}

type Props = {
    children: React.ReactNode;
}
const MainContext = createContext<MainContextTypes>({} as MainContextTypes)

const MainProvider: React.FC<Props> = ({ children }) => {
    const [alert, setAlert] = useState<{message: string, success: boolean} | null>(null)
console.log(alert)
    const values = {
        alert,
        setAlert
    }
    return (
        <MainContext.Provider value={values} >
            {children}
        </MainContext.Provider>
    )
}

const useMainProvider = () => {
    return useContext(MainContext)
}
export { 
    useMainProvider, 
    MainProvider
};