'use client'
import React,  { useState, useEffect } from "react";
import Image from "next/image";

import RegisterForm from "@/components/auth/RegisterForm";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import LoginForm from "@/components/auth/LoginForm";

import logo from '/public/images/H.png'

import styles from "@/styles/Home.module.css";

export default function Home() {
    const [authState, setAuthState] = useState('')
    const [existingUser, setExistingUser] = useState<User | null>(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                const user = localStorage.getItem('hs-user')
    
                if (user) {
                    setExistingUser(JSON.parse(user))
                    setAuthState('register')
                }
                setLoaded(true)
            }

        } catch (err) {
            console.error(err)
        }
    }, [])

    const componentDictionary: {register: any, login: any} = {
        register: <RegisterForm existingUser={existingUser} cancel={() => setAuthState('')}/>,
        login: <LoginForm cancel={() => setAuthState('')}/>
    }

    return loaded ? (
        <main className={styles.main}>
            <div className={styles.logo_container}>
                <Image src={logo} alt='Halpin Software' width={205} height={200}/>
            </div>
            <div className={styles.main_content}>
               
                <button className={`button button_blue_outline`} onClick={() => setAuthState('login')}>LOGIN</button>
                <button className={`button button_blue_solid`} onClick={() => setAuthState('register')}>REGISTER</button>
                  
            </div>
            <Modal open={authState ? true : false} close={() => setAuthState('')} component={componentDictionary[authState as 'register' | 'login']} />
        </main>
    ) : <Loading />;
}
