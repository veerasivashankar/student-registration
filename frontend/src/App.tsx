import { type FormEvent, useEffect, useRef, useState } from "react";
import "./App.css";

type Student = {
  _id: string;
  name: string;
  email: string;
  course: string;
};

const studentsApiUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/students";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadStudents(): Promise<void> {
      try {
        const response = await fetch(studentsApiUrl);

        if (!response.ok) {
          throw new Error("Unable to load students.");
        }

        const savedStudents: Student[] = await response.json();
        setStudents(savedStudents);
      } catch {
        setErrorMessage("Unable to load registered students. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudents();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(studentsApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, course }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("A student with this email is already registered.");
        }

        throw new Error("Unable to register student.");
      }

      const savedStudent: Student = await response.json();
      setStudents((currentStudents) => [savedStudent, ...currentStudents]);
      setName("");
      setEmail("");
      setCourse("");
      setSuccessMessage("Student registered successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to register the student. Please try again.";
      setErrorMessage(message);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (studentId: string): Promise<void> => {
    setErrorMessage("");
    setSuccessMessage("");
    setDeletingStudentId(studentId);

    try {
      const response = await fetch(`${studentsApiUrl}/${studentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete student.");
      }

      setStudents((currentStudents) =>
        currentStudents.filter((student) => student._id !== studentId),
      );
      setSuccessMessage("Student deleted successfully.");
    } catch {
      setErrorMessage("Unable to delete the student. Please try again.");
    } finally {
      setDeletingStudentId(null);
    }
  };

  return (
    <main className="page">
      <section className="registration-card" aria-labelledby="page-title">
        <div className="page-heading">
          <p className="eyebrow">Student portal</p>
          <h1 id="page-title">Student Registration</h1>
          <p className="intro">Enter your details to register for a course.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course</label>
            <input
              id="course"
              type="text"
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              placeholder="Enter your course"
              required
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {errorMessage && (
          <p className="status-message error-message" role="alert">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="status-message success-message" role="status">
            {successMessage}
          </p>
        )}

        <section className="students-section" aria-labelledby="students-heading">
          <h2 id="students-heading">Registered Students</h2>
          {isLoading ? (
            <p className="empty-state">Loading registered students...</p>
          ) : students.length === 0 ? (
            <p className="empty-state">No students registered yet.</p>
          ) : (
            <ul className="students-list">
              {students.map((student) => (
                <li className="student-item" key={student._id}>
                  <div className="student-details">
                    <h3>{student.name}</h3>
                    <p className="student-email">{student.email}</p>
                    <p className="student-course">{student.course}</p>
                  </div>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => void handleDelete(student._id)}
                    disabled={deletingStudentId === student._id}
                  >
                    {deletingStudentId === student._id ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
