
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
// // const pdfData = {
// //   "2024": {
// //     Lagos: [
// //       {
// //         id: 1,
// //         title: "Lagos Economic Report 2024",
// //         url: "/NEW.pdf",
// //         thumbnail: "/placeholder.svg?height=200&width=150",
// //       },
// //     ],
// //   },
// // }

// // // List of Nigerian states
// // const nigerianStates = [
// //   "All_State",
// //   "Abia",
// //   "Adamawa",
// //   "Akwa_Ibom",
// //   "Anambra",
// //   "Bauchi",
// //   "Bayelsa",
// //   "Benue",
// //   "Borno",
// //   "Cross_River",
// //   "Delta",
// //   "Ebonyi",
// //   "Edo",
// //   "Ekiti",
// //   "Enugu",
// //   "Abuja",
// //   "Gombe",
// //   "Imo",
// //   "Jigawa",
// //   "Kaduna",
// //   "Kano",
// //   "Katsina",
// //   "Kebbi",
// //   "Kogi",
// //   "Kwara",
// //   "Lagos",
// //   "Nasarawa",
// //   "Niger",
// //   "Ogun",
// //   "Ondo",
// //   "Osun",
// //   "Oyo",
// //   "Plateau",
// //   "Rivers",
// //   "Sokoto",
// //   "Taraba",
// //   "Yobe",
// //   "Zamfara",
// // ]

// const nigerianStates = [
//   // "All_State",
//   "Abia",
//   "Adamawa",
//   "Uyo",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Calabar",
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
// ];

// const pdfData = {
//   "2024": {},
//   "2025": {}, // Assuming you might have data for 2025 as well
// };

// nigerianStates.forEach((state, index) => {
//   const formattedStateName = state.replace(/_/g, ' '); // Remove underscores for display
//   // const stateLower = state.toLowerCase(); // Lowercase for URL
//   const stateUpper = state.toUpperCase(); // For the URL

//   pdfData["2024"][state] = [
//     {
//       id: index + 1,
//       title: `${formattedStateName} 2024 SUPA Beneficiaries`,
//       url: `SUPA2024/${stateUpper}.pdf`,
//       // thumbnail: "/placeholder.svg?height=200&width=150",
//     },
//   ];
// });

// console.log(pdfData);

// export default function PDFPreviewPage2() {
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
//               Beneficiaries Library
//             </div>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col gap-8">
//             <div className="text-center">
//               <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Preview from the list of beneficiaries of our previous SUPA programs.
//                 <br />
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
//                       {/* <h2 className="text-2xl font-bold mb-4">{year} Beneficiaries</h2> */}

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
//                                     className="relative bg-muted cursor-pointer"
//                                     onClick={() => viewDocument(doc)}
//                                   >
//                                     {/* <img
//                                       src={doc.thumbnail || "/placeholder.svg"}
//                                       alt={doc.title}
//                                       className="w-full h-full object-cover"
//                                     /> */}
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
//                                       Preview List
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
//                   <iframe 
//                     src={selectedDocument.url} 
//                     className="w-full h-full" 
//                     //className="w-full h-screen sm:h-[70vh]"
//                     title={selectedDocument.title} 
//                     loading="lazy"/>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   )
// }
// export const metadata = {
//   title: "Beneficiaries Library",
//   description: "Preview the list of beneficiaries from our previous SUPA programs.",
// }


import PageLayout from "@/components/layout/pageLayout"
import { useState, useEffect } from "react"
import { DotPattern } from "@/components/ui/dot-pattern"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, ChevronLeft, Maximize, Minimize } from "lucide-react"

