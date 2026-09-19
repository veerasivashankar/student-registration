import "dotenv/config";
import app from "./app.js";
import { connectToDatabase } from "./config/database.js";

const port = Number(process.env.PORT ?? 5000);

async function startServer(): Promise<void> {
  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(
        `Student Registration API is running on http://localhost:${port}`,
      );
    });
  } catch (error) {
    console.error("Unable to start the server because MongoDB did not connect.", error);
    process.exit(1);
  }
}

void startServer();
