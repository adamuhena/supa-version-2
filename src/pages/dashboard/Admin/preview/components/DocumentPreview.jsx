"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { documentService } from "../Api/api"
import PageLayout from "../../../../../components/layout/pageLayout"
import { DotPattern } from "../../../../../components/ui/dot-pattern"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react"

function DocumentPreview() {
  const { id } = useParams()
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch document
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        const data = await documentService.getById(id)
        setDocument(data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to load document",
          variant: "destructive",
        })
        navigate("/documents")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [id, navigate, toast])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Helper function for class names
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ")
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

  if (!document) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Document Not Available</h2>
            <p className="text-muted-foreground mt-2">Document not found or unavailable</p>
            <Button className="mt-4" onClick={() => navigate("/documents")}>
              Back to Documents
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
                onClick={() => navigate("/documents")}
                className="mr-2 text-white hover:text-white/80"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Documents
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

export default DocumentPreview

