import cors from "cors";
import express from "express";
import studentsRouter from "./routes/students.js";

const app = express();
const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
  }),
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    message: "Student Registration API is running.",
  });
});

app.use("/api/students", studentsRouter);

export default app;
