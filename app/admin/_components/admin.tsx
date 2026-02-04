'use client'

import React, { useEffect, useState } from 'react'
import { HeaderTitle } from '@/data/admin'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
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
import { Badge } from '@/components/ui/badge'
import { Webdata } from '@/data/data'
import { toast } from 'sonner'
import { Shield, ShieldAlert, User as UserIcon, Loader2, Filter, Save as SaveIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface UserData {
  id: string
  name: string
  email: string
  empId: string
  process: string
  phone: string | null
  role: string
  questionCount: number
}

function AdminPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [totalProcessQuestions, setTotalProcessQuestions] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filterProcess, setFilterProcess] = useState<string>('all')
  const [tempQuestionCounts, setTempQuestionCounts] = useState<Record<string, number>>({})

  const processes = Object.keys(Webdata.processes)

  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
        router.push('/')
        return
      }
      fetchUsers()
    }
  }, [user, authLoading, router])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('Failed to fetch users')
      const data = await res.json()
      setUsers(data.users)
      setTotalProcessQuestions(data.processQuestionCounts || {})
      
      // Initialize temp counts
      const counts: Record<string, number> = {}
      data.users.forEach((u: UserData) => {
        counts[u.id] = u.questionCount
      })
      setTempQuestionCounts(counts)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateUser = async (targetUserId: string, updates: { role?: string, process?: string, questionCount?: number }) => {
    setUpdatingId(targetUserId)
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, ...updates }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update user')
      }

      toast.success('User updated successfully')
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = filterProcess === 'all' 
    ? users 
    : users.filter(u => u.process === filterProcess)

  if (authLoading || loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN')) {
    return null // Will redirect in useEffect
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN'

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {isSuperAdmin ? <ShieldAlert className="text-red-500" /> : <Shield className="text-blue-500" />}
           {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
          </h1>
          {/* <p className="text-muted-foreground mt-1">
            {isSuperAdmin 
              ? 'Super Admin Access: Manage all users and roles across all processes.' 
              : `Admin Access: Manage users for the ${user.process} process.`}
          </p> */}
         

        </div>
        <div> <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          Welcome, <p className='text-xl'>{user.name}</p>
        </h1>
        <p className="text-muted-foreground mt-1">
          {isSuperAdmin 
            ? ' Manage all users and roles across all processes.' 
            : ` Manage users for the  ${user.process.toUpperCase()} process.`}
        </p></div>
        
        {isSuperAdmin && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterProcess} onValueChange={setFilterProcess}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Process" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Processes</SelectItem>
                {processes.map(p => (
                  <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{HeaderTitle[1]}</TableHead>
              <TableHead>{HeaderTitle[2]}</TableHead>
              <TableHead>{HeaderTitle[3]}</TableHead>
              <TableHead>{HeaderTitle[4]}</TableHead>
              <TableHead>{HeaderTitle[5]}</TableHead>
              <TableHead>Questions To Answer</TableHead>
              <TableHead>Total Questions</TableHead>
              <TableHead>{HeaderTitle[6]}</TableHead>
              <TableHead>{HeaderTitle[7]}</TableHead>
              {isSuperAdmin && <TableHead className="text-right">{HeaderTitle[8]}</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 9 : 8} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((u, index) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{u.email}</TableCell>
                  <TableCell>{u.empId}</TableCell>
                  <TableCell>
                    {isSuperAdmin ? (
                      <Select 
                        disabled={updatingId === u.id}
                        value={u.process} 
                        onValueChange={(val) => handleUpdateUser(u.id, { process: val })}
                      >
                        <SelectTrigger className="h-8 w-[140px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {processes.map(p => (
                            <SelectItem key={p} value={p}>{p.toUpperCase()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline">{u.process.toUpperCase()}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="h-8 w-16 text-xs"
                        value={tempQuestionCounts[u.id] !== undefined ? tempQuestionCounts[u.id] : u.questionCount}
                        onChange={(e) => {
                          const val = e.target.value === '' ? 0 : parseInt(e.target.value)
                          if (!isNaN(val)) {
                            setTempQuestionCounts(prev => ({ ...prev, [u.id]: val }))
                          }
                        }}
                      />
                      {tempQuestionCounts[u.id] !== undefined && tempQuestionCounts[u.id] !== u.questionCount && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-50"
                          disabled={updatingId === u.id}
                          onClick={() => handleUpdateUser(u.id, { questionCount: tempQuestionCounts[u.id] })}
                        >
                          <SaveIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {totalProcessQuestions[u.process.toUpperCase().replace(/\s+/g, '')] || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.phone || 'N/A'}</TableCell>
                  <TableCell>
                    {isSuperAdmin ? (
                      <Select 
                        disabled={updatingId === u.id}
                        value={u.role} 
                        onValueChange={(val) => handleUpdateUser(u.id, { role: val })}
                      >
                        <SelectTrigger className="h-8 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">USER</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="SUPER_ADMIN">SUPER ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={u.role === 'ADMIN' ? 'bg-blue-500' : u.role === 'SUPER_ADMIN' ? 'bg-red-500' : 'bg-gray-500'}>
                        {u.role}
                      </Badge>
                    )}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="text-right">
                      {updatingId === u.id && <Loader2 className="h-4 w-4 animate-spin inline ml-2" />}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminPage
