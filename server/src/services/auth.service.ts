import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import { CONFLICT, UNAUTHORIZED } from '../constants/http';
import appAssert from '../utlis/appAssert';
interface CreateAccountParams {
  email: string;
  password: string;
}

interface LoginParams {
  email: string;
  password: string;
}

export const createAccount = async (data: CreateAccountParams) => {
  const existingUser = await User.exists({ email: data.email });
  appAssert(!existingUser, CONFLICT, 'Email already in use');

  const user = await User.create({
    email: data.email,
    password: data.password,
  });
  const userId = user._id;
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }: LoginParams) => {
  const user = await User.findOne({ email });
  appAssert(user, UNAUTHORIZED, 'Email is incorrect');

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, 'Password is incorrect');

  const userId = user._id;
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );
  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const verifyToken = async (token: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};