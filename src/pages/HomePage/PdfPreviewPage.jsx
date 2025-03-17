// import PageLayout from "@/components/layout/pageLayout"
// import { useState } from "react"
// import { DotPattern } from "@/components/ui/dot-pattern"
// import { cn } from "@/lib/utils"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { FileText, Eye, ChevronLeft, Maximize, Minimize } from "lucide-react"

// // Sample data structure - in a real app, this would come from an API or database
// const pdfData = {
//   "2024": {
//     Lagos: [
//       {
//         id: 1,
//         title: "Lagos Economic Report 2024",
//         url: "/pdfs/lagos-economic-2024.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//       {
//         id: 2,
//         title: "Lagos Infrastructure Development",
//         url: "/pdfs/lagos-infrastructure-2024.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//     Abuja: [
//       {
//         id: 3,
//         title: "Abuja City Planning 2024",
//         url: "/pdf/H. ABBAS SANI.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//       {
//         id: 4,
//         title: "FCT Budget Allocation",
//         url: "/pdfs/fct-budget-2024.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//     Kano: [
//       {
//         id: 5,
//         title: "Kano Agricultural Report",
//         url: "/pdfs/kano-agric-2024.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//   },
//   "2025": {
//     Lagos: [
//       {
//         id: 6,
//         title: "Lagos Projections 2025",
//         url: "/pdfs/lagos-projections-2025.pdf",
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
//     Rivers: [
//       {
//         id: 8,
//         title: "Rivers State Oil Report 2025",
//         url: "/pdfs/rivers-oil-2025.pdf",
//         thumbnail: "/placeholder.svg?height=200&width=150",
//       },
//     ],
//   },
// }

// // List of Nigerian states
// const nigerianStates = [
//   "Abia",
//   "Abuja",
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

// export default function PDFPreviewPage() {
//   const [selectedState, setSelectedState] = useState({
//     "2024": "",
//     "2025": "",
//   })
//   const [selectedDocument, setSelectedDocument] = useState(null)
//   const [isFullscreen, setIsFullscreen] = useState(false)

//   const years = Object.keys(pdfData)

//   const handleStateChange = (year, state) => {
//     setSelectedState((prev) => ({
//       ...prev,
//       [year]: state,
//     }))
//     // Reset selected document when changing state
//     setSelectedDocument(null)
//   }

//   const viewDocument = (doc) => {
//     setSelectedDocument(doc)
//   }

//   const closeDocumentViewer = () => {
//     setSelectedDocument(null)
//     setIsFullscreen(false)
//   }

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen)
//   }

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
//                 Browse our collection of documents organized by year and state. Select a year and state to view
//                 available documents.
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
//                   "bg-white rounded-lg shadow-xl transition-all duration-300",
//                   isFullscreen ? "fixed inset-0 z-50" : "relative",
//                 )}
//               >
//                 <div className="flex items-center justify-between p-4 border-b">
//                   <div className="flex items-center">
//                     <Button variant="ghost" size="sm" onClick={closeDocumentViewer} className="mr-2">
//                       <ChevronLeft className="h-4 w-4 mr-1" />
//                       Back
//                     </Button>
//                     <h3 className="font-semibold truncate">{selectedDocument.title}</h3>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
//                     {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
//                   </Button>
//                 </div>
//                 <div className={cn("w-full bg-gray-100", isFullscreen ? "h-[calc(100vh-64px)]" : "h-[70vh]")}>
//                   <iframe src={selectedDocument.url} className="w-full h-full" title={selectedDocument.title} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   )
// }


import { useState, useEffect } from "react";
import PageLayout from "@/components/layout/pageLayout";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, ChevronLeft, Maximize, Minimize, Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";


export default function PDFPreviewPage() {
  const [years, setYears] = useState([]);
  const [states, setStates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yearsResponse, statesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/public/years`),
          axios.get(`${API_BASE_URL}/public/states`)
        ]);

        setYears(yearsResponse.data);
        setStates(statesResponse.data);

        if (yearsResponse.data.length > 0) {
          setSelectedYear(yearsResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!selectedYear) return;

      try {
        setIsLoading(true);

        let url = `${API_BASE_URL}/public/documents?year=${selectedYear}`;
        if (selectedState) {
          url += `&state=${selectedState}`;
        }

        const response = await axios.get(url);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [selectedYear, selectedState]);

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDocument(null);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedDocument(null);
  };

  const viewDocument = (doc) => {
    setSelectedDocument(doc);
  };

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
          <PageLayout>
            <div className="bg-gradient-to-t from-stone-100 to-current-black">
            <DotPattern
                        width={10}
                        height={10}
                        cx={1}
                        cy={1}
                        cr={1}
                        className={cn("fill-neutral-400/40 opacity-15")}
                      />
            <section className="bg-slate-900 pt-32 pb-10">
      <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
      Artisan Registry
      </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"></h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Preview the list of previous SUPA Trainnee's organized by year and state. Select a year and state to view available List.
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
                  <Select
                    value={selectedState}
                    onValueChange={handleStateChange}
                    disabled={isLoading || !selectedYear}
                  >
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
                isFullscreen ? "fixed inset-0 z-50" : "relative"
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
            </PageLayout>
  );
}
