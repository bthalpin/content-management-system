import { useMainProvider } from "@/contexts/MainContext"
import fetcher from "@/helpers/fetcher";
import React, { useState, useEffect } from "react"
import styles from '@/styles/components/auth/RegisterForm.module.css';

type Props = {
    cancel: Function;
}
type Placeholders = {
    [key: string]: string;
}

const LoginForm: React.FC<Props> = ({ cancel }) => {

    const defaultUser = {
        email: '',
        password: ''
    }

    const [user, setUser] = useState<Partial<User>>({ ...defaultUser })


    const placeholderDictionary: Placeholders = {
        email: 'Email',
        password: 'Enter Password'
    }
   

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }))
    }
    
    const handleSubmit = async () => {
       
    }

    return (
        <>
        <p className={styles.register_form_header}>LOGIN</p>
            <div className={styles.register_form_container}>
                {Object.keys(user).map((key, i) => (
                    <div className={'input_container'}>
                        {user[key as keyof User] ?
                            <label>{placeholderDictionary[key]}</label>
                            : null}
                        <input
                            type={key === 'password' ? 'password' : 'text'}
                            key={`input-${i}`}
                            name={key}
                            placeholder={placeholderDictionary[key]}
                            value={user[key as keyof User] ? user[key as keyof User] as string : ''}
                            onChange={handleChange}
                        />
                    </div>
                ))}
              
                <button className={`button button_blue_outline `} onClick={() => cancel()}>CANCEL</button>
                <button className={`button button_blue_solid`} onClick={handleSubmit}>LOGIN</button>
            </div>
        </>
    )
}

export default LoginForm