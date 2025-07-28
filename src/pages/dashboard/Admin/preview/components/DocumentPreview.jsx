"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { documentService } from "../Api/api"
import ProtectedRoute from "@/components/ProtectedRoute"
import DashboardPage from "@/components/layout/DashboardLayout"
import PageLayout from "../../../../../components/layout/pageLayout"
import { DotPattern } from "../../../../../components/ui/dot-pattern"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft, Maximize, Minimize, Loader2, FileWarning } from "lucide-react"
import DocumentLayout from "../components/document-layout"
import useLogout from "@/pages/loginPage/logout"
import { LogOut, UserCircle } from "lucide-react"
import { API_BASE_URL } from "@/config/env";

function DocumentPreview() {
  const params = useParams()
  const { _id } = params
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const logout = useLogout()

  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true)
        const data = await documentService.getById(_id)
        setDocument(data)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "Failed to load document",
          variant: "destructive",
        })
        if (error.code !== "ERR_CANCELED") {
          navigate("/documents")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocument()
  }, [_id, navigate, toast])

  // Helper function for class names
  const cn = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  const handlePdfError = () => {
    setPdfError(true)
    console.error("PDF failed to load")
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
    )
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <ProtectedRoute href="/admin/dashboard">
        <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
          <div className="container mx-auto p-6">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/biodata")}>
                  <UserCircle className="mr-2 h-4 w-4" /> Update Profile
                </Button>

                <Button variant="destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </div>
            </header>
          </div>
            <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
              <DotPattern
                width={10}
                height={10}
                cx={1}
                cy={1}
                cr={1}
                className={cn("fill-neutral-400/40 opacity-15")}
              />

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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFullscreen}
                      className="text-white hover:text-white/80"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className={cn("w-full bg-gray-100", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[80vh]")}>
                  {pdfError ? (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <FileWarning className="h-16 w-16 text-amber-500 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Unable to display PDF</h3>
                      <p className="text-muted-foreground mb-4">
                        The PDF could not be loaded due to security restrictions or an invalid URL.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(document.fileUrl, "_blank")}
                        className="mt-2"
                      >
                        Open in New Tab
                      </Button>
                    </div>
                  ) : (
                    <object
                      data={document.fileUrl}
                      type="application/pdf"
                      className="w-full h-full"
                      onError={handlePdfError}
                    >
                      <iframe
                        //src={`https://docs.google.com/viewer?url=${encodeURIComponent(`${API_BASE_URL.replace("/api", "")}${document.fileUrl}`)}&embedded=true`}
                        src={`${API_BASE_URL.replace("/api", "")}${document.fileUrl}`}
                        className="w-full h-full"
                        title={document.title}
                        frameBorder="0"
                        allowFullScreen
                        loading="lazy"
                      />
                    </object>
                  )}
                </div>
              </div>
            </div>
        </div>
    </ProtectedRoute>
  )
}

export default DocumentPreview

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { documentService } from "../Api/api"
// import ProtectedRoute from "@/components/ProtectedRoute"
// import DashboardPage from "@/components/layout/DashboardLayout"
// import PageLayout from "../../../../../components/layout/pageLayout"
// import { DotPattern } from "../../../../../components/ui/dot-pattern"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { ChevronLeft, Maximize, Minimize, Loader2, Download, LogOut, UserCircle } from "lucide-react"
// import DocumentLayout from "../components/document-layout"
// import useLogout from "@/pages/loginPage/logout"
// import { pdfjs, Document, Page } from "react-pdf"
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"
// import "react-pdf/dist/esm/Page/TextLayer.css"

// // ✅ Initialize PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// function DocumentPreview() {
//   const params = useParams()
//   const { _id } = params // get the document ID from URL params
//   const navigate = useNavigate()
//   const { toast } = useToast()
//   const logout = useLogout()

//   const [document, setDocument] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [numPages, setNumPages] = useState(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [scale, setScale] = useState(1.0)

//   // Helper function for joining classes conditionally
//   const cn = (...classes) => classes.filter(Boolean).join(" ")

//   // ✅ Fetch document by ID on mount
//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         setIsLoading(true)
//         const data = await documentService.getById(_id)
//         setDocument(data)
//       } catch (error) {
//         console.error("Error:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load document",
//           variant: "destructive",
//         })
//         if (error.code !== "ERR_CANCELED") {
//           navigate("/documents")
//         }
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDocument()
//   }, [_id, navigate, toast])

//   // ✅ PDF.js document load success handler
//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   // ✅ Pagination Handlers
//   const goToPrevPage = () => {
//     setPageNumber((prev) => Math.max(prev - 1, 1))
//   }

//   const goToNextPage = () => {
//     setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
//   }

//   // ✅ Zoom handlers
//   const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5))
//   const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5))

