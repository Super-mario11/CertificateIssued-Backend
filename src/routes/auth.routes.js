import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { createRateLimit } from "../middleware/rateLimit.middleware.js";
import {
  forgotPassword,
  login,
  resetPassword
} from "../controllers/auth.controller.js";

const router = Router();
const forgotPasswordRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "If the account exists, a reset link has been sent.",
  statusCode: 200
});
const resetPasswordRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many reset attempts. Please try again later."
});

router.post(
  "/login",
  [body("password").isLength({ min: 6 })],
  validate,
  login
);
router.post("/forgot-password", forgotPasswordRateLimit, forgotPassword);
router.post(
  "/reset-password",
  resetPasswordRateLimit,
  [
    body("token").isString().isLength({ min: 32 }),
    body("newPassword").isLength({ min: 6 })
  ],
  validate,
  resetPassword
);

export default router;
