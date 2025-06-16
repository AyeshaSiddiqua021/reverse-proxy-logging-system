import { Request, Response } from 'express';
import { CREATED, OK } from '../constants/http';
import { loginSchema, registerSchema } from '../validation-schemas/authSchema';
import { createAccount, loginUser } from '../services/auth.service';
import catchErrors from '../utlis/catchErrors';

export const register = catchErrors(async (req: Request, res: Response) => {
  const request = registerSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await createAccount(request);
  res.status(CREATED).json({
    message: 'User registered successfully',
    user: { id: user._id, email: user.email },
    accessToken,
    refreshToken,
  });
});

export const login = catchErrors(async (req: Request, res: Response) => {
  const request = loginSchema.parse(req.body);
  const { user,accessToken, refreshToken } = await loginUser(request);
  res.status(OK).json({
    message: 'Login successful',
    user,
    accessToken,
    refreshToken,
  });
});

export const protectedRoute = catchErrors(async (req: Request, res: Response) => {
  res.status(OK).json({
    message: 'Access granted to protected route',
    userId: (req as any).userId,
  });
});