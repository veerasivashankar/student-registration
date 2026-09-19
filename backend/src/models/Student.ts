import { model, Schema } from "mongoose";

export interface Student {
  name: string;
  email: string;
  course: string;
}

const studentSchema = new Schema<Student>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const StudentModel = model<Student>("Student", studentSchema);
