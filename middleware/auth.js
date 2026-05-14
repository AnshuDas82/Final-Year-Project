import jwt from "jsonwebtoken"

// We should ideally use process.env.JWT_SECRET, but we'll use a fallback for now
const JWT_SECRET = process.env.JWT_SECRET || "smartedu_super_secret_key"

export const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization

    if (!token) {
      return res.status(403).json({ message: "Access Denied. No token provided." })
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft()
    }

    const verified = jwt.verify(token, JWT_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).json({ message: "Invalid Token." })
  }
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied. You don't have permission." })
    }
    next()
  }
}
