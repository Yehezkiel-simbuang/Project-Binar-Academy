import express from "express";
import { getUser, getUserDetails, postUser } from "../middleware/userMiddleware.js";
import { getAccount, getAccountDetails, postAccount } from "../middleware/BankAccount.js";
import { getTransaction, getTransactionDetails, postTransaction } from "../middleware/transactionMiddleware.js";

const combinedRouter = express.Router();

combinedRouter.post("/users", getUser);
combinedRouter.get("/users", postUser);
combinedRouter.get("/users/:userid", getUserDetails);

combinedRouter.post("/accounts", getAccount);
combinedRouter.get("/accounts", postAccount);
combinedRouter.get("/accounts/:accountid", getAccountDetails);

combinedRouter.post("/transactions", getTransaction);
combinedRouter.get("/transactions", postTransaction);
combinedRouter.get("/transactions/:transactionid", getTransactionDetails);

export default combinedRouter;