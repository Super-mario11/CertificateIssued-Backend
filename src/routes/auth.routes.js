import { Router } from "express";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post(
  "/login",
  [body("password").isLength({ min: 6 })],
  validate,
  login
);

export default router;
