'use client'
import React,  { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import RegisterForm from "@/components/auth/RegisterForm";
import Loading from "@/components/Loading";

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

    return loaded ? (
        <main className={styles.main}>
            {authState ? 
                <button className={`button button_blue_text`} onClick={() => setAuthState('')}>Back</button>
            : null}
            {authState === 'register' ?
                <RegisterForm existingUser={existingUser}/>
            : 
                <>
                
                    <button className={`button button_blue_outline`}>Login</button>
                    <button className={`button button_blue_solid`} onClick={() => setAuthState('register')}>Register</button>
                </>
            }
        </main>
    ) : <Loading />;
}
