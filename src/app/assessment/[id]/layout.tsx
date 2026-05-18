import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Video Assessment | AI Autism Screening',
  description: 'AI Avatar video call session for autism and speech delay screening.',
}

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
