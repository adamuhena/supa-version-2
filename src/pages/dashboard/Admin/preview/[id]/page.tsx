"use client"

import PageLayout from "@/components/layout/pageLayout"
import { useState, useEffect } from "react"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react"
import axios from "axios"

// API base URL - would come from environment variables in production
const API_BASE_URL = "http://localhost:5000/api"

// Axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

interface Document {
  id: string
  title: string
  year: string
  state: string
  fileUrl: string
  thumbnailUrl: string
  createdAt: string
  updatedAt: string
}

export default function DocumentPreview({ params }: { params: { id: string } }) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const { toast } = useToast()
  const router = useRouter()

  // Check authentication and fetch document
  useEffect(() => {
    const checkAuthAndFetchDocument = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        toast({
          title: "Authentication Required",
          description: "Please log in to view this document",
          variant: "destructive",
        })
        router.push("/admin")
        return
      }

      try {
        // Verify authentication
        await api.get("/auth/me")
        setIsAuthenticated(true)

        // Fetch document
        const response = await api.get(`/documents/${params.id}`)
        setDocument(response.data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to load document or authentication failed",
          variant: "destructive",
        })
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchDocument()
  }, [params.id, router, toast])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!isAuthenticated || !document) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Document Not Available</h2>
            <p className="text-muted-foreground mt-2">Please log in to view this document</p>
            <Button className="mt-4" onClick={() => router.push("/admin")}>
              Go to Login
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
        <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

        <div
          className={cn(
            "bg-white transition-all duration-300",
            isFullscreen ? "fixed inset-0 z-50" : "container mx-auto px-4 py-12",
          )}
        >
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-lg">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin")}
                className="mr-2 text-white hover:text-white/80"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
              <h3 className="font-semibold truncate">{document.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm hidden md:block">
                {document.state}, {document.year}
              </div>
              <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:text-white/80">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className={cn("w-full bg-gray-100", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[80vh]")}>
            <iframe src={document.fileUrl} className="w-full h-full" title={document.title} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

