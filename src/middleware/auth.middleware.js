import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload?.role === "admin") {
      const adminAuth = await prisma.adminAuth.findUnique({
        where: { id: 1 },
        select: { tokenVersion: true }
      });

      if (!adminAuth || payload.tokenVersion !== adminAuth.tokenVersion) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
