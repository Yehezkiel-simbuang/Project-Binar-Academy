const express = require("express");
const combinedRouter = express.Router();
const {
  getUser,
  getUserDetails,
  postUser,
} = require("../middleware/UserMiddleware");
const {
  getAccount,
  getAccountDetails,
  postAccount,
} = require("../middleware/BankAccount");
const {
  getTransaction,
  getTransactionDetails,
  postTransaction,
} = require("../middleware/transactionMiddleware");

const { loginMiddleware } = require("../middleware/authMiddleware");

combinedRouter.get("/users", getUser);
combinedRouter.post("/create-user", postUser);
combinedRouter.get("/users/:userid", getUserDetails);

combinedRouter.get("/accounts", getAccount);
combinedRouter.post("/create-accounts", postAccount);
combinedRouter.get("/accounts/:accountid", getAccountDetails);

combinedRouter.get("/transactions", getTransaction);
combinedRouter.post("/create-transactions", postTransaction);
combinedRouter.get("/transactions/:transactionid", getTransactionDetails);

module.exports = { combinedRouter };
