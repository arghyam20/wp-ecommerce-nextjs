import type { Metadata } from 'next';
import SignupClient from './signup-client';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a free MyStore account to start shopping, track orders, and enjoy exclusive deals.',
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupClient />;
}
