import { getCurrentUser } from '@/lib/auth-server';
import { Webdata } from '@/data/data';
import DemoClient from './DemoClient';
import { redirect } from 'next/navigation';

export default async function DemoPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  const activeData = (user.process && (Webdata.processes as any)[user.process]) 
    || Webdata.processes.visionPlus;

  return <DemoClient projects={activeData.projects || []} />;
}
