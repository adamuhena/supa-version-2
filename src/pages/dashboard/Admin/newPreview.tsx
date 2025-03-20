
import PageLayout from "@/components/layout/pageLayout"
import { useState } from "react"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, ChevronLeft, Maximize, Minimize } from "lucide-react"

// Sample data structure - in a real app, this would come from an API or database
// const pdfData = {
//   "2024": {
//     Lagos: [
//       {
//         id: 1,
//         title: "Lagos Economic Report 2024",
//         url: "/NEW.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//   },
// }

// // List of Nigerian states
// const nigerianStates = [
//   "All_State",
//   "Abia",
//   "Adamawa",
//   "Akwa_Ibom",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Cross_River",
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

const nigerianStates = [
  // "All_State",
  "Abia",
  "Adamawa",
  "Uyo",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Calabar",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const pdfData = {
  "2024": {},
};

nigerianStates.forEach((state, index) => {
  const formattedStateName = state.replace(/_/g, ' '); // Remove underscores for display
  // const stateLower = state.toLowerCase(); // Lowercase for URL
  const stateUpper = state.toUpperCase(); // For the URL

  pdfData["2024"][state] = [
    {
      id: index + 1,
      title: `${formattedStateName} 2024 SUPA Beneficiaries`,
      url: `SUPA2024/${stateUpper}.pdf`,
      // thumbnail: "/placeholder.svg?height=200&width=150",
    },
  ];
});

console.log(pdfData);

