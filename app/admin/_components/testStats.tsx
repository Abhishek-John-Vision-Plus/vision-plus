'use client'

import React, { useEffect, useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, TrendingUp, CheckCircle, XCircle, Award } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface TestResult {
  id: string
  userId: string
  process: string
  score: number
  correctAnswers: number
  totalQuestions: number
  percentage: number
  status: string
  createdAt: string
  user: {
    name: string
    email: string
    empId: string
  }
}

function TestStats() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/test-results')
      if (!res.ok) throw new Error('Failed to fetch test results')
      const data = await res.json()
      setResults(data.results)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Calculate summary stats
  const totalTests = results.length
  const passCount = results.filter(r => r.status === 'PASSED').length
  const avgScore = totalTests > 0 
    ? (results.reduce((acc, curr) => acc + curr.percentage, 0) / totalTests).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTests > 0 ? ((passCount / totalTests) * 100).toFixed(1) : 0}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Percentage</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Process</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No assessment results found.
                </TableCell>
              </TableRow>
            ) : (
              results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{r.user.name}</span>
                      <span className="text-xs text-muted-foreground">{r.user.empId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.process.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.correctAnswers} / {r.totalQuestions}
                  </TableCell>
                  <TableCell className="font-semibold">
                    {r.percentage.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <Badge className={r.status === 'PASSED' ? 'bg-green-500' : 'bg-red-500'}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(r.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TestStats
