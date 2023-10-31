import express from "express";
import { getUser, getUserDetails, postUser } from "../middleware/userMiddleware.js";
import { getAccount, getAccountDetails, postAccount } from "../middleware/BankAccount.js";
import { getTransaction, getTransactionDetails, postTransaction } from "../middleware/transactionMiddleware.js";

const combinedRouter = express.Router();

combinedRouter.get("/users", getUser);
combinedRouter.post("/create-user", postUser);
combinedRouter.get("/users/:userid", getUserDetails);

combinedRouter.get("/accounts", getAccount);
combinedRouter.post("/create-accounts", postAccount);
combinedRouter.get("/accounts/:accountid", getAccountDetails);

combinedRouter.get("/transactions", getTransaction);
combinedRouter.post("/create-transactions", postTransaction);
combinedRouter.get("/transactions/:transactionid", getTransactionDetails);

export default combinedRouter;