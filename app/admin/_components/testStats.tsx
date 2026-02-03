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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle2, XCircle as XCircleIcon, ScrollText } from 'lucide-react'

interface AnswerDetail {
  questionId: string
  question: string
  selectedAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

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
  answers: any // Json field
  user: {
    name: string
    email: string
    empId: string
  }
}

function TestStats() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/test-results')
      if (!res.ok) throw new Error('Failed to fetch test results')
      const data = await res.json()
      setResults(data.results || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (result: TestResult) => {
    setSelectedResult(result)
    setIsDetailsOpen(true)
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(r)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <ScrollText className="h-6 w-6 text-primary" />
              Assessment Details
            </DialogTitle>
            <DialogDescription>
              Detailed question-by-question breakdown for {selectedResult?.user.name} ({selectedResult?.process})
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Score</p>
                  <p className="text-lg font-bold">{selectedResult.correctAnswers} / {selectedResult.totalQuestions}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Percentage</p>
                  <p className="text-lg font-bold">{selectedResult.percentage.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Status</p>
                  <Badge className={selectedResult.status === 'PASSED' ? 'bg-green-500' : 'bg-red-500'}>
                    {selectedResult.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Date</p>
                  <p className="text-sm font-medium">{format(new Date(selectedResult.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg border-b pb-2">Questions & Answers</h3>
                {Array.isArray(selectedResult.answers) ? (
                  selectedResult.answers.map((ans: any, idx: number) => (
                    <div key={idx} className={`p-4 rounded-xl border-l-4 ${ans.isCorrect ? 'bg-emerald-50/50 border-emerald-500' : 'bg-red-50/50 border-red-500'}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-slate-800">Q{idx + 1}: {ans.question}</p>
                        {ans.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-600 shrink-0" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-3">
                        <div className="p-2 rounded bg-white/50 border">
                          <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tight">User Answer</p>
                          <p className={ans.isCorrect ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>{ans.selectedAnswer || 'Not answered'}</p>
                        </div>
                        {!ans.isCorrect && (
                          <div className="p-2 rounded bg-white/50 border">
                            <p className="text-xs text-muted-foreground font-bold mb-1 uppercase tracking-tight">Correct Answer</p>
                            <p className="text-emerald-700 font-bold">{ans.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-lg">
                    <p className="text-muted-foreground italic">No detailed answer breakdown available for this result.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TestStats
