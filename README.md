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

Example:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="strong-secret"
ADMIN_PASSWORD="strong-admin-password"
ADMIN_EMAIL="admin@example.com"
APP_BASE_URL="https://your-frontend.vercel.app"
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="no-reply@yourdomain.com"
CORS_ORIGIN="http://localhost:5173,https://your-frontend.vercel.app"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
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
