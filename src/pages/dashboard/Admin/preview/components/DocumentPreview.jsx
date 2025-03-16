
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { documentService } from "../Api/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardPage from "@/components/layout/DashboardLayout"
import PageLayout from "../../../../../components/layout/pageLayout"
import { DotPattern } from "../../../../../components/ui/dot-pattern"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react"
import DocumentLayout from "../components/document-layout"
import useLogout from '@/pages/loginPage/logout';
import { LogOut, UserCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/env";

const baseUrl = API_BASE_URL; // Replace with your server's base URL ${baseUrl}
// const absoluteFileUrl = `${document.fileUrl}`;

function DocumentPreview() {
    const params = useParams();
    console.log('useParams() result:', params); // Add this line
    const { _id } = params; // or const {_id} = params;
    console.log('Document ID from params:', _id);
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const logout = useLogout()

  const { toast } = useToast()
  const navigate = useNavigate()
  console.log('Document ID from params:', _id, document); // Add this line


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        const data = await documentService.getById(_id);
        setDocument(data);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to load document",
          variant: "destructive",
        });
        if (!error.code === "ERR_CANCELED") {
          navigate("/documents");
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDocument();
  }, [_id, navigate, toast]);
  

  // const [document, setDocument] = useState(null)
  console.log('Document Data:', _id, document); // Add this line
  // Dynamically set the absoluteFileUrl
  const absoluteFileUrl = document ? `${document.fileUrl}` : '';
  



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

 
      if (!document || !document.fileUrl) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Document Not Available</h2>
              <p className="text-muted-foreground mt-2">Document not found or unavailable</p>
              <Button className="mt-4" onClick={() => navigate("/documents")}>
                Back to Documents
              </Button>
            </div>
          </div>
        );
      }
      
  

  return (
    <ProtectedRoute href='/admin/dashboard'>
    <DashboardPage title="Document Dashboard">
    <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">

<div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/biodata')}>
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
            </Button>
            
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>
        </div>
      <DocumentLayout>
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
              {/* <iframe src={document.fileUrl} className="w-full h-full" title={document.title} /> */}
              {/* <iframe src={absoluteFileUrl} className="w-full h-full" title={document.title} /> */}
              <iframe 
  src={absoluteFileUrl} 
  className="w-full h-full" 
  title={document.title} 
  frameBorder="0" 
  allowFullScreen
  loading="lazy"
/>

            </div>
          </div>
        </div>
      </DocumentLayout>
      </div>
    </DashboardPage>
    </ProtectedRoute>
  )
}

export default DocumentPreview

