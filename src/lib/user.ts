import prisma from "../../prisma";
import bcrypt from 'bcrypt'

export const getUser = async (user_id: number) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                user_id
            }
        })

        return user

    } catch(err) {
        console.error(`Error: /lib/user/getUser - ${err}`)
        return null
    }
}

export const findUserByEmail = async (email: string) => {
    try {
        const user = await prisma.users.findFirst({
            where: {
                email
            }
        })

        return user

    } catch(err) {
        console.error(`Error: /lib/user/findUserByEmail - ${err}`)
        return null
    }
}

export const createUser = async (user: User) => {
    try {
        const existingUser = await findUserByEmail(user.email)

        if (existingUser) {
            return {success: false, error: 'A user with that email already exists.'}
        }
        const newUser = await new Promise((resolve, reject) => bcrypt.genSalt(10, function(err, salt) {

            if (err) reject(err)

            bcrypt.hash(user.password, salt, async function(err, hash) {
            
                if (err) reject(err)

                const newUser = await prisma.users.create({
                    data: {
                        ...user,
                        salt,
                        password: hash,
                        is_pending: true,
                        create_date: new Date(),
                        modified_date: new Date()
                    }
                })
                
                resolve(newUser)
                
                })
            })
        );

        return newUser
    } catch (err) {
        console.error(`Error: /lib/user/createUser - ${err}`)
    }
}

export const updateUser = async (data: Partial<User>, user_id: number) => {
    try {
        const updatedUser = await prisma.users.update({
            data,
            where: {
                user_id
            }
        })

        return updatedUser
    } catch (err) {
        console.error(`Error: /lib/user/updateUser - ${err}`)
    }
}