import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import { getOrCreateAdminAuth } from "../services/adminAuth.service.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

const RESET_TOKEN_TTL_MINUTES = 15;
const RESET_TOKEN_TTL_MS = RESET_TOKEN_TTL_MINUTES * 60 * 1000;
const FORGOT_SUCCESS_MESSAGE =
  "If the account exists, a reset link has been sent.";

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getResetPasswordUrl(rawToken) {
  const baseUrl = (process.env.APP_BASE_URL || "http://localhost:5173").replace(
    /\/+$/,
    ""
  );
  return `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;
}

export async function login(req, res, next) {
  try {
    const { password } = req.body;
    const adminAuth = await getOrCreateAdminAuth();
    const ok = await bcrypt.compare(password, adminAuth.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { role: "admin", tokenVersion: adminAuth.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}

export async function forgotPassword(req, res) {
  try {
    const adminAuth = await getOrCreateAdminAuth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      throw new Error("Missing ADMIN_EMAIL environment variable.");
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashResetToken(rawToken);
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.adminAuth.update({
      where: { id: adminAuth.id },
      data: { resetTokenHash, resetTokenExpiry }
    });

    const resetUrl = getResetPasswordUrl(rawToken);
    await sendPasswordResetEmail({
      to: adminEmail,
      resetUrl,
      expiryMinutes: RESET_TOKEN_TTL_MINUTES
    });
  } catch (error) {
    // Always return a generic success response to avoid leaking internals.
    // eslint-disable-next-line no-console
    console.error("Forgot password error:", error?.message || error);
  }

  return res.json({ message: FORGOT_SUCCESS_MESSAGE });
}

export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    const adminAuth = await getOrCreateAdminAuth();
    const receivedTokenHash = hashResetToken(token);

    const isTokenMissing = !adminAuth.resetTokenHash || !adminAuth.resetTokenExpiry;
    const isExpired = adminAuth.resetTokenExpiry && adminAuth.resetTokenExpiry < new Date();
    const isMismatch = adminAuth.resetTokenHash !== receivedTokenHash;

    if (isTokenMissing || isExpired || isMismatch) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.adminAuth.update({
      where: { id: adminAuth.id },
      data: {
        passwordHash,
        resetTokenHash: null,
        resetTokenExpiry: null,
        tokenVersion: { increment: 1 }
      }
    });

    return res.json({ message: "Password reset successful." });
  } catch (err) {
    return next(err);
  }
}
