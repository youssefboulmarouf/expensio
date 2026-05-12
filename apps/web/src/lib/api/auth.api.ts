import { apiRequest } from './client';
import type { RegisterRequest, RegisterResponse, CheckEmailResponse } from '@expensio/shared';

type ApiSuccess<T> = { success: true; data: T };

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await apiRequest<ApiSuccess<RegisterResponse>>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function checkEmail(email: string): Promise<CheckEmailResponse> {
  const res = await apiRequest<ApiSuccess<CheckEmailResponse>>(
    `/auth/check-email?email=${encodeURIComponent(email)}`,
  );
  return res.data;
}
