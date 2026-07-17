import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFoundMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus2Corporate Backend Running ",
  });
});
// app.get("/error", (req, res, next) => {
//   const error = new Error("This is a test error");
//   error.statusCode = 400;
//   next(error);
// });

// Global Error Handler
app.use(errorHandler);
app.use(notFound);

export default app;