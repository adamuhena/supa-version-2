"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { documentService } from "../Api/api"
import { toast } from "sonner";

const DocumentContext = createContext()

export function DocumentProvider({ children }) {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  // Fetch all documents
  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const data = await documentService.getAll()
      setDocuments(data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Create document
  const createDocument = async (documentData) => {
    try {
      setIsLoading(true)
      const formData = new FormData()

      // Append form fields to FormData
      Object.keys(documentData).forEach((key) => {
        if (documentData[key] !== null) {
          formData.append(key, documentData[key])
        }
      })

      const newDocument = await documentService.create(formData)
      setDocuments([...documents, newDocument])

      toast({
        title: "Success",
        description: "Document created successfully",
      })

      return newDocument
    } catch (error) {
      console.error("Error creating document:", error)
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update document
  const updateDocument = async (id, documentData) => {
    try {
      setIsLoading(true)
      const formData = new FormData()

      // Append form fields to FormData
      Object.keys(documentData).forEach((key) => {
        if (documentData[key] !== null) {
          formData.append(key, documentData[key])
        }
      })

      const updatedDocument = await documentService.update(id, formData)

      setDocuments(documents.map((doc) => (doc.id === id ? updatedDocument : doc)))

      toast({
        title: "Success",
        description: "Document updated successfully",
      })

      return updatedDocument
    } catch (error) {
      console.error("Error updating document:", error)
      toast({
        title: "Error",
        description: "Failed to update document",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Delete document
  const deleteDocument = async (id) => {
    try {
      setIsLoading(true)
      await documentService.delete(id)
      setDocuments(documents.filter((doc) => doc.id !== id))

      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Load documents on mount
  useEffect(() => {
    fetchDocuments()
  }, [])

  const value = {
    documents,
    isLoading,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  }

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}

