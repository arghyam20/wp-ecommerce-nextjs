import type { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your MyStore account to manage orders, track shipments, and more.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
