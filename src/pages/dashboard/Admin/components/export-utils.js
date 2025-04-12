import * as XLSX from "xlsx"

/**
 * Exports data to a multi-sheet Excel file
 * @param {Object} analyticsData - The complete analytics data object
 * @param {string} filename - The name of the file to be downloaded
 */
export const exportToExcel = (analyticsData, filename = "distribution-report.xlsx") => {
  if (!analyticsData) return

  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Helper function to create a worksheet from data
  const createWorksheet = (data, headers) => {
    // Create array with headers as first row
    const wsData = [headers.map((h) => h.label)]

    // Add data rows
    data.forEach((item) => {
      const row = headers.map((header) => item[header.key])
      wsData.push(row)
    })

    return XLSX.utils.aoa_to_sheet(wsData)
  }

  // 0. Summary Counts - Add this as the first sheet
  if (analyticsData.overallCounts?.length) {
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

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Summary Counts")
  }

  // 1. Overall Counts
  if (analyticsData.overallCounts?.length) {
    const headers = [
      { label: "Category", key: "category" },
      { label: "Count", key: "count" },
    ]

    const totalCenters = analyticsData.trainingCenterStats?.totalCenters || 0
    
    const data = [
      {
        category: "Training Centers",
        count: totalCenters,
      },
      ...analyticsData.overallCounts.map((item) => ({
        category: item._id || "Unknown",
        count: item.count || 0,
      }))
    ]

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Overall Counts")
  }

  // 2. Gender Distribution
  if (analyticsData.genderDistribution?.length) {
    const headers = [
      { label: "Gender", key: "gender" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
      { label: "Percentage", key: "percentage" },
    ]

    const totalUsers = analyticsData.genderDistribution.reduce((sum, item) => sum + (item.total || 0), 0)

    const data = analyticsData.genderDistribution.map((item) => ({
      gender: item._id ? 
        (item._id === "" ? "Unknown" : item._id.charAt(0).toUpperCase() + item._id.slice(1)) 
        : "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
      percentage: ((item.total / totalUsers) * 100).toFixed(2) + "%",
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Gender Distribution")
  }

  // 3. Gender by State
  if (analyticsData.genderByStateOfResidence?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Gender", key: "gender" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.genderByStateOfResidence.map((item) => ({
      state: item._id?.stateOfResidence || "Unknown",
      gender: item._id?.gender ? item._id.gender.charAt(0).toUpperCase() + item._id.gender.slice(1) : "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Gender by State")
  }

  // 4. Gender by LGA
  if (analyticsData.genderByLga?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "LGA", key: "lga" },
      { label: "Gender", key: "gender" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.genderByLga.map((item) => ({
      state: item._id?.state || "Unknown",
      lga: item._id?.lga || "Unknown",
      gender: item._id?.gender ? item._id.gender.charAt(0).toUpperCase() + item._id.gender.slice(1) : "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Gender by LGA")
  }

  // 5. State of Residence
  if (analyticsData.stateOfResidenceDistribution?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
      { label: "Percentage", key: "percentage" },
    ]

    const totalUsers = analyticsData.overallCounts?.reduce((sum, item) => sum + item.count, 0) || 0

    const data = analyticsData.stateOfResidenceDistribution.map((item) => ({
      state: item._id || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
      percentage: ((item.total / totalUsers) * 100).toFixed(2) + "%",
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "States of Residence")
  }

  // 6. State of Origin
  if (analyticsData.stateOfOriginDistribution?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
      { label: "Percentage", key: "percentage" },
    ]

    const totalUsers = analyticsData.overallCounts?.reduce((sum, item) => sum + item.count, 0) || 0

    const data = analyticsData.stateOfOriginDistribution.map((item) => ({
      state: item._id || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
      percentage: ((item.total / totalUsers) * 100).toFixed(2) + "%",
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "States of Origin")
  }

  // 7. LGA of Residence
  if (analyticsData.lgaOfResidenceDistribution?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "LGA", key: "lga" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.lgaOfResidenceDistribution.map((item) => ({
      state: item._id?.state || "Unknown",
      lga: item._id?.lga || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "LGA of Residence")
  }

  // 8. LGA Distribution (Origin)
  if (analyticsData.lgaDistribution?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "LGA", key: "lga" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.lgaDistribution.map((item) => ({
      state: item._id?.state || "Unknown",
      lga: item._id?.lga || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "LGA of Origin")
  }

  // 9. Senatorial District
  if (analyticsData.senatorialDistrictDistribution?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Senatorial District", key: "district" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.senatorialDistrictDistribution.map((item) => ({
      state: item._id?.state || "Unknown",
      district: item._id?.district || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Senatorial Districts")
  }

  // 10. Sector by State
  if (analyticsData.sectorByStateOfResidence?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Sector", key: "sector" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.sectorByStateOfResidence.map((item) => ({
      state: item._id?.state || "Unknown",
      sector: item._id?.sector || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Sector by State")
  }

  // 11. Sector by LGA
  if (analyticsData.sectorByLgaOfResidence?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "LGA", key: "lga" },
      { label: "Sector", key: "sector" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.sectorByLgaOfResidence.map((item) => ({
      state: item._id?.state || "Unknown",
      lga: item._id?.lga || "Unknown",
      sector: item._id?.sector || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Sector by LGA")
  }

  // 12. Trade Area by State
  if (analyticsData.tradeAreaByStateOfResidence?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "Sector", key: "sector" },
      { label: "Trade Area", key: "tradeArea" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.tradeAreaByStateOfResidence.map((item) => ({
      state: item._id?.state || "Unknown",
      sector: item._id?.sector || "Unknown",
      tradeArea: item._id?.tradeArea || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Trade Area by State")
  }

  // 13. Trade Area by LGA
  if (analyticsData.tradeAreaByLgaOfResidence?.length) {
    const headers = [
      { label: "State", key: "state" },
      { label: "LGA", key: "lga" },
      { label: "Sector", key: "sector" },
      { label: "Trade Area", key: "tradeArea" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.tradeAreaByLgaOfResidence.map((item) => ({
      state: item._id?.state || "Unknown",
      lga: item._id?.lga || "Unknown",
      sector: item._id?.sector || "Unknown",
      tradeArea: item._id?.tradeArea || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "Trade Area by LGA")
  }

  // 14. State Residence-Origin Cross Tab
  if (analyticsData.stateResidenceOriginCrossTab?.length) {
    const headers = [
      { label: "State of Residence", key: "stateOfResidence" },
      { label: "State of Origin", key: "stateOfOrigin" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.stateResidenceOriginCrossTab.map((item) => ({
      stateOfResidence: item._id?.stateOfResidence || "Unknown",
      stateOfOrigin: item._id?.stateOfOrigin || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "State Residence-Origin")
  }

  // 15. LGA Cross Tab
  if (analyticsData.lgaCrossTab?.length) {
    const headers = [
      { label: "Residence State", key: "residenceState" },
      { label: "Residence LGA", key: "residenceLga" },
      { label: "Origin State", key: "originState" },
      { label: "Origin LGA", key: "originLga" },
      { label: "Total", key: "total" },
      { label: "Artisan Users", key: "artisan_user" },
      { label: "Intending Artisans", key: "intending_artisan" },
    ]

    const data = analyticsData.lgaCrossTab.map((item) => ({
      residenceState: item._id?.residenceState || "Unknown",
      residenceLga: item._id?.residenceLga || "Unknown",
      originState: item._id?.originState || "Unknown",
      originLga: item._id?.originLga || "Unknown",
      total: item.total || 0,
      artisan_user: item.artisan_user || 0,
      intending_artisan: item.intending_artisan || 0,
    }))

    const ws = createWorksheet(data, headers)
    XLSX.utils.book_append_sheet(wb, ws, "LGA Cross Tab")
  }

  // 16. Training Centers
  if (analyticsData.trainingCenterStats) {
    // Centers by State
    if (analyticsData.trainingCenterStats.centersByState?.length) {
      const headers = [
        { label: "State", key: "state" },
        { label: "Count", key: "count" },
        { label: "Centers", key: "centers" }  // New field
      ]

      const data = analyticsData.trainingCenterStats.centersByState.map((item) => ({
        state: item._id || "Unknown",
        count: item.count || 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      }))

      const ws = createWorksheet(data, headers)
      XLSX.utils.book_append_sheet(wb, ws, "Centers by State")
    }

    // Centers by Sector
    if (analyticsData.trainingCenterStats.centersBySector?.length) {
      const headers = [
        { label: "State", key: "state" },
        { label: "Sector", key: "sector" },
        { label: "Count", key: "count" },
        { label: "Centers", key: "centers" }
      ]

      const data = analyticsData.trainingCenterStats.centersBySector.map((item) => ({
        state: item._id.state || "Unknown",
        sector: item._id.sectorName || "Unknown", 
        count: item.count || 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      }))

      const ws = createWorksheet(data, headers)
      XLSX.utils.book_append_sheet(wb, ws, "Centers by Sector")
    }

    // Centers by Trade Area
    if (analyticsData.trainingCenterStats.centersByTradeArea?.length) {
      const headers = [
        { label: "State", key: "state" },
        { label: "Sector", key: "sector" },
        { label: "Trade Area", key: "tradeArea" },
        { label: "Count", key: "count" },
        { label: "Centers", key: "centers" }
      ]

      const data = analyticsData.trainingCenterStats.centersByTradeArea.map((item) => ({
        state: item._id.state || "Unknown",
        sector: item._id.sectorName || "Unknown",
        tradeArea: item._id.tradeAreaName || "Unknown",
        count: item.count || 0,
        centers: (item.centers || []).map(c => c.name).join(", ")
      }))

      const ws = createWorksheet(data, headers)
      XLSX.utils.book_append_sheet(wb, ws, "Centers by Trade Area")
    }
  }

  // Export the workbook
  XLSX.writeFile(wb, filename)
}

