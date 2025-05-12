"use client"

import { useEffect, useState } from "react"
import axios from "axios"
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
import { LogOut, Mail, PhoneCall, UserCircle, Edit, Eye, Save, X, Trash2, Plus } from "lucide-react"
import { API_BASE_URL } from "@/config/env"
import { fetchSectors } from "@/services/api"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadButton from "@/components/UploadButton"
import { FilePreview } from "@/components/FilePreview";
import { Card } from "@/components/ui/card";

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

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const infrastructureTypes = [
  "Offices",
  "Classrooms",
  "Laboratory",
  "Workshops/Kitchen",
  "Libraries",
  "Assembly Hall",
  "Cafeterias",
  "Others (Specify)",
]

const utilityTypes = [
  "Functional Restrooms",
  "Illumination",
  "Waste water disposal",
  "Solid waste disposal",
  "Electricity",
  "Desk Support",
  "Recreational",
  "Others (specify)",
]

const ASSESSMENT_STATUS = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  denied: { label: "Denied", color: "bg-red-100 text-red-800" }
}

const useDebounce = ({ onChange, debounce = 500 }) => {
  const [value, setValue] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return { value, setValue }
}

const TrainingCenterManagement = () => {
  const logout = useLogout()
  const navigate = useNavigate()
  const [error, setError] = useState(null)

  const [sectors, setSectors] = useState([])
  const [hasLoadedFirst, sethasLoadedFirst] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCenter, setSelectedCenter] = useState(null)
  const [editedCenter, setEditedCenter] = useState(null)
  const [selectedTab, setSelectedTab] = useState("details")

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
    dateFrom: "",
    dateTo: "",
    sort: "-createdAt",
  }
  const [filter, setFilter] = useState({
    ...defaultData,
  })

  // const handleFilterChange = (key, value) => {
  //   setFilter((x) => ({ ...x, [key]: value }))
  // }
  // const handleFilterChange = (key, value) => {
  //   setFilter((x) => ({ 
  //     ...x, 
  //     [key]: value === "all" ? "" : value // Convert "all" back to empty string for API
  //   }))
  // }

  const handleFilterChange = (key, value) => {
    setFilter(prev => {
      const newFilter = { ...prev };
      
      // Handle 'all' values
      if (value === 'all') {
        newFilter[key] = '';
      } else {
        newFilter[key] = value;
      }
      
      // Reset dependent fields
      if (key === 'state') {
        newFilter.lga = '';
      }
      if (key === 'sector') {
        newFilter.tradeArea = '';
      }
      
      // Reset to first page when filter changes
      newFilter.currentPage = 1;
      
      return newFilter;
    });
  };

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
      registrationDate: "Registration Date", 
    }

    // const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    // const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

    const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

      // const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
      // const rows = users.map((user) => {
      //   const formattedUser = {
      //     ...user,
      //     registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "---"
      //   };
      //   return Object.keys(formattedUser).map((key) => formattedUser[key]);
      // });

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
          dateFrom: filter?.dateFrom,
          dateTo: filter?.dateTo,
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data

      console.log('Sample record:', data[0])
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

          console.log('CreatedAt value:', x.createdAt, 'Type:', typeof x.createdAt);

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
            
            registrationDate: x.createdAt ? new Date(x.createdAt).toLocaleDateString() : "---"
            
          }
        }),
      )
      setcsvData(formatted)

      toast.success(
        "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
      )
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast.error("Failed to generate CSV data")
    } finally {
      setLoadingCSV(false)
    }
  }

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
  //         assessmentStatus: filter?.assessmentStatus, // Add this
  //         sort: filter?.sort,
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
  //     toast.error("Failed to fetch training centers")
  //   } finally {
  //     setLoading(false)
  //     setcsvData([])
  //   }
  // }

  const fetchReports = async () => {
    setLoading(true);
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
          assessmentStatus: filter?.assessmentStatus, // Add this
          sort: filter?.sort,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      const { data, pagination } = response.data;
      setReports(data);
      setpagination(prev => ({
        ...prev,
        total: pagination.total,
        totalPages: pagination.totalPages
      }));
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch training centers");
    } finally {
      setLoading(false);
      setcsvData([]);
    }
  };

  
  useEffect(() => {
    fetchReports()
  }, [filter?.search, filter?.currentPage, filter?.state, filter?.lga, filter?.sector, filter?.tradeArea, filter?.dateFrom, filter?.dateTo,])

  // const handleViewCenter = (center) => {
  //   setSelectedCenter(center)
  //   setEditMode(false)
  //   setSelectedTab("details")
  // }

  // Update the handleEditCenter function to initialize assessmentRecords as an array
  const handleEditCenter = (center) => {
    setSelectedCenter(center)
    setEditedCenter({ 
      ...center,
      // Ensure assessmentRecords is always an array
      assessmentRecords: Array.isArray(center.assessmentRecords) ? center.assessmentRecords : []
    })
    setEditMode(true)
    setSelectedTab("details")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedCenter((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update where you handle nested input changes for assessmentRecords
  const handleNestedInputChange = (category, field, value) => {
    setEditedCenter((prev) => {
      if (category === "assessmentRecords") {
        return {
          ...prev,
          // Ensure assessmentRecords is an array before updating
          assessmentRecords: Array.isArray(value) ? value : []
        }
      }
      
      return {
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          [field]: value,
        },
      }
    })
  }

  // const handleSaveChanges = async () => {
  //   try {
  //     setLoading(true)
  //     const accessToken = localStorage.getItem("accessToken")

  //     // If there's a new assessment record without an ID, it's a new assessment
  //     const newAssessment = editedCenter.assessmentRecords?.find(record => !record._id)
      
  //     const payload = {
  //       ...editedCenter,
  //       ...(newAssessment && { newAssessment }),
  //     }

  //     await axios.patch(
  //       `${API_BASE_URL}/training-centers/${editedCenter._id}`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     )

  //     toast.success("Training center updated successfully")
  //     fetchReports()
  //     setEditMode(false)
  //     setSelectedCenter(null)
  //     setEditedCenter(null)
  //   } catch (error) {
  //     console.error("Error updating training center:", error)
  //     toast.error("Failed to update training center")
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")
  
      // If there's a new assessment record without an ID, it's a new assessment
      const newAssessment = editedCenter.assessmentRecords?.find(record => !record._id)
      
      const payload = {
        ...editedCenter,
        ...(newAssessment && { newAssessment }),
      }
  
      const response = await axios.patch(
        `${API_BASE_URL}/training-centers/${editedCenter._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
  
      // Update local state with the response data
      const updatedCenter = response.data.data
      setSelectedCenter(updatedCenter)
      
      // Refresh the table data
      await fetchReports()
      
      toast.success("Training center updated successfully")
      setEditMode(false)
      
      // Don't clear selected center so the view shows updated data
      setEditedCenter(null)
    } catch (error) {
      console.error("Error updating training center:", error)
      toast.error("Failed to update training center")
    } finally {
      setLoading(false)
    }
  }
  
  // Update handleViewCenter to fetch fresh data
  const handleViewCenter = async (center) => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await axios.get(
        `${API_BASE_URL}/training-center/${center._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      setSelectedCenter(response.data.data)
      setEditMode(false)
      setSelectedTab("details")
    } catch (error) {
      console.error("Error fetching center details:", error)
      toast.error("Failed to fetch center details")
      setSelectedCenter(center) // Fallback to passed data if fetch fails
    }
  }
  const handleCancelEdit = () => {
    setEditMode(false)
    setEditedCenter(null)
  }

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Update profile picture function
  const updateProfilePicture = async (url) => {
    try {
      if (!editedCenter) return

      setEditedCenter((prev) => ({
        ...prev,
        profileImage: url,
      }))

      toast.success("Profile picture updated. Save changes to apply.")
    } catch (error) {
      console.error("Error updating profile picture:", error)
      toast.error("Failed to update profile picture")
    }
  }

  // These constants are already defined at the top of the file, so we don't need to redefine them here

  return (
    <ProtectedRoute>
      {loading && !hasLoadedFirst ? (
        <div className="flex justify-center items-center h-screen ">
          <Spinner />
        </div>
      ) : null}
      {/* <DashboardPage title="Training Center Management"> */}
      <div className="container mx-auto py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Training Center Management</h1>
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
            <Select value={filter?.state || "default"} onValueChange={(value) => {
              if (value !== "default") {
                handleFilterChange("state", value)
              }
            }}>
              <SelectTrigger className="text-[12px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default" disabled>Select...</SelectItem>
                  {states.map((item) => {
                    return (
                      <SelectItem className="text-[12px]" value={item?.value || "_empty_"} key={item.value}>
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
            <Select value={filter.lga || "default"} onValueChange={(value) => {
              if (value !== "default") {
                handleFilterChange("lga", value)
              }
            }}>
              <SelectTrigger className="text-[12px]">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default" disabled>Select...</SelectItem>
                  {selectedStateLGASResidenceFormatted.map((item) => {
                    return (
                      <SelectItem className="text-[12px]" value={item?.value || "_empty_"} key={item.value}>
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
            <Select value={filter?.sector || "default"} onValueChange={(value) => {
              if (value !== "default") {
                handleFilterChange("sector", value)
              }
            }}>
              <SelectTrigger className="text-[12px]">
                <SelectValue placeholder="Select Sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default" disabled>Select...</SelectItem>
                  {(sectors || []).map((sector) => (
                    <SelectItem className="text-[12px]" key={sector._id} value={sector._id || "_empty_"}>
                      {sector?.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <p className="text-left text-[14px] mb-1">Trade Area</p>
            <Select value={filter.tradeArea || "default"} onValueChange={(value) => {
              if (value !== "default") {
                handleFilterChange("tradeArea", value)
              }
            }}>
              <SelectTrigger className="text-[12px]">
                <SelectValue placeholder="Select Trade Area" className="text-[12px]" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default" disabled>Select...</SelectItem>
                  {sectors
                    .find((sector) => sector._id === filter?.sector)
                    ?.tradeAreas?.map((ta) => {
                      return (
                        <SelectItem className="text-[12px]" key={ta?._id} value={ta?._id || "_empty_"}>
                          {ta?.name}
                        </SelectItem>
                      )
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Add this to your filter section */}
          <div className="w-[200px]">
            <p className="text-left text-[14px] mb-1">Assessment Status</p>
            <Select 
              value={filter?.assessmentStatus || "all"} // Changed from empty string
              onValueChange={(value) => handleFilterChange("assessmentStatus", value)}
            >
              <SelectTrigger className="text-[12px]">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem className="text-[12px]" value="all">All</SelectItem> {/* Changed from empty string */}
                  <SelectItem className="text-[12px]" value="pending">Pending</SelectItem>
                  <SelectItem className="text-[12px]" value="approved">Approved</SelectItem>
                  <SelectItem className="text-[12px]" value="denied">Denied</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <p className="text-left text-[14px] mb-1">From Date</p>
            <Input
              type="date"
              className="text-[12px]"
              value={filter.dateFrom}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="w-[200px]">
            <p className="text-left text-[14px] mb-1">To Date</p>
            <Input
              type="date"
              className="text-[12px]"
              value={filter.dateTo}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="w-full items-center justify-start flex gap-4">
          <Button
            className="bg-slate-700 text-[white] mt-auto hover:bg-gray-300"
            onClick={clearFilter}
            disabled={loading}
          >
            Clear
            {loading ? <SewingPinFilledIcon className="animate-spin" /> : <Cross1Icon />}
          </Button>
        </div>

        <div className="gap-2 flex justify-between w-full mt-4">
          <h2 className="font-medium">Total Records Found: {pagination?.total || 0}</h2>
          <div className="gap-2 flex flex-row-reverse justify-start mb-4">
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
              <TableHead>Assessment Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                Registration Date {filter.sort === "createdAt" ? "↑" : filter.sort === "-createdAt" ? "↓" : ""}
              </TableHead>
              <TableHead>Actions</TableHead>
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
                                  <h1 className="text-left font-medium text-[16px]">Sector: {sectorInfo.sectorName}</h1>

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

                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      ASSESSMENT_STATUS[center.currentAssessmentStatus || 'pending'].color
                    }`}>
                      {ASSESSMENT_STATUS[center.currentAssessmentStatus || 'pending'].label}
                    </span>
                  </TableCell>

                  <TableCell className="text-left text-[12px]">
                    {center?.createdAt ? new Date(center.createdAt).toLocaleDateString() : "---"}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => handleViewCenter(center)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[500px] sm:w-[700px] md:w-[1000px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Training Center Details</SheetTitle>
                            <SheetDescription>View and manage training center information</SheetDescription>
                          </SheetHeader>

                          {selectedCenter && !editMode && (
                            <div className="py-4">
                              <div className="border p-4 rounded-lg shadow-md mb-6">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                                  <div className="w-24 h-24 rounded-full overflow-hidden">
                                    <img
                                      src={selectedCenter.profileImage || "/placeholder.svg?height=96&width=96"}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold">
                                      {selectedCenter.trainingCentreName || "Training Center"}
                                    </h2>
                                    <p className="text-gray-500">{selectedCenter.email || "No email provided"}</p>
                                    <p className="text-gray-500">
                                      {selectedCenter.contactPerson || "No contact person"}
                                    </p>
                                  </div>
                                  {/* Add Assessment Status Badge */}
                                  <div className="ml-auto">
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="text-sm font-medium">Assessment Status</span>
                                      <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                        ASSESSMENT_STATUS[selectedCenter.currentAssessmentStatus || 'pending'].color
                                      }`}>
                                        {ASSESSMENT_STATUS[selectedCenter.currentAssessmentStatus || 'pending'].label}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div className="grid grid-row-2 md:grid-row-2 gap-4">
                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-2">Center Details</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Registration Number:</span>
                                        <span>{selectedCenter.regNum || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">State:</span>
                                        <span>{selectedCenter.state || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">LGA:</span>
                                        <span>{selectedCenter.lga || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Area Office:</span>
                                        <span>{selectedCenter.areaOffice || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Address:</span>
                                        <span>{selectedCenter.address || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Establishment Date:</span>
                                        <span>
                                          {selectedCenter.establishmentDate
                                            ? new Date(selectedCenter.establishmentDate).toLocaleDateString()
                                            : "---"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-2">Contact Information</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Contact Person:</span>
                                        <span>{selectedCenter.contactPerson || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Phone Number:</span>
                                        <span>{selectedCenter.phoneNumber || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Email:</span>
                                        <span>{selectedCenter.email || "---"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-row-2 md:grid-row-2 gap-4">
                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-2">Center Information</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Ownership:</span>
                                        <span>{selectedCenter.ownership || "---"}</span>
                                      </div>
                                      {selectedCenter.ownership === "other" && (
                                        <div className="flex justify-between">
                                          <span className="font-medium">Other Ownership:</span>
                                          <span>{selectedCenter.otherOwnership || "---"}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span className="font-medium">Training Nature:</span>
                                        <span>{selectedCenter.trainingNature || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">ITF Registered:</span>
                                        <span>{selectedCenter.itfRegistered || "---"}</span>
                                      </div>
                                      {selectedCenter.itfRegistered === "yes" && (
                                        <div className="flex justify-between">
                                          <span className="font-medium">ITF Registration Number:</span>
                                          <span>{selectedCenter.itfRegistrationNumber || "---"}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-2">Bank Account</h3>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Account Name:</span>
                                        <span>{selectedCenter.bankAccount?.accountName || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Account Number:</span>
                                        <span>{selectedCenter.bankAccount?.accountNumber || "---"}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium">Bank:</span>
                                        <span>{selectedCenter.bankAccount?.bank || "---"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-row-1 md:grid-row-2 gap-4">
                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-4 text-[24px]">Training Centre Amenities</h3>
                                    <div className="space-y-6 text-sm">
                                      {/* Portable Water */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Does the Centre have portable water that is available to Trainee?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.amenities?.portableWater || "---"}
                                        </span>
                                      </div>

                                      {/* Observe Break */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Does the Centre observe break?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.amenities?.observeBreak || "---"}
                                        </span>
                                      </div>

                                      {/* Break Time - Only show if observeBreak is "yes" */}
                                      {selectedCenter.amenities?.observeBreak === "yes" && (
                                        <div className="flex items-center">
                                          <span className="w-[300px] font-medium text-left leading-[1.3]">
                                            What is the break time?
                                          </span>
                                          <span className="w-[200px] text-left">
                                            {selectedCenter.amenities?.breakTime || "---"}
                                          </span>
                                        </div>
                                      )}

                                      {/* Other Comments */}
                                      <div className="flex items-start">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Any Other Comments:
                                        </span>
                                        <span className="flex-1 text-left">
                                          {selectedCenter.amenities?.otherComments || "---"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-row-1 md:grid-row-2 gap-4">
                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-4 text-[24px]">Training Centre Assessment</h3>
                                    <div className="space-y-6 text-sm">
                                      {/* Trainee-Instructor Ratio */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          15. What is the ratio of Trainee to Instructor?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.traineeInstructorRatio || "---"}
                                        </span>
                                      </div>

                                      {/* Practical-Theory Ratio */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          16. What is the ratio of practical to theory?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.practicalTheoryRatio || "---"}
                                        </span>
                                      </div>

                                      {/* Training Duration Per Day */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          17. What is the Training duration per day?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.trainingDurationPerDay || "---"}
                                        </span>
                                      </div>

                                      {/* Training Duration Per Week */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          18. What is the Training duration per week?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.trainingDurationPerWeek || "---"}
                                        </span>
                                      </div>

                                      {/* Weekly Training Schedule */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          19. Does the Centre maintain weekly Training Schedule?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.weeklyTrainingSchedule || "---"}
                                        </span>
                                      </div>

                                      {/* Training Curriculum */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          20. Does the Centre have a Training Curriculum?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.trainingCurriculum || "---"}
                                        </span>
                                      </div>

                                      {/* Curriculum Attachment */}
                                      {selectedCenter.assessment?.trainingCurriculum === "yes" &&
                                        selectedCenter.assessment?.curriculumAttachment && (
                                          <div className="flex items-center">
                                            <span className="w-[300px] font-medium text-left leading-[1.3]">
                                              Curriculum Document:
                                            </span>
                                            {/* <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                window.open(selectedCenter.assessment.curriculumAttachment, "_blank")
                                              }
                                              className="flex items-center gap-2"
                                            >
                                              <Eye className="h-4 w-4" />
                                              View Document
                                            </Button> */}
                                            <FilePreview fileUrl={selectedCenter.assessment.curriculumAttachment} />
                                            
                                          </div>
                                        )}

                                      {/* Attendance Register */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          21. Does the Centre keep attendance register?
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.attendanceRegister || "---"}
                                        </span>
                                      </div>

                                      {/* Infrastructure Section */}
                                      <div className="space-y-4">
                                        <h2 className="text-left font-[600] text-[20px] mt-4">
                                          22. Infrastructure Available for Training:
                                        </h2>
                                        <div className="border border-gray-300 rounded-md overflow-hidden">
                                          <div className="grid grid-cols-2 bg-gray-100 font-semibold">
                                            <div className="p-2 border-r border-b border-gray-300">Type</div>
                                            <div className="p-2 border-b border-gray-300">Number</div>
                                          </div>
                                          {(selectedCenter.assessment?.infrastructure || []).map((item, index) => (
                                            <div key={index} className="grid grid-cols-2">
                                              <div className="p-2 border-r border-b border-gray-300">{item.type}</div>
                                              <div className="p-2 border-b border-gray-300">{item.number || "---"}</div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Utilities Section */}
                                      <div className="space-y-4">
                                        <h2 className="text-left font-[600] text-[20px] mt-4">
                                          23. Utilities/Services:
                                        </h2>
                                        <div className="border border-gray-300 rounded-md overflow-hidden">
                                          <div className="grid grid-cols-5 bg-gray-100 font-semibold">
                                            <div className="p-2 border-r border-b border-gray-300">Type</div>
                                            <div className="p-2 border-r border-b border-gray-300">Number</div>
                                            <div className="p-2 border-r border-b border-gray-300">Functional</div>
                                            <div className="p-2 border-r border-b border-gray-300">Not Functional</div>
                                            <div className="p-2 border-b border-gray-300">Remarks</div>
                                          </div>
                                          {(selectedCenter.assessment?.utilities || []).map((item, index) => (
                                            <div key={index} className="grid grid-cols-5">
                                              <div className="p-2 border-r border-b border-gray-300">{item.type}</div>
                                              <div className="p-2 border-r border-b border-gray-300">
                                                {item.number || "---"}
                                              </div>
                                              <div className="p-2 border-r border-b border-gray-300">
                                                {item.functional || "---"}
                                              </div>
                                              <div className="p-2 border-r border-b border-gray-300">
                                                {item.notFunctional || "---"}
                                              </div>
                                              <div className="p-2 border-b border-gray-300">
                                                {item.remarks || "---"}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Total Floor Area */}
                                      <div className="flex items-center">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Total Floor Area (m²)
                                        </span>
                                        <span className="w-[200px] text-left">
                                          {selectedCenter.assessment?.totalFloorArea || "---"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-row-1 md:grid-row-2 gap-4">
                                  <div className="border p-4 rounded-lg shadow-sm">
                                    <h3 className="font-semibold mb-4 text-[24px]">Legal Information</h3>
                                    <div className="space-y-6 text-sm">
                                      {/* Legal Registration */}
                                      <div className="flex items-start">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Legal Registration/Licensing Information:
                                        </span>
                                        <span className="flex-1 text-left">
                                          {selectedCenter.legalInfo?.legalRegistration || "---"}
                                        </span>
                                      </div>

                                      {/* Supporting Documents */}
                                      {selectedCenter.legalInfo?.supportingDocuments?.[0] && (
                                        <div className="flex items-center">
                                          <span className="w-[300px] font-medium text-left leading-[1.3]">
                                            Supporting Documents:
                                          </span>
                                          {/* <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              window.open(selectedCenter.legalInfo.supportingDocuments[0], "_blank")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <Eye className="h-4 w-4" />
                                            View Document
                                          </Button> */}
                                          <FilePreview fileUrl={selectedCenter.legalInfo.supportingDocuments[0]} />
                                        </div>
                                      )}

                                      {/* Trade Areas */}
                                      <div className="space-y-4">
                                        <h2 className="text-left font-[600] text-[20px] mt-4">Trade Area Profile:</h2>
                                        {(selectedCenter.legalInfo?.tradeAreas || []).length > 0 ? (
                                          <div className="border border-gray-300 rounded-md overflow-hidden overflow-x-auto">
                                            <table className="w-full border-collapse">
                                              <thead>
                                                <tr className="bg-gray-100">
                                                  <th className="border border-gray-300 p-2">S/NO.</th>
                                                  <th className="border border-gray-300 p-2">Sector</th>
                                                  <th className="border border-gray-300 p-2">Trade Areas</th>
                                                  <th className="border border-gray-300 p-2">Instructors</th>
                                                  <th className="border border-gray-300 p-2">Trainees</th>
                                                  <th className="border border-gray-300 p-2">Facilities</th>
                                                  <th className="border border-gray-300 p-2">Equipment</th>
                                                  <th className="border border-gray-300 p-2">Tools</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {(selectedCenter.legalInfo?.tradeAreas || []).map((trade, index) => (
                                                  <tr key={index}>
                                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.sector?.[0]?.name || "---"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      <div className="flex flex-wrap gap-1">
                                                        {Array.isArray(trade?.tradeArea) && trade.tradeArea.length > 0
                                                          ? trade.tradeArea.map((ta_id, taIndex) => {
                                                              const tradeAreaInfo = trade.sector?.[0]?.tradeAreas?.find(
                                                                (ta) => ta._id === ta_id,
                                                              )
                                                              return (
                                                                <span
                                                                  key={taIndex}
                                                                  className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-blue-600"
                                                                >
                                                                  {tradeAreaInfo?.name || "---"}
                                                                </span>
                                                              )
                                                            })
                                                          : "---"}
                                                      </div>
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.instructors || "---"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.trainees || "---"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.facilities || "---"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.equipment || "---"}
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                      {trade.tools || "---"}
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        ) : (
                                          <p>No trade areas defined</p>
                                        )}
                                      </div>

                                      {/* Instructor Credentials */}
                                      {selectedCenter.legalInfo?.instructorCredentials?.[0] && (
                                        <div className="flex items-center">
                                          <span className="w-[300px] font-medium text-left leading-[1.3]">
                                            Instructor Credentials:
                                          </span>
                                          {/* <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              window.open(selectedCenter.legalInfo.instructorCredentials[0], "_blank")
                                            }
                                            className="flex items-center gap-2"
                                          >
                                            <Eye className="h-4 w-4" />
                                            View Document
                                          </Button> */}
                                          <FilePreview fileUrl={selectedCenter.legalInfo.instructorCredentials[0]} />
                                        </div>
                                      )}

                                      {/* Additional Details */}
                                      <div className="flex items-start">
                                        <span className="w-[300px] font-medium text-left leading-[1.3]">
                                          Additional Details:
                                        </span>
                                        <span className="flex-1 text-left">
                                          {selectedCenter.legalInfo?.additionalDetails || "---"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedCenter && editMode && editedCenter && (
                            <div className="py-4">
                              <div className="border p-4 rounded-lg shadow-md mb-6">
                                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                                  <div className="w-24 h-24 rounded-full overflow-hidden">
                                    <img
                                      src={editedCenter.profileImage || "/placeholder.svg?height=96&width=96"}
                                      alt="Profile"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h2 className="text-2xl font-bold">
                                      {editedCenter.trainingCentreName || "Training Center"}
                                    </h2>
                                    <p className="text-gray-500">{editedCenter.email || "No email provided"}</p>
                                    <p className="text-gray-500">{editedCenter.contactPerson || "No contact person"}</p>
                                  </div>
                                  <div className="ml-auto">
                                    <UploadButton
                                      fileUrl={editedCenter.profileImage}
                                      handleFileChange={(url) => {
                                        updateProfilePicture(url)
                                      }}
                                      removeFile={() => {
                                        updateProfilePicture("")
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="block  mb-4">
                                <Select onValueChange={(value) => setSelectedTab(value)} value={selectedTab}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Tab" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="details">Center Details</SelectItem>
                                    <SelectItem value="amenities">Amenities</SelectItem>
                                    <SelectItem value="assessment">Assessment</SelectItem>
                                    <SelectItem value="assessmentRecords">Assessment Records</SelectItem>
                                    <SelectItem value="legal">Legal Info</SelectItem>
                                    <SelectItem value="bank">Bank Account</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Tabs
                                defaultValue="details"
                                value={selectedTab}
                                onValueChange={setSelectedTab}
                                className="w-full"
                              >
                                {/* <TabsList className="hidden md:grid w-full grid-cols-5">
                                  <TabsTrigger value="details">Center Details</TabsTrigger>
                                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                                  <TabsTrigger value="legal">Legal Info</TabsTrigger>
                                  <TabsTrigger value="bank">Bank Account</TabsTrigger>
                                </TabsList> */}

                                <TabsContent value="details">
                                  <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="trainingCentreName">Training Center Name</Label>
                                        <Input
                                          id="trainingCentreName"
                                          name="trainingCentreName"
                                          value={editedCenter.trainingCentreName || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Training Centre Name"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="regNum">Registration Number</Label>
                                        <Input
                                          id="regNum"
                                          name="regNum"
                                          value={editedCenter.regNum || ""}
                                          onChange={handleInputChange}
                                          placeholder="Registration Number"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="state">State</Label>
                                        <Select
                                          value={editedCenter.state || "default"}
                                          onValueChange={(value) => {
                                            if (value !== "default") {
                                              handleInputChange({
                                                target: { name: "state", value },
                                              })
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="default" disabled>Select...</SelectItem>
                                              {states.map((state) => (
                                                <SelectItem key={state.value} value={state.value || "_empty_"}>
                                                  {state.label}
                                                </SelectItem>
                                              ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="lga">LGA</Label>
                                        <Select
                                          value={editedCenter.lga || "default"}
                                          onValueChange={(value) => {
                                            if (value !== "default") {
                                              handleInputChange({
                                                target: { name: "lga", value },
                                              })
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select LGA" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="default" disabled>Select...</SelectItem>
                                              {states
                                                .find((state) => state.value === editedCenter.state)
                                                ?.lgas.map((lga) => (
                                                  <SelectItem key={lga} value={lga || "_empty_"}>
                                                    {lga}
                                                  </SelectItem>
                                                ))}
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="areaOffice">Area Office</Label>
                                        <Input
                                          id="areaOffice"
                                          name="areaOffice"
                                          value={editedCenter.areaOffice || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Area Office"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                          id="address"
                                          name="address"
                                          value={editedCenter.address || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Address"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="contactPerson">Contact Person</Label>
                                        <Input
                                          id="contactPerson"
                                          name="contactPerson"
                                          value={editedCenter.contactPerson || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Contact Person"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input
                                          id="phoneNumber"
                                          name="phoneNumber"
                                          value={editedCenter.phoneNumber || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Phone Number"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                          id="email"
                                          name="email"
                                          type="email"
                                          value={editedCenter.email || ""}
                                          onChange={handleInputChange}
                                          placeholder="Enter Email"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="establishmentDate">Establishment Date</Label>
                                        <Input
                                          id="establishmentDate"
                                          name="establishmentDate"
                                          type="date"
                                          value={formatDateForInput(editedCenter.establishmentDate)}
                                          onChange={handleInputChange}
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="ownership">Ownership</Label>
                                        <Select
                                          value={editedCenter.ownership || "default"}
                                          onValueChange={(value) => {
                                            if (value !== "default") {
                                              handleInputChange({
                                                target: { name: "ownership", value },
                                              })
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select ownership" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="default" disabled>Select...</SelectItem>
                                              <SelectItem value="federalGovt">Federal Gov't</SelectItem>
                                              <SelectItem value="stateGovt">State Gov't</SelectItem>
                                              <SelectItem value="localGovt">Local Gov't</SelectItem>
                                              <SelectItem value="personal">Personal</SelectItem>
                                              <SelectItem value="coOwned">Co-Owned</SelectItem>
                                              <SelectItem value="religiousOrganization">
                                                Religious Organization
                                              </SelectItem>
                                              <SelectItem value="ngo">Non-Governmental Organization (NGO)</SelectItem>
                                              <SelectItem value="other">Others (Specify)</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {editedCenter.ownership === "other" && (
                                        <div className="space-y-2">
                                          <Label htmlFor="otherOwnership">Specify Other Ownership</Label>
                                          <Input
                                            id="otherOwnership"
                                            name="otherOwnership"
                                            value={editedCenter.otherOwnership || ""}
                                            onChange={handleInputChange}
                                            placeholder="Specify Other Ownership"
                                          />
                                        </div>
                                      )}

                                      <div className="space-y-2">
                                        <Label htmlFor="trainingNature">Nature of Training</Label>
                                        <Select
                                          value={editedCenter.trainingNature || "default"}
                                          onValueChange={(value) => {
                                            if (value !== "default") {
                                              handleInputChange({
                                                target: { name: "trainingNature", value },
                                              })
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select nature of training" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="default" disabled>Select...</SelectItem>
                                              <SelectItem value="institutionTraining">Institution Training</SelectItem>
                                              <SelectItem value="workplaceTraining">
                                                Workplace/Formal Training
                                              </SelectItem>
                                              <SelectItem value="informal">Informal</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label htmlFor="itfRegistered">ITF Registered</Label>
                                        <Select
                                          value={editedCenter.itfRegistered || "default"}
                                          onValueChange={(value) => {
                                            if (value !== "default") {
                                              handleInputChange({
                                                target: { name: "itfRegistered", value },
                                              })
                                            }
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select Yes or No" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="default" disabled>Select...</SelectItem>
                                              <SelectItem value="yes">Yes</SelectItem>
                                              <SelectItem value="no">No</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {editedCenter.itfRegistered === "yes" && (
                                        <div className="space-y-2">
                                          <Label htmlFor="itfRegistrationNumber">ITF Registration Number</Label>
                                          <Input
                                            id="itfRegistrationNumber"
                                            name="itfRegistrationNumber"
                                            value={editedCenter.itfRegistrationNumber || ""}
                                            onChange={handleInputChange}
                                            placeholder="Enter ITF Registration Number"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </form>
                                </TabsContent>

                                <TabsContent value="amenities">
                                  <form className="space-y-6">
                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="portableWater" className="w-[300px] text-left leading-[1.3]">
                                        Does the Centre have portable water that is available to Trainee?
                                      </Label>
                                      <Select
                                        value={editedCenter.amenities?.portableWater || "default"}
                                        onValueChange={(value) => {
                                          if (value !== "default") {
                                            handleNestedInputChange("amenities", "portableWater", value)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[200px]">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="default" disabled>Select...</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="observeBreak" className="w-[300px] text-left leading-[1.3]">
                                        Does the Centre observe break?
                                      </Label>
                                      <Select
                                        value={editedCenter.amenities?.observeBreak || "default"}
                                        onValueChange={(value) => {
                                          if (value !== "default") {
                                            handleNestedInputChange("amenities", "observeBreak", value)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[200px]">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="default" disabled>Select...</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {editedCenter.amenities?.observeBreak === "yes" && (
                                      <div className="flex items-center gap-4">
                                        <Label htmlFor="breakTime" className="w-[300px] text-left leading-[1.3]">
                                          What is the break time?
                                        </Label>
                                        <Input
                                          type="time"
                                          id="breakTime"
                                          value={editedCenter.amenities?.breakTime || ""}
                                          onChange={(e) =>
                                            handleNestedInputChange("amenities", "breakTime", e.target.value)
                                          }
                                        />
                                      </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                      <Label htmlFor="otherComments" className="w-[300px] text-left leading-[1.3]">
                                        Any Other Comments:
                                      </Label>
                                      <Textarea
                                        id="otherComments"
                                        placeholder="Enter any additional comments"
                                        value={editedCenter.amenities?.otherComments || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("amenities", "otherComments", e.target.value)
                                        }
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                  </form>
                                </TabsContent>

                                <TabsContent value="assessment">
                                  <form className="space-y-6">
                                    {/* Trainee-Instructor Ratio */}
                                    <div className="flex items-center gap-4">
                                      <Label
                                        htmlFor="traineeInstructorRatio"
                                        className="w-[300px] text-left leading-[1.3]"
                                      >
                                        15. What is the ratio of Trainee to Instructor?
                                      </Label>
                                      <Input
                                        id="traineeInstructorRatio"
                                        placeholder="e.g., 10:1"
                                        value={editedCenter.assessment?.traineeInstructorRatio || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange(
                                            "assessment",
                                            "traineeInstructorRatio",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Practical-Theory Ratio */}
                                    <div className="flex items-center gap-4">
                                      <Label
                                        htmlFor="practicalTheoryRatio"
                                        className="w-[300px] text-left leading-[1.3]"
                                      >
                                        16. What is the ratio of practical to theory?
                                      </Label>
                                      <Input
                                        id="practicalTheoryRatio"
                                        placeholder="e.g., 70:30"
                                        value={editedCenter.assessment?.practicalTheoryRatio || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("assessment", "practicalTheoryRatio", e.target.value)
                                        }
                                      />
                                    </div>

                                    {/* Training Duration Per Day */}
                                    <div className="flex items-center gap-4">
                                      <Label
                                        htmlFor="trainingDurationPerDay"
                                        className="w-[300px] text-left leading-[1.3]"
                                      >
                                        17. What is the Training duration per day?
                                      </Label>
                                      <Input
                                        id="trainingDurationPerDay"
                                        placeholder="e.g., 8 hours"
                                        value={editedCenter.assessment?.trainingDurationPerDay || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange(
                                            "assessment",
                                            "trainingDurationPerDay",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Training Duration Per Week */}
                                    <div className="flex items-center gap-4">
                                      <Label
                                        htmlFor="trainingDurationPerWeek"
                                        className="w-[300px] text-left leading-[1.3]"
                                      >
                                        18. What is the Training duration per week?
                                      </Label>
                                      <Input
                                        id="trainingDurationPerWeek"
                                        placeholder="e.g., 40 hours"
                                        value={editedCenter.assessment?.trainingDurationPerWeek || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange(
                                            "assessment",
                                            "trainingDurationPerWeek",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    {/* Weekly Training Schedule */}
                                    <div className="flex items-center gap-4">
                                      <Label
                                        htmlFor="weeklyTrainingSchedule"
                                        className="w-[300px] text-left leading-[1.3]"
                                      >
                                        19. Does the Centre maintain weekly Training Schedule?
                                      </Label>
                                      <Select
                                        value={editedCenter.assessment?.weeklyTrainingSchedule || "default"}
                                        onValueChange={(value) => {
                                          if (value !== "default") {
                                            handleNestedInputChange("assessment", "weeklyTrainingSchedule", value)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[200px]">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="default" disabled>Select...</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Training Curriculum */}
                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="trainingCurriculum" className="w-[300px] text-left leading-[1.3]">
                                        20. Does the Centre have a Training Curriculum?
                                      </Label>
                                      <Select
                                        value={editedCenter.assessment?.trainingCurriculum || "default"}
                                        onValueChange={(value) => {
                                          if (value !== "default") {
                                            handleNestedInputChange("assessment", "trainingCurriculum", value)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[200px]">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="default" disabled>Select...</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Curriculum Attachment */}
                                    {editedCenter.assessment?.trainingCurriculum === "yes" && (
                                      <div className="flex items-center gap-4">
                                        <Label
                                          htmlFor="curriculumAttachment"
                                          className="w-[300px] text-left leading-[1.3]"
                                        >
                                          Curriculum Document:
                                        </Label>
                                        <div className="flex-1">
                                          <UploadButton
                                            fileUrl={editedCenter.assessment?.curriculumAttachment}
                                            handleFileChange={(url) =>
                                              handleNestedInputChange("assessment", "curriculumAttachment", url)
                                            }
                                            removeFile={() =>
                                              handleNestedInputChange("assessment", "curriculumAttachment", null)
                                            }
                                            accept=".pdf,.doc,.docx"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Attendance Register */}
                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="attendanceRegister" className="w-[300px] text-left leading-[1.3]">
                                        21. Does the Centre keep attendance register?
                                      </Label>
                                      <Select
                                        value={editedCenter.assessment?.attendanceRegister || "default"}
                                        onValueChange={(value) => {
                                          if (value !== "default") {
                                            handleNestedInputChange("assessment", "attendanceRegister", value)
                                          }
                                        }}
                                      >
                                        <SelectTrigger className="w-[200px]">
                                          <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectGroup>
                                            <SelectItem value="default" disabled>Select...</SelectItem>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                          </SelectGroup>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* Infrastructure Section */}
                                    <div className="space-y-4">
                                      <h2 className="text-left font-[600] text-[20px] mt-4">
                                        22. Infrastructure Available for Training:
                                      </h2>
                                      <div className="border border-gray-300 rounded-md overflow-hidden">
                                        <div className="grid grid-cols-2 bg-gray-100 font-semibold">
                                          <div className="p-2 border-r border-b border-gray-300">Type</div>
                                          <div className="p-2 border-b border-gray-300">Number</div>
                                        </div>
                                        {infrastructureTypes.map((type) => (
                                          <div key={type} className="grid grid-cols-2">
                                            <div className="p-2 border-r border-b border-gray-300">{type}</div>
                                            <div className="p-2 border-b border-gray-300">
                                              <Input
                                                type="number"
                                                value={
                                                  editedCenter.assessment?.infrastructure?.find(
                                                    (item) => item.type === type,
                                                  )?.number || ""
                                                }
                                                onChange={(e) => {
                                                  const currentInfrastructure = Array.isArray(
                                                    editedCenter.assessment?.infrastructure,
                                                  )
                                                    ? editedCenter.assessment.infrastructure
                                                    : []
                                                  const existingIndex = currentInfrastructure.findIndex(
                                                    (item) => item.type === type,
                                                  )
                                                  let updatedInfrastructure

                                                  if (existingIndex >= 0) {
                                                    updatedInfrastructure = [...currentInfrastructure]
                                                    updatedInfrastructure[existingIndex] = {
                                                      ...updatedInfrastructure[existingIndex],
                                                      number: e.target.value,
                                                    }
                                                  } else {
                                                    updatedInfrastructure = [
                                                      ...currentInfrastructure,
                                                      { type, number: e.target.value },
                                                    ]
                                                  }

                                                  handleNestedInputChange(
                                                    "assessment",
                                                    "infrastructure",
                                                    updatedInfrastructure,
                                                  )
                                                }}
                                                min="0"
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Utilities Section */}
                                    <div className="space-y-4">
                                      <h2 className="text-left font-[600] text-[20px] mt-4">23. Utilities/Services:</h2>
                                      <div className="border border-gray-300 rounded-md overflow-hidden">
                                        <div className="grid grid-cols-5 bg-gray-100 font-semibold">
                                          <div className="p-2 border-r border-b border-gray-300">Type</div>
                                          <div className="p-2 border-r border-b border-gray-300">Number</div>
                                          <div className="p-2 border-r border-b border-gray-300">Functional</div>
                                          <div className="p-2 border-r border-b border-gray-300">Not Functional</div>
                                          <div className="p-2 border-b border-gray-300">Remarks</div>
                                        </div>
                                        {utilityTypes.map((type) => (
                                          <div key={type} className="grid grid-cols-5">
                                            <div className="p-2 border-r border-b border-gray-300">{type}</div>
                                            {["number", "functional", "notFunctional", "remarks"].map((field) => (
                                              <div key={field} className="p-2 border-r border-b border-gray-300">
                                                <Input
                                                  type={field === "number" ? "number" : "text"}
                                                  value={
                                                    editedCenter.assessment?.utilities?.find(
                                                      (item) => item.type === type,
                                                    )?.[field] || ""
                                                  }
                                                  onChange={(e) => {
                                                    const currentUtilities = Array.isArray(
                                                      editedCenter.assessment?.utilities,
                                                    )
                                                      ? editedCenter.assessment.utilities
                                                      : []
                                                    const existingIndex = currentUtilities.findIndex(
                                                      (item) => item.type === type,
                                                    )
                                                    let updatedUtilities

                                                    if (existingIndex >= 0) {
                                                      updatedUtilities = [...currentUtilities]
                                                      updatedUtilities[existingIndex] = {
                                                        ...updatedUtilities[existingIndex],
                                                        [field]: e.target.value,
                                                      }
                                                    } else {
                                                      updatedUtilities = [
                                                        ...currentUtilities,
                                                        { type, [field]: e.target.value },
                                                      ]
                                                    }

                                                    handleNestedInputChange("assessment", "utilities", updatedUtilities)
                                                  }}
                                                  min={field === "number" ? "0" : undefined}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Total Floor Area */}
                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="totalFloorArea" className="w-[300px] text-left leading-[1.3]">
                                        Total Floor Area (m²)
                                      </Label>
                                      <Input
                                        type="number"
                                        id="totalFloorArea"
                                        value={editedCenter.assessment?.totalFloorArea || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("assessment", "totalFloorArea", e.target.value)
                                        }
                                        min="0"
                                      />
                                    </div>
                                  </form>
                                </TabsContent>

                                <TabsContent value="legal">
                                  <form className="space-y-6">
                                    {/* Legal Registration */}
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="legalRegistration" className="text-left leading-[1.3]">
                                          Legal Registration/Licensing Information
                                        </Label>
                                        <Textarea
                                          id="legalRegistration"
                                          name="legalRegistration"
                                          value={editedCenter.legalInfo?.legalRegistration || ""}
                                          onChange={(e) =>
                                            handleNestedInputChange("legalInfo", "legalRegistration", e.target.value)
                                          }
                                          placeholder="Enter legal registration details"
                                          className="min-h-[100px] mt-2"
                                        />
                                      </div>

                                      {/* Supporting Documents */}
                                      <div>
                                        <Label htmlFor="supportingDocuments">Supporting Documents</Label>
                                        <div className="mt-2 space-y-2">
                                          <UploadButton
                                            fileUrl={editedCenter.legalInfo?.supportingDocuments?.[0] || ""}
                                            handleFileChange={(url) => {
                                              handleNestedInputChange("legalInfo", "supportingDocuments", [url])
                                            }}
                                            removeFile={() => {
                                              handleNestedInputChange("legalInfo", "supportingDocuments", [])
                                            }}
                                            accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt"
                                          />
                                          {editedCenter.legalInfo?.supportingDocuments?.[0] && (
                                            // <Button
                                            //   type="button"
                                            //   variant="outline"
                                            //   size="sm"
                                            //   onClick={() =>
                                            //     window.open(editedCenter.legalInfo.supportingDocuments[0], "_blank")
                                            //   }
                                            //   className="flex items-center gap-2"
                                            // >
                                            //   <Eye className="h-4 w-4" />
                                            //   Preview Document
                                            // </Button>

                                              <FilePreview fileUrl={editedCenter.legalInfo?.supportingDocuments?.[0]} />
                                             
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Trade Areas Section */}
                                    <div className="space-y-4">
                                      <h2 className="text-left font-[600] text-[20px] mt-4">Trade Area Profile:</h2>
                                      <div className="overflow-x-auto">
                                        <table className="w-full border-collapse border border-gray-300">
                                          <thead>
                                            <tr className="bg-gray-100">
                                              <th className="border border-gray-300 p-2">S/NO.</th>
                                              <th className="border border-gray-300 p-2">Sector</th>
                                              <th className="border border-gray-300 p-2">Trade Area</th>
                                              <th className="border border-gray-300 p-2">Instructors</th>
                                              <th className="border border-gray-300 p-2">Trainees</th>
                                              <th className="border border-gray-300 p-2">Facilities</th>
                                              <th className="border border-gray-300 p-2">Equipment</th>
                                              <th className="border border-gray-300 p-2">Tools</th>
                                              <th className="border border-gray-300 p-2"></th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(editedCenter.legalInfo?.tradeAreas || []).map((trade, index) => (
                                              <tr key={index}>
                                                <td className="border border-gray-300 p-2">{index + 1}</td>
                                                <td className="border border-gray-300 p-2">
                                                  <Select
                                                    value={trade.sector?.[0]?._id || "default"}
                                                    onValueChange={(value) => {
                                                      if (value !== "default") {
                                                        const updatedTradeAreas = [
                                                          ...(editedCenter.legalInfo?.tradeAreas || []),
                                                        ]
                                                        const selectedSector = sectors.find((s) => s._id === value)
                                                        updatedTradeAreas[index] = {
                                                          ...updatedTradeAreas[index],
                                                          sector: [selectedSector],
                                                          tradeArea: [],
                                                        }
                                                        handleNestedInputChange(
                                                          "legalInfo",
                                                          "tradeAreas",
                                                          updatedTradeAreas,
                                                        )
                                                      }
                                                    }}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue>
                                                        {trade.sector?.[0]?.name || "Select Sector"}
                                                      </SelectValue>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectItem value="default" disabled>Select...</SelectItem>
                                                        {sectors.map((sector) => (
                                                          <SelectItem key={sector._id} value={sector._id || "_empty_"}>
                                                            {sector.name}
                                                          </SelectItem>
                                                        ))}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>

                                                  {/* Selected trade areas display */}
                                                  <div className="flex flex-wrap gap-1 mt-2">
                                                    {Array.isArray(trade?.tradeArea) &&
                                                      trade.tradeArea.map((ta_id) => {
                                                        const tradeAreaInfo = trade.sector?.[0]?.tradeAreas?.find(
                                                          (ta) => ta._id === ta_id,
                                                        )
                                                        return (
                                                          tradeAreaInfo && (
                                                            <div
                                                              key={ta_id}
                                                              className="bg-blue-50 border border-blue-200 rounded px-2 py-1 text-xs text-blue-600 flex items-center gap-1"
                                                            >
                                                              {tradeAreaInfo.name}
                                                              <button
                                                                type="button"
                                                                onClick={() => {
                                                                  const updatedTradeAreas = [
                                                                    ...(editedCenter.legalInfo?.tradeAreas || []),
                                                                  ]
                                                                  updatedTradeAreas[index] = {
                                                                    ...updatedTradeAreas[index],
                                                                    tradeArea: trade.tradeArea.filter(
                                                                      (id) => id !== ta_id,
                                                                    ),
                                                                  }
                                                                  handleNestedInputChange(
                                                                    "legalInfo",
                                                                    "tradeAreas",
                                                                    updatedTradeAreas,
                                                                  )
                                                                }}
                                                                className="hover:text-red-600 font-bold"
                                                              >
                                                                ×
                                                              </button>
                                                            </div>
                                                          )
                                                        )
                                                      })}
                                                  </div>
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Select
                                                    value="default"
                                                    onValueChange={(value) => {
                                                      if (value !== "default") {
                                                        const updatedTradeAreas = [
                                                          ...(editedCenter.legalInfo?.tradeAreas || []),
                                                        ]
                                                        updatedTradeAreas[index] = {
                                                          ...updatedTradeAreas[index],
                                                          tradeArea: [...(trade.tradeArea || []), value],
                                                        }
                                                        handleNestedInputChange(
                                                          "legalInfo",
                                                          "tradeAreas",
                                                          updatedTradeAreas,
                                                        )
                                                      }
                                                    }}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue placeholder="Add trade area" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectItem value="default" disabled>Select...</SelectItem>
                                                        {trade.sector?.[0]?.tradeAreas
                                                          ?.filter((ta) => !trade.tradeArea?.includes(ta._id))
                                                          .map((ta) => (
                                                            <SelectItem key={ta._id} value={ta._id || "_empty_"}>
                                                              {ta.name}
                                                            </SelectItem>
                                                          ))}
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </td>
                                                {/* Rest of the trade area fields */}
                                                <td className="border border-gray-300 p-2">
                                                  <Input
                                                    type="number"
                                                    value={trade.instructors || ""}
                                                    onChange={(e) => {
                                                      const updatedTradeAreas = [
                                                        ...(editedCenter.legalInfo?.tradeAreas || []),
                                                      ]
                                                      updatedTradeAreas[index] = {
                                                        ...updatedTradeAreas[index],
                                                        instructors: e.target.value,
                                                      }
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                    placeholder="Number"
                                                  />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Input
                                                    type="number"
                                                    value={trade.trainees || ""}
                                                    onChange={(e) => {
                                                      const updatedTradeAreas = [
                                                        ...(editedCenter.legalInfo?.tradeAreas || []),
                                                      ]
                                                      updatedTradeAreas[index] = {
                                                        ...updatedTradeAreas[index],
                                                        trainees: e.target.value,
                                                      }
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                    placeholder="Number"
                                                  />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Input
                                                    value={trade.facilities || ""}
                                                    onChange={(e) => {
                                                      const updatedTradeAreas = [
                                                        ...(editedCenter.legalInfo?.tradeAreas || []),
                                                      ]
                                                      updatedTradeAreas[index] = {
                                                        ...updatedTradeAreas[index],
                                                        facilities: e.target.value,
                                                      }
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                    placeholder="List facilities"
                                                  />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Input
                                                    value={trade.equipment || ""}
                                                    onChange={(e) => {
                                                      const updatedTradeAreas = [
                                                        ...(editedCenter.legalInfo?.tradeAreas || []),
                                                      ]
                                                      updatedTradeAreas[index] = {
                                                        ...updatedTradeAreas[index],
                                                        equipment: e.target.value,
                                                      }
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                    placeholder="List equipment"
                                                  />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Input
                                                    value={trade.tools || ""}
                                                    onChange={(e) => {
                                                      const updatedTradeAreas = [
                                                        ...(editedCenter.legalInfo?.tradeAreas || []),
                                                      ]
                                                      updatedTradeAreas[index] = {
                                                        ...updatedTradeAreas[index],
                                                        tools: e.target.value,
                                                      }
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                    placeholder="List tools"
                                                  />
                                                </td>
                                                <td className="border border-gray-300 p-2">
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                      const updatedTradeAreas = (
                                                        editedCenter.legalInfo?.tradeAreas || []
                                                      ).filter((_, i) => i !== index)
                                                      handleNestedInputChange(
                                                        "legalInfo",
                                                        "tradeAreas",
                                                        updatedTradeAreas,
                                                      )
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          const newTradeArea = {
                                            sector: [],
                                            tradeArea: [],
                                            instructors: "",
                                            trainees: "",
                                            facilities: "",
                                            equipment: "",
                                            tools: "",
                                          }
                                          handleNestedInputChange("legalInfo", "tradeAreas", [
                                            ...(editedCenter.legalInfo?.tradeAreas || []),
                                            newTradeArea,
                                          ])
                                        }}
                                        className="flex items-center gap-2"
                                      >
                                        <Plus className="h-4 w-4" /> Add Trade Area
                                      </Button>
                                    </div>

                                    {/* Instructor Credentials */}
                                    <div className="space-y-2">
                                      <Label htmlFor="instructorCredentials">Instructor Credentials</Label>
                                      <div className="mt-2 space-y-2">
                                        <UploadButton
                                          fileUrl={editedCenter.legalInfo?.instructorCredentials?.[0] || ""}
                                          handleFileChange={(url) => {
                                            handleNestedInputChange("legalInfo", "instructorCredentials", [url])
                                          }}
                                          removeFile={() => {
                                            handleNestedInputChange("legalInfo", "instructorCredentials", [])
                                          }}
                                          accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"
                                        />
                                        {editedCenter.legalInfo?.instructorCredentials?.[0] && (
                                          // <Button
                                          //   type="button"
                                          //   variant="outline"
                                          //   size="sm"
                                          //   onClick={() =>
                                          //     window.open(editedCenter.legalInfo.instructorCredentials[0], "_blank")
                                          //   }
                                          //   className="flex items-center gap-2"
                                          // >
                                          //   <Eye className="h-4 w-4" />
                                          //   Preview Document
                                          // </Button>
                                          <FilePreview fileUrl={editedCenter.legalInfo?.instructorCredentials?.[0]} />
                                        )}
                                      </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="space-y-2">
                                      <Label htmlFor="additionalDetails">Additional Details</Label>
                                      <Textarea
                                        id="additionalDetails"
                                        value={editedCenter.legalInfo?.additionalDetails || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("legalInfo", "additionalDetails", e.target.value)
                                        }
                                        placeholder="Enter any additional details"
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                  </form>
                                </TabsContent>

                                <TabsContent value="bank">
                                  <form className="space-y-6">
                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="accountName" className="w-[300px] text-left leading-[1.3]">
                                        Account Name *
                                      </Label>
                                      <Input
                                        id="accountName"
                                        name="accountName"
                                        value={editedCenter.bankAccount?.accountName || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("bankAccount", "accountName", e.target.value)
                                        }
                                        placeholder="Enter account name"
                                      />
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="accountNumber" className="w-[300px] text-left leading-[1.3]">
                                        Account Number *
                                      </Label>
                                      <Input
                                        id="accountNumber"
                                        type="text"
                                        name="accountNumber"
                                        value={editedCenter.bankAccount?.accountNumber || ""}
                                        onChange={(e) =>
                                          handleNestedInputChange("bankAccount", "accountNumber", e.target.value)
                                        }
                                        placeholder="Enter 10-digit account number"
                                      />
                                    </div>

                                    <div className="flex items-center gap-4">
                                      <Label htmlFor="bank" className="w-[300px] text-left leading-[1.3]">
                                        Bank Name *
                                      </Label>
                                      <Input
                                        id="bank"
                                        name="bank"
                                        value={editedCenter.bankAccount?.bank || ""}
                                        onChange={(e) => handleNestedInputChange("bankAccount", "bank", e.target.value)}
                                        placeholder="Enter bank name"
                                      />
                                    </div>
                                  </form>
                                </TabsContent>

                                <TabsContent value="assessmentRecords">
                                  <div className="space-y-6">
                                    {editMode ? (
                                      // Edit Mode
                                      <div>
                                        <div className="flex justify-between items-center mb-4">
                                          <h3 className="text-lg font-semibold">Assessment Records</h3>
                                          <Button
                                            onClick={() => {
                                              const newAssessment = {
                                                year: new Date().getFullYear(),
                                                status: "pending",
                                                date: new Date().toISOString(),
                                                notes: "",
                                                assessorName: ""
                                              }
                                              setEditedCenter(prev => ({
                                                ...prev,
                                                assessmentRecords: [...(prev.assessmentRecords || []), newAssessment]
                                              }))
                                            }}
                                          >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Assessment
                                          </Button>
                                        </div>

                                        <div className="space-y-4">
                                          {editedCenter.assessmentRecords?.map((record, index) => (
                                            <Card key={record._id || index} className="p-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                  <Label>Year</Label>
                                                  <Input
                                                    type="number"
                                                    value={record.year}
                                                    onChange={(e) => {
                                                      const updatedRecords = [...editedCenter.assessmentRecords]
                                                      updatedRecords[index] = {
                                                        ...record,
                                                        year: parseInt(e.target.value)
                                                      }
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label>Status</Label>
                                                  <Select
                                                    value={record.status || "default"}
                                                    onValueChange={(value) => {
                                                      if (value !== "default") {
                                                        const updatedRecords = [...editedCenter.assessmentRecords]
                                                        updatedRecords[index] = {
                                                          ...record,
                                                          status: value
                                                        }
                                                        handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                      }
                                                    }}
                                                  >
                                                    <SelectTrigger>
                                                      <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                      <SelectGroup>
                                                        <SelectItem value="default" disabled>Select...</SelectItem>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="approved">Approved</SelectItem>
                                                        <SelectItem value="denied">Denied</SelectItem>
                                                      </SelectGroup>
                                                    </SelectContent>
                                                  </Select>
                                                </div>

                                                <div className="space-y-2">
                                                  <Label>Assessor Name</Label>
                                                  <Input
                                                    value={record.assessorName || ""}
                                                    onChange={(e) => {
                                                      const updatedRecords = [...editedCenter.assessmentRecords]
                                                      updatedRecords[index] = {
                                                        ...record,
                                                        assessorName: e.target.value
                                                      }
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label>Assessment Date</Label>
                                                  <Input
                                                    type="date"
                                                    value={formatDateForInput(record.date)}
                                                    onChange={(e) => {
                                                      const updatedRecords = [...editedCenter.assessmentRecords]
                                                      updatedRecords[index] = {
                                                        ...record,
                                                        date: new Date(e.target.value).toISOString()
                                                      }
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2 col-span-2">
                                                  <Label>Notes</Label>
                                                  <Textarea
                                                    value={record.notes || ""}
                                                    onChange={(e) => {
                                                      const updatedRecords = [...editedCenter.assessmentRecords]
                                                      updatedRecords[index] = {
                                                        ...record,
                                                        notes: e.target.value
                                                      }
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  />
                                                </div>

                                                <div className="space-y-2">
                                                  <Label>Expiration Date</Label>
                                                  <Input
                                                    type="date"
                                                    value={formatDateForInput(record.expirationDate)}
                                                    onChange={(e) => {
                                                      const updatedRecords = [...editedCenter.assessmentRecords]
                                                      updatedRecords[index] = {
                                                        ...record,
                                                        expirationDate: new Date(e.target.value).toISOString()
                                                      }
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  />
                                                </div>

                                                <div className="col-span-2 flex justify-end">
                                                  <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                      const updatedRecords = editedCenter.assessmentRecords.filter((_, i) => i !== index)
                                                      handleNestedInputChange("assessmentRecords", null, updatedRecords)
                                                    }}
                                                  >
                                                    <Trash2 className="h-4 w-4" />
                                                    Remove
                                                  </Button>
                                                </div>
                                              </div>
                                            </Card>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      // View Mode
                                      <div>
                                        <h3 className="text-lg font-semibold mb-4">Assessment Records</h3>
                                        <div className="space-y-4">
                                          {selectedCenter?.assessmentRecords?.map((record) => (
                                            <Card key={record._id || Math.random()} className="p-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <Label className="font-medium">Year</Label>
                                                  <p>{record.year}</p>
                                                </div>
                                                
                                                <div>
                                                  <Label className="font-medium">Status</Label>
                                                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${ASSESSMENT_STATUS[record.status].color}`}>
                                                    {ASSESSMENT_STATUS[record.status].label}
                                                  </span>
                                                </div>

                                                <div>
                                                  <Label className="font-medium">Assessor</Label>
                                                  <p>{record.assessorName || "Not specified"}</p>
                                                </div>

                                                <div>
                                                  <Label className="font-medium">Assessment Date</Label>
                                                  <p>{new Date(record.date).toLocaleDateString()}</p>
                                                </div>

                                                <div className="col-span-2">
                                                  <Label className="font-medium">Notes</Label>
                                                  <p className="whitespace-pre-wrap">{record.notes || "No notes provided"}</p>
                                                </div>

                                                {record.expirationDate && (
                                                  <div>
                                                    <Label className="font-medium">Expiration Date</Label>
                                                    <p>{new Date(record.expirationDate).toLocaleDateString()}</p>
                                                  </div>
                                                )}
                                              </div>
                                            </Card>
                                          ))}
                                          {!selectedCenter?.assessmentRecords?.length && (
                                            <p className="text-gray-500 text-center">No assessment records found</p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          )}

                          <SheetFooter className="pt-4">
                            {!editMode ? (
                              <div className="flex justify-between w-full">
                                <Button variant="outline" onClick={() => handleEditCenter(selectedCenter)}>
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <SheetClose asChild>
                                  <Button variant="secondary">Close</Button>
                                </SheetClose>
                              </div>
                            ) : (
                              <div className="flex justify-between w-full">
                                <Button variant="destructive" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 mr-1" /> Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} disabled={loading}>
                                  <Save className="h-4 w-4 mr-1" /> Save Changes
                                  {loading && <SewingPinFilledIcon className="animate-spin ml-1" />}
                                </Button>
                              </div>
                            )}
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>

                      <Button variant="outline" size="sm" onClick={() => handleEditCenter(center)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </div>
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
                    <PaginationLink isActive={pageNumber === currentPage} onClick={() => handlePageChange(pageNumber)}>
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

export default TrainingCenterManagement

