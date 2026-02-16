const buckets = new Map();

export function createRateLimit({ windowMs, max, message, statusCode = 429 }) {
  return function rateLimit(req, res, next) {
    const now = Date.now();
    const key = `${req.path}:${req.ip}`;
    const item = buckets.get(key);

    if (!item || item.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (item.count >= max) {
      return res.status(statusCode).json({ message });
    }

    item.count += 1;
    return next();
  };
}
