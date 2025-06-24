

// import PageLayout from "@/components/layout/pageLayout"
// import { useState, useEffect } from "react"
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
//     ]
//   },
//   {
//     id: "shortlisted",
//     label: "Shortlisted | Nominees",
//     types: [
//       { value: "shortlisted_artisans", label: "Shortlisted Artisans" },
//     ]
//   }
// ];

// const years = ["2025", "2024"];

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
//   const [selectedYear, setSelectedYear] = useState(years[0]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("main");
//   const [pdfExistsMap, setPdfExistsMap] = useState({});
//   const [isCheckingPdfs, setIsCheckingPdfs] = useState(false);

//   const checkPdfExists = async (url) => {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     if (selectedYear && selectedState) {
//       setIsCheckingPdfs(true);
//       const checkAllPdfs = async () => {
//         const existsMap = {};
//         const docs = pdfData[selectedYear][selectedState];
        
//         for (const doc of docs) {
//           existsMap[doc.id] = await checkPdfExists(doc.url);
//         }
        
//         setPdfExistsMap(existsMap);
//         setIsCheckingPdfs(false);
//       };
      
//       checkAllPdfs();
//     } else {
//       setPdfExistsMap({});
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
//             {!selectedDocument && (
//               <div className="bg-blue-50 border-l-4 border-blue-500 p-2 rounded-r-lg">
//                 <div className="flex flex-col sm:flex-row gap-12 items-center">
//                   <div className="flex items-center">
//                     <svg className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                     </svg>
//                     <div className="ml-2">
//                       <h3 className="text-sm font-medium text-blue-800">Nominees | Shortlisted Check</h3>
//                       <p className="text-xs text-blue-700 mt-1">To check if you're shortlisted for 2025:</p>
//                       <p className="text-xs text-blue-600 mt-2 italic">Note: Only official nominees are listed.</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex-1 overflow-x-auto">
//                     <div className="text-sm text-blue-700 flex items-center gap-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <span className="font-semibold text-xs mr-1">1.</span>
//                         <span className="text-xs">Select <span className="font-semibold">2025</span></span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-xs mr-1">2.</span>
//                         <span className="text-xs">Choose <span className="font-semibold">State</span></span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-xs mr-1">3.</span>
//                         <span className="text-xs">Click <span className="font-semibold">Shortlisted | Nominiees</span></span>
//                       </div>
//                       <div className="flex items-center">
//                         <span className="font-semibold text-xs mr-1">4.</span>
//                         <span className="text-xs">Click <span className="font-semibold">Preview List</span> under SUPA Artisans</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

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

//                           {isCheckingPdfs ? (
//                             <div className="bg-muted p-8 rounded-lg text-center">
//                               <p className="text-muted-foreground">Checking available documents...</p>
//                             </div>
//                           ) : (
//                             <>
//                               {pdfData[selectedYear][selectedState]
//                                 .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
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

