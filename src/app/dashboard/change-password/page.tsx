import type { Metadata } from 'next';
import ChangePasswordClient from './change-password-client';

export const metadata: Metadata = {
  title: 'Change Password',
  description: 'Update your MyStore account password.',
  robots: { index: false, follow: false },
};

export default function ChangePasswordPage() {
  return <ChangePasswordClient />;
}
