import { getCurrentUser } from '@/lib/auth-server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import ManageQuestionsClient from './ManageQuestionsClient';

export default async function ManageQuestionsPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/');
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
  const allowedProcess = user.process || "";

  // Fetch initial questions server-side
  const mcqs = await db.mcq.findMany({
    where: isSuperAdmin ? {} : { process: allowedProcess },
    orderBy: { createdAt: 'desc' },
  });

  const initialQuestions = mcqs.map((q: any) => ({
    ...q,
    options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)) : null
  }));

  return (
    <ManageQuestionsClient 
      initialQuestions={initialQuestions}
      isSuperAdmin={isSuperAdmin}
      allowedProcess={allowedProcess}
      userRole={user.role}
      userProcess={user.process || ""}
    />
  );
}
