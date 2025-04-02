"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Eye } from "lucide-react"
import UploadButton from "@/components/UploadButton"

const BasicInfoTab = ({ center, handleInputChange, handleSubmit }) => {
  // Function to handle document updates
  const handleDocumentChange = (field, fileUrl) => {
    handleInputChange({
      target: {
        name: `verificationDocuments.${field}`,
        value: fileUrl
      }
    })
  }

  // Validation function
  const isFormValid = () => {
    const docs = center.verificationDocuments || {};
    return Boolean(
      docs.certificateOfRegistration &&
      docs.taxClearanceCertificate &&
      docs.proofOfAddress &&
      docs.accreditationCertificate
    );
  }

  return (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          {/* <div className="space-y-4">
            <h2 className="text-left font-[600] text-[20px]">Basic Information</h2>
            <Input
              name="trainingCentreName"
              value={center.trainingCentreName}
              onChange={handleInputChange}
              placeholder="Training Centre Name"
            />
            <Input 
              name="regNum" 
              value={center.regNum} 
              onChange={handleInputChange} 
              placeholder="Registration Number" 
            />
            <Input 
              name="email" 
              type="email" 
              value={center.email} 
              onChange={handleInputChange} 
              placeholder="Email" 
            />
            <Input
              name="phoneNumber"
              value={center.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
            <Input 
              name="address" 
              value={center.address} 
              onChange={handleInputChange} 
              placeholder="Address" 
            />
          </div> */}

          {/* Verification Documents Section */}
          <div className="space-y-4">
            <h2 className="text-left font-[600] text-[20px]">Verification Documents</h2>
            
            {/* Certificate of Registration */}
            <div className="space-y-2">
              <Label htmlFor="certificateOfRegistration" className="text-left leading-[1.3]">
                Certificate of Registration
              </Label>
              <div className="flex flex-col gap-2">
                <UploadButton
                  fileUrl={center.verificationDocuments?.certificateOfRegistration}
                  handleFileChange={(url) => handleDocumentChange("certificateOfRegistration", url)}
                  removeFile={() => handleDocumentChange("certificateOfRegistration", "")}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                />
                {center.verificationDocuments?.certificateOfRegistration && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(center.verificationDocuments.certificateOfRegistration, '_blank')}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Eye className="h-4 w-4" />
                    View Document
                  </Button>
                )}
              </div>
            </div>

            {/* Tax Clearance Certificate */}
            <div className="space-y-2">
              <Label htmlFor="taxClearanceCertificate" className="text-left leading-[1.3]">
                Tax Clearance Certificate
              </Label>
              <div className="flex flex-col gap-2">
                <UploadButton
                  fileUrl={center.verificationDocuments?.taxClearanceCertificate}
                  handleFileChange={(url) => handleDocumentChange("taxClearanceCertificate", url)}
                  removeFile={() => handleDocumentChange("taxClearanceCertificate", "")}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                />
                {center.verificationDocuments?.taxClearanceCertificate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(center.verificationDocuments.taxClearanceCertificate, '_blank')}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Eye className="h-4 w-4" />
                    View Document
                  </Button>
                )}
              </div>
            </div>

            {/* Proof of Address */}
            <div className="space-y-2">
              <Label htmlFor="proofOfAddress" className="text-left leading-[1.3]">
                Proof of Address
              </Label>
              <div className="flex flex-col gap-2">
                <UploadButton
                  fileUrl={center.verificationDocuments?.proofOfAddress}
                  handleFileChange={(url) => handleDocumentChange("proofOfAddress", url)}
                  removeFile={() => handleDocumentChange("proofOfAddress", "")}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                />
                {center.verificationDocuments?.proofOfAddress && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(center.verificationDocuments.proofOfAddress, '_blank')}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Eye className="h-4 w-4" />
                    View Document
                  </Button>
                )}
              </div>
            </div>

            {/* Accreditation Certificate */}
            <div className="space-y-2">
              <Label htmlFor="accreditationCertificate" className="text-left leading-[1.3]">
                Accreditation Certificate
              </Label>
              <div className="flex flex-col gap-2">
                <UploadButton
                  fileUrl={center.verificationDocuments?.accreditationCertificate}
                  handleFileChange={(url) => handleDocumentChange("accreditationCertificate", url)}
                  removeFile={() => handleDocumentChange("accreditationCertificate", "")}
                  accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                  
                />
                {center.verificationDocuments?.accreditationCertificate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(center.verificationDocuments.accreditationCertificate, '_blank')}
                    className="flex items-center gap-2 w-fit"
                  >
                    <Eye className="h-4 w-4" />
                    View Document
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            // disabled={!isFormValid()}
            disabled={true} 
          >
            {isFormValid() ? 'Update Basic Info' : 'Please Upload All Required Documents'}
          </Button>
        </form>
  )
}

export default BasicInfoTab