const nigerianStates = [
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

const beneficiaryCategories = [
  {
    id: "main",
    label: "Beneficiaries",
    types: [
      { value: "artisans", label: "Artisans" },
    ]
  },
  {
    id: "shortlisted",
    label: "Shortlisted | Nominees",
    types: [
      { value: "shortlisted_artisans", label: "Shortlisted Artisans" },
    ]
  }
];

const years = ["2025", "2024"];

const pdfData = {};
years.forEach(year => {
  pdfData[year] = {};
  nigerianStates.forEach(state => {
    pdfData[year][state] = [];
    beneficiaryCategories.forEach(category => {
      category.types.forEach(type => {
        pdfData[year][state].push({
          id: `${year}-${state}-${type.value}`,
          title: `${state} ${year} SUPA ${type.label}`,
          url: `SUPA${year}/${state}_${type.value}.pdf`,
          type: type.value,
          category: category.id
        });
      });
    });
  });
});

export default function PDFPreviewPage2() {
  const [selectedYear, setSelectedYear] = useState(years[0]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("main");
  const [pdfExistsMap, setPdfExistsMap] = useState({});
  const [isCheckingPdfs, setIsCheckingPdfs] = useState(false);

  const checkPdfExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (selectedYear && selectedState) {
      setIsCheckingPdfs(true);
      const checkAllPdfs = async () => {
        const existsMap = {};
        const docs = pdfData[selectedYear][selectedState];
        
        for (const doc of docs) {
          existsMap[doc.id] = await checkPdfExists(doc.url);
        }
        
        setPdfExistsMap(existsMap);
        setIsCheckingPdfs(false);
      };
      
      checkAllPdfs();
    } else {
      setPdfExistsMap({});
    }
  }, [selectedYear, selectedState]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedState("");
    setSelectedDocument(null);
  }

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedDocument(null);
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedDocument(null);
  }

  const viewDocument = (doc) => {
    setSelectedDocument(doc);
  }

  const closeDocumentViewer = () => {
    setSelectedDocument(null);
    setIsFullscreen(false);
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  }

  return (
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
        <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

        <section className="bg-slate-900 pt-32 pb-10">
          <div className="container mx-auto px-4">
            <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
              2024 Beneficiaries / 2025 Nominees
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-8">
            {!selectedDocument && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-lg">
                <div className="flex flex-col sm:flex-row gap-12 items-center">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-2">
                      <h3 className="text-sm font-medium text-blue-800">Nominees | Shortlisted Check</h3>
                      <p className="text-xs text-blue-700 mt-1">To check if you're shortlisted for 2025:</p>
                      <p className="text-xs text-blue-600 mt-2 italic">Note: Only official nominees are listed.</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-x-auto">
                    <div className="text-sm text-blue-700 flex items-center gap-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="font-semibold text-xs mr-1">1.</span>
                        <span className="text-xs">Select <span className="font-semibold">2025</span></span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-xs mr-1">2.</span>
                        <span className="text-xs">Choose <span className="font-semibold">State</span></span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-xs mr-1">3.</span>
                        <span className="text-xs">Click <span className="font-semibold">Shortlisted | Nominiees</span></span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold text-xs mr-1">4.</span>
                        <span className="text-xs">Click <span className="font-semibold">Preview List</span> under SUPA Artisans</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedDocument ? (
              <div className="bg-card rounded-lg p-6 shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Year:</label>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select State:</label>
                    <Select value={selectedState} onValueChange={handleStateChange} disabled={!selectedYear}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={selectedYear ? "Select state" : "Select year first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map(state => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedState && (
                  <Tabs defaultValue="main" className="w-full" onValueChange={handleCategoryChange}>
                    <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                      {beneficiaryCategories.map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {beneficiaryCategories.map(category => (
                      <TabsContent key={category.id} value={category.id} className="mt-6">
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            {category.label} for {selectedState} - {selectedYear}
                          </h3>

                          {isCheckingPdfs ? (
                            <div className="bg-muted p-8 rounded-lg text-center">
                              <p className="text-muted-foreground">Checking available documents...</p>
                            </div>
                          ) : (
                            <>
                              {pdfData[selectedYear][selectedState]
                                .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
                                .map((doc) => (
                                  <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div
                                      className="relative bg-muted cursor-pointer"
                                      onClick={() => viewDocument(doc)}
                                    >
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

                              {pdfData[selectedYear][selectedState]
                                .filter(doc => doc.category === category.id)
                                .length > 0 && 
                                pdfData[selectedYear][selectedState]
                                  .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
                                  .length === 0 && (
                                <div className="bg-muted p-8 rounded-lg text-center">
                                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                  <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
                                  <p className="text-muted-foreground">
                                    There are no documents available for {selectedState} in {selectedYear}.
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
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
                    src={selectedDocument.url} 
                    className="w-full h-full" 
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

export const metadata = {
  title: "Beneficiaries / Nominees",
  description: "Preview the list of Shotlisted candidates for the current SUPA programs and beneficiaries from our previous SUPA programs.",
}

// import PageLayout from "@/components/layout/pageLayout"
// import { useState, useEffect} from "react"
// import { DotPattern } from "@/components/ui/dot-pattern"
// import { cn } from "@/lib/utils"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { FileText, Eye, ChevronLeft, Maximize, Minimize } from "lucide-react"

// const nigerianStates = [
//   "Abia",
//   "Adamawa",
//   "Uyo",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Calabar",
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
// ];

// const beneficiaryCategories = [
//   {
//     id: "main",
//     label: "Beneficiaries",
//     types: [
//       { value: "artisans", label: "Artisans" },
//       // { value: "training_centers", label: "Training Centers" }
//     ]
//   },
//   {
//     id: "shortlisted",
//     label: "Shortlisted | Nominees",
//     types: [
//       { value: "shortlisted_artisans", label: "Shortlisted Artisans" },
//       // { value: "shortlisted_training_centers", label: "Shortlisted Training Centers" }
//     ]
//   }
// ];

// // Years in descending order (most recent first)
// const years = ["2025", "2024"];

// // Generate data structure
// const pdfData = {};
// years.forEach(year => {
//   pdfData[year] = {};
//   nigerianStates.forEach(state => {
//     pdfData[year][state] = [];
//     beneficiaryCategories.forEach(category => {
//       category.types.forEach(type => {
//         pdfData[year][state].push({
//           id: `${year}-${state}-${type.value}`,
//           title: `${state} ${year} SUPA ${type.label}`,
//           url: `SUPA${year}/${state}_${type.value}.pdf`,
//           type: type.value,
//           category: category.id
//         });
//       });
//     });
//   });
// });

// export default function PDFPreviewPage2() {
//   const [selectedYear, setSelectedYear] = useState(years[0]); // Default to most recent year
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("main");
  
//     const checkPdfExists = async (url) => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     if (selectedYear && selectedState) {
//       const checkAllPdfs = async () => {
//         const existsMap = {};
//         const docs = pdfData[selectedYear][selectedState];
        
//         for (const doc of docs) {
//           existsMap[doc.id] = await checkPdfExists(doc.url);
//         }
        
//         setPdfExistsMap(existsMap);
//       };
      
//       checkAllPdfs();
//     }
//   }, [selectedYear, selectedState]);

//   const handleYearChange = (year) => {
//     setSelectedYear(year);
//     setSelectedState("");
//     setSelectedDocument(null);
//   }

//   const handleStateChange = (state) => {
//     setSelectedState(state);
//     setSelectedDocument(null);
//   }

//   const handleCategoryChange = (category) => {
//     setSelectedCategory(category);
//     setSelectedDocument(null);
//   }

//   const viewDocument = (doc) => {
//     setSelectedDocument(doc);
//   }

//   const closeDocumentViewer = () => {
//     setSelectedDocument(null);
//     setIsFullscreen(false);
//   }

//   const toggleFullscreen = () => {
//     setIsFullscreen(!isFullscreen);
//   }

//   return (
//     <PageLayout>
//       <div className="bg-gradient-to-t from-stone-100 to-current-black min-h-screen">
//         <DotPattern width={10} height={10} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40 opacity-15")} />

//         <section className="bg-slate-900 pt-32 pb-10">
//           <div className="container mx-auto px-4">
//             <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
//               2024 Beneficiaries / 2025 Nominees
//             </div>
//           </div>
//         </section>

//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col gap-8">
//             {/* <div className="text-center">
//               <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
//                 Select a year, state, and category (Beneficiaries or Shortlisted/Nominees) to view official SUPA program lists.
//               </p>
//             </div> */}

//               {!selectedDocument && (
//                 <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-lg">
//                   <div className="flex flex-col sm:flex-row gap-12 items-center">
//                     {/* Left side - Title and intro */}
//                     <div className="flex items-center">
//                       <svg className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                       </svg>
//                       <div className="ml-2">
//                         <h3 className="text-sm font-medium text-blue-800">Nominees | Shortlisted Check</h3>
//                         <p className="text-xs text-blue-700 mt-1">To check if you're shortlisted for 2025:</p>
//                         <p className="text-xs text-blue-600 mt-2 italic">Note: Only official nominees are listed.</p>
//                       </div>
                        
//                     </div>
                    
//                     {/* Steps in one line */}
//                     <div className="flex-1 overflow-x-auto">
//                       <div className="text-sm text-blue-700 flex items-center gap-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <span className="font-semibold text-xs mr-1">1.</span>
//                           <span className="text-xs">Select <span className="font-semibold">2025</span></span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="font-semibold text-xs mr-1">2.</span>
//                           <span className="text-xs">Choose <span className="font-semibold">State</span></span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="font-semibold text-xs mr-1">3.</span>
//                           <span className="text-xs">Click <span className="font-semibold">Shortlisted | Nominiees</span></span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="font-semibold text-xs mr-1">4.</span>
//                           <span className="text-xs">Click <span className="font-semibold">Preview List</span>  under SUPA Artisans </span>
//                         </div>
//                       </div>
//                     </div>

                    
//                   </div>
//                 </div>
//               )}

//             {!selectedDocument ? (
//               <div className="bg-card rounded-lg p-6 shadow-md">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Select Year:</label>
//                     <Select value={selectedYear} onValueChange={handleYearChange}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select year" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {years.map(year => (
//                           <SelectItem key={year} value={year}>
//                             {year}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Select State:</label>
//                     <Select value={selectedState} onValueChange={handleStateChange} disabled={!selectedYear}>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder={selectedYear ? "Select state" : "Select year first"} />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {nigerianStates.map(state => (
//                           <SelectItem key={state} value={state}>
//                             {state}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {selectedState && (
//                   <Tabs defaultValue="main" className="w-full" onValueChange={handleCategoryChange}>
//                     <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
//                       {beneficiaryCategories.map(category => (
//                         <TabsTrigger key={category.id} value={category.id}>
//                           {category.label}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                     {beneficiaryCategories.map(category => (
//                       <TabsContent key={category.id} value={category.id} className="mt-6">
//                         <div>
//                           <h3 className="text-xl font-semibold mb-4">
//                             {category.label} for {selectedState} - {selectedYear}
//                           </h3>

//                           {/* {pdfData[selectedYear][selectedState]?.filter(doc => doc.category === category.id).length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                               {pdfData[selectedYear][selectedState]
//                                 .filter(doc => doc.category === category.id)
//                                 .map((doc) => (
//                                   <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//                                     <div
//                                       className="relative bg-muted cursor-pointer"
//                                       onClick={() => viewDocument(doc)}
//                                     >
//                                       <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                                         <Button variant="secondary">
//                                           <Eye className="mr-2 h-4 w-4" />
//                                           View Document
//                                         </Button>
//                                       </div>
//                                     </div>
//                                     <CardHeader className="p-4">
//                                       <CardTitle className="text-lg">{doc.title}</CardTitle>
//                                     </CardHeader>
//                                     <CardFooter className="p-4 pt-0">
//                                       <Button className="w-full" onClick={() => viewDocument(doc)}>
//                                         <Eye className="mr-2 h-4 w-4" />
//                                         Preview List
//                                       </Button>
//                                     </CardFooter>
//                                   </Card>
//                                 ))}
//                             </div>
//                           ) : (
//                             <div className="bg-muted p-8 rounded-lg text-center">
//                               <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                               <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
//                               <p className="text-muted-foreground">
//                                 There are no documents available for {selectedState} in {selectedYear}.
//                               </p>
//                             </div>
//                           )} */}

//                           {pdfData[selectedYear][selectedState]
//         .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
//         .map((doc) => (
//           <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//             <div
//               className="relative bg-muted cursor-pointer"
//               onClick={() => viewDocument(doc)}
//             >
//               <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
//                 <Button variant="secondary">
//                   <Eye className="mr-2 h-4 w-4" />
//                   View Document
//                 </Button>
//               </div>
//             </div>
//             <CardHeader className="p-4">
//               <CardTitle className="text-lg">{doc.title}</CardTitle>
//             </CardHeader>
//             <CardFooter className="p-4 pt-0">
//               <Button className="w-full" onClick={() => viewDocument(doc)}>
//                 <Eye className="mr-2 h-4 w-4" />
//                 Preview List
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}

//       {pdfData[selectedYear][selectedState]
//         .filter(doc => doc.category === category.id)
//         .length > 0 && 
//         pdfData[selectedYear][selectedState]
//           .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
//           .length === 0 && (
//         <div className="bg-muted p-8 rounded-lg text-center">
//           <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//           <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
//           <p className="text-muted-foreground">
//             There are no documents available for {selectedState} in {selectedYear}.
//           </p>
//         </div>
//       )}
//                         </div>
//                       </TabsContent>
//                     ))}
//                   </Tabs>
//                 )}
//               </div>
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
//                   <iframe 
//                     src={selectedDocument.url} 
//                     className="w-full h-full" 
//                     title={selectedDocument.title} 
//                     loading="lazy"/>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageLayout>
//   )
// }

// export const metadata = {
//   title: "Beneficiaries / Nominees",
//   description: "Preview the list of Shotlisted candidates for the current SUPA programs and beneficiaries from our previous SUPA programs.",
// }