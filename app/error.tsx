'use client'

import { useEffect } from 'react'
import ErrorDisplay from './_components/ErrorDisplay'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <ErrorDisplay 
      error={error} 
      reset={reset} 
      message="An unexpected error occurred. Our team has been notified and we are working to fix it."
    />
  )
}
