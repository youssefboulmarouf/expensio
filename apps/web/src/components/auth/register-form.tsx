'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { register as registerUser, checkEmail } from '@/lib/api/auth.api';
import { ApiRequestError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type EmailStatus = 'idle' | 'checking' | 'available' | 'taken';

export function RegisterForm() {
  const router = useRouter();
  const [emailStatus, setEmailStatus] = useState<EmailStatus>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const handleEmailBlur = () => {
    const email = watch('email');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailStatus('idle');
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setEmailStatus('checking');
      try {
        const result = await checkEmail(email);
        setEmailStatus(result.available ? 'available' : 'taken');
      } catch {
        setEmailStatus('idle');
      }
    }, 500);
  };

  const onSubmit = async (data: FormData) => {
    if (emailStatus === 'taken') return;
    setServerError(null);

    try {
      await registerUser({ email: data.email, password: data.password, fullName: data.fullName });
      router.push('/login?registered=true');
    } catch (err) {
      if (err instanceof ApiRequestError && err.code === 'EMAIL_ALREADY_EXISTS') {
        setEmailStatus('taken');
      } else {
        setServerError(
          err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        );
      }
    }
  };

  const isChecking = emailStatus === 'checking';
  const canSubmit = !isSubmitting && !isChecking && emailStatus !== 'taken';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          placeholder="Jane Doe"
          disabled={isSubmitting}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Must be at least 2 characters' },
          })}
        />
        {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              onBlur: handleEmailBlur,
            })}
          />
          {isChecking && <Spinner className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />}
          {emailStatus === 'available' && (
            <span className="absolute right-3 top-2.5 text-xs text-green-400">✓ Available</span>
          )}
        </div>
        {emailStatus === 'taken' && <p className="text-xs text-red-400">Email already taken</p>}
        {errors.email && emailStatus === 'idle' && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min 8 characters"
          disabled={isSubmitting}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Must be at least 8 characters' },
          })}
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          disabled={isSubmitting}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (v) => v === watch('password') || 'Passwords do not match',
          })}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={!canSubmit} className="w-full">
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4" />
            Creating account…
          </span>
        ) : (
          'Create account'
        )}
      </Button>
    </form>
  );
}
