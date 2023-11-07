const { PrismaClient } = require("@prisma/client");
const { errorHandler } = require("../utils/errorHandler");

const prisma = new PrismaClient();

const getAccount = async (req, res, next) => {
  try {
    const account = await prisma.bankAccount.findMany();
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};
const getAccountDetails = async (req, res, next) => {
  try {
    const account = await prisma.bankAccount.findUnique({
      where: {
        id: +req.params.accountid,
      },
    });

    if (!account) {
      res.status(200).json({
        status: "success",
        message: "data is empty",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: account,
      });
    }
  } catch (error) {
    next(error);
  }
};
const postAccount = async (req, res, next) => {
  try {
    const numAccount = await prisma.bankAccount.count();
    if (numAccount == 0) {
      const account = await prisma.bankAccount.create({
        data: {
          bank_name: req.body.name,
          bank_account_number: +req.body.accNumber,
          balance: +req.body.balance,
          userId: +req.body.userid,
        },
      });
      res.status(200).json({
        status: "success",
        data: account,
      });
      return;
    }
    const isAccount = await prisma.bankAccount.findFirst({
      where: {
        bank_account_number: +req.body.accNumber,
      },
    });
    if (isAccount) {
      next(errorHandler(400, "Account number telah terdaftar"));
      return;
    }
    const account = await prisma.bankAccount.create({
      data: {
        bank_name: req.body.name,
        bank_account_number: +req.body.accNumber,
        balance: +req.body.balance,
        userId: +req.body.userid,
      },
    });
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAccount,
  getAccountDetails,
  postAccount,
};
