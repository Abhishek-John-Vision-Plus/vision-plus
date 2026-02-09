import { getCurrentUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import AdminClient from './_components/AdminClient'
import TestStatsClient from './_components/TestStatsClient'
import UploadMCQPage from './upload-mcq/page'
import ManageQuestionsPage from './manage-questions/page'
import TopicRulesManagerClient from './_components/TopicRulesManagerClient'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, FileText, Upload, Settings, ListChecks } from 'lucide-react'
import { db } from '@/lib/prisma'

export default async function Page() {
  const user = await getCurrentUser()

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/')
  }

  // Fetch users and question counts server-side
  let usersData;
  let processQuestionCounts: Record<string, number> = {};
  let assessmentResults;
  let topicRules: any[] = [];
  const initialProcess = user.process || "";

  if (user.role === "SUPER_ADMIN") {
    usersData = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    const processes = await db.mcq.groupBy({
      by: ['process'],
      _count: { id: true }
    });
    processes.forEach(p => {
      if (p.process) {
        const normalizedKey = p.process.toUpperCase().replace(/\s+/g, '');
        processQuestionCounts[normalizedKey] = (processQuestionCounts[normalizedKey] || 0) + p._count.id;
      }
    });

    assessmentResults = await db.assessmentResult.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            empId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    usersData = await db.user.findMany({
      where: { process: user.process },
      orderBy: { createdAt: "desc" },
    });

    const allCounts = await db.mcq.groupBy({
      by: ['process'],
      _count: { id: true }
    });

    const normalizedRequesterProcess = (user.process || "").toUpperCase().replace(/\s+/g, '');
    let totalCount = 0;
    allCounts.forEach(p => {
      if (p.process && p.process.toUpperCase().replace(/\s+/g, '') === normalizedRequesterProcess) {
        totalCount += p._count.id;
      }
    });
    processQuestionCounts[normalizedRequesterProcess] = totalCount;

    const processKey = user.process?.toLowerCase();
    const possibleNames = [processKey];
    if (processKey === 'aadhar' || processKey === 'aadhaar') {
      possibleNames.push('aadhar', 'aadhaar', 'Aadhar', 'Aadhaar');
    }

    assessmentResults = await db.assessmentResult.findMany({
      where: {
        OR: [
          { process: { in: possibleNames as any } },
          {
            process: {
              contains: user.process || "",
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            empId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Fetch initial topic rules for the user's process
  if (initialProcess) {
    const existingRules = await db.topicRule.findMany({
      where: {
        process: {
          equals: initialProcess,
          mode: 'insensitive'
        }
      },
      orderBy: { order: 'asc' }
    });

    const mcqs = await db.mcq.findMany({
      where: {
        process: {
          equals: initialProcess,
          mode: 'insensitive'
        }
      },
      select: { category: true }
    });
    const categories = Array.from(new Set(mcqs.map(q => q.category || 'General')));

    topicRules = categories.map(cat => {
      const existing = existingRules.find(r => r.category === cat);
      return existing || {
        process: initialProcess,
        category: cat,
        minAttempt: 0,
        maxDisplay: 0,
        requiredAttempt: null,
        order: 0
      };
    });
    topicRules.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  const serializedUsers = usersData.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  const serializedResults = assessmentResults.map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs defaultValue="users" className="space-y-6">
        <div className="flex justify-center border-b pb-4">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Test Results
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Topic Rules
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Bulk Upload
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Questions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" className="border-none p-0 outline-none">
          <AdminClient 
            initialUsers={serializedUsers as any} 
            initialProcessQuestionCounts={processQuestionCounts}
            user={{
              id: user.id,
              name: user.name,
              role: user.role,
              process: user.process || ""
            }}
          />
        </TabsContent>
        
        <TabsContent value="stats" className="border-none p-0 outline-none">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Assessment Statistics</h2>
              <p className="text-muted-foreground">
                View performance metrics and test results for your assigned process.
              </p>
            </div>
            <TestStatsClient initialResults={serializedResults as any} />
          </div>
        </TabsContent>

        <TabsContent value="rules" className="border-none p-0 outline-none">
          <TopicRulesManagerClient 
            initialRules={topicRules as any} 
            initialProcess={initialProcess}
            user={{ process: user.process || "" }}
          />
        </TabsContent>

        <TabsContent value="upload" className="border-none p-0 outline-none">
          <UploadMCQPage />
        </TabsContent>

        <TabsContent value="questions" className="border-none p-0 outline-none">
          <ManageQuestionsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}

