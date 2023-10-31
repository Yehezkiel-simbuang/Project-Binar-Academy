import express from "express";
import combinedRouter from "./route/CombinedRoute.js";

const app = express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Connecting to port 3000.....")
})

app.use("api/v1", combinedRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});