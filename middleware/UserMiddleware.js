import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();


export const getUser = async(req, res, next) => {
    try {
        const user = await prisma.user.findMany();
        res.status(200).json({
            status : "success",
            data : user
        })
    } catch (error) {
        next(error);
    }
}
export const getUserDetails = async(req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id : req.params.userid,
            },
            include : {
                profile:true
            }
        })

        if (!user) {
            res.status(200).json({
                status : "success",
                message : "data is empty"
            })
        } else {
            res.status(200).json({
                status : "success",
                data : user
            })
        }
    } catch (error) {
        next(error)
    }
    
}
export const postUser = async(req, res, next) => {
    try {
        const user = await prisma.user.create({
            data : {
                email : req.body.email,
                name : req.body.name,
                password : req.body.password,
                profile : {
                    create : {
                        identity_type : req.body.identity_type,
                        identity_number : req.body.identity_number,
                        address : req.body.address,
                    }
                }
            },
            include : {
                profile : true
            }
        })
        res.status(200).json({
            status : "success",
            data : user
        })   
    } catch (error) {
        next(error)
    }
}