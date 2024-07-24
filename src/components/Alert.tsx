'use client'
import React, { useEffect, useContext } from "react";

import { useMainProvider } from "@/contexts/MainContext";
import styles from '@/styles/Alert.module.css';

type Props = {
}

const Alert: React.FC<Props> = () => {

    const {
        alert, 
        setAlert
    } = useMainProvider()
    console.log(alert)

    
    useEffect(() => {
        if (alert) {
            let timeout = setTimeout(() => {
                setAlert(null)
            }, 2000)
            return () => clearTimeout(timeout)
        }
    }, [alert])

    return alert ? (
        <div className={`${styles.alert_modal} ${alert.success ? styles.alert_success : styles.alert_error}`}>
            {alert.message}
        </div>
    ) : null
}

export default Alert;