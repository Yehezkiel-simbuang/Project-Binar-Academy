import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


export const getTransaction = async(req, res, next) => {
    try {
        const transaction = await prisma.transaction.findMany();
        res.status(200).json({
            status : "success",
            data : transaction
        })
    } catch (error) {
        next(error);
    }
}
export const getTransactionDetails = async(req, res, next) => {
    try {
        const account = await prisma.transaction.findUnique({
            where: {
                id : req.params.transactionid,
            },
            include : {
                sender : {
                    include : {
                        user : true
                    }
                },
                receiver : {
                    include : {
                        user : true
                    }
                }
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
export const postTransaction = async(req, res, next) => {
    if(req.body.senderNumber && req.body.destinationNumber && req.body.amount) {
        try {
            const sender = await prisma.bankAccount.findUnique({
                where : {
                    id : req.body.senderNumber
                }
            })
            const receiver = await prisma.bankAccount.findUnique({
                where : {
                    id : req.body.destinationNumber
                }
            })

            if (sender && receiver) {
                const transaction = await prisma.transaction.create({
                    data : {
                        source_account_id : req.body.senderNumber,
                        destination_account_number : req.body.destinationNumber,
                        amount : req.body.amount
                    }
                })
                res.status(200).json({
                    status : "success",
                    data : transaction
                })
            } else {
                res.status(400).json({
                    status : "failed",
                    message : "Invalid sender or receiver address"
                })
            }   
            } catch (error) {
                next(error)
            }
        } else {
            res.status(400).json({
                status : "failed",
                message : "Information is not enough"
            })
        }
    }
    