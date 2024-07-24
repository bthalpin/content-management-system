'use client'
import React,  { useState } from "react";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import RegisterForm from "@/components/auth/RegisterForm";

export default function Home() {
    const [authState, setAuthState] = useState('')
    return (
        <main className={styles.main}>
            {authState ? 
                <button className={`button button_blue_text`} onClick={() => setAuthState('')}>Back</button>
            : null}
            {authState === 'register' ?
                <RegisterForm />
            : 
                <>
                
                    <button className={`button button_blue_outline`}>Login</button>
                    <button className={`button button_blue_solid`} onClick={() => setAuthState('register')}>Register</button>
                </>
            }
        </main>
    );
}
