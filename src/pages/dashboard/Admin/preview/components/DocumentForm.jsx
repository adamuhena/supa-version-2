"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDocuments } from "../contexts/DocumentContext"
import UploadButton from "@/components/UploadButton";
import { documentService } from "../Api/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
]

// Years array (current year and 10 years into the future)
const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() + i).toString())

function DocumentForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const { createDocument, updateDocument } = useDocuments()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    state: "",
    fileUrl: null,
    thumbnailUrl: null,
  })



useEffect(() => {
  // Use useCallback to memoize fetchDocument function and avoid unnecessary re-renders
  const fetchDocument = useCallback(async () => {
    try {
      setIsLoading(true);
      const document = await documentService.getById(id);

      setFormData({
        title: document.title || "",
        year: document.year || "",
        state: document.state || "",
        fileUrl: document.fileUrl || "", // Pre-fill with URL if available
        thumbnailUrl: document.thumbnailUrl || "", // Pre-fill with URL if available
      });
    } catch (error) {
      console.error("Error fetching document:", error);
      toast({
        title: "Error",
        description: "Failed to load document data",
        variant: "destructive",
      });
      // Navigate to documents on error
      navigate("/documents");
    } finally {
      // Ensure loading state is always set to false
      setIsLoading(false);
    }
  }, [id, navigate, toast]); // Dependencies

  if (isEditMode) {
    fetchDocument();
  }
}, [id, isEditMode, fetchDocument]); // useEffect dependencies

// useEffect(() => {
//   if (isEditMode) {
//     const fetchDocument = async () => {
//       try {
//         setIsLoading(true)
//         const document = await documentService.getById(id)

//         setFormData({
//           title: document.title || "",
//           year: document.year || "",
//           state: document.state || "",
//           fileUrl: document.fileUrl || "", // Pre-fill with URL if available
//           thumbnailUrl: document.thumbnailUrl || "", // Pre-fill with URL if available
//         })
//       } catch (error) {
//         console.error("Error fetching document:", error)
//         toast({
//           title: "Error",
//           description: "Failed to load document data",
//           variant: "destructive",
//         })
//         navigate("/documents")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchDocument()
//   }
// }, [id, isEditMode, navigate, toast])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle file input changes
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const { name } = e.target
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.year || !formData.state) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      })
      return
    }

    // In edit mode, file is optional. In create mode, file is required
    if (!isEditMode && !formData.fileUrl) {
      toast({
        title: "Missing File",
        description: "Please upload a document file",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      if (isEditMode) {
        await updateDocument(id, formData)
      } else {
        await createDocument(formData)
      }

      navigate("/documents")
    } catch (error) {
      console.error("Error submitting form:", error)
      // Toast is already handled in the context
    } finally {
      setIsLoading(false)
    }
  }

    // Generate years array (10 years in the past and 10 years in the future)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) =>
      (currentYear - 10 + i).toString()
    );
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Document" : "Upload New Document"}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update document information" : "Add a new document to the system"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Document Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter document title"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="year" className="text-sm font-medium">
                Year
              </label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger id="year">
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

            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium">
                State
              </label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
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
          </div>

          {/* <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-medium">
              PDF Document {isEditMode && "(Leave empty to keep current file)"}
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                </div>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileChange}
                  required={!isEditMode}
                />
              </label>
            </div>
            {formData.file && <p className="text-sm text-muted-foreground mt-2">Selected file: {formData.file.name}</p>}
          </div> */}

<div className="space-y-2">
  <label htmlFor="file" className="text-sm font-medium">
    PDF Document {isEditMode && "(Leave empty to keep current file)"}
  </label>

  {/* New UploadButton for AWS upload */}
  <UploadButton
  fileUrl={formData.fileUrl}
  title="file"
  accept=".pdf"
  handleFileChange={(fileUrl) => {
    setFormData({ ...formData, fileUrl }); // 🔥 correct key
  }}
  removeFile={() => {
    setFormData({ ...formData, fileUrl: "" });
  }}
/>

{formData.fileUrl && (
  <p className="text-sm text-muted-foreground mt-2">
    Uploaded file: {formData.fileUrl}
  </p>
)}
</div>


          {/* <div className="space-y-2">
            <label htmlFor="thumbnail" className="text-sm font-medium">
              Thumbnail Image (Optional) {isEditMode && "(Leave empty to keep current thumbnail)"}
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 2MB)</p>
                </div>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {formData.thumbnail && (
              <p className="text-sm text-muted-foreground mt-2">Selected thumbnail: {formData.thumbnail.name}</p>
            )}
          </div> */}

<div className="space-y-2">
  <label htmlFor="thumbnail" className="text-sm font-medium">
    Thumbnail Image (Optional) {isEditMode && "(Leave empty to keep current thumbnail)"}
  </label>

  {/* New UploadButton for AWS upload */}
  <UploadButton
  fileUrl={formData.thumbnailUrl}
  title="thumbnail"
  accept="image/png, image/jpeg, image/webp"
  handleFileChange={(thumbnailUrl) => {
    setFormData({ ...formData, thumbnailUrl }); // 🔥 correct key
  }}
  removeFile={() => {
    setFormData({ ...formData, thumbnailUrl: "" });
  }}
/>

{formData.thumbnailUrl && (
  <p className="text-sm text-muted-foreground mt-2">
    Uploaded thumbnail: {formData.thumbnailUrl}
  </p>
)}

</div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate("/documents")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Uploading..."}
              </>
            ) : (
              <>{isEditMode ? "Update Document" : "Upload Document"}</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default DocumentForm



