import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED } from '../constants/http';
import { verifyToken } from '../services/auth.service';
import appAssert from '../utlis/appAssert';
interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  appAssert(authHeader && authHeader.startsWith('Bearer '), UNAUTHORIZED, 'No token provided');

  const token = authHeader.split(' ')[1];
  try {
    const userId = await verifyToken(token); 
    appAssert(userId, UNAUTHORIZED, 'Invalid token');
    req.userId = userId;
    next();
  } catch (error) {
    console.error('[Auth Error]', error);
    res.status(UNAUTHORIZED).json({ message: 'Invalid or expired token' });
  }
};
