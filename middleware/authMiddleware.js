const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../utils/errorHandler");
// const { response } = require("express");

const loginMiddleware = async (req, res, next) => {
  const email = req.body.email;
  const isUser = await prisma.user.findFirst({ where: { email } });
  if (!isUser) {
    next(errorHandler(400, "Username or email is wrong"));
    return;
  }

  const compareHash = bcryptjs.compareSync(req.body.password, isUser.password);
  if (!compareHash) {
    next(errorHandler(400, "Username or email is wrong"));
  }
  const { password, ...payload } = isUser;
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return res
    .cookie("access_token", token, { httpOnly: true, maxAge: 900000 })
    .status(200)
    .json({
      status: "success",
      message: "User authenticate successfully",
    });
};
const authenticateMidlleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Token not found"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return next(errorHandler(401, "Token Invalid"));
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  });
};

module.exports = {
  loginMiddleware,
  authenticateMidlleware,
};