//   // ✅ Fullscreen handler
//   const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

//   // ✅ Loader while fetching document
//   // if (isLoading) {
//   //   return (
//   //     <PageLayout>
//   //       <div className="flex items-center justify-center min-h-screen">
//   //         <div className="flex flex-col items-center gap-2">
//   //           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//   //           <p className="text-muted-foreground">Loading document...</p>
//   //         </div>
//   //       </div>
//   //     </PageLayout>
//   //   )
//   // }

//   // ✅ If document is missing or fileUrl not found
//   if (!document || !document.fileUrl) {
//     return (
//       <ProtectedRoute href="/admin/dashboard">
//       <DashboardPage title="Document Dashboard">
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="text-center">
//             <h2 className="text-2xl font-bold">Document Not Available</h2>
//             <p className="text-muted-foreground mt-2">Document not found or unavailable</p>
//             <Button className="mt-4" onClick={() => navigate("/documents")}>
//               Back to Documents
//             </Button>
//           </div>
//         </div>
//         </DashboardPage>
//         </ProtectedRoute>
//     )
//   }

//   return (
//     <ProtectedRoute href="/admin/dashboard">
//       <DashboardPage title="Document Dashboard">
//         <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//           <div className="container mx-auto p-6">
//             <header className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl font-bold">Dashboard</h1>
//               <div className="flex gap-2">
//                 <Button variant="outline" onClick={() => navigate("/biodata")}>
//                   <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//                 </Button>

//                 <Button variant="destructive" onClick={logout}>
//                   <LogOut className="mr-2 h-4 w-4" /> Logout
//                 </Button>
//               </div>
//             </header>
//           </div>

//           {/* ✅ Document Viewer Layout */}
//           <DocumentLayout>
//             <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//               <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//               <div
//                 className={cn(
//                   "bg-white transition-all duration-300",
//                   isFullscreen ? "fixed inset-0 z-50" : "container mx-auto px-4 py-12",
//                 )}
//               >
//                 {/* ✅ Top Header */}
//                 <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-lg">
//                   <div className="flex items-center">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => navigate("/documents")}
//                       className="mr-2 text-white hover:text-white/80"
//                     >
//                       <ChevronLeft className="h-4 w-4 mr-1" />
//                       Back to Documents
//                     </Button>
//                     <h3 className="font-semibold truncate">{document.title}</h3>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <div className="text-sm hidden md:block">
//                       {document.state}, {document.year}
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={toggleFullscreen}
//                       className="text-white hover:text-white/80"
//                     >
//                       {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 {/* ✅ PDF Viewer Container */}
//                 <div
//                   className={cn(
//                     "w-full bg-gray-100",
//                     isFullscreen ? "h-[calc(100vh-64px)]" : "h-[80vh]",
//                     "overflow-auto",
//                   )}
//                 >
//                   {/* ✅ Controls */}
//                   <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-white border-b">
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
//                         Previous
//                       </Button>
//                       <span className="text-sm">
//                         Page {pageNumber} of {numPages || "?"}
//                       </span>
//                       <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
//                         Next
//                       </Button>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" onClick={zoomOut}>
//                         -
//                       </Button>
//                       <span className="text-sm">{Math.round(scale * 100)}%</span>
//                       <Button variant="outline" size="sm" onClick={zoomIn}>
//                         +
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => window.open(document.fileUrl, "_blank")}>
//                         <Download className="h-4 w-4 mr-1" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>

//                   {/* ✅ PDF Document Display */}
//                   <div className="flex justify-center p-4">
//                     <Document
//                       file={document.fileUrl}
//                       onLoadSuccess={onDocumentLoadSuccess}
//                       onLoadError={(error) => {
//                         console.error("Error loading PDF:", error)
//                         toast({
//                           title: "Error",
//                           description: "Failed to load PDF document",
//                           variant: "destructive",
//                         })
//                       }}
//                       loading={
//                         <div className="flex justify-center items-center h-64">
//                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                         </div>
//                       }
//                     >
//                       <Page
//                         pageNumber={pageNumber}
//                         scale={scale}
//                         renderTextLayer={true}
//                         renderAnnotationLayer={true}
//                       />
//                     </Document>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </DocumentLayout>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   )
// }

// export default DocumentPreview


// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { documentService } from "../Api/api"
// import ProtectedRoute from "@/components/ProtectedRoute"
// import DashboardPage from "@/components/layout/DashboardLayout"
// import PageLayout from "../../../../../components/layout/pageLayout"
// import { DotPattern } from "../../../../../components/ui/dot-pattern"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { ChevronLeft, Maximize, Minimize, Loader2, Download } from "lucide-react"
// import DocumentLayout from "../components/document-layout"
// import useLogout from "@/pages/loginPage/logout"
// import { LogOut, UserCircle } from "lucide-react"
// import { pdfjs, Document, Page } from "react-pdf"
// import "react-pdf/dist/esm/Page/AnnotationLayer.css"
// import "react-pdf/dist/esm/Page/TextLayer.css"

