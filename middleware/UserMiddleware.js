// import { PrismaClient } from "@prisma/client";
// import bcryptjs from "bcryptjs";
// import { errorHandler } from "../utils/errorHandler.js";

// import dotenv from "dotenv";

const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const { errorHandler } = require("../utils/errorHandler");
const dotenv = require("dotenv").config();

const prisma = new PrismaClient();

const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findMany();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const getUserDetails = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.userid,
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      res.status(200).json({
        status: "success",
        message: "data is empty",
      });
    } else {
      res.status(200).json({
        status: "success",
        data: user,
      });
    }
  } catch (error) {
    next(error);
  }
};
const postUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const isUser = await prisma.user.findFirst({ where: { email } });
    if (isUser) {
      next(errorHandler(400, "Email already used"));
    }
    const encryptedPass = bcryptjs.hashSync(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        password: encryptedPass,
        profile: {
          create: {
            identity_type: req.body.identity_type,
            identity_number: +req.body.identity_number,
            address: req.body.address,
          },
        },
      },
      include: {
        profile: true,
      },
    });
    const { password, ...rest } = user;
    res.status(200).json({
      status: "success",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  getUserDetails,
  postUser,
};
