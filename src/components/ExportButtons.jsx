"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "sonner"
import { API_BASE_URL } from "@/config/env"

const ExportButtons = ({
  exportType, // 'artisans', 'clients', 'requests'
  filters = {},
  disabled = false,
}) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExcelExport = async () => {
    setIsExporting(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      // Build query parameters from filters
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value)
        }
      })

      const response = await fetch(`${API_BASE_URL}/marketplace-exports/export/${exportType}?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get("content-disposition")
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `${exportType}-export-${new Date().toISOString().split("T")[0]}.xlsx`

      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`${exportType.charAt(0).toUpperCase() + exportType.slice(1)} exported successfully!`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error(`Failed to export ${exportType}`)
    } finally {
      setIsExporting(false)
    }
  }

  const handleSummaryReport = async () => {
    setIsExporting(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      const response = await fetch(`${API_BASE_URL}/marketplace-exports/export/summary?period=30d`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Summary report generation failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `marketplace-summary-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Summary report generated successfully!")
    } catch (error) {
      console.error("Summary report error:", error)
      toast.error("Failed to generate summary report")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExcelExport}
        variant="outline"
        disabled={disabled || isExporting}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        {isExporting ? "Exporting..." : "Export to Excel"}
      </Button>

      {exportType === "artisans" && (
        <Button
          onClick={handleSummaryReport}
          variant="outline"
          disabled={disabled || isExporting}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {isExporting ? "Generating..." : "Summary Report"}
        </Button>
      )}
    </div>
  )
}

export default ExportButtons