// // Initialize PDF.js worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// function DocumentPreview() {
//   const params = useParams()
//   const { _id } = params
//   const [document, setDocument] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [numPages, setNumPages] = useState(null)
//   const [pageNumber, setPageNumber] = useState(1)
//   const [scale, setScale] = useState(1.0)
//   const logout = useLogout()

//   const { toast } = useToast()
//   const navigate = useNavigate()

//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         setIsLoading(true)
//         const data = await documentService.getById(_id)
//         setDocument(data)
//       } catch (error) {
//         console.error("Error:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load document",
//           variant: "destructive",
//         })
//         if (error.code !== "ERR_CANCELED") {
//           navigate("/documents")
//         }
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDocument()
//   }, [_id, navigate, toast])

//   // Helper function for class names
//   const cn = (...classes) => {
//     return classes.filter(Boolean).join(" ")
//   }

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages)
//   }

//   const goToPrevPage = () => {
//     setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1))
//   }

//   const goToNextPage = () => {
//     setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages || 1))
//   }

//   const zoomIn = () => {
//     setScale((prevScale) => Math.min(prevScale + 0.2, 2.5))
//   }

//   const zoomOut = () => {
//     setScale((prevScale) => Math.max(prevScale - 0.2, 0.5))
//   }

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

//   if (isLoading) {
//     return (
//       <PageLayout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <p className="text-muted-foreground">Loading document...</p>
//           </div>
//         </div>
//       </PageLayout>
//     )
//   }

//   if (!document || !document.fileUrl) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold">Document Not Available</h2>
//           <p className="text-muted-foreground mt-2">Document not found or unavailable</p>
//           <Button className="mt-4" onClick={() => navigate("/documents")}>
//             Back to Documents
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <ProtectedRoute href="/admin/dashboard">
//       <DashboardPage title="Document Dashboard">
//         <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//           <div className="container mx-auto p-6">
//             <header className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl font-bold">Dashboard</h1>
//               <div className="flex gap-2">
//                 <Button variant="outline" onClick={() => navigate("/biodata")}>
//                   <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//                 </Button>

//                 <Button variant="destructive" onClick={logout}>
//                   <LogOut className="mr-2 h-4 w-4" /> Logout
//                 </Button>
//               </div>
//             </header>
//           </div>
//           <DocumentLayout>
//             <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//               <DotPattern
//                 width={10}
//                 height={10}
//                 cx={1}
//                 cy={1}
//                 cr={1}
//                 className={cn("fill-neutral-400/40 opacity-15")}
//               />

//               <div
//                 className={cn(
//                   "bg-white transition-all duration-300",
//                   isFullscreen ? "fixed inset-0 z-50" : "container mx-auto px-4 py-12",
//                 )}
//               >
//                 <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-lg">
//                   <div className="flex items-center">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => navigate("/documents")}
//                       className="mr-2 text-white hover:text-white/80"
//                     >
//                       <ChevronLeft className="h-4 w-4 mr-1" />
//                       Back to Documents
//                     </Button>
//                     <h3 className="font-semibold truncate">{document.title}</h3>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="text-sm hidden md:block">
//                       {document.state}, {document.year}
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={toggleFullscreen}
//                       className="text-white hover:text-white/80"
//                     >
//                       {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>

//                 <div
//                   className={cn(
//                     "w-full bg-gray-100",
//                     isFullscreen ? "h-[calc(100vh-64px)]" : "h-[80vh]",
//                     "overflow-auto",
//                   )}
//                 >
//                   <div className="sticky top-0 z-10 flex justify-between items-center p-2 bg-white border-b">
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
//                         Previous
//                       </Button>
//                       <span className="text-sm">
//                         Page {pageNumber} of {numPages || "?"}
//                       </span>
//                       <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= numPages}>
//                         Next
//                       </Button>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm" onClick={zoomOut}>
//                         -
//                       </Button>
//                       <span className="text-sm">{Math.round(scale * 100)}%</span>
//                       <Button variant="outline" size="sm" onClick={zoomIn}>
//                         +
//                       </Button>
//                       <Button variant="outline" size="sm" onClick={() => window.open(document.fileUrl, "_blank")}>
//                         <Download className="h-4 w-4 mr-1" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex justify-center p-4">
//                     <Document
//                       file={document.fileUrl}
//                       onLoadSuccess={onDocumentLoadSuccess}
//                       onLoadError={(error) => {
//                         console.error("Error loading PDF:", error)
//                         toast({
//                           title: "Error",
//                           description: "Failed to load PDF document",
//                           variant: "destructive",
//                         })
//                       }}
//                       loading={
//                         <div className="flex justify-center items-center h-64">
//                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                         </div>
//                       }
//                     >
//                       <Page pageNumber={pageNumber} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} />
//                     </Document>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </DocumentLayout>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   )
// }

