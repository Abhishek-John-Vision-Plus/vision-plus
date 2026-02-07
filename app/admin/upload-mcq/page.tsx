import { getCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import UploadMCQClient from './UploadMCQClient';

export default async function UploadMCQPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/');
  }

  return (
    <UploadMCQClient 
      userRole={user.role} 
      userProcess={user.process || ""} 
    />
  );
}
