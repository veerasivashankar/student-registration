# Student Registration

A small full-stack student registration application built with React, Express, TypeScript, MongoDB, and Mongoose.

## Project folders

- `frontend` contains the React and Vite website.
- `backend` contains the Express API and MongoDB connection.

## Run locally

Open two PowerShell windows from the `student-registration` folder.

```powershell
cd .\backend
npm run dev
```

```powershell
cd .\frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy with GitHub, Vercel, and MongoDB Atlas

The local MongoDB address in `backend/.env` works only on your laptop. A deployed application needs a cloud database, such as MongoDB Atlas.

1. Create a MongoDB Atlas cluster and database user. Copy its connection string.
2. Push this repository to GitHub.
3. In Vercel, import the GitHub repository twice:
   - Create a backend project with `backend` as its Root Directory.
   - Create a frontend project with `frontend` as its Root Directory.
4. Add these environment variables in Vercel:

```text
Backend project
MONGODB_URI=<your MongoDB Atlas connection string>
CLIENT_URL=<your deployed frontend URL>

Frontend project
VITE_API_URL=<your deployed backend URL>/api/students
```

5. Redeploy the frontend after setting `VITE_API_URL`.

Never commit a real `.env` file or MongoDB password. Use the included `.env.example` files as templates.
