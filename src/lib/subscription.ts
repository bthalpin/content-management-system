import prisma from "../../prisma";

export const createSubscription = async (subscription: Partial<Subscription>) => {
    try {
        const user = await prisma.subscriptions.create({
            data: {
                ...subscription,
                modified_date: new Date(),
                create_date: new Date()
            }
        })

        return user

    } catch(err) {
        console.error(`Error: /lib/subscription/createSubscription - ${err}`)
        return null
    }
}
