export const securityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
};

export const sanitizeBody = (req, res, next) => {
  const clean = (value) => {
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !key.startsWith("$") && !key.includes("."))
          .map(([key, nested]) => [key, clean(nested)])
      );
    }
    if (typeof value === "string") return value.trim();
    return value;
  };

  if (req.body) req.body = clean(req.body);
  next();
};
