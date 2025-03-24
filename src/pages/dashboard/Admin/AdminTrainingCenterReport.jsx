"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import DashboardPage from "@/components/layout/DashboardLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import Spinner from "@/components/layout/spinner"
import { states } from "@/data/nigeria"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"
import "jspdf-autotable"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Cross1Icon, SewingPinFilledIcon } from "@radix-ui/react-icons"
import useLogout from "@/pages/loginPage/logout"
import { LogOut, Mail, PhoneCall, UserCircle } from "lucide-react"
import { API_BASE_URL } from "@/config/env"
import { fetchSectors } from "@/services/api"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const useDebounce = ({ onChange, debounce = 500 }) => {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce])

  return { value, setValue }
}

const TrainingCenterReport = () => {
  const logout = useLogout()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const [sectors, setSectors] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetchSectors(accessToken)
        setSectors(response)
      } catch (err) {
        setError("Failed to fetch sectors")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const [hasLoadedFirst, sethasLoadedFirst] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loading && !hasLoadedFirst) sethasLoadedFirst(true)
  }, [loading])

  const [reports, setReports] = useState([])
  const [pagination, setpagination] = useState({
    totalPages: 0,
    total: 0,
  })
  const totalPages = pagination.totalPages

  const itemsPerPage = 25

  const defaultData = {
    currentPage: 1,
    search: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    sort: "-createdAt",
  }
  const [filter, setFilter] = useState({
    ...defaultData,
  })

  const handleFilterChange = (key, value) => {
    setFilter((x) => ({ ...x, [key]: value }))
  }

  const currentPage = filter?.currentPage

  // Add pagination state handler
  const handlePageChange = (page) => {
    setFilter((x) => ({ ...x, currentPage: page }))
  }

  const [loadingCSV, setLoadingCSV] = useState(false)
  const [csvData, setcsvData] = useState([])
  const MAX_CSV_ROWS = 1000000

  function replaceSymbolsWithSpace(str = "") {
    const replacedStr = str.replace(/[-/]/g, " ")
    return replacedStr.toLowerCase()
  }

  const selectedStateLGASResidence =
    states.find((state) => replaceSymbolsWithSpace(`${state?.value}`) === replaceSymbolsWithSpace(`${filter?.state}`))
      ?.lgas || []

  const selectedStateLGASResidenceFormatted =
    selectedStateLGASResidence && selectedStateLGASResidence?.length
      ? selectedStateLGASResidence.map((x) => ({
          label: x,
          value: x,
        }))
      : []

  const { value: searchv, setValue } = useDebounce({
    debounce: 500,
    onChange: (debouncedValue) => {
      setFilter((x) => ({ ...x, search: debouncedValue }))
    },
  })

  // Helper function to extract trade areas from different payload formats
  const extractTradeAreas = (center) => {
    if (!center?.legalInfo?.tradeAreas || !Array.isArray(center.legalInfo.tradeAreas)) {
      return []
    }

    const result = []

    // Process each trade area in the array
    center.legalInfo.tradeAreas.forEach((area) => {
      // Handle format 1: where sector is populated with objects
      if (area.sector && Array.isArray(area.sector) && area.sector.length > 0) {
        area.sector.forEach((sector) => {
          const sectorInfo = {
            sectorId: sector._id,
            sectorName: sector.name,
            tradeAreas: [],
          }

          // Extract trade areas using IDs referenced in the tradeArea array
          if (Array.isArray(area.tradeArea)) {
            area.tradeArea.forEach((taId) => {
              const found = (sector.tradeAreas || []).find((ta) => ta._id === taId)
              if (found) {
                sectorInfo.tradeAreas.push({
                  id: found._id,
                  name: found.name,
                })
              }
            })
          }

          result.push(sectorInfo)
        })
      }
      // Handle format 2: where tradeArea contains strings
      else if (area.tradeArea && Array.isArray(area.tradeArea)) {
        // For this format, we create a sector with null ID but include the trade areas
        const sectorInfo = {
          sectorId: area._id || null,
          sectorName: "Unspecified Sector",
          tradeAreas: area.tradeArea
            .filter((ta) => ta)
            .map((ta) => ({
              id: null,
              name: ta,
            })),
        }

        if (sectorInfo.tradeAreas.length > 0) {
          result.push(sectorInfo)
        }
      }
    })

    return result
  }

  function formatTCToCSV(users) {
    if (!Array.isArray(users) || users.length === 0) {
      return []
    }

    const headerMapping = {
      sn: "S/N",
      trainingCentreName: "Training Center",
      contactPersonName: "Contact Person Name",
      contactPersonPhone: "Contact Person Phone",
      contactPersonEmail: "Contact Person Email",
      state: "State of Origin",
      lga: "LGA of Origin",
      address: "Address",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
    }

    const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

    return [headers, ...rows]
  }

  const downloadCSV = async () => {
    setLoadingCSV(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
        params: {
          limit: MAX_CSV_ROWS,
          page: 1,
          search: filter?.search,
          state: filter?.state,
          lga: filter?.lga,
          sector: filter?.sector,
          tradeArea: filter?.tradeArea,
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data
      const formatted = formatTCToCSV(
        (data || []).map((x, i) => {
          // Use the new function to extract trade areas
          const tradeAreasData = extractTradeAreas(x)

          let sectors = ""
          let tradeAreas = ""

          // Format sector and trade area information for CSV
          tradeAreasData.forEach((sectorInfo) => {
            sectors += sectorInfo.sectorName + ", "

            sectorInfo.tradeAreas.forEach((ta) => {
              tradeAreas += ta.name + ", "
            })
          })

          return {
            sn: i + 1,
            trainingCentreName: x?.trainingCentreName,
            contactPersonName: x?.contactPerson,
            contactPersonPhone: x?.phoneNumber,
            contactPersonEmail: x?.email,
            state: x?.state,
            lga: x?.lga,
            address: x?.address,
            sectors: sectors.replace(/,\s*$/, ""),
            tradeAreas: tradeAreas.replace(/,\s*$/, ""),
          }
        }),
      )
      setcsvData(formatted)

      toast.success(
        "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
      )
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoadingCSV(false)
    }
  }

  const clearFilter = () => {
    setFilter(defaultData)
    setValue("")
    setcsvData([])
  }

  const fetchReports = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
        params: {
          limit: itemsPerPage,
          page: filter?.currentPage,
          search: filter?.search,
          state: filter?.state,
          lga: filter?.lga,
          sector: filter?.sector,
          tradeArea: filter?.tradeArea,
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data, pagination } = response.data
      setReports(data)

      setpagination((x) => {
        return {
          ...x,
          total: pagination.total,
          totalPages: pagination.totalPages,
        }
      })
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
      setcsvData([])
    }
  }

  useEffect(() => {
    fetchReports()
  }, [filter?.search, filter?.currentPage, filter?.state, filter?.lga, filter?.sector, filter?.tradeArea])

  return (
    <ProtectedRoute>
      {loading && !hasLoadedFirst ? (
        <div className="flex justify-center items-center h-screen ">
          <Spinner />
        </div>
      ) : null}
      {/* <DashboardPage title="Training Center Report"> */}
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Center Reports</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/biodata")}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>

              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="flex gap-[20px] flex-wrap mb-2">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Search</p>
              <Input
                className="text-[12px] placeholder:text-[12px]"
                placeholder="Name or email"
                value={searchv}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State</p>
              <Select value={filter?.state} onValueChange={(value) => handleFilterChange("state", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((item) => {
                      return (
                        <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
                          {item?.label}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Local Government</p>
              <Select value={filter.localGovernment} onValueChange={(value) => handleFilterChange("lga", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select LGA" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {selectedStateLGASResidenceFormatted.map((item) => {
                      return (
                        <SelectItem className="text-[12px]" value={item?.value} key={item.value}>
                          {item?.label}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Sector</p>
              <Select value={filter?.sector} onValueChange={(value) => handleFilterChange("sector", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(sectors || []).map((sector) => (
                      <SelectItem className="text-[12px]" key={sector._id} value={sector._id}>
                        {sector?.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Trade Area</p>
              <Select value={filter.tradeArea} onValueChange={(value) => handleFilterChange("tradeArea", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select Trade Area" className="text-[12px]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sectors
                      .find((sector) => sector._id === filter?.sector)
                      ?.tradeAreas?.map((ta) => {
                        return (
                          <SelectItem className="text-[12px]" key={ta?._id} value={ta?._id}>
                            {ta?.name}
                          </SelectItem>
                        )
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" w-full items-center justify-start flex gap-4">
            <Button
              className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
              onClick={clearFilter}
              disabled={loading}
            >
              Clear
              {loading ? <SewingPinFilledIcon className="animate-spin" /> : <Cross1Icon />}
            </Button>
          </div>

          <div className=" gap-2 flex justify-between w-full mt-4">
            <h2 className="font-medium">Total Records Found: {pagination?.total || 0}</h2>
            <div className=" gap-2 flex flex-row-reverse justify-start mb-4">
              {!csvData?.length ? (
                <button onClick={downloadCSV} className="border-[1px] text-[12px] p-2 font-medium">
                  Generate CSV
                  {loadingCSV ? <SewingPinFilledIcon className="animate-spin" /> : null}
                </button>
              ) : (
                <CSVLink
                  data={csvData}
                  className="border-[1px] text-[12px] p-2 font-medium"
                  disabled={loadingCSV || !reports?.length}
                >
                  Download CSV
                  {loadingCSV ? <SewingPinFilledIcon className="animate-spin" /> : null}
                </CSVLink>
              )}
            </div>
          </div>

          <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
            <TableHeader>
              <TableRow>
                <TableHead>S/N</TableHead>
                <TableHead>Training Center</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>State/LGA</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Trade Areas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((center, index) => {
                // Use the helper function to extract trade areas from both formats
                const tradeAreasData = extractTradeAreas(center)

                return (
                  <TableRow key={center._id || index}>
                    <TableCell className="text-left text-[12px]">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </TableCell>
                    <TableCell className="text-left max-w-[200px] text-[12px]">
                      {center.trainingCentreName || ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-left text-[12px]">{center?.contactPerson || "---"}</span>
                          <div className="flex flex-row gap-1 items-center">
                            <PhoneCall className="size-[14px]" />
                            <span className="text-left text-[10px]">{center?.phoneNumber || "---"}</span>
                          </div>

                          <div className="flex flex-row gap-1 items-center">
                            <Mail className="size-[14px]" />
                            <span className="text-left text-[10px]">{center?.email || "---"}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-left text-[12px]">{center?.state || "---"}</span>
                          <span className="text-left text-[10px]">{center?.lga || "---"}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-left max-w-[200px] text-[12px]">{center?.address || ""}</TableCell>

                    <TableCell className="text-left max-w-[200px] text-[12px]">
                      <AlertDialog>
                        <div className="flex items-center gap-2">
                          <div>
                            {tradeAreasData.length} Sector{tradeAreasData.length > 1 ? "s" : ""}
                          </div>

                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="text-[11px] w-[40px] h-[30px]">
                              View
                            </Button>
                          </AlertDialogTrigger>
                        </div>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{center?.trainingCentreName} - Sectors & Trade Areas</AlertDialogTitle>
                            <AlertDialogDescription>
                              {tradeAreasData.length > 0 ? (
                                tradeAreasData.map((sectorInfo, sIndex) => (
                                  <div className="mb-[30px]" key={`sector-${sIndex}`}>
                                    <h1 className="text-left font-medium text-[16px]">
                                      Sector: {sectorInfo.sectorName}
                                    </h1>

                                    <div className="flex flex-wrap gap-[15px]">
                                      {sectorInfo.tradeAreas.length > 0 ? (
                                        sectorInfo.tradeAreas.map((ta, taIndex) => (
                                          <p className="flex items-center gap-1" key={`ta-${taIndex}`}>
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                            <span>{ta.name}</span>
                                          </p>
                                        ))
                                      ) : (
                                        <p>No trade areas defined</p>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p>No trade areas information available</p>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogAction>Close</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>

                {/* First Page */}
                <PaginationItem>
                  <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
                    1
                  </PaginationLink>
                </PaginationItem>

                {/* Ellipsis after first */}
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Middle Pages */}
                {Array.from({ length: 3 }, (_, i) => {
                  const pageNumber = currentPage + i - 1
                  return pageNumber > 1 && pageNumber < totalPages ? (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ) : null
                })}

                {/* Ellipsis before last */}
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationLink disabled>...</PaginationLink>
                  </PaginationItem>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      {/* </DashboardPage> */}
    </ProtectedRoute>
  )
}

export default TrainingCenterReport

