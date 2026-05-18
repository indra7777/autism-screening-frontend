"use client"

import { useEffect, useRef, useState, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react"

// A very simple placeholder avatar component
function Avatar(props: any) {
  return (
    <group {...props} dispose={null}>
      {/* Simple robot/avatar placeholder */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.2, 1.6, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.2, 1.6, 0.45]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.5, 32]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>
    </group>
  )
}

export default function AssessmentSession({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Unwrap the promise
  const resolvedParams = use(params)
  const assessmentId = resolvedParams.id
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [assessmentState, setAssessmentState] = useState("Initializing...")
  const [aiMessage, setAiMessage] = useState("Hello! I'm getting ready to play with you.")

  // Initialize Camera & WebSocket
  useEffect(() => {
    let websocket: WebSocket;

    async function setupMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }

        // Connect WebSocket to backend for analysis
        websocket = new WebSocket(`wss://autism-backend-prod.onrender.com/api/ws/analyze/${assessmentId}`)
        
        websocket.onopen = () => {
          console.log("Connected to AI analysis server")
          setAssessmentState("Observing")
          setWs(websocket)
        }

        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.message) {
            setAiMessage(data.message)
          }
          if (data.status === "completed") {
            router.push(`/results/${assessmentId}`)
          }
        }

        websocket.onerror = (error) => {
          console.error("WebSocket Error:", error)
        }

        // Start frame extraction interval
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        
        const intervalId = setInterval(() => {
          if (websocket.readyState === WebSocket.OPEN && videoRef.current && isVideoOn) {
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            ctx?.drawImage(videoRef.current, 0, 0)
            
            // Send frame as base64
            const frameData = canvas.toDataURL("image/jpeg", 0.5)
            websocket.send(JSON.stringify({ 
              type: "video_frame", 
              data: frameData.split(",")[1] 
            }))
          }
        }, 1000) // Send 1 frame per second for analysis

        return () => clearInterval(intervalId)

      } catch (err) {
        console.error("Error accessing media devices.", err)
        setAssessmentState("Camera Access Required")
      }
    }

    setupMedia()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (websocket) {
        websocket.close()
      }
    }
  }, [assessmentId])

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn
      })
      setIsAudioOn(!isAudioOn)
    }
  }

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (ws) {
      ws.close()
    }
    router.push(`/results/${assessmentId}`)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      
      {/* Left side: AI Avatar (Main view) */}
      <div className="flex-1 relative flex flex-col">
        <div className="absolute top-6 left-6 z-10 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI Session: {assessmentState}
          </span>
        </div>

        {/* 3D Canvas for Avatar */}
        <div className="w-full h-full bg-gradient-to-b from-indigo-900 to-gray-900">
          <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="city" />
            <Avatar />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>

        {/* Captions / AI Speech Output */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-8 py-4 rounded-2xl max-w-2xl text-center border border-white/10">
            <p className="text-xl font-medium tracking-wide">{aiMessage}</p>
          </div>
        </div>

        {/* Call Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className={`w-14 h-14 rounded-full border-0 ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={toggleAudio}
          >
            {isAudioOn ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-white" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={`w-14 h-14 rounded-full border-0 ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700"
            onClick={endCall}
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Right side: User camera PIP and info */}
      <div className="w-80 border-l border-white/10 p-4 flex flex-col gap-4 bg-gray-950">
        <Card className="bg-black/40 border-white/10 overflow-hidden aspect-video relative">
          {isVideoOn ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-xs">
            You
          </div>
        </Card>

        <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-4 text-gray-200">Assessment Progress</h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              Establishing Baseline
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
              Evaluating Eye Contact
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-700"></div>
              Speech Pattern Analysis
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-700"></div>
              Generating Report
            </li>
          </ul>
        </div>
      </div>

    </div>
  )
}
