'use client'

import { ProtectedRoute } from '@/components/auth'

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute allowedRoles={['COUNSELLOR']}>{children}</ProtectedRoute>
}
