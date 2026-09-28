# FitTrack

Full-stack fitness tracking app. Log workouts, track daily steps, and see your week at a glance.

```
Client (React + Vite)  --REST/JSON, JWT in Authorization header-->  Server (Express)  --Mongoose-->  MongoDB
```

The frontend never talks to MongoDB. Every read and write goes through the Express API, and every
protected endpoint runs through a JWT middleware before its controller runs.

## Tech stack

| Layer    | Choice                                                    |
| -------- | --------------------------------------------------------- |
| Frontend | React (Vite), Tailwind CSS, Axios, Recharts, React Router |
| Backend  | Node.js, Express, CORS, dotenv                            |
| Database | MongoDB (Atlas or local) with Mongoose ODM                |
| Auth     | bcrypt password hashing, JWT sessions (7-day expiry)      |

## Folder tree

```
Based-Fitness/
├── backend/
│   ├── config/
│   │   └── db.js                 Mongoose connection
│   ├── models/
│   │   ├── User.js               name, email, phone, passwordHash, createdAt
│   │   ├── WorkoutSession.js     userId, type, duration, caloriesBurned, date, notes
│   │   └── StepLog.js            userId, date, stepCount
│   ├── controllers/
│   │   ├── auth.controller.js    signup, login
│   │   ├── workouts.controller.js createWorkout, listWorkouts, deleteWorkout
│   │   ├── steps.controller.js   upsertSteps, getSteps
│   │   └── users.controller.js   getMe
│   ├── routes/
│   │   ├── auth.routes.js        POST /signup, POST /login
│   │   ├── users.routes.js       GET /me
│   │   ├── workouts.routes.js    POST /, GET /, DELETE /:id
│   │   └── steps.routes.js       POST /, GET /
│   ├── middleware/
│   │   ├── auth.middleware.js    Verifies JWT, loads user onto req.user
│   │   └── error.middleware.js   asyncHandler, 404 handler, central error handler
│   ├── server.js                 Express app, CORS, route mounting, error middleware
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx         Sign in with email OR phone
│   │   │   ├── Signup.jsx        Create account (name, email, phone, password)
│   │   │   ├── Dashboard.jsx     Today's steps, last workout, weekly chart, quick adds
│   │   │   ├── Workouts.jsx      Create / list / delete workout sessions
│   │   │   ├── Steps.jsx         Daily step entry, weekly chart, day-by-day table
│   │   │   └── Profile.jsx       Account details and lifetime totals
│   │   ├── components/
│   │   │   ├── Navbar.jsx        Top navigation + logout
│   │   │   ├── StatCard.jsx      Reusable metric card
│   │   │   ├── WorkoutForm.jsx   Create-session form (type, duration, calories, date, notes)
│   │   │   ├── StepChart.jsx     Recharts bar chart of the last 7 days
│   │   │   └── ProtectedRoute.jsx Redirects to /login when no valid session
│   │   ├── context/
│   │   │   └── AuthContext.jsx   Holds user + token, exposes login / signup / logout
│   │   ├── api/
│   │   │   ├── axios.js          Base instance + request/response interceptors
│   │   │   ├── auth.js           signupRequest, loginRequest, fetchMe
│   │   │   ├── workouts.js       createWorkoutRequest, fetchWorkouts, deleteWorkoutRequest
│   │   │   └── steps.js          saveStepsRequest, fetchSteps
│   │   ├── App.jsx               Routes + AuthProvider + ProtectedRoute wiring
│   │   ├── main.jsx              React entry point
│   │   └── index.css             Tailwind directives only
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   └── .env.example
├── .env.example
└── README.md
```

### Layer rules

- **Routes** only declare method + path + controller. No logic, no database access.
- **Controllers** handle `req`/`res` and call the Mongoose models. No query logic elsewhere.
- **Components/pages** call functions from `src/api/`. No inline `fetch` or `axios` anywhere in the UI.

## Data models

