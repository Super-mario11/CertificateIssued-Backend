import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

function getAdminHash() {
  const password = process.env.ADMIN_PASSWORD || "admin123";
  return bcrypt.hashSync(password, 10);
}

export async function login(req, res, next) {
  try {
    const { password } = req.body;
    const ok = await bcrypt.compare(password, getAdminHash());
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
}