export default function PDFPreviewPage2() {
  const [selectedState, setSelectedState] = useState({
    "2024": "",
    "2025": "",
  })
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const years = Object.keys(pdfData)

  const handleStateChange = (year, state) => {
    setSelectedState((prev) => ({
      ...prev,
      [year]: state,
    }))
    // Reset selected document when changing state
    setSelectedDocument(null)
  }

  const viewDocument = (doc) => {
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
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
        <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

        <section className="bg-slate-900 pt-32 pb-10">
          <div className="container mx-auto px-4">
            <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
              Beneficiaries Library
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                Preview from the list of beneficiaries of our previous SUPA programs.
                <br />
              </p>
            </div>

            {!selectedDocument ? (
              <Tabs defaultValue="2024" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                  {years.map((year) => (
                    <TabsTrigger key={year} value={year}>
                      {year}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {years.map((year) => (
                  <TabsContent key={year} value={year} className="mt-6">
                    <div className="bg-card rounded-lg p-6 shadow-md">
                      {/* <h2 className="text-2xl font-bold mb-4">{year} Beneficiaries</h2> */}

                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Select a State:</label>
                        <Select value={selectedState[year]} onValueChange={(value) => handleStateChange(year, value)}>
                          <SelectTrigger className="w-full max-w-md">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {nigerianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedState[year] && (
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Documents for {selectedState[year]} - {year}
                          </h3>

                          {pdfData[year][selectedState[year]] ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {pdfData[year][selectedState[year]].map((doc) => (
                                <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                  <div
                                    className="relative bg-muted cursor-pointer"
                                    onClick={() => viewDocument(doc)}
                                  >
                                    {/* <img
                                      src={doc.thumbnail || "/placeholder.svg"}
                                      alt={doc.title}
                                      className="w-full h-full object-cover"
                                    /> */}
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
                                      Preview List
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
                                There are no documents available for {selectedState[year]} in {year}.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
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
                    src={selectedDocument.url} 
                    className="w-full h-full" 
                    //className="w-full h-screen sm:h-[70vh]"
                    title={selectedDocument.title} 
                    loading="lazy"/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}


// "use client"

// import PageLayout from "@/components/layout/pageLayout"
// import { useState } from "react"
// import { DotPattern } from "@/components/ui/dot-pattern"
// import { cn } from "@/lib/utils"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { FileText, Eye, ChevronLeft, Maximize, Minimize } from "lucide-react"
// import { Document, Page, pdfjs } from "react-pdf"

// // Load worker
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// const pdfData = {
//   "2024": {
//     All_State: [
//       {
//         id: 1,
//         title: "Lagos Economic Report 2024",
//         url: "/SUPA_2024_BEN.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//   },
//   "2025": {
//     Lagos: [
//       {
//         id: 6,
//         title: "Lagos Projections 2025",
//         url: "/NEW.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//     Abuja: [
//       {
//         id: 7,
//         title: "Abuja Development Plan 2025",
//         url: "/pdfs/abuja-dev-2025.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//   },
// }

// const nigerianStates = [
//   "All_State", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
//   "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Abuja", "Gombe",
//   "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
//   "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
//   "Taraba", "Yobe", "Zamfara"
// ]

// export default function PDFPreviewPage2() {
//   const [selectedState, setSelectedState] = useState({
//     "2024": "",
//     "2025": "",
//   })
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [numPages, setNumPages] = useState(null)
//   const [pageNumber, setPageNumber] = useState(1)

//   const years = Object.keys(pdfData)

//   const handleStateChange = (year, state) => {
//     setSelectedState((prev) => ({
//       ...prev,
//       [year]: state,
//     }))
//     setSelectedDocument(null)
//   }

//   const viewDocument = (doc) => {
//     setSelectedDocument(doc)
//     setPageNumber(1)
//   }

//   const closeDocumentViewer = () => {
//     setSelectedDocument(null)
//     setIsFullscreen(false)
//   }

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

//   const onDocumentLoadSuccess = ({ numPages }) => {
//     setNumPages(numPages)
//     setPageNumber(1)
//   }

//   const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1))
//   const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages))

//   return (
//     <PageLayout>
//       <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//         <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//         <section className="bg-slate-900 pt-32 pb-10">
//           <div className="container mx-auto px-4">
//             <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
//               Document Library
//             </div>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col gap-8">
//             <div className="text-center">
//               <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Nigerian State Documents</h1>
//               <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Browse our collection of documents organized by year and state.
//               </p>
//             </div>

//             {!selectedDocument ? (
//               <Tabs defaultValue="2024" className="w-full">
//                 <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
//                   {years.map((year) => (
//                     <TabsTrigger key={year} value={year}>
//                       {year}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>

//                 {years.map((year) => (
//                   <TabsContent key={year} value={year} className="mt-6">
//                     <div className="bg-card rounded-lg p-6 shadow-md">
//                       <h2 className="text-2xl font-bold mb-4">{year} Documents</h2>

//                       <div className="mb-8">
//                         <label className="block text-sm font-medium mb-2">Select a State:</label>
//                         <Select value={selectedState[year]} onValueChange={(value) => handleStateChange(year, value)}>
//                           <SelectTrigger className="w-full max-w-md">
//                             <SelectValue placeholder="Select a state" />
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

//                       {selectedState[year] && (
//                         <div>
//                           <h3 className="text-xl font-semibold mb-4">
//                             Documents for {selectedState[year]} - {year}
//                           </h3>

//                           {pdfData[year][selectedState[year]] ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                               {pdfData[year][selectedState[year]].map((doc) => (
//                                 <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                                   <div
//                                     className="aspect-[3/4] relative bg-muted cursor-pointer"
//                                     onClick={() => viewDocument(doc)}
//                                   >
//                                     <img
//                                       src={doc.thumbnail || "/placeholder.svg"}
//                                       alt={doc.title}
//                                       className="w-full h-full object-cover"
//                                     />
//                                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                                       <Button variant="secondary">
//                                         <Eye className="mr-2 h-4 w-4" />
//                                         View Document
//                                       </Button>
//                                     </div>
//                                   </div>
//                                   <CardHeader className="p-4">
//                                     <CardTitle className="text-lg">{doc.title}</CardTitle>
//                                   </CardHeader>
//                                   <CardFooter className="p-4 pt-0">
//                                     <Button className="w-full" onClick={() => viewDocument(doc)}>
//                                       <Eye className="mr-2 h-4 w-4" />
//                                       Read Document
//                                     </Button>
//                                   </CardFooter>
//                                 </Card>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="bg-muted p-8 rounded-lg text-center">
//                               <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                               <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
//                               <p className="text-muted-foreground">
//                                 There are no documents available for {selectedState[year]} in {year}.
//                               </p>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </TabsContent>
//                 ))}
//               </Tabs>
//             ) : (
//               <div
//                 className={cn(
//                   "bg-white rounded-lg shadow-xl transition-all duration-300 flex flex-col",
//                   isFullscreen ? "fixed inset-0 z-50" : "relative"
//                 )}
//               >
//                 <div className="flex items-center justify-between p-4 border-b bg-muted">
//                   <div className="flex items-center gap-2">
//                     <Button variant="ghost" size="sm" onClick={closeDocumentViewer}>
//                       <ChevronLeft className="h-4 w-4" />
//                       Back
//                     </Button>
//                     <h3 className="font-semibold truncate">{selectedDocument.title}</h3>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
//                     {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
//                   </Button>
//                 </div>

//                 <div className={cn("flex-1 flex flex-col items-center justify-center bg-gray-100 p-4 gap-4", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[70vh]")}>
//                   <Document
//                     file={selectedDocument.url}
//                     onLoadSuccess={onDocumentLoadSuccess}
//                     loading={<p>Loading PDF...</p>}
//                     error={<p>Failed to load PDF.</p>}
//                   >
//                     <Page pageNumber={pageNumber} width={isFullscreen ? window.innerWidth - 100 : 800} />
//                   </Document>

//                   <div className="flex items-center gap-4 mt-4">
//                     <Button onClick={goToPrevPage} disabled={pageNumber <= 1}>Previous</Button>
//                     <p className="text-sm">Page {pageNumber} of {numPages}</p>
//                     <Button onClick={goToNextPage} disabled={pageNumber >= numPages}>Next</Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   )
// }
