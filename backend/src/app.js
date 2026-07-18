import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFoundMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);

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

/*import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFoundMiddleware.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentAuthRoutes from "./routes/studentAuthRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Campus2Corporate Backend Running ",
  });
});

app.use("/api/auth", studentAuthRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/students", studentRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;*/
