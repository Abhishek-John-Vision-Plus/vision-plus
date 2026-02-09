'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Webdata } from '@/data/data'
import { toast } from 'sonner'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Save, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loading from '@/app/_components/Loading'

interface TopicRule {
  id?: string
  process: string
  category: string
  minAttempt: number
  maxDisplay: number
  requiredAttempt: number | null
  order: number
}

interface TopicRulesManagerClientProps {
  initialRules: TopicRule[]
  initialProcess: string
  user: {
    process: string
  }
}

export default function TopicRulesManagerClient({ initialRules, initialProcess, user }: TopicRulesManagerClientProps) {
  const [selectedProcess, setSelectedProcess] = useState<string>(initialProcess || user.process || '')
  const [rules, setRules] = useState<TopicRule[]>(initialRules)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const processes = Object.keys(Webdata.processes)

  const fetchRules = useCallback(async (processToFetch: string) => {
    if (!processToFetch) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/topic-rules?process=${processToFetch}`)
      if (!res.ok) throw new Error('Failed to fetch rules')
      const data = await res.json()
      
      const questionsRes = await fetch(`/api/mcqs?process=${processToFetch}`)
      const questionsData = await questionsRes.json()
      const categories = Array.from(new Set(questionsData.mcqs.map((q: any) => q.category || 'General'))) as string[]
      
      const existingRules = data.rules as TopicRule[]
      const mergedRules = categories.map(cat => {
        const existing = existingRules.find(r => r.category === cat)
        return existing || {
          process: processToFetch,
          category: cat,
          minAttempt: 0,
          maxDisplay: 0,
          requiredAttempt: null,
          order: 0
        }
      })
      
      mergedRules.sort((a, b) => (a.order || 0) - (b.order || 0))
      setRules(mergedRules)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load rules')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProcess && selectedProcess !== initialProcess) {
      fetchRules(selectedProcess)
    }
  }, [selectedProcess, initialProcess, fetchRules])

  const handleUpdateRule = (index: number, field: keyof TopicRule, value: any) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }

  const saveRules = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/topic-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ process: selectedProcess, rules }),
      })

      if (!res.ok) throw new Error('Failed to save rules')
      toast.success('Rules saved successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save rules')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic & Module Rules</CardTitle>
        <CardDescription>
          Configure how many questions from each topic should be displayed and answered.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select value={selectedProcess} onValueChange={setSelectedProcess}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select Process" />
            </SelectTrigger>
            <SelectContent>
              {processes.map(p => (
                <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => fetchRules(selectedProcess)} disabled={loading || !selectedProcess}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <Loading message="Fetching topic rules..." fullScreen={false} />
        ) : selectedProcess ? (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Sequence</TableHead>
                    <TableHead>Topic / Module</TableHead>
                    <TableHead>Max Questions to Show</TableHead>
                    <TableHead>Min Questions to Answer</TableHead>
                    <TableHead>Required Answer Count (Exact)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        No categories found for this process. Add questions with categories first.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rules.map((rule, index) => (
                      <TableRow key={rule.category}>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={rule.order} 
                            onChange={(e) => handleUpdateRule(index, 'order', parseInt(e.target.value))}
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{rule.category}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={rule.maxDisplay} 
                            onChange={(e) => handleUpdateRule(index, 'maxDisplay', parseInt(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            value={rule.minAttempt} 
                            onChange={(e) => handleUpdateRule(index, 'minAttempt', parseInt(e.target.value))}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="number" 
                              placeholder="Optional"
                              value={rule.requiredAttempt ?? ''} 
                              onChange={(e) => handleUpdateRule(index, 'requiredAttempt', e.target.value ? parseInt(e.target.value) : null)}
                              className="w-24"
                            />
                            <span className="text-xs text-muted-foreground">If set, user must answer exactly this many.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveRules} disabled={saving || rules.length === 0} className="flex items-center gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Rules
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-md border-dashed">
            Select a process to manage topic rules.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
