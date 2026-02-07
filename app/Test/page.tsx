'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function TestRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Questionnaire')
  }, [router])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
      <Image src="/Sandy Loading.gif" alt="logo" width={100} height={100} />
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-slate-500 font-medium">Redirecting to Questionnaire...</p>
    </div>
  )
}
