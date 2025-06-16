"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"
import UploadButton from "@/components/UploadButton"

const DOCUMENT_FIELDS = [
  {
    id: 'certificateOfRegistration',
    label: 'Certificate of Registration',
    required: true
  },
  {
    id: 'taxClearanceCertificate',
    label: 'Tax Clearance Certificate',
    required: true
  },
  {
    id: 'proofOfAddress',
    label: 'Proof of Address',
    required: true
  },
  {
    id: 'accreditationCertificate',
    label: 'Accreditation Certificate',
    required: true
  }
]

// Add this utility function after the imports
const cleanFileUrl = (url) => {
  if (!url) return '';
  // Remove timestamp numbers after file extension
  return url.replace(/(\.[^.]+)\d+$/, '$1');
};

const BasicInfoTab = ({ center, handleInputChange, handleSubmit }) => {
  // Function to handle document updates
  const handleDocumentChange = (field, value) => {
    // Clean the URL before saving
    const newValue = typeof value === 'string' 
      ? cleanFileUrl(value)
      : value?.returnedUri 
        ? cleanFileUrl(value.returnedUri)
        : '';
      
    const updatedDocs = {
      ...(center.verificationDocuments || {}),
      [field]: newValue
    };

    handleInputChange({
      target: {
        name: 'verificationDocuments',
        value: updatedDocs
      }
    });
  }

  // Function to handle document removal
  const handleDocumentRemoval = (field) => {
    handleDocumentChange(field, '')
  }

  // Validation function
  const isFormValid = () => {
    const docs = center.verificationDocuments || {}
    return DOCUMENT_FIELDS.every(field => 
      !field.required || Boolean(docs[field.id])
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-left font-[600] text-[20px]">
          Verification Documents
        </h2>
        
        {DOCUMENT_FIELDS.map(field => (
          <div key={field.id} className="space-y-2">
            <Label 
              htmlFor={field.id} 
              className="text-left leading-[1.3] flex items-center gap-1"
            >
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            
            <div className="flex flex-col gap-2">
              <UploadButton
                fileUrl={center.verificationDocuments?.[field.id] || ''}
                title={field.label}
                handleFileChange={(url) => handleDocumentChange(field.id, url)}
                removeFile={() => handleDocumentRemoval(field.id)}
                accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
              />
              
              {center.verificationDocuments?.[field.id] && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const cleanUrl = cleanFileUrl(center.verificationDocuments[field.id]);
                    window.open(cleanUrl, '_blank');
                  }}
                  className="flex items-center gap-2 w-fit"
                >
                  <Eye className="h-4 w-4" />
                  View Document
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!isFormValid()}
      >
        {isFormValid() ? 'Update Documents' : 'Please Upload All Required Documents'}
      </Button>
    </form>
  )
}

export default BasicInfoTab