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

  // const defaultData = {
  //   currentPage: 1,
  //   search: "",
  //   state: "",
  //   lga: "",
  //   sector: "",
  //   tradeArea: "",
  //   sort: "-createdAt",
  // }
  const defaultData = {
    currentPage: 1,
    search: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    sort: "-createdAt",
    dateFrom: "",
    dateTo: "",
  };
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
      _id: "Ref-Number",
      trainingCentreName: "Training Center",
      contactPersonName: "Contact Person Name",
      contactPersonPhone: "Contact Person Phone",
      contactPersonEmail: "Contact Person Email",
      state: "State of Origin",
      lga: "LGA of Origin",
      address: "Address",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
      createdAt: "Registered Date",
    }

    const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

    return [headers, ...rows]
  }

  // const downloadCSV = async () => {
  //   setLoadingCSV(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")
  //     const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
  //       params: {
  //         limit: MAX_CSV_ROWS,
  //         page: 1,
  //         search: filter?.search,
  //         state: filter?.state,
  //         lga: filter?.lga,
  //         sector: filter?.sector,
  //         tradeArea: filter?.tradeArea,
  //         sort: filter?.sort,
  //         dateFrom: filter.dateFrom,
  //         dateTo: filter.dateTo,
  //       },
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })

  //     const { data } = response.data
  //     const formatted = formatTCToCSV(
  //       (data || []).map((x, i) => {
  //         // Use the new function to extract trade areas
  //         const tradeAreasData = extractTradeAreas(x)

  //         let sectors = ""
  //         let tradeAreas = ""

  //         // Format sector and trade area information for CSV
  //         tradeAreasData.forEach((sectorInfo) => {
  //           sectors += sectorInfo.sectorName + ", "

  //           sectorInfo.tradeAreas.forEach((ta) => {
  //             tradeAreas += ta.name + ", "
  //           })
  //         })

  //         return {
  //           sn: i + 1,
  //           trainingCentreName: x?.trainingCentreName,
  //           contactPersonName: x?.contactPerson,
  //           contactPersonPhone: x?.phoneNumber,
  //           contactPersonEmail: x?.email,
  //           state: x?.state,
  //           lga: x?.lga,
  //           address: x?.address,
  //           sectors: sectors.replace(/,\s*$/, ""),
  //           tradeAreas: tradeAreas.replace(/,\s*$/, ""),
  //         }
  //       }),
  //     )
  //     setcsvData(formatted)

  //     toast.success(
  //       "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
  //     )
  //   } catch (error) {
  //     console.error("Error fetching reports:", error)
  //   } finally {
  //     setLoadingCSV(false)
  //   }
  // }

  const downloadCSV = async () => {
    setLoadingCSV(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      // Format dates for the query
      let params = {
        limit: MAX_CSV_ROWS,
        page: 1,
        search: filter?.search,
        state: filter?.state,
        lga: filter?.lga,
        sector: filter?.sector,
        tradeArea: filter?.tradeArea,
        sort: filter?.sort,
      };
  
      // Only add date parameters if they exist
      if (filter.dateFrom) {
        params.dateFrom = new Date(filter.dateFrom).toISOString();
      }
      if (filter.dateTo) {
        params.dateTo = new Date(filter.dateTo).toISOString();
      }
  
      const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const { data } = response.data;
      const formatted = formatTCToCSV(
        (data || []).map((x, i) => {
          // Use the new function to extract trade areas
          const tradeAreasData = extractTradeAreas(x);
  
          let sectors = "";
          let tradeAreas = "";
  
          // Format sector and trade area information for CSV
          tradeAreasData.forEach((sectorInfo) => {
            sectors += sectorInfo.sectorName + ", ";
            sectorInfo.tradeAreas.forEach((ta) => {
              tradeAreas += ta.name + ", ";
            });
          });
  
          return {
            sn: i + 1,
            _id: x?._id || "",
            trainingCentreName: x?.trainingCentreName || "",
            contactPersonName: x?.contactPerson || "",
            contactPersonPhone: x?.phoneNumber || "",
            contactPersonEmail: x?.email || "",
            state: x?.state || "",
            lga: x?.lga || "",
            address: x?.address || "",
            sectors: sectors.replace(/,\s*$/, ""),
            tradeAreas: tradeAreas.replace(/,\s*$/, ""),
            createdAt: x?.createdAt || "",
          };
        })
      );
      
      setcsvData(formatted);
      toast.success(
        "CSV data has been generated with all records. Click 'Download CSV' to download."
      );
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to generate CSV data");
    } finally {
      setLoadingCSV(false);
    }
  };

  const clearFilter = () => {
    setFilter(defaultData)
    setValue("")
    setcsvData([])
  }

  // const fetchReports = async () => {
  //   setLoading(true)
  //   try {
  //     const accessToken = localStorage.getItem("accessToken")
  //     const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
  //       params: {
  //         limit: itemsPerPage,
  //         page: filter?.currentPage,
  //         search: filter?.search,
  //         state: filter?.state,
  //         lga: filter?.lga,
  //         sector: filter?.sector,
  //         tradeArea: filter?.tradeArea,
  //         sort: filter?.sort,
  //         dateFrom: filter.dateFrom,
  //         dateTo: filter.dateTo,
  //       },
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })

  //     const { data, pagination } = response.data
  //     setReports(data)

  //     setpagination((x) => {
  //       return {
  //         ...x,
  //         total: pagination.total,
  //         totalPages: pagination.totalPages,
  //       }
  //     })
  //   } catch (error) {
  //     console.error("Error fetching reports:", error)
  //   } finally {
  //     setLoading(false)
  //     setcsvData([])
  //   }
  // }

  const fetchReports = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
  
      // Format dates for the query
      let params = {
        limit: itemsPerPage,
        page: filter?.currentPage,
        search: filter?.search,
        state: filter?.state,
        lga: filter?.lga,
        sector: filter?.sector,
        tradeArea: filter?.tradeArea,
        sort: filter?.sort,
      };
  
      // Only add date parameters if they exist
      if (filter.dateFrom) {
        params.dateFrom = new Date(filter.dateFrom).toISOString();
      }
      if (filter.dateTo) {
        params.dateTo = new Date(filter.dateTo).toISOString();
      }
  
      const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const { data, pagination } = response.data;
      setReports(data);
      setpagination((x) => ({
        ...x,
        total: pagination.total,
        totalPages: pagination.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
      setcsvData([]);
    }
  };


  useEffect(() => {
    fetchReports()
  }, [filter?.search, filter?.currentPage, filter?.state, filter?.lga, filter?.sector, filter?.tradeArea, filter?.dateFrom, filter?.dateTo,])

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

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date From</p>
              <Input
                type="date"
                className="text-[12px]"
                value={filter.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Date To</p>
              <Input
                type="date"
                className="text-[12px]"
                value={filter.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                min={filter.dateFrom}
              />
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
                  filename="Training_Centre_Admin_Reports.csv"
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
                <TableHead>Ref-Number</TableHead>
                <TableHead>Training Center</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>State/LGA</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Trade Areas</TableHead>
                <TableHead>Registered Date</TableHead>
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
                      {center._id || ""}
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
                    <TableCell className="text-left max-w-[200px] text-[12px]">
                      {center.createdAt || ""}
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




// import { useState, useEffect } from "react"
// import { useLocation, useNavigate, Link } from "react-router-dom"
// import axios from "axios"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import { Button } from "../../components/ui/button"
// import { toast } from "sonner"
// import Spinner from "../../components/Spinner"
// import { API_BASE_URL } from "@/config/env"
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import { states } from "@/data/nigeria.ts"
// import { fetchSectors } from "@/services/api"
// import { Plus, Trash2 } from "lucide-react"
// import clsx from "clsx"

// export default function SignupForm() {
//   // const [signupAs, setSignupAs] = useState("artisan_user");
//   const [isMobile, setIsMobile] = useState(false)

//   // Detect screen width
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth < 640) // Tailwind 'sm' breakpoint

//     checkMobile()
//     window.addEventListener("resize", checkMobile)
//     return () => window.removeEventListener("resize", checkMobile)
//   }, [])

//   // Dynamic color based on selected value (mobile dropdown trigger color)
//   const getTriggerColor = () => {
//     switch (signupAs) {
//       case "artisan_user":
//         return "bg-emerald-800 text-white font-bold"
//       case "intending_artisan":
//         return "bg-red-600 text-white font-bold"
//       case "training_center":
//         return "bg-blue-600 text-white font-bold"
//       default:
//         return "bg-gray-100 text-gray-700"
//     }
//   }

//   // const handleRoleChange = (value) => {
//   //   setSignupAs(value);
//   // };

//   const location = useLocation()
//   const initialTab = location.state?.tab || "artisan_user"
//   const [signupAs, setRole] = useState(initialTab)
//   const [sectors, setSectors] = useState([])
//   const [sectorLoading, setSectorLoading] = useState(true)
//   const [sectorError, setSectorError] = useState(null)
//   const [formData, setFormData] = useState({
//     firstName: "",
//     //middleName: "",
//     lastName: "",
//     nin: "",
//     gender: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     trainingCentreName: "",
//     regNum: "",
//     state: "",
//     lga: "",
//     address: "",
//     street: "",
//     stateOfResidence: "",
//     lgaOfResidence: "",
//     senatorialDistrict: "",
//     stateOfOrigin: "",
//     // sector: "",
//     // tradeArea: "",
//     hasDisability: false,
//     disabilityType: "",
//     priorSkillsCerts: [], // Initialize as an array
//     legalInfo: {
//       tradeAreas: [],
//     },
//   })

//   // Add this function to handle checkbox change
//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target
//     setFormData({ ...formData, [name]: checked })
//   }

//   // Add this function to handle select change
//   const handleSelectChange = (name, value) => {
//     setFormData({ ...formData, [name]: value })
//   }

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()
//   const [lgas, setLgas] = useState([])
//   const [selectedSectorId, setSelectedSectorId] = useState("")
//   const [lgasOfOrigin, setLgasOfOrigin] = useState([])
//   // Add a new state variable for senatorial districts
//   const [senatorialDistricts, setSenatorialDistricts] = useState([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accessToken = localStorage.getItem("accessToken")
//         const response = await fetchSectors(accessToken)
//         setSectors(response)
//       } catch (err) {
//         setSectorError("Failed to fetch sectors")
//         console.error(err)
//       } finally {
//         setSectorLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Update the handleSectorChange function to store both the sector name and ID
//   const handleSectorChange = (sectorName) => {
//     // Find the selected sector object from the sectors array
//     const selectedSector = sectors.find((sector) => sector.name === sectorName)

//     if (selectedSector) {
//       setSelectedSectorId(selectedSector._id)

//       // Update formData with the sector name and reset tradeArea
//       setFormData({
//         ...formData,
//         // sector: sectorName,
//         tradeArea: "",
//         // Initialize legalInfo.tradeAreas with the correct structure
//         legalInfo: {
//           ...formData.legalInfo,
//           tradeAreas: [
//             {
//               sector: [selectedSector._id], // Store as array of ObjectId
//               tradeArea: [],
//               instructors: "",
//               trainees: "",
//               facilities: "",
//               equipment: "",
//               tools: "",
//             },
//           ],
//         },
//       })
//     }
//   }

//   // Update the trade area handler to store in the correct format
//   const handleTradeAreaChange = (tradeAreaName) => {
//     const selectedSector = sectors.find((sector) => sector.name === formData.sector)
//     const selectedTradeArea = selectedSector?.tradeAreas?.find((ta) => ta.name === tradeAreaName)

//     if (selectedTradeArea) {
//       setFormData({
//         ...formData,
//         tradeArea: tradeAreaName,
//         legalInfo: {
//           ...formData.legalInfo,
//           tradeAreas: [
//             {
//               ...formData.legalInfo.tradeAreas[0],
//               tradeArea: [selectedTradeArea._id], // Store trade area ID as array of ObjectIds
//             },
//           ],
//         },
//       })
//     }
//   }

//   // const handleRoleChange = (newRole) => {
//   //   setRole(newRole)
//   //   setFormData({
//   //     firstName: "",
//   //     //middleName: "",
//   //     lastName: "",
//   //     gender: "",
//   //     maritalStatus: "",
//   //     dob: "",
//   //     nin: "",
//   //     email: "",
//   //     phoneNumber: "",
//   //     password: "",
//   //     confirmPassword: "",
//   //     trainingCentreName: "",
//   //     regNum: "",
//   //     state: "",
//   //     lga: "",
//   //     address: "",
//   //     street: "",
//   //     stateOfResidence: "",
//   //     lgaOfResidence: "",
//   //     senatorialDistrict: "",
//   //     stateOfOrigin: "",
//   //     hasDisability: false, // Add hasDisability
//   //     disabilityType: "", // Add disabilityType
//   //     // Initialize priorSkillsCerts based on role
//   //     priorSkillsCerts: newRole === "intending_artisan" ? [{ sector: "", tradeArea: "" }] : [],
//   //     legalInfo: {
//   //       tradeAreas: [],
//   //     },
//   //   })
//   //   setSelectedSectorId("")
//   // }
//   const handleRoleChange = (newRole) => {
//     setRole(newRole)
//     setFormData({
//       firstName: "",
//       lastName: "",
//       gender: "",
//       maritalStatus: "",
//       dob: "",
//       nin: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//       trainingCentreName: "",
//       regNum: "",
//       state: "",
//       lga: "",
//       address: "",
//       street: "",
//       stateOfResidence: "",
//       lgaOfResidence: "",
//       senatorialDistrict: "",
//       stateOfOrigin: "",
//       hasDisability: false, // Ensure this is a boolean
//       disabilityType: "",   // Ensure this is a string
//       priorSkillsCerts: newRole === "intending_artisan" ? [{ sector: "", tradeArea: "" }] : [],
//       legalInfo: {
//         tradeAreas: [],
//       },
//     })
//     setSelectedSectorId("")
//   }
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleStateChange = (stateName) => {
//     setFormData({ ...formData, state: stateName, lga: "" })
//     const selectedState = states.find((state) => state.value === stateName)
//     setLgas(selectedState ? selectedState.lgas : [])
//   }

//   const handlePriorSkillsCertChange = (index, field, value) => {
//     const updatedPriorSkillsCerts = [...formData.priorSkillsCerts]
//     updatedPriorSkillsCerts[index] = {
//       ...updatedPriorSkillsCerts[index],
//       [field]: value,
//     }
//     setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts })
//   }

//   const addPriorSkillsCert = () => {
//     setFormData({
//       ...formData,
//       priorSkillsCerts: [...formData.priorSkillsCerts, { sector: "", tradeArea: "" }],
//     })
//   }

//   const removePriorSkillsCert = (index) => {
//     const updatedPriorSkillsCerts = formData.priorSkillsCerts.filter((_, i) => i !== index)
//     setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts })
//   }

//   const handleTradeAreaSectorChange = (index, sectorName) => {
//     const selectedSector = sectors.find((sector) => sector.name === sectorName)

//     if (selectedSector) {
//       const updatedTradeAreas = [...formData.legalInfo.tradeAreas]
//       updatedTradeAreas[index] = {
//         ...updatedTradeAreas[index],
//         sector: [selectedSector._id],
//         tradeArea: [], // Reset trade area when sector changes
//         instructors: updatedTradeAreas[index]?.instructors || "",
//         trainees: updatedTradeAreas[index]?.trainees || "",
//         facilities: updatedTradeAreas[index]?.facilities || "",
//         equipment: updatedTradeAreas[index]?.equipment || "",
//         tools: updatedTradeAreas[index]?.tools || "",
//       }

//       setFormData({
//         ...formData,
//         legalInfo: {
//           ...formData.legalInfo,
//           tradeAreas: updatedTradeAreas,
//         },
//       })
//     }
//   }

//   const handleTradeAreaMultipleChange = (index, value) => {
//     const tradeAreaItem = formData.legalInfo.tradeAreas[index]
//     const sectorId = tradeAreaItem.sector[0]
//     const selectedSector = sectors.find((sector) => sector._id === sectorId)
//     const selectedTradeArea = selectedSector?.tradeAreas?.find((ta) => ta.name === value)

//     if (selectedTradeArea) {
//       const updatedTradeAreas = [...formData.legalInfo.tradeAreas]
//       updatedTradeAreas[index] = {
//         ...updatedTradeAreas[index],
//         tradeArea: [selectedTradeArea._id],
//       }

//       setFormData({
//         ...formData,
//         legalInfo: {
//           ...formData.legalInfo,
//           tradeAreas: updatedTradeAreas,
//         },
//       })
//     }
//   }

//   const handleTradeAreaFieldChange = (index, field, value) => {
//     const updatedTradeAreas = [...formData.legalInfo.tradeAreas]
//     updatedTradeAreas[index] = {
//       ...updatedTradeAreas[index],
//       [field]: value,
//     }

//     setFormData({
//       ...formData,
//       legalInfo: {
//         ...formData.legalInfo,
//         tradeAreas: updatedTradeAreas,
//       },
//     })
//   }

//   const addTradeArea = () => {
//     setFormData({
//       ...formData,
//       legalInfo: {
//         ...formData.legalInfo,
//         tradeAreas: [
//           ...formData.legalInfo.tradeAreas,
//           {
//             sector: [],
//             tradeArea: [],
//             instructors: "",
//             trainees: "",
//             facilities: "",
//             equipment: "",
//             tools: "",
//           },
//         ],
//       },
//     })
//   }

//   const removeTradeArea = (index) => {
//     const updatedTradeAreas = formData.legalInfo.tradeAreas.filter((_, i) => i !== index)
//     setFormData({
//       ...formData,
//       legalInfo: {
//         ...formData.legalInfo,
//         tradeAreas: updatedTradeAreas,
//       },
//     })
//   }

//   function isOnlyNumbers(str) {
//     return /^\d+$/.test(str)
//   }

//   const setAuthState = (userData) => {
//     // Set is logged in flag
//     localStorage.setItem("isLoggedIn", "true")

//     // Handle different user types
//     if (userData.trainingCenter) {
//       // For training center
//       localStorage.setItem("userRole", userData.trainingCenter.role)
//       localStorage.setItem("userId", userData.trainingCenter._id)
//       localStorage.setItem("isFirstTimeUser", userData.trainingCenter.agree || false)
//       localStorage.setItem("trainingCentreName", userData.trainingCenter.trainingCentreName)
//       localStorage.setItem("regNum", userData.trainingCenter.regNum)
//     } else if (userData.user) {
//       // For artisan and intending artisan
//       localStorage.setItem("userRole", userData.user.role)
//       localStorage.setItem("userId", userData.user._id)
//       localStorage.setItem("isFirstTimeUser", userData.user.agree || false)
//     }

//     // Handle tokens
//     if (userData.accessToken) {
//       localStorage.setItem(
//         "accessToken",
//         typeof userData.accessToken === "object" ? userData.accessToken.accessToken : userData.accessToken,
//       )
//     }

//     if (userData.refreshToken) {
//       localStorage.setItem(
//         "refreshToken",
//         typeof userData.refreshToken === "object" ? userData.refreshToken.refreshToken : userData.refreshToken,
//       )
//     }
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError(null)

//     // START VALIDATION
//     let errorMsg = ""
//     console.log("Form data before submission:", JSON.stringify(formData, null, 2));
//     // Format the phone number to start with "234" if it starts with "0"
//     const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
//       ? "234" + formData.phoneNumber.slice(1)
//       : formData.phoneNumber

//     // Update the phone number in formData
//     formData.phoneNumber = formattedPhoneNumber
    
//     if (formData.hasDisability && !formData.disabilityType) {
//       errorMsg = "Please select a disability type"
//     } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
//       errorMsg = "Passwords do not match!"
//     } else if (formData.password.trim().length < 6) {
//       errorMsg = "Password must be at least 6 characters!"
//     } else if (!isOnlyNumbers(formData.phoneNumber)) {
//       errorMsg = "Phone number must be numeric!"
//     } else if (formData.phoneNumber.trim().length !== 13) {
//       errorMsg = "Phone number must be 13 digits!"
//     } else if (signupAs !== "training_center" && (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)) {
//       errorMsg = "NIN must be 11 numeric digits!"
//     } else if (signupAs !== "training_center" && formData.gender === "") {
//       errorMsg = "Please select a gender!"
//     } else if (
//       (signupAs === "artisan_user" || signupAs === "intending_artisan") &&
//       formData.priorSkillsCerts.length > 0 &&
//       (!formData.priorSkillsCerts[0].sector || !formData.priorSkillsCerts[0].tradeArea)
//     ) {
//       errorMsg = "Sector and Trade Area are required!"
//     } else if (
//       signupAs === "training_center" &&
//       (formData.legalInfo.tradeAreas.length === 0 ||
//         !formData.legalInfo.tradeAreas[0].sector ||
//         formData.legalInfo.tradeAreas[0].sector.length === 0)
//     ) {
//       errorMsg = "At least one Sector and Trade Area is required!"
//     }

//     if (errorMsg) {
//       toast.error(errorMsg, { position: "top-right" })
//       setLoading(false)
//       return
//     }
//     // END VALIDATION

//     const endpoint =
//       signupAs === "training_center" ? `${API_BASE_URL}/training-centers/register` : `${API_BASE_URL}/signup`

//       const submissionData = {
//         ...formData,
//         hasDisability: Boolean(formData.hasDisability), // Ensure it's a boolean
//         disabilityType: typeof formData.disabilityType === 'object' 
//           ? formData.disabilityType.default || "" 
//           : formData.disabilityType
//       };

//       console.log("Form data before submission:", JSON.stringify(submissionData, null, 2));
//       const payload =
//       signupAs === "training_center"
//         ? {
//             trainingCentreName: submissionData.trainingCentreName,
//             regNum: submissionData.regNum,
//             email: submissionData.email,
//             phoneNumber: submissionData.phoneNumber,
//             password: submissionData.password,
//             confirm_password: submissionData.confirmPassword,
//             state: submissionData.state,
//             lga: submissionData.lga,
//             address: submissionData.address,
//             sector: submissionData.sector,
//             tradeArea: submissionData.tradeArea,
//             legalInfo: submissionData.legalInfo,
//             agree: false,
//             role: signupAs,
//           }
//         : {
//             firstName: submissionData.firstName,
//             //middleName: formData.middleName,
//             lastName: submissionData.lastName,
//             stateOfResidence: submissionData.stateOfResidence,
//             lgaOfResidence: submissionData.lgaOfResidence,
//             senatorialDistrict: submissionData.senatorialDistrict,
//             stateOfOrigin: submissionData.stateOfOrigin,
//             lga: submissionData.lga,
//             street: submissionData.street,
//             gender: submissionData.gender, // Add gender here
//             maritalStatus: submissionData.maritalStatus, // Add maritalStatus
//             dob: submissionData.dob, // Add dob
//             hasDisability: submissionData.hasDisability, // Add hasDisability
//             disabilityType: submissionData.disabilityType, // Add disabilityType
//             priorSkillsCerts: submissionData.priorSkillsCerts.map((cert) => ({
//               sector: cert.sector,
//               tradeArea: cert.tradeArea,
//             })),
//             role: signupAs,
//             nin: submissionData.nin,
//             email: submissionData.email,
//             phoneNumber: submissionData.phoneNumber,
//             password: submissionData.password,
//             confirm_password: submissionData.confirmPassword,
//             agree: false,
//           }
//     // Prepare the payload with the correct structure for legalInfo.tradeAreas
//     // const payload =
//     //   signupAs === "training_center"
//     //     ? {
//     //         trainingCentreName: formData.trainingCentreName,
//     //         regNum: formData.regNum,
//     //         email: formData.email,
//     //         phoneNumber: formData.phoneNumber,
//     //         password: formData.password,
//     //         confirm_password: formData.confirmPassword,
//     //         state: formData.state,
//     //         lga: formData.lga,
//     //         address: formData.address,
//     //         sector: formData.sector,
//     //         tradeArea: formData.tradeArea,
//     //         legalInfo: formData.legalInfo,
//     //         agree: false,
//     //         role: signupAs,
//     //       }
//     //     : {
//     //         firstName: formData.firstName,
//     //         //middleName: formData.middleName,
//     //         lastName: formData.lastName,
//     //         stateOfResidence: formData.stateOfResidence,
//     //         lgaOfResidence: formData.lgaOfResidence,
//     //         senatorialDistrict: formData.senatorialDistrict,
//     //         stateOfOrigin: formData.stateOfOrigin,
//     //         lga: formData.lga,
//     //         street: formData.street,
//     //         gender: formData.gender, // Add gender here
//     //         maritalStatus: formData.maritalStatus, // Add maritalStatus
//     //         dob: formData.dob, // Add dob
//     //         hasDisability: formData.hasDisability, // Add hasDisability
//     //         disabilityType: formData.disabilityType, // Add disabilityType
//     //         priorSkillsCerts: formData.priorSkillsCerts.map((cert) => ({
//     //           sector: cert.sector,
//     //           tradeArea: cert.tradeArea,
//     //         })),
//     //         role: signupAs,
//     //         nin: formData.nin,
//     //         email: formData.email,
//     //         phoneNumber: formData.phoneNumber,
//     //         password: formData.password,
//     //         confirm_password: formData.confirmPassword,
//     //         agree: false,
//     //       }

//     try {
//       const response = await axios.post(endpoint, payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       console.log("Response:", response.data) // Debugging log

//       if (response.data.success) {
//         // Set authentication state
//         setAuthState(response.data.data)

//         // Success toast
//         toast.success("Signup successful 🚀!", {
//           description: "Login Successfully",
//           position: "top-right",
//           duration: 2000,
//         })

//         // Redirect based on role
//         setTimeout(() => {
//           const role = response.data.data.trainingCenter
//             ? response.data.data.trainingCenter.role
//             : response.data.data.user.role

//           switch (role) {
//             case "artisan_user":
//               navigate("/register/artisan")
//               break
//             case "intending_artisan":
//               navigate("/register/intendingArtisan")
//               break
//             case "training_center":
//               navigate("/register/trainingcenter")
//               break
//             default:
//               navigate("/dashboard")
//           }
//         }, 2000)
//       } else {
//         toast.error(`Signup failed: ${response.data.message}`, {
//           duration: 2000,
//         })
//       }
//     } catch (error) {
//       console.error("Signup error:", error) // Debugging log
//       const message = "Error!"
//       const description =
//         typeof error?.response?.data === "string"
//           ? error?.response?.data
//           : error?.response?.data?.message || "An error occurred. Please try again."
//       setError("Error signing up. Please try again.")
//       toast.error(message, {
//         description,
//         position: "top-right",
//         style: { textAlign: "left" },
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleStateOfOriginChange = (stateName) => {
//     setFormData({ ...formData, stateOfOrigin: stateName, lga: "" })
//     const selectedState = states.find((state) => state.value === stateName)
//     setLgasOfOrigin(selectedState ? selectedState.lgas : [])
//   }

//   // Update the handleStateOfResidenceChange function to also set senatorial districts
//   const handleStateOfResidenceChange = (stateName) => {
//     setFormData({ ...formData, stateOfResidence: stateName, lgaOfResidence: "", senatorialDistrict: "" })
//     const selectedState = states.find((state) => state.value === stateName)
//     setLgas(selectedState ? selectedState.lgas : [])
//     setSenatorialDistricts(selectedState ? selectedState.senatorialDistricts || [] : [])
//   }

//   return (
//     <section className=" bg-slate-900   min-h-screen">
//       <div className="flex items-start justify-center absolute top-8 left-0 right-0 bottom-10">
//         <div className="flex w-full max-w-4xl sm:items-stretch bg-white shadow-lg rounded-lg overflow-auto">
//           {/* Left image section */}
//           <div className="hidden md:block w-3/5 relative">
//             {signupAs === "artisan_user" ? (
//               <div className="flex h-full items-center justify-center bg-green-100 p-6">
//                 <div className="text-center">
//                   <h2 className="mb-2 text-2xl font-bold text-green-800">SignUp Today</h2>
//                   <p className="text-green-600">Access your personal dashboard and track your progress.</p>
//                   <img
//                     src="/hairdresser copy.jpeg?height=200&width=200"
//                     alt="I am an artisan in this trade area"
//                     className="mx-auto mt-4 h-48 w-48 object-cover"
//                   />
//                 </div>
//               </div>
//             ) : signupAs === "intending_artisan" ? (
//               <div className="flex h-full items-center justify-center bg-red-100 p-6">
//                 <div className="text-center">
//                   <h2 className="mb-2 text-2xl font-bold text-red-800">SignUp Today</h2>
//                   <p className="text-red-600">Access your personal dashboard and track your progress.</p>
//                   <img
//                     src="/hairdresser copy.jpeg?height=200&width=200"
//                     alt="I am an intending artisan in this trade area"
//                     className="mx-auto mt-4 h-48 w-48 object-cover"
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex h-full items-center justify-center bg-blue-100 p-6">
//                 <div className="text-center">
//                   <h2 className="mb-2 text-2xl font-bold text-blue-800">SignUp Today</h2>
//                   <p className="text-blue-600">Access your personal dashboard and track your progress.</p>
//                   <img
//                     src="/hairdresser copy.jpeg?height=200&width=200"
//                     alt="I am a training center"
//                     className="mx-auto mt-4 h-48 w-48 object-cover"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Card section */}
//           {/* <Card className="w-full h-{full} max-w-4xl pt-4 overflow-y-auto pr-2 md:pr-0"> */}
//           <Card
//             className="w-full max-w-4xl 
//                 h-auto
//                 items-start
//                 sm:h-[650px]  
//                 md:h-[750px]   
//                 pt-4 pr-2 md:pr-0
//                 overflow-y-auto" // Scroll the inside of the card
//           >
//             <CardHeader className="md:hidden">
//               <CardTitle className="text-2xl font-bold text-gray-600 ">SignUp Today</CardTitle>
//               <CardDescription className="text-xs">
//                 {" "}
//                 Access your personal dashboard and track your progress.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* <Tabs value={signupAs} onValueChange={handleRoleChange} className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger
//                     value="artisan_user"
//                     className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                   >
//                     Artisan
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="intending_artisan"
//                     className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                   >
//                     Intending Artisan
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="training_center"
//                     className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                   >
//                     Training Center
//                   </TabsTrigger>
//                 </TabsList> */}

//               <Tabs value={signupAs} onValueChange={handleRoleChange} className="w-full">
//                 {/* Desktop Tabs */}
//                 {!isMobile && (
//                   <TabsList className="grid w-full grid-cols-3">
//                     <TabsTrigger
//                       value="artisan_user"
//                       className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                     >
//                       Artisan
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="intending_artisan"
//                       className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                     >
//                       Intending Artisan
//                     </TabsTrigger>
//                     <TabsTrigger
//                       value="training_center"
//                       className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
//                     >
//                       Training Center
//                     </TabsTrigger>
//                   </TabsList>
//                 )}

//                 {/* Mobile Dropdown */}
//                 {isMobile && (
//                   <div className="w-full mb-4">
//                     <Select value={signupAs} onValueChange={handleRoleChange}>
//                       <SelectTrigger className={clsx("w-full", getTriggerColor())}>
//                         <SelectValue placeholder="Select Role" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem
//                           value="artisan_user"
//                           className="hover:bg-emerald-800 hover:text-white focus:bg-emerald-800 focus:text-white"
//                         >
//                           Artisan
//                         </SelectItem>
//                         <SelectItem
//                           value="intending_artisan"
//                           className="hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white"
//                         >
//                           Intending Artisan
//                         </SelectItem>
//                         <SelectItem
//                           value="training_center"
//                           className="hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white"
//                         >
//                           Training Center
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}

//                 {/* Artisan User Form */}
//                 <TabsContent className="overflow-y-auto" value="artisan_user">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="email"
//                         label="Email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="abc@email.com"
//                         required={true}
//                       />

//                       <LabelInput
//                         name="phoneNumber"
//                         label="Phone Number"
//                         type="tel"
//                         value={formData.phoneNumber}
//                         onChange={handleChange}
//                         placeholder="2347012345643"
//                         required={true}
//                       />
//                     </div>

//                     {/* Name Fields */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="firstName"
//                         label="First Name"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="John"
//                         required={true}
//                       />
//                       {/* <LabelInput
//                         name="middleName"
//                         label="Middle Name"
//                         value={formData.middleName}
//                         onChange={handleChange}
//                         placeholder="David"
//                       /> */}
//                       <LabelInput
//                         name="lastName"
//                         label="Last Name"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Smith"
//                         required={true}
//                       />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="nin"
//                         label="National ID"
//                         type="tel"
//                         pattern="\d{11}"
//                         value={formData.nin}
//                         onChange={handleChange}
//                         placeholder="12345678953"
//                         required={true}
//                       />

//                       <div className="">
//                         <Label htmlFor="gender" className="text-left text-xs text-gray-600">
//                           Gender <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.gender}
//                           onValueChange={(value) => setFormData({ ...formData, gender: value })}
//                           required={formData.gender} // Add required attribute
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               <SelectItem value="male">Male</SelectItem>
//                               <SelectItem value="female">Female</SelectItem>
//                               <SelectItem value="other">Other</SelectItem>
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div className="space-y-2">
//     <Label htmlFor="maritalStatus" className="text-left text-xs text-gray-600">
//       Marital Status <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//     </Label>
//     <Select
//       value={formData.maritalStatus}
//       onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
//     >
//       <SelectTrigger>
//         <SelectValue placeholder="Select marital status" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectItem value="single">Single</SelectItem>
//           <SelectItem value="married">Married</SelectItem>
//           <SelectItem value="divorced">Divorced</SelectItem>
//           <SelectItem value="widowed">Widowed</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   </div>

//   <div className="space-y-2">
//     <Label htmlFor="dob" className="text-left text-xs text-gray-600">
//       Date of Birth <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//     </Label>
//     <Input
//       type="date"
//       id="dob"
//       name="dob"
//       value={formData.dob}
//       onChange={handleChange}
//       className="w-full"
//       required
//     />
//   </div>
// </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div className="space-y-2">
//     <Label htmlFor="hasDisability" className="text-left text-xs text-gray-600">
//       Do you have a disability?
//     </Label>
//     <input
//       type="checkbox"
//       id="hasDisability"
//       name="hasDisability"
//       checked={formData.hasDisability}
//       onChange={(e) => {
//         setFormData({
//           ...formData,
//           hasDisability: e.target.checked,
//           disabilityType: e.target.checked ? formData.disabilityType : ""
//         });
//       }}
//       className="w-4 h-4"
//     />
//   </div>

//   {formData.hasDisability && (
//     <div className="space-y-2">
//       <Label htmlFor="disabilityType" className="text-left text-xs text-gray-600">
//         Type of Disability
//       </Label>
//       <Select
//         value={formData.disabilityType}
//         onValueChange={(value) => setFormData({...formData, disabilityType: value})}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select disability type" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="visual">Visual</SelectItem>
//             <SelectItem value="hearing">Hearing</SelectItem>
//             <SelectItem value="mobility">Mobility</SelectItem>
//             <SelectItem value="cognitive">Cognitive</SelectItem>
//             <SelectItem value="other">Other</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   )}
// </div>

//                     {/* State of Residence and LGA */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="stateOfResidence" className="text-left text-xs text-gray-600">
//                           State of Residence<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.stateOfResidence}
//                           onValueChange={(value) => {
//                             setFormData({ ...formData, stateOfResidence: value, lgaOfResidence: "" })
//                             const selectedState = states.find((state) => state.value === value)
//                             setLgas(selectedState ? selectedState.lgas : [])
//                             setSenatorialDistricts(selectedState ? selectedState.senatorialDistricts || [] : [])
//                           }}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {states.map((state) => (
//                                 <SelectItem key={state.value} value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lgaOfResidence" className="text-left text-xs text-gray-600">
//                           LGA of Residence<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lgaOfResidence}
//                           onValueChange={(value) => setFormData({ ...formData, lgaOfResidence: value })}
//                           disabled={!lgas.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select LGA" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {lgas.map((lga) => (
//                                 <SelectItem key={lga} value={lga}>
//                                   {lga}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       {/* Senatorial District */}
//                       <div className="space-y-2">
//                         <Label htmlFor="senatorialDistrict" className="text-left text-xs text-gray-600">
//                           Senatorial District<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.senatorialDistrict}
//                           onValueChange={(value) => setFormData({ ...formData, senatorialDistrict: value })}
//                           disabled={!senatorialDistricts.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select senatorial district" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {senatorialDistricts.map((district) => (
//                                 <SelectItem key={district} value={district}>
//                                   {district}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div>
//                       <LabelInput
//                         name="street"
//                         label="Official Address"
//                         type="text"
//                         value={formData.street}
//                         onChange={handleChange}
//                         placeholder="No 1, House Street, house City"
//                         required={true}
//                       />
//                     </div>

//                     {/* State of Origin and LGA */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="stateOfOrigin" className="text-left text-xs text-gray-600">
//                           State of Origin<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.stateOfOrigin}
//                           onValueChange={(value) => {
//                             setFormData({ ...formData, stateOfOrigin: value, lga: "" })
//                             const selectedState = states.find((state) => state.value === value)
//                             setLgasOfOrigin(selectedState ? selectedState.lgas : [])
//                           }}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {states.map((state) => (
//                                 <SelectItem key={state.value} value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lga" className="text-left text-xs text-gray-600">
//                           LGA of Origin<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lga}
//                           onValueChange={(value) => setFormData({ ...formData, lga: value })}
//                           disabled={!lgasOfOrigin.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select LGA" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {lgasOfOrigin.map((lga) => (
//                                 <SelectItem key={lga} value={lga}>
//                                   {lga}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     {/* Sector and Trade Area */}
//                     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="sector" className="text-left text-xs text-gray-600">
//                           Sector<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select value={formData.sector} onValueChange={handleSectorChange} disabled={sectorLoading}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select sector" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {sectors?.map((sector) => (
//                                 <SelectItem key={sector._id} value={sector.name}>
//                                   {sector.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="tradeArea" className="text-left text-xs text-gray-600">
//                           Trade Area<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.tradeArea}
//                           onValueChange={handleTradeAreaChange}
//                           disabled={!formData.sector}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select trade area" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {sectors
//                                 ?.find((sector) => sector.name === formData.sector)
//                                 ?.tradeAreas?.map((ta) => (
//                                   <SelectItem key={ta._id} value={ta.name}>
//                                     {ta.name}
//                                   </SelectItem>
//                                 ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div> */}

//                     {/* Prior Skills Certificates */}
//                     <div className="space-y-4">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-left text-xs text-gray-600">
//                           Prior Skills/Certificates <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={addPriorSkillsCert}
//                           className="flex items-center gap-1"
//                         >
//                           <Plus className="h-4 w-4" /> Add Skill
//                         </Button>
//                       </div>

//                       {formData.priorSkillsCerts.length > 0 ? (
//                         formData.priorSkillsCerts.map((cert, index) => (
//                           <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-md relative">
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removePriorSkillsCert(index)}
//                               className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor={`cert-sector-${index}`} className="text-left text-xs text-gray-600">
//                                   Sector
//                                 </Label>
//                                 <Select
//                                   value={cert.sector}
//                                   onValueChange={(value) => handlePriorSkillsCertChange(index, "sector", value)}
//                                   disabled={sectorLoading}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select sector" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectGroup>
//                                       {sectors?.map((sector) => (
//                                         <SelectItem key={sector._id} value={sector.name}>
//                                           {sector.name}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectGroup>
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor={`cert-tradeArea-${index}`} className="text-left text-xs text-gray-600">
//                                   Trade Area
//                                 </Label>
//                                 <Select
//                                   value={cert.tradeArea}
//                                   onValueChange={(value) => handlePriorSkillsCertChange(index, "tradeArea", value)}
//                                   disabled={!cert.sector}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select trade area" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectGroup>
//                                       {sectors
//                                         ?.find((sector) => sector.name === cert.sector)
//                                         ?.tradeAreas?.map((ta) => (
//                                           <SelectItem key={ta._id} value={ta.name}>
//                                             {ta.name}
//                                           </SelectItem>
//                                         ))}
//                                     </SelectGroup>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-4 text-gray-500 text-sm italic">
//                           No prior skills added. Click "Add Skill" to add your previous skills or certifications.
//                         </div>
//                       )}
//                     </div>

//                     <PasswordFields formData={formData} onChange={handleChange} required />
//                     <Button type="submit" className="w-full bg-emerald-800">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Intending Artisan Form */}
//                 <TabsContent value="intending_artisan">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="email"
//                         label="Email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="abc@email.com"
//                         required={true}
//                       />
//                       <LabelInput
//                         name="phoneNumber"
//                         label="Phone Number"
//                         type="tel"
//                         value={formData.phoneNumber}
//                         onChange={handleChange}
//                         placeholder="2347012345643"
//                         required={true}
//                       />
//                     </div>

//                     {/* Name Fields */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="firstName"
//                         label="First Name"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         placeholder="John"
//                         required={true}
//                       />
//                       {/* <LabelInput
//                         name="middleName"
//                         label="Middle Name"
//                         value={formData.middleName}
//                         onChange={handleChange}
//                         placeholder="David"
//                       /> */}
//                       <LabelInput
//                         name="lastName"
//                         label="Last Name"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         placeholder="Smith"
//                         required={true}
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <LabelInput
//                         name="nin"
//                         label="National ID"
//                         type="tel"
//                         pattern="\d{11}"
//                         value={formData.nin}
//                         onChange={handleChange}
//                         placeholder="12345678953"
//                         required={true}
//                       />
//                       <div className="">
//                         <Label htmlFor="gender" className="text-left text-xs text-gray-600">
//                           Gender <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.gender}
//                           onValueChange={(value) => setFormData({ ...formData, gender: value })}
//                           required={formData.gender}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               <SelectItem value="male">Male</SelectItem>
//                               <SelectItem value="female">Female</SelectItem>
//                               <SelectItem value="other">Other</SelectItem>
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div className="space-y-2">
//     <Label htmlFor="maritalStatus" className="text-left text-xs text-gray-600">
//       Marital Status <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//     </Label>
//     <Select
//       value={formData.maritalStatus}
//       onValueChange={(value) => setFormData({ ...formData, maritalStatus: value })}
//     >
//       <SelectTrigger>
//         <SelectValue placeholder="Select marital status" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectGroup>
//           <SelectItem value="single">Single</SelectItem>
//           <SelectItem value="married">Married</SelectItem>
//           <SelectItem value="divorced">Divorced</SelectItem>
//           <SelectItem value="widowed">Widowed</SelectItem>
//         </SelectGroup>
//       </SelectContent>
//     </Select>
//   </div>

//   <div className="space-y-2">
//     <Label htmlFor="dob" className="text-left text-xs text-gray-600">
//       Date of Birth <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//     </Label>
//     <Input
//       type="date"
//       id="dob"
//       name="dob"
//       value={formData.dob}
//       onChange={handleChange}
//       className="w-full"
//       required
//     />
//   </div>
// </div>

// <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div className="space-y-2">
//     <Label htmlFor="hasDisability" className="text-left text-xs text-gray-600">
//       Do you have a disability?
//     </Label>
//     <input
//       type="checkbox"
//       id="hasDisability"
//       name="hasDisability"
//       checked={formData.hasDisability}
//       onChange={(e) => {
//         setFormData({
//           ...formData,
//           hasDisability: e.target.checked,
//           disabilityType: e.target.checked ? formData.disabilityType : ""
//         });
//       }}
//       className="w-4 h-4"
//     />
//   </div>

//   {formData.hasDisability && (
//     <div className="space-y-2">
//       <Label htmlFor="disabilityType" className="text-left text-xs text-gray-600">
//         Type of Disability
//       </Label>
//       <Select
//         value={formData.disabilityType}
//         onValueChange={(value) => setFormData({...formData, disabilityType: value})}
//       >
//         <SelectTrigger>
//           <SelectValue placeholder="Select disability type" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="visual">Visual</SelectItem>
//             <SelectItem value="hearing">Hearing</SelectItem>
//             <SelectItem value="mobility">Mobility</SelectItem>
//             <SelectItem value="cognitive">Cognitive</SelectItem>
//             <SelectItem value="other">Other</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   )}
// </div>

//                     {/* State of Residence and LGA */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="stateOfResidence" className="text-left text-xs text-gray-600">
//                           State of Residence<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.stateOfResidence}
//                           onValueChange={(value) => {
//                             setFormData({ ...formData, stateOfResidence: value, lgaOfResidence: "" })
//                             const selectedState = states.find((state) => state.value === value)
//                             setLgas(selectedState ? selectedState.lgas : [])
//                             setSenatorialDistricts(selectedState ? selectedState.senatorialDistricts || [] : [])
//                           }}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {states.map((state) => (
//                                 <SelectItem key={state.value} value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lgaOfResidence" className="text-left text-xs text-gray-600">
//                           LGA of Residence<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lgaOfResidence}
//                           onValueChange={(value) => setFormData({ ...formData, lgaOfResidence: value })}
//                           disabled={!lgas.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select LGA" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {lgas.map((lga) => (
//                                 <SelectItem key={lga} value={lga}>
//                                   {lga}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       {/* Senatorial District */}
//                       <div className="space-y-2">
//                         <Label htmlFor="senatorialDistrict" className="text-left text-xs text-gray-600">
//                           Senatorial District<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.senatorialDistrict}
//                           onValueChange={(value) => setFormData({ ...formData, senatorialDistrict: value })}
//                           disabled={!senatorialDistricts.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select senatorial district" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {senatorialDistricts.map((district) => (
//                                 <SelectItem key={district} value={district}>
//                                   {district}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div>
//                       <LabelInput
//                         name="street"
//                         label="Official Address"
//                         type="text"
//                         value={formData.street}
//                         onChange={handleChange}
//                         placeholder="No 1, House Street, house City"
//                         required={true}
//                       />
//                     </div>

//                     {/* State of Origin and LGA */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="stateOfOrigin" className="text-left text-xs text-gray-600">
//                           State of Origin<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.stateOfOrigin}
//                           onValueChange={(value) => {
//                             setFormData({ ...formData, stateOfOrigin: value, lga: "" })
//                             const selectedState = states.find((state) => state.value === value)
//                             setLgasOfOrigin(selectedState ? selectedState.lgas : [])
//                           }}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {states.map((state) => (
//                                 <SelectItem key={state.value} value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lga" className="text-left text-xs text-gray-600">
//                           LGA of Origin<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lga}
//                           onValueChange={(value) => setFormData({ ...formData, lga: value })}
//                           disabled={!lgasOfOrigin.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select LGA" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {lgasOfOrigin.map((lga) => (
//                                 <SelectItem key={lga} value={lga}>
//                                   {lga}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     {/* Sector and Trade Area */}
//                     {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="sector" className="text-left text-xs text-gray-600">
//                           Sector<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select value={formData.sector} onValueChange={handleSectorChange} disabled={sectorLoading}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select sector" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {sectors?.map((sector) => (
//                                 <SelectItem key={sector._id} value={sector.name}>
//                                   {sector.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="tradeArea" className="text-left text-xs text-gray-600">
//                           Trade Area<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.tradeArea}
//                           onValueChange={handleTradeAreaChange}
//                           disabled={!formData.sector}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select trade area" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {sectors
//                                 ?.find((sector) => sector.name === formData.sector)
//                                 ?.tradeAreas?.map((ta) => (
//                                   <SelectItem key={ta._id} value={ta.name}>
//                                     {ta.name}
//                                   </SelectItem>
//                                 ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div> */}

//                     {/* Prior Skills Certificate - Single Entry for Intending Artisan */}
//                     <div className="space-y-4">
//                       <Label className="text-left text-xs text-gray-600">
//                         Intending Skill <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                       </Label>
//                       <div className="grid grid-cols-1 gap-4 p-4 border rounded-md">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="prior-sector" className="text-left text-xs text-gray-600">
//                               Sector
//                             </Label>
//                             <Select
//                               value={formData.priorSkillsCerts[0]?.sector || ""}
//                               onValueChange={(value) => {
//                                 const updatedPriorSkillsCerts =
//                                   formData.priorSkillsCerts.length > 0
//                                     ? [{ ...formData.priorSkillsCerts[0], sector: value, tradeArea: "" }]
//                                     : [{ sector: value, tradeArea: "" }]
//                                 setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts })
//                               }}
//                               disabled={sectorLoading}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select sector" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectGroup>
//                                   {sectors?.map((sector) => (
//                                     <SelectItem key={sector._id} value={sector.name}>
//                                       {sector.name}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectGroup>
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           <div className="space-y-2">
//                             <Label htmlFor="prior-tradeArea" className="text-left text-xs text-gray-600">
//                               Trade Area
//                             </Label>
//                             <Select
//                               value={formData.priorSkillsCerts[0]?.tradeArea || ""}
//                               onValueChange={(value) => {
//                                 const updatedPriorSkillsCerts =
//                                   formData.priorSkillsCerts.length > 0
//                                     ? [{ ...formData.priorSkillsCerts[0], tradeArea: value }]
//                                     : [{ sector: "", tradeArea: value }]
//                                 setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts })
//                               }}
//                               disabled={!formData.priorSkillsCerts[0]?.sector}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select trade area" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectGroup>
//                                   {sectors
//                                     ?.find((sector) => sector.name === formData.priorSkillsCerts[0]?.sector)
//                                     ?.tradeAreas?.map((ta) => (
//                                       <SelectItem key={ta._id} value={ta.name}>
//                                         {ta.name}
//                                       </SelectItem>
//                                     ))}
//                                 </SelectGroup>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <PasswordFields formData={formData} onChange={handleChange} required />
//                     <Button type="submit" className="w-full bg-red-600">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Training Center Form */}
//                 <TabsContent value="training_center">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* First Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//                       <div>
//                         <LabelInput
//                           name="trainingCentreName"
//                           label="Company Name"
//                           value={formData.trainingCentreName}
//                           onChange={handleChange}
//                           placeholder="Company Name here"
//                           required
//                         />
//                       </div>
//                       <div>
//                         <LabelInput
//                           name="regNum"
//                           label="Reg Number"
//                           type="text"
//                           value={formData.regNum}
//                           onChange={handleChange}
//                           placeholder="RC-123456"
//                           required
//                         />
//                       </div>
//                     </div>

//                     {/* Email */}
//                     <div>
//                       <LabelInput
//                         name="email"
//                         label="Company Email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="company@email.com"
//                         required
//                       />
//                     </div>

//                     {/* Phone */}
//                     <div>
//                       <LabelInput
//                         name="phoneNumber"
//                         label="Company Phone"
//                         type="tel"
//                         value={formData.phoneNumber}
//                         onChange={handleChange}
//                         placeholder="2347012345643"
//                         required
//                       />
//                     </div>

//                     {/* Second Row: State and LGA */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
//                       <div className="space-y-2">
//                         <Label htmlFor="state" className="text-left text-xs text-gray-600">
//                           State<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select value={formData.state} onValueChange={handleStateChange}>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select state" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {states.map((state) => (
//                                 <SelectItem key={state.value} value={state.value}>
//                                   {state.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="lga" className="text-left text-xs text-gray-600">
//                           LGA<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lga}
//                           onValueChange={(value) => {
//                             console.log("Selected LGA:", value) // Debugging step
//                             setFormData({ ...formData, lga: value })
//                           }}
//                           disabled={!lgas.length}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select LGA" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectGroup>
//                               {lgas.map((lga) => (
//                                 <SelectItem key={lga} value={lga}>
//                                   {lga}
//                                 </SelectItem>
//                               ))}
//                             </SelectGroup>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     {/* Address (below State and LGA) */}
//                     <div>
//                       <LabelInput
//                         name="address"
//                         label="Company Address"
//                         type="text"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="No 1, Company Street, Company City" />
//                         </div>
//                     <div>
//                       <LabelInput
//                         name="address"
//                         label="Company Address"
//                         type="text"
//                         value={formData.address}
//                         onChange={handleChange}
//                         placeholder="No 1, Company Street, Company City"
//                       />
//                     </div>

//                     {/* Multiple Trade Areas with Sectors */}
//                     <div className="space-y-4 mt-4">
//                       <div className="flex justify-between items-center">
//                         <Label className="text-left text-xs text-gray-600">
//                           Sectors & Trade Areas<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           size="sm"
//                           onClick={addTradeArea}
//                           className="flex items-center gap-1"
//                         >
//                           <Plus className="h-4 w-4" /> Add Trade Area
//                         </Button>
//                       </div>

//                       {formData.legalInfo.tradeAreas.length > 0 ? (
//                         formData.legalInfo.tradeAreas.map((tradeAreaItem, index) => (
//                           <div key={index} className="grid grid-cols-1 gap-4 p-4 border rounded-md relative">
//                             {index > 0 && (
//                               <Button
//                                 type="button"
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => removeTradeArea(index)}
//                                 className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             )}

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor={`sector-${index}`} className="text-left text-xs text-gray-600">
//                                   Sector
//                                 </Label>
//                                 <Select
//                                   value={sectors?.find((sector) => sector._id === tradeAreaItem.sector[0])?.name || ""}
//                                   onValueChange={(value) => handleTradeAreaSectorChange(index, value)}
//                                   disabled={sectorLoading}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select sector" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectGroup>
//                                       {sectors?.map((sector) => (
//                                         <SelectItem key={sector._id} value={sector.name}>
//                                           {sector.name}
//                                         </SelectItem>
//                                       ))}
//                                     </SelectGroup>
//                                   </SelectContent>
//                                 </Select>
//                               </div>

//                               <div className="space-y-2">
//                                 <Label htmlFor={`tradeArea-${index}`} className="text-left text-xs text-gray-600">
//                                   Trade Area
//                                 </Label>
//                                 <Select
//                                   value={
//                                     sectors
//                                       ?.find((sector) => sector._id === tradeAreaItem.sector[0])
//                                       ?.tradeAreas?.find((ta) => ta._id === tradeAreaItem.tradeArea[0])?.name || ""
//                                   }
//                                   onValueChange={(value) => handleTradeAreaMultipleChange(index, value)}
//                                   disabled={!tradeAreaItem.sector.length}
//                                 >
//                                   <SelectTrigger>
//                                     <SelectValue placeholder="Select trade area" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     <SelectGroup>
//                                       {sectors
//                                         ?.find((sector) => sector._id === tradeAreaItem.sector[0])
//                                         ?.tradeAreas?.map((ta) => (
//                                           <SelectItem key={ta._id} value={ta.name}>
//                                             {ta.name}
//                                           </SelectItem>
//                                         ))}
//                                     </SelectGroup>
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>

//                             {/* Additional fields for each trade area */}
//                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
//                               <div className="space-y-2">
//                                 <Label htmlFor={`instructors-${index}`} className="text-left text-xs text-gray-600">
//                                   Instructors
//                                 </Label>
//                                 <Input
//                                   id={`instructors-${index}`}
//                                   value={tradeAreaItem.instructors}
//                                   onChange={(e) => handleTradeAreaFieldChange(index, "instructors", e.target.value)}
//                                   placeholder="Number of instructors"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`trainees-${index}`} className="text-left text-xs text-gray-600">
//                                   Trainees
//                                 </Label>
//                                 <Input
//                                   id={`trainees-${index}`}
//                                   value={tradeAreaItem.trainees}
//                                   onChange={(e) => handleTradeAreaFieldChange(index, "trainees", e.target.value)}
//                                   placeholder="Number of trainees"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`facilities-${index}`} className="text-left text-xs text-gray-600">
//                                   Facilities
//                                 </Label>
//                                 <Input
//                                   id={`facilities-${index}`}
//                                   value={tradeAreaItem.facilities}
//                                   onChange={(e) => handleTradeAreaFieldChange(index, "facilities", e.target.value)}
//                                   placeholder="Available facilities"
//                                   className="w-full"
//                                 />
//                               </div>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div className="space-y-2">
//                                 <Label htmlFor={`equipment-${index}`} className="text-left text-xs text-gray-600">
//                                   Equipment
//                                 </Label>
//                                 <Input
//                                   id={`equipment-${index}`}
//                                   value={tradeAreaItem.equipment}
//                                   onChange={(e) => handleTradeAreaFieldChange(index, "equipment", e.target.value)}
//                                   placeholder="Available equipment"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div className="space-y-2">
//                                 <Label htmlFor={`tools-${index}`} className="text-left text-xs text-gray-600">
//                                   Tools
//                                 </Label>
//                                 <Input
//                                   id={`tools-${index}`}
//                                   value={tradeAreaItem.tools}
//                                   onChange={(e) => handleTradeAreaFieldChange(index, "tools", e.target.value)}
//                                   placeholder="Available tools"
//                                   className="w-full"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="text-center py-4 text-gray-500 text-sm italic">
//                           No trade areas added. Click "Add Trade Area" to add sectors and trade areas.
//                         </div>
//                       )}
//                     </div>

//                     {/* Password Fields */}
//                     <PasswordFields formData={formData} onChange={handleChange} />

//                     {/* Submit Button */}
//                     <Button type="submit" className="w-full bg-blue-600">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>
//               </Tabs>
//               <div className="mt-4 text-center text-sm">
//                 Already have an account?-
//                 <Link to="/login" className=" text-emerald-900 hover:underline">
//                   Login
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </section>
//   )
// }

// // Input field with label component
// const LabelInput = ({ name, label, type = "text", value, onChange, placeholder, required = false }) => (
//   <div className="space-y-2">
//     <div className="w-full flex ">
//       <div htmlFor={name} className="text-left text-xs text-gray-600">
//         {label}
//         {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
//       </div>
//     </div>

//     <Input
//       id={name}
//       name={name}
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required
//       className="w-full"
//     />
//   </div>
// )

// // Password fields component
// const PasswordFields = ({ formData, onChange, required }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//     <div className="space-y-2">
//       <div className="w-full flex">
//         <div htmlFor={"password"} className="text-left text-xs text-gray-600">
//           Password
//           {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
//         </div>
//       </div>
//       <Input
//         id="password"
//         name="password"
//         type="password"
//         value={formData.password}
//         onChange={onChange}
//         placeholder="************"
//         required
//         className="w-full"
//       />
//     </div>
//     <div className="space-y-2">
//       <div className="w-full flex">
//         <div htmlFor={"confirmPassword"} className="text-left text-xs text-gray-600">
//           Confirm Password
//           {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
//         </div>
//       </div>
//       <Input
//         id="confirmPassword"
//         name="confirmPassword"
//         type="password"
//         value={formData.confirmPassword}
//         onChange={onChange}
//         placeholder="************"
//         required
//         className="w-full"
//       />
//     </div>
//   </div>
// )