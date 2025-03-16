"use client"

import { useState, useEffect } from "react"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react"
import axios from "axios"

// API base URL - would come from environment variables in production
import { API_BASE_URL } from "@/config/env";

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

export default function PDFPreviewPage() {
  const [years, setYears] = useState<string[]>([])
  const [states, setStates] = useState<string[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch available years and states on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearsResponse, statesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/years`),
          axios.get(`${API_BASE_URL}/public/states`),
        ])

        setYears(yearsResponse.data)
        setStates(statesResponse.data)

        // Set default year to the first one if available
        if (yearsResponse.data.length > 0) {
          setSelectedYear(yearsResponse.data[0])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch documents when year or state changes
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedYear) return

      try {
        setIsLoading(true)

        let url = `${API_BASE_URL}/public/documents?year=${selectedYear}`
        if (selectedState) {
          url += `&state=${selectedState}`
        }

        const response = await axios.get(url)
        setDocuments(response.data)
      } catch (error) {
        console.error("Error fetching documents:", error)
        setDocuments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDocuments()
  }, [selectedYear, selectedState])

  const handleStateChange = (state: string) => {
    setSelectedState(state)
    setSelectedDocument(null)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
    setSelectedDocument(null)
  }

  const viewDocument = (doc: Document) => {
    setSelectedDocument(doc)
  }

  const closeDocumentViewer = () => {
    setSelectedDocument(null)
    setIsFullscreen(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
      <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

      <section className="bg-slate-900 pt-32 pb-10">
        <div className="container mx-auto px-4">
          <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
            Document Library
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nigerian State Documents</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our collection of documents organized by year and state. Select a year and state to view available
              documents.
            </p>
          </div>

          {!selectedDocument ? (
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Year:</label>
                  <Select
                    value={selectedYear}
                    onValueChange={handleYearChange}
                    disabled={isLoading || years.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Select State:</label>
                  <Select value={selectedState} onValueChange={handleStateChange} disabled={isLoading || !selectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading documents...</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    {selectedState
                      ? `Documents for ${selectedState} - ${selectedYear}`
                      : `All Documents for ${selectedYear}`}
                  </h2>

                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {documents.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div
                            className="aspect-[3/4] relative bg-muted cursor-pointer"
                            onClick={() => viewDocument(doc)}
                          >
                            <img
                              src={
                                `${API_BASE_URL.replace("/api", "")}${doc.thumbnailUrl}` ||
                                "/placeholder.svg?height=200&width=150"
                              }
                              alt={doc.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Button variant="secondary">
                                <Eye className="mr-2 h-4 w-4" />
                                View Document
                              </Button>
                            </div>
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                          </CardHeader>
                          <CardFooter className="p-4 pt-0">
                            <Button className="w-full" onClick={() => viewDocument(doc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Read Document
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted p-8 rounded-lg text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
                      <p className="text-muted-foreground">
                        {selectedState
                          ? `There are no documents available for ${selectedState} in ${selectedYear}.`
                          : `There are no documents available for ${selectedYear}.`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "bg-white rounded-lg shadow-xl transition-all duration-300",
                isFullscreen ? "fixed inset-0 z-50" : "relative",
              )}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <Button variant="ghost" size="sm" onClick={closeDocumentViewer} className="mr-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <h3 className="font-semibold truncate">{selectedDocument.title}</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
              <div className={cn("w-full bg-gray-100", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[70vh]")}>
                <iframe
                  src={`${API_BASE_URL.replace("/api", "")}${selectedDocument.fileUrl}`}
                  className="w-full h-full"
                  title={selectedDocument.title}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




// "use client"

// import PageLayout from "@/components/layout/pageLayout"
// import type React from "react"
// import { useNavigate, Link } from "react-router-dom";
// import { useState, useEffect } from "react"
// import { DotPattern } from "@/components/ui/dot-pattern"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { FileText, Upload, Trash2, Edit, Eye, LogOut, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// import axios from "axios"
// import { API_BASE_URL } from "@/config/env";

// // Types
// interface Document {
//   id: string
//   title: string
//   year: string
//   state: string
//   fileUrl: string
//   thumbnailUrl: string
//   createdAt: string
//   updatedAt: string
// }

// interface User {
//   id: string
//   email: string
//   name: string
// }

// // Nigerian states array
// const nigerianStates = [
//   "Abia",
//   "Adamawa",
//   "Akwa Ibom",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Cross River",
//   "Delta",
//   "Ebonyi",
//   "Edo",
//   "Ekiti",
//   "Enugu",
//   "Abuja",
//   "Gombe",
//   "Imo",
//   "Jigawa",
//   "Kaduna",
//   "Kano",
//   "Katsina",
//   "Kebbi",
//   "Kogi",
//   "Kwara",
//   "Lagos",
//   "Nasarawa",
//   "Niger",
//   "Ogun",
//   "Ondo",
//   "Osun",
//   "Oyo",
//   "Plateau",
//   "Rivers",
//   "Sokoto",
//   "Taraba",
//   "Yobe",
//   "Zamfara",
// ]

// // Years array (current year and 10 years into the future)
// const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString())

// // API base URL - would come from environment variables in production


// // Axios instance with auth header
// const api = axios.create({
//   baseURL: API_BASE_URL,
// })

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// export default function DocPreview() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [user, setUser] = useState<User | null>(null)
//   const [documents, setDocuments] = useState<Document[]>([])
//   const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
//   const [selectedYear, setSelectedYear] = useState<string>("")
//   const [selectedState, setSelectedState] = useState<string>("")
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [isUploading, setIsUploading] = useState(false)
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
//   const [currentDocument, setCurrentDocument] = useState<Document | null>(null)
//   const navigate = useNavigate();

//   // Form states
//   const [formData, setFormData] = useState({
//     title: "",
//     year: "",
//     state: "",
//     file: null as File | null,
//     thumbnail: null as File | null,
//   })

//   const { toast } = useToast()


//   // Check authentication status on component mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem("token")

//       if (!token) {
//         setIsAuthenticated(false)
//         setIsLoading(false)
//         return
//       }

//       try {
//         const response = await api.get("/auth/me")
//         setUser(response.data.user)
//         setIsAuthenticated(true)
//         fetchDocuments()
//       } catch (error) {
//         console.error("Authentication error:", error)
//         localStorage.removeItem("token")
//         setIsAuthenticated(false)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     checkAuth()
//   }, [])

//   // Fetch documents from API
//   const fetchDocuments = async () => {
//     try {
//       const response = await api.get("/documents")
//       setDocuments(response.data)
//       setFilteredDocuments(response.data)
//     } catch (error) {
//       console.error("Error fetching documents:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch documents",
//         variant: "destructive",
//       })
//     }
//   }

//   // Handle login
//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const email = (e.currentTarget as HTMLFormElement).email.value
//     const password = (e.currentTarget as HTMLFormElement).password.value

//     try {
//       setIsLoading(true)
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, {
//         email,
//         password,
//       })

//       localStorage.setItem("token", response.data.token)
//       setUser(response.data.user)
//       setIsAuthenticated(true)
//       fetchDocuments()

//       toast({
//         title: "Success",
//         description: "Logged in successfully",
//       })
//     } catch (error) {
//       console.error("Login error:", error)
//       toast({
//         title: "Login Failed",
//         description: "Invalid email or password",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     setIsAuthenticated(false)
//     setUser(null)
    
//     navigate("/");

//     toast({
//       title: "Logged out",
//       description: "You have been logged out successfully",
//     })
//   }

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData({
//       ...formData,
//       [name]: value,
//     })
//   }

//   // Handle file input changes
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const { name } = e.target
//       setFormData({
//         ...formData,
//         [name]: e.target.files[0],
//       })
//     }
//   }

//   // Handle document upload
//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.title || !formData.year || !formData.state || !formData.file) {
//       toast({
//         title: "Missing Fields",
//         description: "Please fill all required fields",
//         variant: "destructive",
//       })
//       return
//     }

//     const formPayload = new FormData()
//     formPayload.append("title", formData.title)
//     formPayload.append("year", formData.year)
//     formPayload.append("state", formData.state)
//     if (formData.file) formPayload.append("file", formData.file)
//     if (formData.thumbnail) formPayload.append("thumbnail", formData.thumbnail)

//     try {
//       setIsUploading(true)

//       if (currentDocument) {
//         // Update existing document
//         await api.put(`/documents/${currentDocument.id}`, formPayload)
//         toast({
//           title: "Success",
//           description: "Document updated successfully",
//         })
//       } else {
//         // Create new document
//         await api.post("/documents", formPayload)
//         toast({
//           title: "Success",
//           description: "Document uploaded successfully",
//         })
//       }

//       // Reset form and refresh documents
//       setFormData({
//         title: "",
//         year: "",
//         state: "",
//         file: null,
//         thumbnail: null,
//       })
//       setCurrentDocument(null)
//       setIsEditDialogOpen(false)
//       fetchDocuments()
//     } catch (error) {
//       console.error("Upload error:", error)
//       toast({
//         title: "Upload Failed",
//         description: "Failed to upload document",
//         variant: "destructive",
//       })
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   // Handle document deletion
//   const handleDelete = async (id: string) => {
//     if (window.confirm("Are you sure you want to delete this document?")) {
//       try {
//         await api.delete(`/documents/${id}`)
//         toast({
//           title: "Success",
//           description: "Document deleted successfully",
//         })
//         fetchDocuments()
//       } catch (error) {
//         console.error("Delete error:", error)
//         toast({
//           title: "Delete Failed",
//           description: "Failed to delete document",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   // Handle edit document
//   const handleEdit = (document: Document) => {
//     setCurrentDocument(document)
//     setFormData({
//       title: document.title,
//       year: document.year,
//       state: document.state,
//       file: null,
//       thumbnail: null,
//     })
//     setIsEditDialogOpen(true)
//   }

//   // Filter documents based on selected year, state, and search query
//   useEffect(() => {
//     let filtered = [...documents]

//     if (selectedYear) {
//       filtered = filtered.filter((doc) => doc.year === selectedYear)
//     }

//     if (selectedState) {
//       filtered = filtered.filter((doc) => doc.state === selectedState)
//     }

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (doc) => doc.title.toLowerCase().includes(query) || doc.state.toLowerCase().includes(query),
//       )
//     }

//     setFilteredDocuments(filtered)
//   }, [selectedYear, selectedState, searchQuery, documents])

//   // Reset form when dialog closes
//   const handleDialogClose = () => {
//     if (!isUploading) {
//       setFormData({
//         title: "",
//         year: "",
//         state: "",
//         file: null,
//         thumbnail: null,
//       })
//       setCurrentDocument(null)
//     }
//   }

//   if (isLoading) {
//     return (
//       <PageLayout>
//         <div className="flex items-center justify-center min-h-screen">
//           <div className="flex flex-col items-center gap-2">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             <p className="text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </PageLayout>
//     )
//   }

//   if (!isAuthenticated) {
//     return (
//       <PageLayout>
//         <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//           <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//           <div className="flex items-center justify-center min-h-screen px-4">
//             <Card className="w-full max-w-md">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
//                 <CardDescription>Sign in to access the document management dashboard</CardDescription>
//               </CardHeader>
//               <form onSubmit={handleLogin}>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <label htmlFor="email" className="text-sm font-medium">
//                       Email
//                     </label>
//                     <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="password" className="text-sm font-medium">
//                       Password
//                     </label>
//                     <Input id="password" name="password" type="password" required />
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button type="submit" className="w-full" disabled={isLoading}>
//                     {isLoading ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Signing in...
//                       </>
//                     ) : (
//                       "Sign In"
//                     )}
//                   </Button>
//                 </CardFooter>
//               </form>
//             </Card>
//           </div>
//         </div>
//       </PageLayout>
//     )
//   }

//   return (
//     <PageLayout>
//       <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//         <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//         <section className="bg-slate-900 pt-32 pb-10">
//           <div className="container mx-auto px-4 flex justify-between items-center">
//             <div className="inline-block rounded-lg bg-muted px-6 md:px-16 py-5 text-2xl md:text-3xl font-bold text-emerald-600">
//               Admin Dashboard
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-white hidden md:inline-block">Welcome, {user?.name || "Admin"}</span>
//               <Button variant="outline" onClick={handleLogout}>
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <Tabs defaultValue="documents" className="w-full">
//             <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
//               <TabsTrigger value="documents">Documents</TabsTrigger>
//               <TabsTrigger value="upload">Upload</TabsTrigger>
//             </TabsList>

//             <TabsContent value="documents" className="mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Document Management</CardTitle>
//                   <CardDescription>View, edit, and delete documents in the system</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col md:flex-row gap-4 mb-6">
//                     <div className="flex-1">
//                       <Input
//                         placeholder="Search documents..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="w-full"
//                       />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                       <Select value={selectedYear} onValueChange={setSelectedYear}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Filter by year" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Years</SelectItem>
//                           {years.map((year) => (
//                             <SelectItem key={year} value={year}>
//                               {year}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>

//                       <Select value={selectedState} onValueChange={setSelectedState}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Filter by state" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All States</SelectItem>
//                           {nigerianStates.map((state) => (
//                             <SelectItem key={state} value={state}>
//                               {state}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   {filteredDocuments.length > 0 ? (
//                     <div className="rounded-md border">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Title</TableHead>
//                             <TableHead>Year</TableHead>
//                             <TableHead>State</TableHead>
//                             <TableHead>Date Added</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {filteredDocuments.map((doc) => (
//                             <TableRow key={doc.id}>
//                               <TableCell className="font-medium">{doc.title}</TableCell>
//                               <TableCell>{doc.year}</TableCell>
//                               <TableCell>{doc.state}</TableCell>
//                               <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
//                               <TableCell className="text-right">
//                                 <div className="flex justify-end gap-2">
//                                   <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => window.open(`/admin/preview/${doc.id}`, "_blank")}
//                                   >
//                                     <Eye className="h-4 w-4" />
//                                     <span className="sr-only">View</span>
//                                   </Button>
//                                   <Button variant="outline" size="sm" onClick={() => handleEdit(doc)}>
//                                     <Edit className="h-4 w-4" />
//                                     <span className="sr-only">Edit</span>
//                                   </Button>
//                                   <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
//                                     <Trash2 className="h-4 w-4" />
//                                     <span className="sr-only">Delete</span>
//                                   </Button>
//                                 </div>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col items-center justify-center py-12 text-center">
//                       <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//                       <h3 className="text-lg font-medium">No documents found</h3>
//                       <p className="text-muted-foreground mt-2">
//                         {documents.length === 0
//                           ? "Start by uploading your first document"
//                           : "Try adjusting your filters"}
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="upload" className="mt-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Upload New Document</CardTitle>
//                   <CardDescription>Add a new document to the system</CardDescription>
//                 </CardHeader>
//                 <form onSubmit={handleUpload}>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <label htmlFor="title" className="text-sm font-medium">
//                         Document Title
//                       </label>
//                       <Input
//                         id="title"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         placeholder="Enter document title"
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <label htmlFor="year" className="text-sm font-medium">
//                           Year
//                         </label>
//                         <Select
//                           value={formData.year}
//                           onValueChange={(value) => setFormData({ ...formData, year: value })}
//                         >
//                           <SelectTrigger id="year">
//                             <SelectValue placeholder="Select year" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {years.map((year) => (
//                               <SelectItem key={year} value={year}>
//                                 {year}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <label htmlFor="state" className="text-sm font-medium">
//                           State
//                         </label>
//                         <Select
//                           value={formData.state}
//                           onValueChange={(value) => setFormData({ ...formData, state: value })}
//                         >
//                           <SelectTrigger id="state">
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {nigerianStates.map((state) => (
//                               <SelectItem key={state} value={state}>
//                                 {state}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label htmlFor="file" className="text-sm font-medium">
//                         PDF Document
//                       </label>
//                       <div className="flex items-center justify-center w-full">
//                         <label
//                           htmlFor="file"
//                           className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                         >
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <Upload className="w-8 h-8 mb-3 text-gray-500" />
//                             <p className="mb-2 text-sm text-gray-500">
//                               <span className="font-semibold">Click to upload</span> or drag and drop
//                             </p>
//                             <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
//                           </div>
//                           <Input
//                             id="file"
//                             name="file"
//                             type="file"
//                             accept=".pdf"
//                             className="hidden"
//                             onChange={handleFileChange}
//                             required={!currentDocument}
//                           />
//                         </label>
//                       </div>
//                       {formData.file && (
//                         <p className="text-sm text-muted-foreground mt-2">Selected file: {formData.file.name}</p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <label htmlFor="thumbnail" className="text-sm font-medium">
//                         Thumbnail Image (Optional)
//                       </label>
//                       <div className="flex items-center justify-center w-full">
//                         <label
//                           htmlFor="thumbnail"
//                           className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                         >
//                           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                             <Upload className="w-8 h-8 mb-3 text-gray-500" />
//                             <p className="mb-2 text-sm text-gray-500">
//                               <span className="font-semibold">Click to upload</span> or drag and drop
//                             </p>
//                             <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
//                           </div>
//                           <Input
//                             id="thumbnail"
//                             name="thumbnail"
//                             type="file"
//                             accept="image/png, image/jpeg, image/webp"
//                             className="hidden"
//                             onChange={handleFileChange}
//                           />
//                         </label>
//                       </div>
//                       {formData.thumbnail && (
//                         <p className="text-sm text-muted-foreground mt-2">
//                           Selected thumbnail: {formData.thumbnail.name}
//                         </p>
//                       )}
//                     </div>
//                   </CardContent>
//                   <CardFooter>
//                     <Button type="submit" className="w-full" disabled={isUploading}>
//                       {isUploading ? (
//                         <>
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                           Uploading...
//                         </>
//                       ) : (
//                         <>
//                           <Upload className="mr-2 h-4 w-4" />
//                           {currentDocument ? "Update Document" : "Upload Document"}
//                         </>
//                       )}
//                     </Button>
//                   </CardFooter>
//                 </form>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>

//       <Dialog
//         open={isEditDialogOpen}
//         onOpenChange={(open) => {
//           setIsEditDialogOpen(open)
//           if (!open) handleDialogClose()
//         }}
//       >
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Edit Document</DialogTitle>
//             <DialogDescription>Make changes to the document information</DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleUpload}>
//             <div className="grid gap-4 py-4">
//               <div className="space-y-2">
//                 <label htmlFor="edit-title" className="text-sm font-medium">
//                   Document Title
//                 </label>
//                 <Input
//                   id="edit-title"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleInputChange}
//                   placeholder="Enter document title"
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label htmlFor="edit-year" className="text-sm font-medium">
//                     Year
//                   </label>
//                   <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
//                     <SelectTrigger id="edit-year">
//                       <SelectValue placeholder="Select year" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {years.map((year) => (
//                         <SelectItem key={year} value={year}>
//                           {year}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="edit-state" className="text-sm font-medium">
//                     State
//                   </label>
//                   <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
//                     <SelectTrigger id="edit-state">
//                       <SelectValue placeholder="Select state" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {nigerianStates.map((state) => (
//                         <SelectItem key={state} value={state}>
//                           {state}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="edit-file" className="text-sm font-medium">
//                   PDF Document (Leave empty to keep current file)
//                 </label>
//                 <Input id="edit-file" name="file" type="file" accept=".pdf" onChange={handleFileChange} />
//                 {formData.file && (
//                   <p className="text-sm text-muted-foreground mt-2">Selected file: {formData.file.name}</p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="edit-thumbnail" className="text-sm font-medium">
//                   Thumbnail Image (Leave empty to keep current thumbnail)
//                 </label>
//                 <Input
//                   id="edit-thumbnail"
//                   name="thumbnail"
//                   type="file"
//                   accept="image/png, image/jpeg, image/webp"
//                   onChange={handleFileChange}
//                 />
//                 {formData.thumbnail && (
//                   <p className="text-sm text-muted-foreground mt-2">Selected thumbnail: {formData.thumbnail.name}</p>
//                 )}
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" disabled={isUploading}>
//                 {isUploading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Save Changes"
//                 )}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </PageLayout>
//   )
// }

