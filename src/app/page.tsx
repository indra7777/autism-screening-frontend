import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl text-blue-900 mb-6">
        Understand Your Child Better
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        The first AI-powered platform in India that screens your child's autism and speech delay risk, connects you to therapists, and empowers you to support them at home—in your own language.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/questionnaire">
          <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all">
            Start Free AI Assessment
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full font-semibold">
          Learn More
        </Button>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI Avatar Assessor</h3>
          <p className="text-gray-600">Friendly, game-like video call that analyzes behavior and speech naturally without stressing your child.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🌍</div>
          <h3 className="text-xl font-bold mb-2">In Your Language</h3>
          <p className="text-gray-600">Fully supported in Hindi, Telugu, Tamil, and more, ensuring your child is assessed in their mother tongue.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🏥</div>
          <h3 className="text-xl font-bold mb-2">Expert Connections</h3>
          <p className="text-gray-600">Get immediately connected to top-rated therapists and special schools near you based on the diagnosis.</p>
        </div>
      </div>
    </div>
  )
}
