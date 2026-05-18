import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessment Results | AI Autism Screening',
  description: 'View the results of your child\'s AI autism and speech delay assessment.',
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
