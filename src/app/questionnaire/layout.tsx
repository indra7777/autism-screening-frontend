import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questionnaire | AI Autism Screening',
  description: 'Provide information about your child to begin the AI autism assessment.',
}

export default function QuestionnaireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
