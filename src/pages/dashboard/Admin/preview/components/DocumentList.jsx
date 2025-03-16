
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDocuments } from "../contexts/DocumentContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Eye, Edit, Trash2, FileText, Loader2 } from "lucide-react";

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
// ];

// // Years array (current year and 10 years into the future)
// const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString());

// function DocumentList() {
//   const { documents, isLoading, deleteDocument, fetchDocuments } = useDocuments();
//   const [filteredDocuments, setFilteredDocuments] = useState([]);
//   const [selectedYear, setSelectedYear] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   // Ensure documents is always an array
//   const safeDocuments = Array.isArray(documents) ? documents : [];

//   // Filter documents based on selected year, state, and search query
// //   useEffect(() => {
// //     let filtered = [...safeDocuments];

// //     if (selectedYear && selectedYear !== "all") {
// //       filtered = filtered.filter((doc) => doc.year === selectedYear);
// //     }

// //     if (selectedState && selectedState !== "all") {
// //       filtered = filtered.filter((doc) => doc.state === selectedState);
// //     }

// //     if (searchQuery) {
// //       const query = searchQuery.toLowerCase();
// //       filtered = filtered.filter(
// //         (doc) => doc.title.toLowerCase().includes(query) || doc.state.toLowerCase().includes(query)
// //       );
// //     }

// //     setFilteredDocuments(filtered);
// //   }, [selectedYear, selectedState, searchQuery, safeDocuments]);

// useEffect(() => {
//     let filtered = [...documents]
  
//     // Only apply filters if the documents array has changed or a filter has been modified
//     if (selectedYear && selectedYear !== "all") {
//       filtered = filtered.filter((doc) => doc.year === selectedYear)
//     }
  
//     if (selectedState && selectedState !== "all") {
//       filtered = filtered.filter((doc) => doc.state === selectedState)
//     }
  
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       filtered = filtered.filter(
//         (doc) => doc.title.toLowerCase().includes(query) || doc.state.toLowerCase().includes(query),
//       )
//     }
  
//     // Only update the filtered documents if they have changed
//     if (filtered !== filteredDocuments) {
//       setFilteredDocuments(filtered)
//     }
//   }, [selectedYear, selectedState, searchQuery, documents]) // Ensure this effect doesn't fire repeatedly
  

// const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this document?")) {
//       try {
//         await deleteDocument(id);
//       } catch (error) {
//         console.error("Error in delete handler:", error);
//       }
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Document Management</CardTitle>
//         <CardDescription>View, edit, and delete documents in the system</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <Input
//               placeholder="Search documents..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Select value={selectedYear} onValueChange={setSelectedYear}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by year" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Years</SelectItem>
//                 {years.map((year) => (
//                   <SelectItem key={year} value={year}>
//                     {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={selectedState} onValueChange={setSelectedState}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by state" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All States</SelectItem>
//                 {nigerianStates.map((state) => (
//                   <SelectItem key={state} value={state}>
//                     {state}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {Array.isArray(documents) && documents.length > 0 ? (
//   <div className="rounded-md border">
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Title</TableHead>
//           <TableHead>Year</TableHead>
//           <TableHead>State</TableHead>
//           <TableHead>Date Added</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {documents.map((doc) => (
//           <TableRow key={doc.id}>
//             <TableCell className="font-medium">{doc.title}</TableCell>
//             <TableCell>{doc.year}</TableCell>
//             <TableCell>{doc.state}</TableCell>
//             <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
//             <TableCell className="text-right">
//               <div className="flex justify-end gap-2">
//                 <Button variant="outline" size="sm" onClick={() => navigate(`/documents/${doc.id}`)}>
//                   <Eye className="h-4 w-4" />
//                   <span className="sr-only">View</span>
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => navigate(`/documents/edit/${doc.id}`)}>
//                   <Edit className="h-4 w-4" />
//                   <span className="sr-only">Edit</span>
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
//                   <Trash2 className="h-4 w-4" />
//                   <span className="sr-only">Delete</span>
//                 </Button>
//               </div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   </div>
// ) : (
//   <div className="flex flex-col items-center justify-center py-12 text-center">
//     <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//     <h3 className="text-lg font-medium">No documents found</h3>
//     <p className="text-muted-foreground mt-2">
//       {documents.length === 0 ? "Start by uploading your first document" : "Try adjusting your filters"}
//     </p>
//   </div>
// )}

//         {/* {isLoading ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : filteredDocuments.length > 0 ? (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Year</TableHead>
//                   <TableHead>State</TableHead>
//                   <TableHead>Date Added</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredDocuments.map((doc) => (
//                   <TableRow key={doc.id}>
//                     <TableCell className="font-medium">{doc.title}</TableCell>
//                     <TableCell>{doc.year}</TableCell>
//                     <TableCell>{doc.state}</TableCell>
//                     <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="outline" size="sm" onClick={() => navigate(`/documents/${doc.id}`)}>
//                           <Eye className="h-4 w-4" />
//                           <span className="sr-only">View</span>
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={() => navigate(`/documents/edit/${doc.id}`)}>
//                           <Edit className="h-4 w-4" />
//                           <span className="sr-only">Edit</span>
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
//                           <Trash2 className="h-4 w-4" />
//                           <span className="sr-only">Delete</span>
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium">No documents found</h3>
//             <p className="text-muted-foreground mt-2">
//               {safeDocuments.length === 0 ? "Start by uploading your first document" : "Try adjusting your filters"}
//             </p>
//           </div>
//         )} */}

