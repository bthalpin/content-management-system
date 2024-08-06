import { useMainProvider } from "@/contexts/MainContext"
import fetcher from "@/helpers/fetcher";
import React, { useState, useEffect } from "react"
import styles from '@/styles/components/auth/RegisterForm.module.css';

type Props = {
    existingUser?: User | null;
    cancel: Function;
}
type Placeholders = {
    [key: string]: string;
}

const RegisterForm: React.FC<Props> = ({ existingUser, cancel }) => {

    const {
        setAlert
    } = useMainProvider()

    const defaultEditUser = {
        name: '',
        email: '',
        company_name: '',
        phone: '',
    }

    const defaultUser = {
        ...defaultEditUser,
        password: ''
    }

    const [user, setUser] = useState<Partial<User>>({ ...defaultUser })
    const { 
        name,
        email,
        company_name,
        phone,
        password
    } = user;


    useEffect(() => {
        if (existingUser) {
            
            setUser({
                name: existingUser.name,
                email: existingUser.email,
                company_name: existingUser.company_name,
                phone: existingUser.phone
            })
        }
    }, [existingUser])
    const [confirmPassword, setConfirmPassword] = useState('')

    const placeholderDictionary: Placeholders = {
        name: 'Name',
        email: 'Email',
        company_name: 'Company Name',
        phone: 'Phone Number',
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
        const missingFields = [
            ...!name ? ['Name'] : [],
            ...!email ? ['Email'] : [],
            ...!phone ? ['Phone Number'] : [],
            ...!existingUser && !password ? ['Password'] : [],
            ...!existingUser && !confirmPassword ? ['Confirm Password'] : [],
            ...!existingUser && password && confirmPassword && password !== confirmPassword ? ['Passwords Must Match'] : [],
        ]
        
        if (missingFields.length > 0) {
            return setAlert({ message: `Please fix the following fields: ${new Intl.ListFormat('en-us').format(missingFields)}`, success: false })
        }

        try {
            const newUser = await fetcher(`/api/user`, 
                existingUser ? 'PUT' : 'POST', 
                {
                    user: {
                        ...user,
                        ...existingUser ? { user_id: existingUser.user_id } : {}
                    }
                })

            if (newUser?.user_id) {
                localStorage.setItem(`hs-user`, JSON.stringify(newUser))
                const stripeCheckout = await fetcher(`/api/stripe/checkout`, 'POST', { user: newUser, url: window.location.href })

                if (stripeCheckout.url) {
                    window.open(stripeCheckout.url, '_self')
                }
            } else {
                setAlert({ message: newUser.error ? newUser.error : 'Unable to create user', success: false })
            }

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
        <p className={styles.register_form_header}>REGISTER</p>
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
                {!existingUser ? 
                    <div className={'input_container'}>
                        {confirmPassword ?
                            <label>Confirm Password</label>
                        : null}
                        <input
                            type='password'
                            className={`input`}
                            name={'confirmPassword'}
                            placeholder={'Confirm Password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        /> 
                    </div>
                : null}
                <button className={`button button_blue_outline `} onClick={() => cancel()}>CANCEL</button>
                <button className={`button button_blue_solid`} onClick={handleSubmit}>SUBMIT</button>
            </div>
        </>
    )
}

export default RegisterForm