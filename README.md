# Backend (Node.js + Express + Prisma)

Production-ready API for certificate management and verification.

## Stack
- Node.js (ESM)
- Express 4
- Prisma ORM
- PostgreSQL (Neon/Render-compatible)
- JWT auth
- Cloudinary uploads

## Scripts
- `npm run dev`: run API locally
- `npm start`: production start
- `npm run prisma:generate`: generate Prisma client
- `npm run prisma:migrate`: run dev migrations
- `npm run db:seed`: seed database

## Environment Variables
Create `backend/.env` from `backend/.env.example`.

Required:
- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `APP_BASE_URL` (frontend origin used in password reset link)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CORS_ORIGIN` (comma-separated allowed frontend origins)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER` (optional, default `CertificateIssued`)
- `PORT` (Render injects this automatically)

Value guide:
- `DATABASE_URL`: full Postgres connection string for your backend DB.
- `JWT_SECRET`: long random secret (at least 32 chars).
- `ADMIN_PASSWORD`: initial admin password used only to bootstrap first hash.
- `ADMIN_EMAIL`: admin inbox that receives reset links.
- `APP_BASE_URL`: frontend origin where `/reset-password` route exists.
- `RESEND_API_KEY`: key from Resend dashboard (format `re_...`).
- `RESEND_FROM_EMAIL`: verified sender in Resend (same verified domain).
- `CORS_ORIGIN`: include all frontend origins that call backend APIs.

Local example (`backend/.env`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
JWT_SECRET="replace_with_a_very_long_random_secret_32_plus_chars"
ADMIN_PASSWORD="replace_with_strong_admin_password"
ADMIN_EMAIL="admin@yourdomain.com"
APP_BASE_URL="http://localhost:5173"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="no-reply@yourdomain.com"
CORS_ORIGIN="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_FOLDER="CertificateIssued"
PORT=5000
```

Production example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require"
JWT_SECRET="replace_with_a_very_long_random_secret_32_plus_chars"
ADMIN_PASSWORD="replace_with_strong_admin_password"
ADMIN_EMAIL="admin@yourdomain.com"
APP_BASE_URL="https://your-frontend-domain.com"
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"
RESEND_FROM_EMAIL="no-reply@yourdomain.com"
CORS_ORIGIN="https://your-frontend-domain.com,https://www.your-frontend-domain.com"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
CLOUDINARY_FOLDER="CertificateIssued"
PORT=5000
```

## Local Development
1. Install dependencies:
```bash
npm install
```
2. Configure `backend/.env`.
3. Apply migrations:
```bash
npx prisma migrate deploy
```
4. Generate Prisma client:
```bash
npx prisma generate
```
5. Run API:
```bash
npm run dev
```

## Deploy to Render
1. Push backend code to GitHub.
2. Create a new **Web Service** in Render.
3. Set:
   - Root directory: `backend` (if monorepo)
   - Runtime: `Node`
   - Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start command: `npm start`
4. Add all required environment variables from above.
5. Deploy.

## Production Hardening Included
- CORS allowlist via `CORS_ORIGIN` in `src/server.js`
- `express.json({ limit: "1mb" })`
- `x-powered-by` disabled
- upload constraints (size/type filter) in `src/routes/upload.routes.js`

## API Notes
- Health endpoint: `GET /health`
- Public endpoints under `/api`
- Auth endpoints:
  - `POST /api/auth/login`
  - `POST /api/auth/forgot-password` (no body)
  - `POST /api/auth/reset-password` (`token`, `newPassword`)
- Admin endpoints under:
  - `/api/admin/certificates`
  - `/api/admin/students`
- Upload endpoint:
  - `POST /api/uploads` (auth required)

## Cloudinary Upload Naming
Uploads are named using context fields:
- `studentName`
- `courseName`
- `assetType`

Pattern:
`student_course_assetType_timestamp`

## Troubleshooting
- `Invalid token`: user session expired; login again.
- Prisma `EPERM` on Windows during `prisma generate`:
  - stop running backend process first, then rerun command.
- CORS errors in browser:
  - ensure frontend domain is included in `CORS_ORIGIN`.