```js
User            { name: String!, email: String! (unique), phone: String! (unique), passwordHash: String!, createdAt: Date }
WorkoutSession  { userId: ObjectId! -> User, type: 'Run'|'Gym'|'Yoga'|'Cycling'|'Other',
                  duration: Number (min), caloriesBurned: Number, date: Date, notes: String? }
StepLog         { userId: ObjectId! -> User, date: Date!, stepCount: Number! }   // one per user per day
```

## API

| Method | Path                    | Auth      | Body / Query                                     |
| ------ | ----------------------- | --------- | ------------------------------------------------ |
| POST   | `/api/auth/signup`      | public    | `{ name, email, phone, password }`                |
| POST   | `/api/auth/login`       | public    | `{ emailOrPhone, password }`                      |
| GET    | `/api/users/me`         | protected | —                                                |
| POST   | `/api/steps`            | protected | `{ date, stepCount }` (upserts that day)         |
| GET    | `/api/steps?range=week` | protected | `range=week` for 7 days, otherwise today only    |
| POST   | `/api/workouts`         | protected | `{ type, duration, caloriesBurned, date, notes }` |
| GET    | `/api/workouts`         | protected | — (newest first)                                 |
| DELETE | `/api/workouts/:id`     | protected | —                                                |

`POST /api/auth/signup` and `POST /api/auth/login` return `{ token, user }`. Send the token on
every other request as `Authorization: Bearer <token>`. Missing, malformed, or expired tokens
return `401`.

## Request flow

1. User signs up or logs in on `/login` or `/signup`; the API returns a 7-day JWT.
2. `AuthContext` stores the token and user in `localStorage` (`fittrack_token`, `fittrack_user`).
3. The Axios request interceptor attaches `Authorization: Bearer <token>` to every call.
4. `auth.middleware.js` verifies the JWT, loads the user, and calls `next()`.
5. The controller reads/writes through Mongoose; Mongoose talks to MongoDB.
6. The response interceptor clears the stored session and redirects to `/login` on a `401`.

## Running locally

Prerequisites: Node 18+, a MongoDB Atlas connection string (or a local `mongod`).

**1. Backend**

```bash
cd backend
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # or: npm start
```

The API listens on `http://localhost:5000` and only starts listening after MongoDB connects.

**2. Frontend**

```bash
cd frontend
cp .env.example .env      # optional; defaults to http://localhost:5000/api
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`, which is already allowed by the backend CORS config.

## Environment variables

`backend/.env`

| Variable    | Purpose                             | Example                                              |
| ----------- | ----------------------------------- | ---------------------------------------------------- |
| `PORT`      | API port                            | `5000`                                               |
| `MONGO_URI` | MongoDB / Atlas connection string   | `mongodb+srv://user:pass@cluster.mongodb.net/fittrack` |
| `JWT_SECRET` | Secret used to sign and verify tokens | a long random string                              |
| `CLIENT_URL` | CORS origin allowed to call the API | `http://localhost:5173`                               |

`frontend/.env`

| Variable       | Purpose                     | Default                    |
| -------------- | --------------------------- | -------------------------- |
| `VITE_API_URL` | Base URL for all API calls | `http://localhost:5000/api` |

If port 5000 is already taken on your machine, set `PORT=5001` in `backend/.env` and
`VITE_API_URL=http://localhost:5001/api` in `frontend/.env`.

## Scripts

| Location     | Command          | What it does                        |
| ------------ | ---------------- | ----------------------------------- |
| `backend/`   | `npm run dev`    | Start API with nodemon reload       |
| `backend/`   | `npm start`      | Start API with node                 |
| `frontend/`  | `npm run dev`    | Vite dev server on :5173            |
| `frontend/`  | `npm run build`  | Production build into `frontend/dist` |
| `frontend/`  | `npm run preview` | Serve the production build locally |

## UI notes

Card-based layout, rounded corners, soft shadows, a single teal accent, light theme, and
Tailwind utility classes only (no component-level CSS files). Layout is responsive from mobile
through desktop.
