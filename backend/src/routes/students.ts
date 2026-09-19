import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { StudentModel } from "../models/Student.js";

type StudentInput = {
  name: string;
  email: string;
  course: string;
};

const studentsRouter = Router();

function getStudentInput(requestBody: unknown): StudentInput | null {
  if (typeof requestBody !== "object" || requestBody === null) {
    return null;
  }

  const { name, email, course } = requestBody as Record<string, unknown>;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof course !== "string"
  ) {
    return null;
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedCourse = course.trim();
  const emailPattern = /^\S+@\S+\.\S+$/;

  if (
    !trimmedName ||
    !trimmedEmail ||
    !trimmedCourse ||
    !emailPattern.test(trimmedEmail)
  ) {
    return null;
  }

  return {
    name: trimmedName,
    email: trimmedEmail.toLowerCase(),
    course: trimmedCourse,
  };
}

studentsRouter.post("/", async (request, response) => {
  const studentInput = getStudentInput(request.body);

  if (!studentInput) {
    response.status(400).json({
      message: "Name, a valid email, and course are required.",
    });
    return;
  }

  const existingStudent = await StudentModel.exists({
    email: studentInput.email,
  });

  if (existingStudent) {
    response.status(409).json({
      message: "A student with this email is already registered.",
    });
    return;
  }

  const student = await StudentModel.create(studentInput);
  response.status(201).json(student);
});

studentsRouter.get("/", async (_request, response) => {
  const students = await StudentModel.find().sort({ createdAt: -1 });
  response.status(200).json(students);
});

studentsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  if (!isValidObjectId(id)) {
    response.status(400).json({
      message: "The student ID is not valid.",
    });
    return;
  }

  const deletedStudent = await StudentModel.findByIdAndDelete(id);

  if (!deletedStudent) {
    response.status(404).json({
      message: "Student not found.",
    });
    return;
  }

  response.status(200).json({
    message: "Student deleted successfully.",
  });
});

export default studentsRouter;
