import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request to include `user`
export interface AuthRequest extends Request {
  user?: IUser | null;
}

// Protect middleware (authentication)
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload & { id: string };

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Admin middleware (authorization)
export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && (req.user as any).isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