// export default DocumentPreview





// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { documentService } from "../Api/api"
// import ProtectedRoute from "@/components/ProtectedRoute"
// import DashboardPage from "@/components/layout/DashboardLayout"
// import PageLayout from "../../../../../components/layout/pageLayout"
// import { DotPattern } from "../../../../../components/ui/dot-pattern"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react"
// import DocumentLayout from "../components/document-layout"
// import useLogout from '@/pages/loginPage/logout';
// import { LogOut, UserCircle } from "lucide-react";
// import { API_BASE_URL } from "@/config/env";

// const baseUrl = API_BASE_URL; // Replace with your server's base URL ${baseUrl}
// // const absoluteFileUrl = `${document.fileUrl}`;

// function DocumentPreview() {
//     const params = useParams();
//     console.log('useParams() result:', params); // Add this line
//     const { _id } = params; // or const {_id} = params;
//     console.log('Document ID from params:', _id);
//   const [document, setDocument] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const logout = useLogout()

//   const { toast } = useToast()
//   const navigate = useNavigate()
//   console.log('Document ID from params:', _id, document); // Add this line


//   useEffect(() => {
//     const fetchDocument = async () => {
//       try {
//         setIsLoading(true);
//         const data = await documentService.getById(_id);
//         setDocument(data);
//       } catch (error) {
//         console.error("Error:", error);
//         toast({
//           title: "Error",
//           description: "Failed to load document",
//           variant: "destructive",
//         });
//         if (!error.code === "ERR_CANCELED") {
//           navigate("/documents");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchDocument();
//   }, [_id, navigate, toast]);
  

//   // const [document, setDocument] = useState(null)
//   console.log('Document Data:', _id, document); // Add this line
//   // Dynamically set the absoluteFileUrl
//   const absoluteFileUrl = document ? `${document.fileUrl}` : '';
  



//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

//   // Helper function for class names
//   const cn = (...classes) => {
//     return classes.filter(Boolean).join(" ")
//   }

//   if (isLoading) {
//     return (
//       <PageLayout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <p className="text-muted-foreground">Loading document...</p>
//           </div>
//         </div>
//       </PageLayout>
//     )
//   }

 
//       if (!document || !document.fileUrl) {
//         return (
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold">Document Not Available</h2>
//               <p className="text-muted-foreground mt-2">Document not found or unavailable</p>
//               <Button className="mt-4" onClick={() => navigate("/documents")}>
//                 Back to Documents
//               </Button>
//             </div>
//           </div>
//         );
//       }
      
  

//   return (
//     <ProtectedRoute href='/admin/dashboard'>
//     <DashboardPage title="Document Dashboard">
//     <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">

// <div className="container mx-auto p-6">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => navigate('/biodata')}>
//               <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//             </Button>
            
//             <Button variant="destructive" onClick={logout}>
//               <LogOut className="mr-2 h-4 w-4" /> Logout
//             </Button>
//           </div>
//         </header>
//         </div>
//       <DocumentLayout>
//         <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//           <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//           <div
//             className={cn(
//               "bg-white transition-all duration-300",
//               isFullscreen ? "fixed inset-0 z-50" : "container mx-auto px-4 py-12",
//             )}
//           >
//             <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-lg">
//               <div className="flex items-center">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => navigate("/documents")}
//                   className="mr-2 text-white hover:text-white/80"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Back to Documents
//                 </Button>
//                 <h3 className="font-semibold truncate">{document.title}</h3>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="text-sm hidden md:block">
//                   {document.state}, {document.year}
//                 </div>
//                 <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:text-white/80">
//                   {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <div className={cn("w-full bg-gray-100", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[80vh]")}>
//               {/* <iframe src={document.fileUrl} className="w-full h-full" title={document.title} /> */}
//               {/* <iframe src={absoluteFileUrl} className="w-full h-full" title={document.title} /> */}
//               <iframe
//   src={absoluteFileUrl}
//   className="w-full h-96"
//   title={document.title}
//   frameBorder="0"
//   allow="fullscreen" // Allow fullscreen if needed
//   loading="lazy"
//   sandbox="allow-same-origin allow-scripts allow-popups allow-forms" // If sandboxed, make sure it's not restrictive
// />


//             </div>
//           </div>
//         </div>
//       </DocumentLayout>
//       </div>
//     </DashboardPage>
//     </ProtectedRoute>
//   )
// }

// export default DocumentPreview

