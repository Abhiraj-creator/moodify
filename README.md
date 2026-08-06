# Moodify

>Moodify is a full-stack web application for uploading, storing, and playing songs with a mood-aware feature driven by simple audio metadata + a webcam-based expression/vision feature on the frontend.

---

**Table of contents**
- **Overview**
- **Repository layout**
- **Tech stack**
- **Features**
- **Architecture & flow**
- **Environment / configuration**
- **Backend: API & data models**
- **Frontend: structure & usage**
- **Development & deployment**
- **Troubleshooting**

---

**Overview**

Moodify provides:
- User authentication (register / login / logout)
- Uploading MP3 songs (extracts ID3 tags and embedded cover art)
- Storing songs and posters using ImageKit
- Serving songs to clients and fetching songs by mood
- A React frontend including a webcam/MediaPipe expression component to influence mood selection

**Repository layout**

- backend/ — Node.js + Express API and static server
	- src/
		- app.js — Express app, routes, and static build serving
		- config/
			- database.js — MongoDB connection
			- cache.js — Redis connection
		- controllers/ — request handlers (`user.controller.js`, `songs.controller.js`)
		- middlewares/ — authorization and upload middleware
		- models/ — Mongoose models (`user.model.js`, `songs.model.js`, `blacklist.model.js`)
		- routes/ — Express routes (`auth.routes.js`, `song.routes.js`)
		- services/ — external integrations (`storage.service.js`)
	- server.js — server bootstrap (connect DB and listen)
	- package.json — backend scripts & deps

- frontend/ — React client (Vite)
	- src/ — React components, contexts, routes and features
		- features/auth — auth provider, pages, hooks
		- features/home — song context, player, fetch services
		- features/expression — webcam/face component using MediaPipe
	- package.json — frontend scripts & deps

**Tech stack**

- Backend: Node.js, Express, Mongoose (MongoDB), Redis (`ioredis`), JWT for auth, `multer` for uploads, ImageKit for media storage
- Frontend: React + Vite, React Router, SCSS, Axios, MediaPipe (`@mediapipe/tasks-vision`) and `react-webcam`

**Features (high level)**

- User signup/login with cookies (JWT set as cookie)
- Protected `get-me` endpoint to fetch current user
- Song upload endpoint reads ID3 tags from uploaded MP3 and extracts title and cover art, stores both song and poster in ImageKit
- Song retrieval by `mood` (SAD, HAPPY, SURPRISED, ANGRY)
- Frontend maintains `AuthProvider` and `SongContext` for global state; includes a `Face` component for expression-based mood selection

**Architecture & request flow**

1. User registers / logs in → backend creates user and issues JWT cookie.
2. User uploads a song (multipart form file field named `song`) plus a `mood` field → backend reads ID3 tags, uploads song bytes and cover image to ImageKit, stores a `Song` document in MongoDB.
3. Client requests songs by query `?mood=HAPPY` → backend returns a matching song document.
4. Frontend may use webcam + MediaPipe to infer a user's expression and map it to a mood, then fetch a song accordingly.

**Environment / configuration**

Create a `.env` file in `backend/` with at least the following variables:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `IMAGEKIT_PRIVATE_KEY` — ImageKit private key used by `storage.service.js`
- `REDIS_HOST` — Redis host
- `REDIS_PORT` — Redis port
- `REDIS_PASSWORD` — Redis password (optional if not required)
- `PORT` — (optional) port to run backend server (defaults to 3000)
- `CLIENT_URL` — (optional) allowed frontend origin for CORS if uncommented in `app.js`

Example `.env` (do NOT commit real secrets):

```
MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/moodify
JWT_SECRET=replace_with_a_secure_string
IMAGEKIT_PRIVATE_KEY=private_XXXXX
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
PORT=3000
CLIENT_URL=http://localhost:5173
```

**Backend: API & data models**

Base API path: `/api`

Auth routes (in `src/routes/auth.routes.js`)
- `POST /api/auth/register` — body: `{ username, email, password }` → creates user, sets `token` cookie (JWT)
- `POST /api/auth/login` — body: `{ username|email, password }` → validates and sets `token` cookie
- `GET /api/auth/get-me` — protected (uses `auth.middleware`) → returns currently authenticated user
- `GET /api/auth/logout` — clears cookie and stores token in Redis blacklist

Songs routes (in `src/routes/song.routes.js`)
- `POST /api/song/` — upload endpoint expects `multipart/form-data` with field `song` (file) and `mood` (string). The controller reads ID3 tags with `node-id3` and uploads song + poster to ImageKit.
- `GET /api/song/?mood=HAPPY` — fetch a song by mood. The `Song` model enforces `mood` enum: `SAD | HAPPY | SURPRISED | ANGRY`.

Data models (high level)
- `User` (`src/models/user.model.js`): `username`, `email`, `password` (stored hashed)
- `Song` (`src/models/songs.model.js`): `title`, `SongUrl`, `PosterUrl`, `mood`

Security notes
- JWT is issued and set as a cookie. The `auth.middleware` expects the cookie and populates `req.user`.
- Logout stores the token in Redis (cache) to invalidate tokens on the server.

**Frontend: structure & usage**

- The app uses `AuthProvider` (features/auth) and `SongContext` (features/home) to manage authentication and song playback state.
- Key UIs:
	- `features/auth/pages/Login.jsx`, `Register.jsx` — login and registration
	- `features/home/components/SongPlayer.jsx` — playback UI
	- `features/expression/components/Face.jsx` — webcam-based expression detector using `@mediapipe/tasks-vision`
- Important behavior:
	- Frontend calls backend endpoints (`/api/auth/*`, `/api/song`) with Axios.
	- Uploads must use `multipart/form-data` with `song` file field.

**Development & run commands**

From repository root, open two terminals:

Backend (from `backend/`):
```powershell
cd backend
npm install
npm run dev   # uses nodemon to run server.js
```

Frontend (from `frontend/`):
```powershell
cd frontend
npm install
npm run dev   # runs Vite dev server (default: localhost:5173)
```

To build frontend and serve via backend static files:
```powershell
cd frontend
npm run build
cd ../backend
npm start
```

The backend's `app.js` serves the frontend build from `backend/public`.

**API examples**

Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"username":"alice","email":"a@x.com","password":"secret"}'
```

Upload a song (multipart):
```bash
curl -X POST http://localhost:3000/api/song/ \
	-F "song=@/path/to/song.mp3" \
	-F "mood=HAPPY"
```

Fetch a song by mood:
```bash
curl http://localhost:3000/api/song/?mood=HAPPY
```

**Troubleshooting & notes**

- If the frontend build is missing, `app.js` returns 404 and logs a message. Build the frontend (`npm run build` in `frontend/`).
- Upload size limit is 10 MB (see `upload.middleware.js`). Increase `limits.fileSize` if needed.
- The song upload controller expects ID3 tags including an embedded image. If a file has no image, the upload may fail; consider adding a fallback poster.
- Redis must be reachable using `REDIS_HOST`/`REDIS_PORT` for token blacklisting to work correctly.

**Next improvements (suggested)**

- Add pagination and search for songs.
- Add endpoints to list all songs and to stream partial content (range requests) for better playback.
- Add explicit API docs (OpenAPI/Swagger).

---

If you want, I can:
- Add a one-page `CONTRIBUTING.md` and `.env.example` with the recommended env variables,
- Generate a minimal Postman collection or OpenAPI spec for the API,
- Or commit these docs to the repository.
