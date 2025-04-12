"use client"

import { Button } from "@/components/ui/button"
import { Download, FileSpreadsheet, FileText, FileType, BarChart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { CSVLink } from "react-csv"
import { exportToExcel } from "./export-utils"
import { generatePDF, generateEnhancedPDF, formatAllDataForCSV } from "./enhanced-pdf-export"
import jsPDF from "jspdf"
import "jspdf-autotable"

export function ExportDropdown({ analyticsData }) {
  // Get formatted data for CSV export
  const csvData = formatAllDataForCSV(analyticsData)

  // Create summary data for quick export
  const getSummaryData = () => {
    if (!analyticsData?.overallCounts) return { headers: [], data: [] }

    const artisanCount = analyticsData.overallCounts.find((item) => item._id === "artisan_user")?.count || 0
    const intendingCount = analyticsData.overallCounts.find((item) => item._id === "intending_artisan")?.count || 0
    const totalCount = artisanCount + intendingCount
    const totalCenters = analyticsData.trainingCenterStats?.totalCenters || 0

    const headers = [
      { label: "Category", key: "category" },
      { label: "Count", key: "count" },
      { label: "Percentage", key: "percentage" },
    ]

    const data = [
      {
        category: "Training Centers",
        count: totalCenters,
        percentage: "-",
      },
      {
        category: "Artisan Users",
        count: artisanCount,
        percentage: ((artisanCount / totalCount) * 100).toFixed(2) + "%",
      },
      {
        category: "Intending Artisans",
        count: intendingCount,
        percentage: ((intendingCount / totalCount) * 100).toFixed(2) + "%",
      },
      {
        category: "Total Users",
        count: totalCount,
        percentage: "100%",
      },
    ]

    return { headers, data }
  }

  const summaryData = getSummaryData()

  // Function to generate a summary PDF
  const generateSummaryPDF = () => {
    if (!analyticsData) return

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Distribution Summary Report", 105, 20, { align: "center" })
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 30, { align: "center" })

    // Add summary counts
    if (analyticsData.overallCounts?.length) {
      const artisanCount = analyticsData.overallCounts.find((item) => item._id === "artisan_user")?.count || 0
      const intendingCount = analyticsData.overallCounts.find((item) => item._id === "intending_artisan")?.count || 0
      const totalCount = artisanCount + intendingCount
      const totalCenters = analyticsData.trainingCenterStats?.totalCenters || 0

      doc.setFontSize(14)
      doc.text("Distribution Summary", 105, 50, { align: "center" })

      doc.autoTable({
        startY: 60,
        head: [["Category", "Count", "Percentage"]],
        body: [
          ["Training Centers", totalCenters.toLocaleString(), "-"],
          ["Artisan Users", artisanCount.toLocaleString(), ((artisanCount / totalCount) * 100).toFixed(2) + "%"],
          ["Intending Artisans", intendingCount.toLocaleString(), ((intendingCount / totalCount) * 100).toFixed(2) + "%"],
          ["Total Users", totalCount.toLocaleString(), "100%"],
        ],
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12, cellPadding: 8 },
        margin: { left: 40, right: 40 },
        rowStyles: {
          0: { fillColor: [240, 247, 255] } // Light blue background for Training Centers row
        }
      })
    }

    doc.save("distribution-summary.pdf")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 py-1 text-xs">
          <Download className="mr-1 h-3 w-3" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Summary exports */}
        <DropdownMenuItem onClick={generateSummaryPDF}>
          <BarChart className="mr-2 h-4 w-4" />
          <span>Summary Report</span>
        </DropdownMenuItem>

        <CSVLink
          data={summaryData?.data || []}
          headers={summaryData?.headers || []}
          filename="distribution-summary.csv"
          className="w-full"
        >
          <DropdownMenuItem>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Summary CSV</span>
          </DropdownMenuItem>
        </CSVLink>

        <DropdownMenuSeparator />

        {/* Full exports */}
        <CSVLink
          data={csvData?.data || []}
          headers={csvData?.headers || []}
          filename="distribution-report.csv"
          className="w-full"
        >
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Full CSV</span>
          </DropdownMenuItem>
        </CSVLink>

        <DropdownMenuItem onClick={() => exportToExcel(analyticsData)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          <span>Excel</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => generatePDF(analyticsData)}>
          <FileType className="mr-2 h-4 w-4" />
          <span>PDF</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => generateEnhancedPDF(analyticsData)}>
          <FileType className="mr-2 h-4 w-4" />
          <span>Full Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

