import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


export const getAccount = async(req, res, next) => {
    try {
        const account = await prisma.bankAccount.findMany();
        res.status(200).json({
            status : "success",
            data : account
        })
    } catch (error) {
        next(error);
    }
}
export const getAccountDetails = async(req, res, next) => {
    try {
        const account = await prisma.bankAccount.findUnique({
            where: {
                id : req.params.accountid,
            }
        })

        if (!account) {
            res.status(200).json({
                status : "success",
                message : "data is empty"
            })
        } else {
            res.status(200).json({
                status : "success",
                data : account
            })
        }
    } catch (error) {
        next(error)
    }
    
}
export const postAccount = async(req, res, next) => {
    try {
        const account = await prisma.bankAccount.create({
            data : {
                bank_name : req.body.name,
                bank_account_number : req.body.accNumber,
                balance : req.body.balance
            }
        })
        res.status(200).json({
            status : "success",
            data : account
        })   
    } catch (error) {
        next(error)
    }
}