import jsPDF from "jspdf"
import "jspdf-autotable"

/**
 * Formats all distribution data for CSV export
 * @param {Object} analyticsData - The complete analytics data object
 */
export const formatAllDataForCSV = (analyticsData) => {
  if (!analyticsData) return { headers: [], data: [] }

  const headers = [
    { label: "Category", key: "category" },
    { label: "Subcategory", key: "subcategory" },
    { label: "Detail", key: "detail" },
    { label: "Additional", key: "additional" },
    { label: "Total", key: "total" },
    { label: "Artisan Users", key: "artisan_user" },
    { label: "Intending Artisans", key: "intending_artisan" },
  ]

  const data = []

  // Add summary counts including training centers
  if (analyticsData.overallCounts?.length) {
    const artisanCount = analyticsData.overallCounts.find((item) => item._id === "artisan_user")?.count || 0
    const intendingCount = analyticsData.overallCounts.find((item) => item._id === "intending_artisan")?.count || 0
    const totalCount = artisanCount + intendingCount
    const totalCenters = analyticsData.trainingCenterStats?.totalCenters || 0

    // Add Training Centers count first
    data.push({
      category: "Summary",
      subcategory: "Overall Counts",
      detail: "Training Centers",
      additional: "",
      total: totalCenters,
      artisan_user: 0,
      intending_artisan: 0,
    })

    // Then add user counts
    data.push({
      category: "Summary",
      subcategory: "Overall Counts",
      detail: "Artisan Users",
      additional: "",
      total: artisanCount,
      artisan_user: artisanCount,
      intending_artisan: 0,
    })

    data.push({
      category: "Summary",
      subcategory: "Overall Counts",
      detail: "Intending Artisans",
      additional: "",
      total: intendingCount,
      artisan_user: 0,
      intending_artisan: intendingCount,
    })

    data.push({
      category: "Summary",
      subcategory: "Overall Counts",
      detail: "Total Users",
      additional: "",
      total: totalCount,
      artisan_user: artisanCount,
      intending_artisan: intendingCount,
    })
  }

  // 1. Overall Counts - Include Training Centers
  analyticsData.overallCounts?.forEach((item) => {
    data.push({
      category: "Overall",
      subcategory: "Role",
      detail: item._id || "Unknown",
      additional: "",
      total: item.count || 0,
      artisan_user: item._id === "artisan_user" ? item.count : 0,
      intending_artisan: item._id === "intending_artisan" ? item.count : 0,
    })
  })

  // Add Training Centers as part of overall counts
  data.push({
    category: "Overall",
    subcategory: "Infrastructure",
    detail: "Training Centers",
    additional: "",
    total: analyticsData.trainingCenterStats?.totalCenters || 0,
    artisan_user: 0,
    intending_artisan: 0,
  })

// 2. Gender Distribution
analyticsData.genderDistribution?.forEach((item) => {
  data.push({
    category: "Gender",
    subcategory: "All",
    detail: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Unknown",
    additional: "",
    total: item.total || 0,
    artisan_user: item.artisan_user || 0,
    intending_artisan: item.intending_artisan || 0,
  });
});

  // 3. Gender by State
  analyticsData.genderByStateOfResidence?.forEach((item) => {
    data.push({
      category: "Gender",
      subcategory: "By State",
      detail: item._id?.gender ? item._id.gender.charAt(0).toUpperCase() + item._id.gender.slice(1) : "Unknown",
      additional: item._id?.stateOfResidence || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 4. Gender by LGA
  analyticsData.genderByLga?.forEach((item) => {
    data.push({
      category: "Gender",
      subcategory: "By LGA",
      detail: item._id?.gender ? item._id.gender.charAt(0).toUpperCase() + item._id.gender.slice(1) : "Unknown",
      additional: `${item._id?.lga || "Unknown"}, ${item._id?.state || "Unknown"}`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 5. State of Residence
  analyticsData.stateOfResidenceDistribution?.forEach((item) => {
    data.push({
      category: "Geographic",
      subcategory: "State of Residence",
      detail: item._id || "Unknown",
      additional: "",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 6. State of Origin
  analyticsData.stateOfOriginDistribution?.forEach((item) => {
    data.push({
      category: "Geographic",
      subcategory: "State of Origin",
      detail: item._id || "Unknown",
      additional: "",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 7. LGA of Residence
  analyticsData.lgaOfResidenceDistribution?.forEach((item) => {
    data.push({
      category: "Geographic",
      subcategory: "LGA of Residence",
      detail: item._id?.lga || "Unknown",
      additional: item._id?.state || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 8. LGA Distribution (Origin)
  analyticsData.lgaDistribution?.forEach((item) => {
    data.push({
      category: "Geographic",
      subcategory: "LGA of Origin",
      detail: item._id?.lga || "Unknown",
      additional: item._id?.state || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 9. Senatorial District
  analyticsData.senatorialDistrictDistribution?.forEach((item) => {
    data.push({
      category: "Geographic",
      subcategory: "Senatorial District",
      detail: item._id?.district || "Unknown",
      additional: item._id?.state || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 10. Sector by State
  analyticsData.sectorByStateOfResidence?.forEach((item) => {
    data.push({
      category: "Sector",
      subcategory: "By State",
      detail: item._id?.sector || "Unknown",
      additional: item._id?.state || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 11. Sector by LGA
  analyticsData.sectorByLgaOfResidence?.forEach((item) => {
    data.push({
      category: "Sector",
      subcategory: "By LGA",
      detail: item._id?.sector || "Unknown",
      additional: `${item._id?.lga || "Unknown"}, ${item._id?.state || "Unknown"}`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 12. Trade Area by State
  analyticsData.tradeAreaByStateOfResidence?.forEach((item) => {
    data.push({
      category: "Trade Area",
      subcategory: "By State",
      detail: item._id?.tradeArea || "Unknown",
      additional: `${item._id?.state || "Unknown"} (${item._id?.sector || "Unknown"})`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 13. Trade Area by LGA
  analyticsData.tradeAreaByLgaOfResidence?.forEach((item) => {
    data.push({
      category: "Trade Area",
      subcategory: "By LGA",
      detail: item._id?.tradeArea || "Unknown",
      additional: `${item._id?.lga || "Unknown"}, ${item._id?.state || "Unknown"} (${item._id?.sector || "Unknown"})`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 14. State Residence-Origin Cross Tab
  analyticsData.stateResidenceOriginCrossTab?.forEach((item) => {
    data.push({
      category: "Cross Tab",
      subcategory: "State Residence-Origin",
      detail: `Residence: ${item._id?.stateOfResidence || "Unknown"}`,
      additional: `Origin: ${item._id?.stateOfOrigin || "Unknown"}`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 15. LGA Cross Tab
  analyticsData.lgaCrossTab?.forEach((item) => {
    data.push({
      category: "Cross Tab",
      subcategory: "LGA Residence-Origin",
      detail: `Residence: ${item._id?.residenceLga || "Unknown"}, ${item._id?.residenceState || "Unknown"}`,
      additional: `Origin: ${item._id?.originLga || "Unknown"}, ${item._id?.originState || "Unknown"}`,
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    })
  })

  // 16. Training Centers
  analyticsData.trainingCenterStats?.centersByState?.forEach((item) => {
    data.push({
      category: "Training Centers",
      subcategory: "By State",
      detail: item._id || "Unknown",
      additional: "",
      total: item.count || 0,
      artisan_user: 0,
      intending_artisan: 0,
    })
  })

   // Add training center data
   if (analyticsData.trainingCenterStats) {
    // Centers by State
    analyticsData.trainingCenterStats.centersByState?.forEach((item) => {
      data.push({
        category: "Training Centers",
        subcategory: "By State",
        detail: item._id || "Unknown",
        additional: "",
        total: item.count || 0,
        artisan_user: 0,
        intending_artisan: 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      });
    });

    // Centers by Sector
    analyticsData.trainingCenterStats.centersBySector?.forEach((item) => {
      data.push({
        category: "Training Centers",
        subcategory: "By Sector",
        detail: item._id.sectorName || "Unknown",
        additional: item._id.state || "Unknown",
        total: item.count || 0,
        artisan_user: 0,
        intending_artisan: 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      });
    });

    // Centers by Trade Area
    analyticsData.trainingCenterStats.centersByTradeArea?.forEach((item) => {
      data.push({
        category: "Training Centers",
        subcategory: "By Trade Area",
        detail: item._id.tradeAreaName || "Unknown",
        additional: `${item._id.state || "Unknown"} - ${item._id.sectorName || "Unknown"}`,
        total: item.count || 0,
        artisan_user: 0,
        intending_artisan: 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      });
    });
  }

  return { headers, data };
};


/**
 * Generates a basic PDF report with distribution data
 * @param {Object} analyticsData - The complete analytics data object
 */
export const generatePDF = (analyticsData) => {
  if (!analyticsData) return

  // Create PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text("Distribution Dashboard Report", 14, 15)
  doc.setFontSize(10)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25)

  // Add summary counts at the top
  if (analyticsData.overallCounts?.length) {
    const artisanCount = analyticsData.overallCounts.find((item) => item._id === "artisan_user")?.count || 0
    const intendingCount = analyticsData.overallCounts.find((item) => item._id === "intending_artisan")?.count || 0
    const totalCount = artisanCount + intendingCount

    doc.setFontSize(12)
    doc.text("Summary Counts", 14, 35)

    doc.autoTable({
      startY: 40,
      head: [["Category", "Count", "Percentage"]],
      body: [
        ["Artisan Users", artisanCount.toLocaleString(), ((artisanCount / totalCount) * 100).toFixed(2) + "%"],
        ["Intending Artisans", intendingCount.toLocaleString(), ((intendingCount / totalCount) * 100).toFixed(2) + "%"],
        ["Total Users", totalCount.toLocaleString(), "100%"],
      ],
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    })

    // Format data for the rest of the report
    const { headers, data } = formatAllDataForCSV(analyticsData)

    // Create table for the rest of the data
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 10,
      head: [headers.map((h) => h.label)],
      body: data.map((item) => [
        item.category,
        item.subcategory,
        item.detail,
        item.additional,
        item.total,
        item.artisan_user,
        item.intending_artisan,
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })
  } else {
    // If no summary counts, just show the regular data
    const { headers, data } = formatAllDataForCSV(analyticsData)

    doc.autoTable({
      startY: 35,
      head: [headers.map((h) => h.label)],
      body: data.map((item) => [
        item.category,
        item.subcategory,
        item.detail,
        item.additional,
        item.total,
        item.artisan_user,
        item.intending_artisan,
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    })
  }

  doc.save("distribution-report.pdf")
}

/**
 * Generates a comprehensive PDF report that matches the dashboard layout
 * @param {Object} analyticsData - The complete analytics data object
 */
export const generateEnhancedPDF = async (analyticsData) => {
  if (!analyticsData) return

  // Create PDF document
  const doc = new jsPDF()

  // Add title and metadata
  doc.setFontSize(20)
  doc.setTextColor(33, 33, 33)
  doc.text("Distribution Dashboard Report", 105, 15, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 22, { align: "center" })

  // Add summary metrics
  doc.setFontSize(14)
  doc.setTextColor(33, 33, 33)
  doc.text("Summary Counts", 14, 30)

  const artisanCount = analyticsData.overallCounts?.find((i) => i._id === "artisan_user")?.count || 0
  const intendingCount = analyticsData.overallCounts?.find((i) => i._id === "intending_artisan")?.count || 0
  const totalUsers = artisanCount + intendingCount

  // Update the metrics array to include training centers
  const metrics = [
    {
      label: "Training Centers",
      value: analyticsData.trainingCenterStats?.totalCenters?.toLocaleString() || "0",
      percentage: "-",
    },
    {
      label: "Artisan Users",
      value: artisanCount.toLocaleString(),
      percentage: ((artisanCount / totalUsers) * 100).toFixed(1) + "%",
    },
    {
      label: "Intending Artisans",
      value: intendingCount.toLocaleString(),
      percentage: ((intendingCount / totalUsers) * 100).toFixed(1) + "%",
    },
    { 
      label: "Total Users", 
      value: totalUsers.toLocaleString(), 
      percentage: "100%" 
    },
  ]

  // Update the table styling to better accommodate the training centers row
  doc.autoTable({
    startY: 35,
    head: [["Category", "Count", "Percentage"]],
    body: metrics.map((m) => [m.label, m.value, m.percentage]),
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 11 },
    styles: { fontSize: 10, fontStyle: "normal" },
    rowStyles: {
      0: { fontStyle: "bold", fillColor: [240, 247, 255] } // Highlight training centers row
    },
    margin: { left: 14, right: 14 },
  })

  let yPos = doc.lastAutoTable.finalY + 10

  // Gender Distribution Section
  // if (analyticsData.genderDistribution?.length) {
  //   doc.setFontSize(12)
  //   doc.text("Gender Distribution", 14, yPos)

  //   // Process gender data to include role counts
  //   const genderData = analyticsData.genderDistribution.map((item) => {
  //     const artisanCount = item.roles?.find((r) => r.role === "artisan_user")?.count || 0
  //     const intendingCount = item.roles?.find((r) => r.role === "intending_artisan")?.count || 0

  //     return [
  //       item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Unknown",
  //       item.total.toLocaleString(),
  //       artisanCount.toLocaleString(),
  //       intendingCount.toLocaleString(),
  //       ((item.total / totalUsers) * 100).toFixed(2) + "%",
  //     ]
  //   })

  //   doc.autoTable({
  //     startY: yPos + 5,
  //     head: [["Gender", "Total", "Artisan Users", "Intending Artisans", "Percentage"]],
  //     body: genderData,
  //     theme: "grid",
  //     headStyles: { fillColor: [41, 128, 185], textColor: 255 },
  //     styles: { fontSize: 10 },
  //     margin: { left: 14, right: 14 },
  //   })

  //   yPos = doc.lastAutoTable.finalY + 10
  // }
// Update the gender distribution section in generateEnhancedPDF
if (analyticsData.genderDistribution?.length) {
  doc.setFontSize(12);
  doc.text("Gender Distribution", 14, yPos);

  const genderData = analyticsData.genderDistribution
    .map((item) => [
      item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : "Unknown",
      item.total.toLocaleString(),
      item.artisan_user.toLocaleString(),
      item.intending_artisan.toLocaleString(),
      ((item.total / totalUsers) * 100).toFixed(2) + "%",
    ])
    .sort((a, b) => parseInt(b[1].replace(/,/g, "")) - parseInt(a[1].replace(/,/g, "")));

  doc.autoTable({
    startY: yPos + 5,
    head: [["Gender", "Total", "Artisan Users", "Intending Artisans", "Percentage"]],
    body: genderData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });

  yPos = doc.lastAutoTable.finalY + 10;
}

  // Geographic Distribution Section
  if (analyticsData.stateOfResidenceDistribution?.length) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(12)
    doc.text("Geographic Distribution - Top States", 14, yPos)

    const topStates = analyticsData.stateOfResidenceDistribution.sort((a, b) => b.total - a.total).slice(0, 10)

    doc.autoTable({
      startY: yPos + 5,
      head: [["State", "Total", "Artisan Users", "Intending Artisans", "Percentage"]],
      body: topStates.map((item) => [
        item._id || "Unknown",
        item.total.toLocaleString(),
        item.artisan_user.toLocaleString(),
        item.intending_artisan.toLocaleString(),
        ((item.total / totalUsers) * 100).toFixed(2) + "%",
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    })

    yPos = doc.lastAutoTable.finalY + 10
  }

  // Sector Distribution Section
  if (analyticsData.sectorByStateOfResidence?.length) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(12)
    doc.text("Sector Distribution", 14, yPos)

    // Group by sector and sum counts
    const sectorCounts = {}
    analyticsData.sectorByStateOfResidence.forEach((item) => {
      const sector = item._id?.sector || "Unknown"
      if (!sectorCounts[sector]) {
        sectorCounts[sector] = {
          total: 0,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }
      sectorCounts[sector].total += item.total || 0
      sectorCounts[sector].artisan_user += item.artisan_user || 0
      sectorCounts[sector].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort
    const sectorData = Object.entries(sectorCounts)
      .map(([sector, counts]) => ({
        sector,
        ...counts,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    doc.autoTable({
      startY: yPos + 5,
      head: [["Sector", "Total", "Artisan Users", "Intending Artisans", "Percentage"]],
      body: sectorData.map((item) => [
        item.sector,
        item.total.toLocaleString(),
        item.artisan_user.toLocaleString(),
        item.intending_artisan.toLocaleString(),
        ((item.total / totalUsers) * 100).toFixed(2) + "%",
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    })

    yPos = doc.lastAutoTable.finalY + 10
  }

  // Trade Area Distribution Section
  if (analyticsData.tradeAreaByStateOfResidence?.length) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(12)
    doc.text("Trade Area Distribution", 14, yPos)

    // Group by trade area and sum counts
    const tradeAreaCounts = {}
    analyticsData.tradeAreaByStateOfResidence.forEach((item) => {
      const tradeArea = item._id?.tradeArea || "Unknown"
      const sector = item._id?.sector || "Unknown"
      const key = `${tradeArea} (${sector})`

      if (!tradeAreaCounts[key]) {
        tradeAreaCounts[key] = {
          total: 0,
          artisan_user: 0,
          intending_artisan: 0,
        }
      }

      tradeAreaCounts[key].total += item.total || 0
      tradeAreaCounts[key].artisan_user += item.artisan_user || 0
      tradeAreaCounts[key].intending_artisan += item.intending_artisan || 0
    })

    // Convert to array and sort
    const tradeAreaData = Object.entries(tradeAreaCounts)
      .map(([key, counts]) => ({
        key,
        ...counts,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    doc.autoTable({
      startY: yPos + 5,
      head: [["Trade Area (Sector)", "Total", "Artisan Users", "Intending Artisans", "Percentage"]],
      body: tradeAreaData.map((item) => [
        item.key,
        item.total.toLocaleString(),
        item.artisan_user.toLocaleString(),
        item.intending_artisan.toLocaleString(),
        ((item.total / totalUsers) * 100).toFixed(2) + "%",
      ]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    })

    yPos = doc.lastAutoTable.finalY + 10
  }

  // Training Centers Section
  if (analyticsData.trainingCenterStats?.centersByState?.length) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage()
      yPos = 15
    }

    doc.setFontSize(12)
    doc.text("Training Centers Distribution", 14, yPos)

    const topTrainingCenters = analyticsData.trainingCenterStats.centersByState
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    doc.autoTable({
      startY: yPos + 5,
      head: [["State", "Number of Centers"]],
      body: topTrainingCenters.map((item) => [item._id || "Unknown", item.count.toLocaleString()]),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    })

    yPos = doc.lastAutoTable.finalY + 10
  }

  // Add Training Centers Section
  if (analyticsData.trainingCenterStats) {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage();
      yPos = 15;
    }

    doc.setFontSize(14);
    doc.text("Training Centers Distribution", 14, yPos);
    yPos += 10;

    // Centers by State
    const stateCenters = analyticsData.trainingCenterStats.centersByState || [];
    if (stateCenters.length) {
      doc.autoTable({
        startY: yPos,
        head: [["State", "Count", "Centers"]],
        body: stateCenters.map(item => [
          item._id || "Unknown",
          item.count || 0,
          (item.centers || []).map(c => c.name).join(", ")
        ]),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          2: { cellWidth: 'auto' }
        }
      });
      yPos = doc.lastAutoTable.finalY + 10;
    }

    // Centers by Sector
    if (yPos > 230) {
      doc.addPage();
      yPos = 15;
    }

    const sectorCenters = analyticsData.trainingCenterStats.centersBySector || [];
    if (sectorCenters.length) {
      doc.autoTable({
        startY: yPos,
        head: [["State", "Sector", "Count", "Centers"]],
        body: sectorCenters.map(item => [
          item._id.state || "Unknown",
          item._id.sectorName || "Unknown",
          item.count || 0,
          (item.centers || []).map(c => c.name).join(", ")
        ]),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          3: { cellWidth: 'auto' }
        }
      });
    }
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" })
  }

  doc.save("distribution-report.pdf")
}

