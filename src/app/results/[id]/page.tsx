"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Brain, Speech } from "lucide-react"

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const assessmentId = resolvedParams.id
  
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulating API call for demo
    setTimeout(() => {
      setResults({
        child_name: "Aryan",
        overall_risk_level: "Moderate",
        eye_contact_score: 45, // out of 100
        facial_expression_score: 60,
        speech_delay_risk: "High",
        recommended_path: "Early Intervention Speech Therapy",
        language: "en"
      })
      setLoading(false)
    }, 1500)
  }, [assessmentId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-600">Generating Personalized Report...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-0 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Assessment Results</h1>
          <p className="text-xl text-gray-600">
            Thank you for completing the session. Here is our initial analysis for {results.child_name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                <Activity className="w-5 h-5" /> Overall Finding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{results.overall_risk_level} Risk</div>
              <p className="text-sm mt-2 text-blue-800">Further evaluation recommended</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-700 text-lg">
                <Brain className="w-5 h-5" /> Social/Behavioral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{results.eye_contact_score}/100</div>
              <p className="text-sm mt-2 text-purple-800">Eye contact & Engagement score</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-orange-700 text-lg">
                <Speech className="w-5 h-5" /> Speech & Comm.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{results.speech_delay_risk}</div>
              <p className="text-sm mt-2 text-orange-800">Speech delay indicators</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-gray-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Recommended Path</CardTitle>
            <CardDescription className="text-base">Based on the AI observation and your inputs, here is the best way forward.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <h3 className="font-bold text-green-900 text-lg mb-2">Primary Recommendation</h3>
              <p className="text-green-800 text-lg">{results.recommended_path}</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold mb-4 text-gray-800">Next Steps (Coming Soon)</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">1</div>
                  Connect with top 3 verified Speech Therapists in your area
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
                  Access our home-based parent training modules
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">3</div>
                  Explore communication aids in our store
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button onClick={() => router.push('/')} size="lg" className="h-14 px-8 text-lg rounded-full">
            Return to Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
