import { Router } from 'express';
import { login, protectedRoute, register } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRoutes= Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/protected', authMiddleware, protectedRoute);
export default authRoutes
