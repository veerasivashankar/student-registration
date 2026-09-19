import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import { connectToDatabase } from "./config/database.js";
import studentsRouter from "./routes/students.js";

const app = express();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
  }),
);
app.use(express.json());

app.use(async (_request, _response, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    message: "Student Registration API is running.",
  });
});

app.use("/api/students", studentsRouter);

const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
  void next;
  console.error("An API error occurred.", error);
  response.status(500).json({
    message: "The server could not complete the request.",
  });
};

app.use(errorHandler);

export default app;
