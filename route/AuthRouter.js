const express = require("express");
const {
  loginMiddleware,
  authenticateMidlleware,
} = require("../middleware/authMiddleware");
const { postUser } = require("../middleware/UserMiddleware");
const authRouter = express.Router();

authRouter.post("/login", loginMiddleware);
authRouter.post("/register", postUser);
authRouter.get("/authenticate", authenticateMidlleware);

module.exports = { authRouter };