//         <div className="mt-6">
//           <Button onClick={() => navigate("/documents/create")}>Add New Document</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default DocumentList;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Edit, Trash2, FileText, Loader2 } from "lucide-react";

// Nigerian states array
const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
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

// Years array (current year and 10 years into the future)
const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString());

function DocumentList() {
  const { documents, isLoading, deleteDocument, fetchDocuments } = useDocuments();
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Ensure documents is always an array
  const safeDocuments = Array.isArray(documents) ? documents : [];

  useEffect(() => {
    console.log("useEffect triggered", {
        selectedYear,
        selectedState,
        searchQuery,
        safeDocuments,
    });

    

    let filtered = [...safeDocuments];

    if (selectedYear && selectedYear !== "all") {
        filtered = filtered.filter((doc) => doc.year === selectedYear);
    }

    if (selectedState && selectedState !== "all") {
        filtered = filtered.filter((doc) => doc.state === selectedState);
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
            (doc) => doc.title.toLowerCase().includes(query) || doc.state.toLowerCase().includes(query)
        );
    }

    console.log("Filtered documents:", filtered);
    setFilteredDocuments(filtered);
}, [selectedYear, selectedState, searchQuery, safeDocuments]);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        fetchDocuments(); // Refresh documents after deletion
      } catch (error) {
        console.error("Error in delete handler:", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Management</CardTitle>
        <CardDescription>View, edit, and delete documents in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
        
{safeDocuments.length > 0 && (
  <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
              </Select>
)}

{safeDocuments.length > 0 && (
  <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {nigerianStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
)}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : safeDocuments.length > 0 ? (
         //filteredDocuments.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.year}</TableCell>
                    <TableCell>{doc.state}</TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                      {/* <Button variant="outline" size="sm" onClick={() => navigate(`/documents/preview/${doc._id}`)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                    </Button> */}

<Button
  variant="outline"
  size="sm"
  onClick={() => {
    console.log("Document object:", doc); // Add this line
    if (doc && doc._id) {
      navigate(`/documents/preview/${doc._id}`);
    } else {
      console.error("Document or document ID is undefined");
      // Optionally, display an error message to the user
    }
  }}
>
  <Eye className="h-4 w-4" />
  <span className="sr-only">View</span>
</Button>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/documents/edit/${doc._id}`)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(doc._id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No documents found</h3>
            <p className="text-muted-foreground mt-2">
              {safeDocuments.length === 0 ? "Start by uploading your first document" : "Try adjusting your filters"}
            </p>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={() => navigate("/documents/create")}>Add New Document</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default DocumentList;

// "use client"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { useDocuments } from "../contexts/DocumentContext"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Eye, Edit, Trash2, FileText, Loader2 } from "lucide-react"

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

// function DocumentList() {
//   const { documents, isLoading, deleteDocument, fetchDocuments } = useDocuments()
//   const [filteredDocuments, setFilteredDocuments] = useState([])
//   const [selectedYear, setSelectedYear] = useState("")
//   const [selectedState, setSelectedState] = useState("")
//   const [searchQuery, setSearchQuery] = useState("")
//   const navigate = useNavigate()

//   // Filter documents based on selected year, state, and search query
//   useEffect(() => {
//     let filtered = [...documents]

//     if (selectedYear && selectedYear !== "all") {
//       filtered = filtered.filter((doc) => doc.year === selectedYear)
//     }

//     if (selectedState && selectedState !== "all") {
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

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this document?")) {
//       try {
//         await deleteDocument(id)
//       } catch (error) {
//         console.error("Error in delete handler:", error)
//       }
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Document Management</CardTitle>
//         <CardDescription>View, edit, and delete documents in the system</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex flex-col md:flex-row gap-4 mb-6">
//           <div className="flex-1">
//             <Input
//               placeholder="Search documents..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <Select value={selectedYear} onValueChange={setSelectedYear}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by year" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Years</SelectItem>
//                 {years.map((year) => (
//                   <SelectItem key={year} value={year}>
//                     {year}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <Select value={selectedState} onValueChange={setSelectedState}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by state" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All States</SelectItem>
//                 {nigerianStates.map((state) => (
//                   <SelectItem key={state} value={state}>
//                     {state}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center py-8">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : filteredDocuments.length > 0 ? (
//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Title</TableHead>
//                   <TableHead>Year</TableHead>
//                   <TableHead>State</TableHead>
//                   <TableHead>Date Added</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredDocuments.map((doc) => (
//                   <TableRow key={doc.id}>
//                     <TableCell className="font-medium">{doc.title}</TableCell>
//                     <TableCell>{doc.year}</TableCell>
//                     <TableCell>{doc.state}</TableCell>
//                     <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-2">
//                         <Button variant="outline" size="sm" onClick={() => navigate(`/documents/${doc.id}`)}>
//                           <Eye className="h-4 w-4" />
//                           <span className="sr-only">View</span>
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={() => navigate(`/documents/edit/${doc.id}`)}>
//                           <Edit className="h-4 w-4" />
//                           <span className="sr-only">Edit</span>
//                         </Button>
//                         <Button variant="outline" size="sm" onClick={() => handleDelete(doc.id)}>
//                           <Trash2 className="h-4 w-4" />
//                           <span className="sr-only">Delete</span>
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12 text-center">
//             <FileText className="h-12 w-12 text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium">No documents found</h3>
//             <p className="text-muted-foreground mt-2">
//               {documents.length === 0 ? "Start by uploading your first document" : "Try adjusting your filters"}
//             </p>
//           </div>
//         )}

//         <div className="mt-6">
//           <Button onClick={() => navigate("/documents/create")}>Add New Document</Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default DocumentList