//                               {pdfData[selectedYear][selectedState]
//                                 .filter(doc => doc.category === category.id)
//                                 .length > 0 && 
//                                 pdfData[selectedYear][selectedState]
//                                   .filter(doc => doc.category === category.id && pdfExistsMap[doc.id])
//                                   .length === 0 && (
//                                 <div className="bg-muted p-8 rounded-lg text-center">
//                                   <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
//                                   <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
//                                   <p className="text-muted-foreground">
//                                     There are no documents available for {selectedState} in {selectedYear}.
//                                   </p>
//                                 </div>
//                               )}
//                             </>
//                           )}
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
    id: "shortlisted",
    label: "SUPA Nominees",
    types: [
      { value: "shortlisted_artisans", label: "Nominees" },
    ]
  },
  {
    id: "main",
    label: "Beneficiaries",
    types: [
      { value: "artisans", label: "Artisans" },
    ]
  },
  // {
  //   id: "shortlisted",
  //   label: "SUPA Nominees",
  //   types: [
  //     { value: "shortlisted_artisans", label: "Nominees" },
  //   ]
  // }
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
          url: `/SUPA${year}/${state}_${type.value}.pdf`,
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
      console.log('Checking PDF:', url); // Debug log
      const response = await fetch(url, { method: 'HEAD' });
      console.log('Response status:', response.status, 'for', url); // Debug log
      console.log('Content-Type:', response.headers.get('content-type')); // Debug log
      
      // Check if response is OK AND content-type is PDF
      const isOk = response.ok;
      const contentType = response.headers.get('content-type');
      const isPdf = contentType && contentType.includes('application/pdf');
      
      console.log('Is OK:', isOk, 'Is PDF:', isPdf); // Debug log
      
      return isOk && isPdf;
    } catch (error) {
      console.log('Error checking PDF:', url, error); // Debug log
      return false;
    }
  };

  useEffect(() => {
    if (selectedYear && selectedState) {
      setIsCheckingPdfs(true);
      const checkAllPdfs = async () => {
        const existsMap = {};
        const docs = pdfData[selectedYear][selectedState];
        
        console.log('Checking PDFs for:', selectedState, selectedYear); // Debug log
        
        for (const doc of docs) {
          const exists = await checkPdfExists(doc.url);
          existsMap[doc.id] = exists;
          console.log('PDF exists check:', doc.id, exists); // Debug log
        }
        
        console.log('Final existsMap:', existsMap); // Debug log
        setPdfExistsMap(existsMap);
        setIsCheckingPdfs(false);
      };
      
      checkAllPdfs();
    } else {
      setPdfExistsMap({});
      setIsCheckingPdfs(false);
    }
  }, [selectedYear, selectedState]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedState("");
    setSelectedDocument(null);
    setPdfExistsMap({});
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

  // Get available documents for the current category
  const getAvailableDocuments = (categoryId) => {
    if (!selectedYear || !selectedState) return [];
    
    const allDocs = pdfData[selectedYear][selectedState]
      .filter(doc => doc.category === categoryId);
    
    const availableDocs = allDocs.filter(doc => pdfExistsMap[doc.id] === true);
    
    console.log('All docs for category:', categoryId, allDocs); // Debug log
    console.log('Available docs for category:', categoryId, availableDocs); // Debug log
    console.log('Current pdfExistsMap:', pdfExistsMap); // Debug log
    
    return availableDocs;
  };

  // Check if any documents exist for the current category
  const hasDocumentsForCategory = (categoryId) => {
    return getAvailableDocuments(categoryId).length > 0;
  };

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
            {/* {!selectedDocument && (
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
            )} */}

            {!selectedDocument && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 lg:p-4 rounded-r-lg">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 items-start lg:items-center">
            {/* Header Section */}
            <div className="flex items-start sm:items-center w-full lg:w-auto lg:min-w-0 lg:flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <div className="ml-2 sm:ml-3 min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-blue-800 leading-tight">
                  To Check Successful SUPA 2025 Nominiees
                </h3>
                <p className="text-xs sm:text-xs text-blue-700 mt-0.5 leading-relaxed">
                  To check if you're Nominated for SUPA 2025:
                </p>
                <p className="text-xs sm:text-xs text-blue-600 mt-1 italic font-medium">
                  Note: Selected Nominees will undergo screening.
                </p>
              </div>
            </div>
            
            {/* Steps Section */}
            <div className="w-full lg:flex-1 min-w-0">
              {/* Mobile & Tablet: Vertical Stack */}
              <div className="block lg:hidden space-y-1.5 sm:space-y-2">
                <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
                  <span className="ml-2 text-xs text-blue-800">
                    Select <span className="font-semibold">2025</span>
                  </span>
                </div>
                <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
                  <span className="ml-2 text-xs text-blue-800">
                    Choose <span className="font-semibold">State</span>
                  </span>
                </div>
                <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
                  <span className="ml-2 text-xs text-blue-800">
                    Click <span className="font-semibold">SUPA Nominees</span>
                  </span>
                </div>
                <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
                  <span className="ml-2 text-xs text-blue-800">
                    Click <span className="font-semibold">Preview List</span> under SUPA Artisans
                  </span>
                </div>
              </div>

              {/* Desktop: Horizontal Flow */}
              {/* <div className="hidden lg:block">
                <div className="flex items-center  gap-2 xl:gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
                    <span className="text-xs xl:text-sm truncate">
                      Select <span className="font-semibold">2025</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
                    <span className="text-xs xl:text-sm truncate">
                      Choose <span className="font-semibold">State</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
                    <span className="text-xs xl:text-sm truncate">
                      Click <span className="font-semibold">Shortlisted | Nominees</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
                    <span className="text-xs xl:text-sm truncate">
                      Click <span className="font-semibold">Preview List</span> under SUPA Artisans
                    </span>
                  </div>
                </div>
              </div> */}
              {/* Desktop: Two per row horizontal layout */}
<div className="hidden lg:block">
  <div className="grid grid-cols-2 gap-3 xl:gap-4 text-sm text-blue-700">
    {/* Row 1 */}
    <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200">
      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
      <span className="text-xs xl:text-sm">
        Select <span className="font-semibold">2025</span>
      </span>
    </div>
    
    <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200">
      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
      <span className="text-xs xl:text-sm">
        Choose <span className="font-semibold">State</span>
      </span>
    </div>
    
    {/* Row 2 */}
    <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200">
      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
      <span className="text-xs xl:text-sm">
        Click <span className="font-semibold">SUPA Nominees</span>
      </span>
    </div>
    
    <div className="flex items-center gap-2 p-2 bg-white/60 rounded border border-blue-200">
      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
      <span className="text-xs xl:text-sm">
        Click <span className="font-semibold">Preview List</span> under SUPA Nominees
      </span>
    </div>
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
                  <Tabs defaultValue="shortlisted" className="w-full" onValueChange={handleCategoryChange}>
                    {/* <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                      {beneficiaryCategories.map(category => (
                        <TabsTrigger key={category.id} value={category.id}>
                          {category.label}
                        </TabsTrigger>
                      ))}
                    </TabsList> */}
                    <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                      {beneficiaryCategories.map(category => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className={cn(
                            "transition-colors",
                            "data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow data-[state=active]:font-semibold",
                            "bg-white text-emerald-600 hover:bg-emerald-50"
                          )}
                        >
                          {category.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {/* <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                      {beneficiaryCategories.map(category => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className={cn(
                            "transition-colors",
                            selectedCategory === category.id
                              ? "bg-emerald-600 text-white shadow font-semibold"
                              : "bg-white text-emerald-600 hover:bg-emerald-50"
                          )}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          {category.label}
                        </TabsTrigger>
                      ))}
                    </TabsList> */}

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
                              {hasDocumentsForCategory(category.id) ? (
                                getAvailableDocuments(category.id).map((doc) => (
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
                                    <CardFooter className="p-4 pt-0 gap-4">
                                      <Button className="w-full flex-1 bg-emerald-600 " onClick={() => viewDocument(doc)}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        Preview List
                                      </Button>
                                      <a
                                        href={doc.url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                      >
                                        <Button type="button" variant="outline" className="w-full">
                                          <FileText className="mr-2 h-4 w-4" />
                                          Download List
                                        </Button>
                                      </a>
                                    </CardFooter>
                                  </Card>
                                ))
                              ) : (
                                <div className="bg-muted p-8 rounded-lg text-center">
                                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                  <h4 className="text-lg font-medium mb-2">No Documents Available</h4>
                                  <p className="text-muted-foreground">
                                    There are no documents available for {category.label.toLowerCase()} in {selectedState} for {selectedYear}.
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