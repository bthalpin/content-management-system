import prisma from "../../prisma";

export const createTransaction = async (transaction: Partial<Transaction>) => {
    try {
        const newTransaction = await prisma.transactions.create({
            data: {
                ...transaction,
                modified_date: new Date(),
            }
        })

        return newTransaction

    } catch(err) {
        console.error(`Error: /lib/transaction/createTransaction - ${err}`)
        return null
    }
}
