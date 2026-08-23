import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

// User must be authenticated
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  // Check for token in cookies OR Authorization header
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      req.user = await User.findById(decoded.userId).select('-password').populate('role');
      
      if (!req.user) {
         res.status(401).json({ message: 'Not authorized, user not found' });
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

// Check if user has specific permissions
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Basic role check (Super Admin, Admin, etc.)
    if (req.user && req.user.role && roles.includes(req.user.role.name)) {
      next();
    } else {
      res.status(403).json({ message: `Role (${req.user?.role?.name || 'Unknown'}) is not authorized to access this route` });
    }
  };
};

// Check for specific granular permissions
export const hasPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role && req.user.role.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ message: `Missing required permission: ${permission}` });
    }
  };
}
