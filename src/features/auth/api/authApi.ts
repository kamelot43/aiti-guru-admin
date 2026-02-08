import { http } from '@/shared/api/http';
import type { LoginRequest, LoginResponse } from '../model/auth.types';

export const authApi = {
  login: (payload: LoginRequest) =>
    http<LoginResponse>({
      method: 'POST',
      path: '/auth/login',
      body: payload,
    }),
};
