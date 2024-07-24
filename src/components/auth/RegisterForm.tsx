import { useMainProvider } from "@/contexts/MainContext"
import fetcher from "@/helpers/fetcher";
import React, { useState } from "react"

type Placeholders = {
    [key: string]: string;
}

const RegisterForm = () => {

    const {
        setAlert
    } = useMainProvider()

    const defaultUser = {
        name: '',
        email: '',
        company_name: '',
        phone: '',
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
            ...!password ? ['Password'] : [],
            ...!confirmPassword ? ['Confirm Password'] : [],
            ...password && confirmPassword && password !== confirmPassword ? ['Passwords Must Match'] : [],
        ]
console.log('HERE', missingFields, user, !name, name)
        if (missingFields.length > 0) {
            return setAlert({ message: `Please fix the following fields: ${new Intl.ListFormat('en-us').format(missingFields)}`, success: false })
        }

        try {console.log(user)
            const newUser = await fetcher(`/api/user`, 'POST', {user})

            if (newUser?.user_id) {
                const stripeCheckout = await fetcher(`/api/stripe/checkout`, 'POST', { user: newUser, url: window.location.href })

                if (stripeCheckout.url) {
                    window.open(stripeCheckout.url)
                }
            } else {
                setAlert({ message: newUser.error ? newUser.error : 'Unable to create user', success: false })
            }

            console.log(newUser, 'HERE')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            {Object.keys(user).map((key, i) => (
                <input
                    type={key === 'password' ? 'password' : 'text'}
                    className={`input`}
                    key={`input-${i}`}
                    name={key}
                    placeholder={placeholderDictionary[key]}
                    value={user[key as keyof User] ? user[key as keyof User] as string : ''}
                    onChange={handleChange}
                />
            ))}
            <input
                type='password'
                className={`input`}
                name={'confirmPassword'}
                placeholder={'Confirm Password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className={`button button_blue_solid`} onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default RegisterForm