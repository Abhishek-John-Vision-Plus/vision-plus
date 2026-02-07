import { getCurrentUser } from '@/lib/auth-server'
import { redirect } from 'next/navigation'
import AdminPage from './_components/admin'
import TestStats from './_components/testStats'
import UploadMCQPage from './upload-mcq/page'
import ManageQuestionsPage from './manage-questions/page'
import TopicRulesManager from './_components/topicRulesManager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, FileText, Upload, Settings, ListChecks } from 'lucide-react'

export default async function Page() {
  const user = await getCurrentUser()

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    redirect('/')
  }

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
          <AdminPage />
        </TabsContent>
        
        <TabsContent value="stats" className="border-none p-0 outline-none">
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Assessment Statistics</h2>
              <p className="text-muted-foreground">
                View performance metrics and test results for your assigned process.
              </p>
            </div>
            <TestStats />
          </div>
        </TabsContent>

        <TabsContent value="rules" className="border-none p-0 outline-none">
          <TopicRulesManager />
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

