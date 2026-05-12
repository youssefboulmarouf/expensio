import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold text-white">Create your account</h1>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-white underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </>
  );
}
