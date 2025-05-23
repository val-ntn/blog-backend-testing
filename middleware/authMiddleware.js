// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // read token from cookie named "token"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // verify token and get payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
