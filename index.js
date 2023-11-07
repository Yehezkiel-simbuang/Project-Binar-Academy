const { combinedRouter } = require("./route/CombinedRoute.js");
const { authRouter } = require("./route/AuthRouter.js");
const express = require("express");
const app = express();

app.use(express.json());

app.use("/api/v1", combinedRouter);
app.use("/api/v1/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(3000, () => {
  console.log("Connecting to port 3000.....");
});
