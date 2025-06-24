
import { useEffect, useState } from "react"
import axios from "axios"
import ProtectedRoute from "@/components/ProtectedRoute"
import Spinner from "@/components/layout/spinner"
import { states } from "@/data/nigeria"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CSVLink } from "react-csv"
import jsPDF from "jspdf"
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
import { LogOut, Mail, PhoneCall, UserCircle, Edit, Eye, Save, X, Download, FileText, Trash2, Plus } from "lucide-react"
import { API_BASE_URL } from "@/config/env"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import UploadButton from "@/components/UploadButton"
import { FilePreview } from "@/components/FilePreview";

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

// Add this banks array after the useDebounce function at the top of the file
const banks = [
  { id: 1, name: "Access Bank" },
  { id: 2, name: "First Bank of Nigeria" },
  { id: 3, name: "Guaranty Trust Bank (GTBank)" },
  { id: 4, name: "United Bank for Africa (UBA)" },
  { id: 5, name: "Zenith Bank" },
  { id: 6, name: "Ecobank Nigeria" },
  { id: 7, name: "Stanbic IBTC Bank" },
  { id: 8, name: "Fidelity Bank" },
  { id: 9, name: "Polaris Bank" },
  { id: 10, name: "Wema Bank" },
  { id: 11, name: "Union Bank" },
  { id: 12, name: "Citibank Nigeria" },
  { id: 13, name: "Heritage Bank" },
  { id: 14, name: "Keystone Bank" },
  { id: 15, name: "Providus Bank" },
  { id: 16, name: "Standard Chartered Bank" },
  { id: 17, name: "Jaiz Bank" },
  { id: 18, name: "Paga" }, // Fintech
  { id: 19, name: "Paystack" }, // Fintech
  { id: 20, name: "Flutterwave" }, // Fintech
  { id: 21, name: "Kuda Bank" }, // Fintech
  { id: 22, name: "Opay" }, // Fintech
  { id: 23, name: "Carbon" }, // Fintech
  { id: 24, name: "TeamApt" }, // Fintech
  { id: 25, name: "Interswitch" }, // Fintech
  { id: 26, name: "Others" },
]

const UserManagement = () => {
  // Component state management
  const [userRole, setUserRole] = useState("");
  const [isMounted, setIsMounted] = useState(false)
  const [hasLoadedFirst, sethasLoadedFirst] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editedUser, setEditedUser] = useState(null)
  const [loadingCSV, setLoadingCSV] = useState(false)
  const [csvData, setcsvData] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  

  // Add these state variables inside the UserManagement component, after the other state declarations
  const [selectedBank, setSelectedBank] = useState("")
  const [customBank, setCustomBank] = useState("")

  const logout = useLogout()
  const navigate = useNavigate()
  const MAX_CSV_ROWS = 1000000

  // Filter states
  const [sectors, setSectors] = useState([])
  const [tradeAreas, setTradeAreas] = useState([])
  const [loadingSectors, setLoadingSectors] = useState(false)

  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalUsers: 0,
    pageSize: 25,
  })
  const totalPages = pagination.totalPages
  const itemsPerPage = 25

  const defaultData = {
    currentPage: 1,
    search: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    senatorialDistrict: "",
    stateOfOrigin: "",
    lgaOfOrigin: "",
    sector: "",
    tradeArea: "",
    role: "",
    fromDate: "",
    toDate: "",
    sort: "-createdAt",
  }
  const [filter, setFilter] = useState({
    ...defaultData,
  })

  useEffect(() => {
  // Adjust the key if your user object is stored differently
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.role) setUserRole(user.role);
}, []);

  // Set mounted state on component mount/unmount
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  // Fix the handleFilterChange function to use correct field names
  const handleFilterChange = (key, value) => {
    // If the value is "all", set it to an empty string in the filter
    const filterValue = value === "all" ? "" : value
    setFilter((x) => ({ ...x, [key]: filterValue }))

    // If changing stateOfResidence, reset LGA and senatorial district
    if (key === "stateOfResidence") {
      setFilter((x) => ({ ...x, lgaOfResidence: "", senatorialDistrict: "" }))
    }

    // If changing stateOfOrigin, reset lgaOfOrigin
    if (key === "stateOfOrigin") {
      setFilter((x) => ({ ...x, lgaOfOrigin: "" }))
    }

    // If changing sector, reset trade area
    if (key === "sector") {
      setFilter((x) => ({ ...x, tradeArea: "" }))
    }
  }

  const currentPage = filter?.currentPage

  // Add pagination state handler
  const handlePageChange = (page) => {
    setFilter((x) => ({ ...x, currentPage: page }))
  }

  function replaceSymbolsWithSpace(str = "") {
    const replacedStr = str.replace(/[-/]/g, " ")
    return replacedStr.toLowerCase()
  }

  const selectedStateLGASResidence =
    states.find(
      (state) => replaceSymbolsWithSpace(`${state?.value}`) === replaceSymbolsWithSpace(`${filter?.stateOfResidence}`),
    )?.lgas || []

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

  function formatUserToCSV(users) {
    if (!Array.isArray(users) || users.length === 0) {
      return []
    }

    const headerMapping = {
      sn: "S/N",
      fullName: "Full Name",
      gender: "Gender",
      email: "Email",
      phoneNumber: "Phone Number",
      role: "Role",
      verificationStatus: "Verification Status",
      stateOfResidence: "State of Residence",
      lgaOfResidence: "LGA of Residence",
      street: "Address",
      senatorialDistrict: "Senatorial District",
      disability: "Disability",
      sectors: "Sectors",
      tradeAreas: "Trade Areas",
      createdAt: "Registration Date",
    }

    const headers = Object.keys(users[0]).map((key) => headerMapping[key] || key)
    const rows = users.map((user) => Object.keys(user).map((key) => user[key]))

    // const rows = users.map((user) => ({
    //   ...user,
    //   verificationStatus: user.currentVerificationStatus || "pending",

    return [headers, ...rows]
  }

  const downloadCSV = async () => {
    setLoadingCSV(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      // Prepare filter parameters
      const params = {
        limit: MAX_CSV_ROWS,
        page: 1,
      }

      // Add search parameter if it exists
      if (filter?.search) params.search = filter.search

      // Add other filter parameters if they exist and are not empty
      if (filter?.stateOfResidence) params.stateOfResidence = filter.stateOfResidence
      if (filter?.lgaOfResidence) params.lgaOfResidence = filter.lgaOfResidence
      if (filter?.senatorialDistrict) params.senatorialDistrict = filter.senatorialDistrict
      if (filter?.stateOfOrigin) params.stateOfOrigin = filter.stateOfOrigin
      if (filter?.lgaOfOrigin) params.lga = filter.lgaOfOrigin // Note: The backend expects 'lga' for lgaOfOrigin
      if (filter?.sector) params.sector = filter.sector
      if (filter?.tradeArea) params.tradeArea = filter.tradeArea
      if (filter?.role) params.role = filter.role
      if (filter?.fromDate) params.fromDate = filter.fromDate
      if (filter?.toDate) params.toDate = filter.toDate
      if (filter?.sort) params.sort = filter.sort

      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data
      const formatted = formatUserToCSV(
        (data?.users || []).map((x, i) => {
          // Extract sector and trade area information
          const sectors = x.priorSkillsCerts
            ? x.priorSkillsCerts
                .map((cert) => cert.sector)
                .filter(Boolean)
                .join(", ")
            : ""
          const tradeAreas = x.priorSkillsCerts
            ? x.priorSkillsCerts
                .map((cert) => cert.tradeArea)
                .filter(Boolean)
                .join(", ")
            : ""

          return {
            sn: i + 1,
            fullName: `${x?.firstName || ""} ${x?.lastName || ""}`,
            gender: x?.gender || "",
            email: x?.email || "",
            phoneNumber: x?.phoneNumber || "",
            role: x?.role || "",
            verificationStatus: x?.currentVerificationStatus || "pending",
            stateOfResidence: x?.stateOfResidence || "",
            lgaOfResidence: x?.lgaOfResidence || "",
            street: x?.street || "",
            senatorialDistrict: x?.senatorialDistrict || "",
            disability: `${x?.disabilityType ? ` ${x?.disabilityType}` : "none"}`,
            sectors: sectors,
            tradeAreas: tradeAreas,
            createdAt: x?.createdAt ? new Date(x.createdAt).toLocaleDateString() : "",
          }
        }),
      )
      setcsvData(formatted)

      toast.success(
        "CSV data has been generated with the filter options applied. Kindly click the 'Download CSV' button to download!",
      )
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to generate CSV data")
    } finally {
      setLoadingCSV(false)
    }
  }

  const downloadPDF = async () => {
    setLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      // Prepare filter parameters
      const params = {
        limit: 1000000, // Limit for PDF to avoid large files
        page: 1,
      }

      // Add search parameter if it exists
      if (filter?.search) params.search = filter.search

      // Add other filter parameters if they exist and are not empty
      if (filter?.stateOfResidence) params.stateOfResidence = filter.stateOfResidence
      if (filter?.lgaOfResidence) params.lgaOfResidence = filter.lgaOfResidence
      if (filter?.senatorialDistrict) params.senatorialDistrict = filter.senatorialDistrict
      if (filter?.stateOfOrigin) params.stateOfOrigin = filter.stateOfOrigin
      if (filter?.lgaOfOrigin) params.lga = filter.lgaOfOrigin // Note: The backend expects 'lga' for lgaOfOrigin
      if (filter?.sector) params.sector = filter.sector
      if (filter?.tradeArea) params.tradeArea = filter.tradeArea
      if (filter?.role) params.role = filter.role
      if (filter?.fromDate) params.fromDate = filter.fromDate
      if (filter?.toDate) params.toDate = filter.toDate
      if (filter?.sort) params.sort = filter.sort

      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { data } = response.data
      const users = data?.users || []

      // Create PDF document
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text("User Management Report", 14, 22)
      doc.setFontSize(11)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

      // Define table columns
      const columns = [
        { header: "S/N", dataKey: "sn" },
        { header: "Name", dataKey: "name" },
        { header: "Gender", dataKey: "gender"},
        { header: "Email", dataKey: "email" },
        { header: "Phone", dataKey: "phone" },
        { header: "Role", dataKey: "role" },
        { header: "Verification Status", dataKey: "verificationStatus" },
        { header: "State", dataKey: "state" },
        { header: "LGA", dataKey: "lga" },
        { header: "Address", dataKey: "adress" },
        { header: "Disability", dataKey: "disability" },
      ]

      // Prepare data for table
      const tableData = users.map((user, index) => ({
        sn: index + 1,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        gender: user.gender || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        role: user.role || "",
        verificationStatus: user.currentVerificationStatus || "pending",
        state: user.stateOfResidence || "",
        lga: user.lgaOfResidence || "",
        adress: user.street || "",
        disability:`${user.hasDisability || ""}${user.disabilityType ? ` ${user.disabilityType}` : ""}`,
      }))

      // Add table to PDF
      doc.autoTable({
        columns,
        body: tableData,
        startY: 40,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [66, 66, 66] },
      })

      // Add filter information
      const filterInfo = []
      if (filter.search) filterInfo.push(`Search: ${filter.search}`)
      if (filter.stateOfResidence) filterInfo.push(`State: ${filter.stateOfResidence}`)
      if (filter.lgaOfResidence) filterInfo.push(`LGA: ${filter.lgaOfResidence}`)
      if (filter.senatorialDistrict) filterInfo.push(`Senatorial District: ${filter.senatorialDistrict}`)
      if (filter.role) filterInfo.push(`Role: ${filter.role}`)
      if (filter.verificationStatus) filterInfo.push(`Verification Status: ${filter.verificationStatus}`)
      if (filter.sector) filterInfo.push(`Sector: ${filter.sector}`)
      if (filter.tradeArea) filterInfo.push(`Trade Area: ${filter.tradeArea}`)
      if (filter.fromDate) filterInfo.push(`From: ${filter.fromDate}`)
      if (filter.toDate) filterInfo.push(`To: ${filter.toDate}`)

      if (filterInfo.length > 0) {
        const finalY = doc.lastAutoTable.finalY || 40
        doc.setFontSize(10)
        doc.text("Filters Applied:", 14, finalY + 10)
        doc.setFontSize(8)
        filterInfo.forEach((info, index) => {
          doc.text(info, 14, finalY + 15 + index * 5)
        })
      }

      // Save the PDF
      doc.save("user-management-report.pdf")
      toast.success("PDF report has been generated and downloaded")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate PDF report")
    } finally {
      setLoading(false)
    }
  }

  const clearFilter = () => {
    setFilter(defaultData)
    setValue("")
    setcsvData([])
  }

  // Improved handleEditUser function
  const handleEditUser = (user) => {
    // Create a deep copy of the user to avoid reference issues
    const userCopy = JSON.parse(JSON.stringify(user))
    setSelectedUser(userCopy)
    // setEditedUser(userCopy)
    setEditedUser({
      ...user,
      role: user?.role || '',
      certifiedStatus: user?.certifiedStatus || false,
      licenseStatus: user?.licenseStatus || false,
      currentVerificationStatus: user?.currentVerificationStatus || 'pending'
    });
    setEditMode(true)
    setIsEditing(true)
  }

  // Improved handleSaveChanges function
  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")

      // Make a copy of the current editedUser to avoid race conditions
      const userToUpdate = { ...editedUser }

      // Perform the API call to update the user
      const response = await axios.patch(`${API_BASE_URL}/users/${userToUpdate._id}`, userToUpdate, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      // Check if the update was successful
      if (response.data && response.data.success) {
        toast.success("User updated successfully")

        // Update the local users array with the updated user data
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === userToUpdate._id ? { ...user, ...response.data.data } : user)),
        )

        // Update the selectedUser with the new data
        setSelectedUser(response.data.data)

        // Reset edit mode but keep the updated data visible
        setEditMode(false)
        setIsEditing(false)
        setEditedUser(null)
      } else {
        toast.error("Failed to update user: " + (response.data?.message || "Unknown error"))
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user: " + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Separate function to fetch updated users
  const fetchUpdatedUsers = async (accessToken) => {
    try {
      // Prepare filter parameters
      const params = {
        limit: itemsPerPage,
        page: filter?.currentPage,
      }

      // Add search parameter if it exists
      if (filter?.search) params.search = filter.search

      // Add other filter parameters if they exist and are not empty
      if (filter?.stateOfResidence) params.stateOfResidence = filter.stateOfResidence
      if (filter?.lgaOfResidence) params.lgaOfResidence = filter.lgaOfResidence
      if (filter?.senatorialDistrict) params.senatorialDistrict = filter.senatorialDistrict
      if (filter?.stateOfOrigin) params.stateOfOrigin = filter.stateOfOrigin
      if (filter?.lgaOfOrigin) params.lga = filter.lgaOfOrigin // Note: The backend expects 'lga' for lgaOfOrigin
      if (filter?.sector) params.sector = filter.sector
      if (filter?.tradeArea) params.tradeArea = filter.tradeArea
      if (filter?.role) params.role = filter.role
      if (filter?.fromDate) params.fromDate = filter.fromDate
      if (filter?.toDate) params.toDate = filter.toDate
      if (filter?.sort) params.sort = filter.sort

      const response = await axios.get(`${API_BASE_URL}/userscert`, {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.data && response.data.success && response.data.data) {
        const { users, pagination } = response.data.data
        setUsers(users || [])
        setPagination({
          currentPage: pagination?.currentPage || 1,
          totalPages: pagination?.totalPages || 1,
          totalUsers: pagination?.totalUsers || 0,
          pageSize: pagination?.pageSize || 25,
        })
      }
    } catch (error) {
      console.error("Error fetching updated users:", error)
    }
  }

  // Improved handleCancelEdit function
  const handleCancelEdit = () => {
    setEditMode(false)
    // Don't clear selectedUser so we can still view the data
    setEditedUser(null)
    setIsEditing(false)
  }

  // Enhance the handleInputChange function to better handle arrays and nested objects
  // const handleInputChange = (field, value, index = null, subfield = null) => {
  //   if (!editedUser) return

  //   setEditedUser((prev) => {
  //     if (!prev) return null

  //     // Handle array fields with index
  //     if (index !== null) {
  //       const arrayField = prev[field] || []
  //       const updatedArray = [...arrayField]

  //       if (subfield) {
  //         // Special handling for tradeArea which is an array
  //         if (subfield === "tradeArea") {
  //           // If value is an array, use it directly, otherwise create a new array with the value
  //           const tradeAreaValue = Array.isArray(value) ? value : [value]
  //           updatedArray[index] = {
  //             ...updatedArray[index],
  //             [subfield]: tradeAreaValue,
  //           }
  //         } else {
  //           // Handle other nested object fields
  //           updatedArray[index] = {
  //             ...updatedArray[index],
  //             [subfield]: value,
  //           }
  //         }
  //       } else {
  //         // Replace entire array item
  //         updatedArray[index] = value
  //       }

  //       return {
  //         ...prev,
  //         [field]: updatedArray,
  //       }
  //     }
  //     // Handle nested fields like "bankAccount.accountName"
  //     else if (typeof field === "string" && field.includes(".")) {
  //       const [parent, child] = field.split(".")
  //       return {
  //         ...prev,
  //         [parent]: {
  //           ...(prev[parent] || {}),
  //           [child]: value,
  //         },
  //       }
  //     } else {
  //       // Handle regular fields
  //       return {
  //         ...prev,
  //         [field]: value,
  //       }
  //     }
  //   })
  // }

  // Add this to your handleInputChange function
const handleInputChange = (field, value, index = null) => {
  if (!editedUser) return;

  setEditedUser(prev => {
    const newData = { ...prev };
    
    if (index !== null) {
      // Handle array updates
      if (!Array.isArray(newData[field])) {
        newData[field] = [];
      }
      newData[field][index] = value;
    } else if (field.includes('.')) {
      // Handle nested object updates
      const [parent, child] = field.split('.');
      if (!newData[parent]) newData[parent] = {};
      newData[parent][child] = value;
    } else {
      // Handle direct field updates
      newData[field] = value;
    }
    
    return newData;
  });
};

  // Add a function to add a trade area to the tradeArea array
  const addTradeAreaToSkill = (skillIndex, tradeAreaValue) => {
    if (!editedUser || !editedUser.priorSkillsCerts) return

    setEditedUser((prev) => {
      if (!prev) return null

      const updatedSkills = [...(prev.priorSkillsCerts || [])]
      const currentSkill = updatedSkills[skillIndex]

      if (!currentSkill) return prev

      // Initialize tradeArea as array if it doesn't exist or isn't an array
      const currentTradeAreas = Array.isArray(currentSkill.tradeArea) ? [...currentSkill.tradeArea] : []

      // Only add if it doesn't already exist
      if (!currentTradeAreas.includes(tradeAreaValue)) {
        currentTradeAreas.push(tradeAreaValue)
      }

      updatedSkills[skillIndex] = {
        ...currentSkill,
        tradeArea: currentTradeAreas,
      }

      return {
        ...prev,
        priorSkillsCerts: updatedSkills,
      }
    })
  }

  // Add a function to remove a trade area from the tradeArea array
  const removeTradeAreaFromSkill = (skillIndex, tradeAreaValue) => {
    if (!editedUser || !editedUser.priorSkillsCerts) return

    setEditedUser((prev) => {
      if (!prev) return null

      const updatedSkills = [...(prev.priorSkillsCerts || [])]
      const currentSkill = updatedSkills[skillIndex]

      if (!currentSkill || !Array.isArray(currentSkill.tradeArea)) return prev

      updatedSkills[skillIndex] = {
        ...currentSkill,
        tradeArea: currentSkill.tradeArea.filter((ta) => ta !== tradeAreaValue),
      }

      return {
        ...prev,
        priorSkillsCerts: updatedSkills,
      }
    })
  }

  // Add these helper functions for array manipulation
  const addArrayItem = (field, defaultItem) => {
    setEditedUser((prev) => {
      if (!prev) return null

      const currentArray = prev[field] || []
      return {
        ...prev,
        [field]: [...currentArray, defaultItem],
      }
    })
  }

  const removeArrayItem = (field, index) => {
    setEditedUser((prev) => {
      if (!prev) return null

      const currentArray = prev[field] || []
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index),
      }
    })
  }

  // Add this function to get trade areas for a specific sector
  const getTradeAreasForSector = (sectorId) => {
    return tradeAreas.filter((ta) => ta.sectorId === sectorId)
  }

  // Improved useEffect for fetching users
  useEffect(() => {
    // Fetch sectors and trade areas when component mounts
    const fetchSectorsAndTradeAreas = async () => {
      setLoadingSectors(true)
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) return

        const response = await axios.get(`${API_BASE_URL}/sectors`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (response.data && response.data.success) {
          // Store sectors with their original structure
          setSectors(response.data.data || [])

          // Extract all trade areas from sectors
          const allTradeAreas = []
          response.data.data.forEach((sector) => {
            if (sector.tradeAreas && Array.isArray(sector.tradeAreas)) {
              sector.tradeAreas.forEach((ta) => {
                allTradeAreas.push({
                  ...ta,
                  sectorId: sector._id,
                  sectorName: sector.name,
                })
              })
            }
          })

          setTradeAreas(allTradeAreas)
        }
      } catch (error) {
        console.error("Error fetching sectors:", error)
      } finally {
        setLoadingSectors(false)
      }
    }

    fetchSectorsAndTradeAreas()
  }, [API_BASE_URL])

  // Add this useEffect to update selectedBank when editedUser changes
  useEffect(() => {
    if (editedUser?.bankAccount?.bank) {
      setSelectedBank(editedUser.bankAccount.bank)
    }
  }, [editedUser])

  useEffect(() => {
    // Only fetch users if the component is mounted and we're not currently editing
    if (isMounted && !isEditing) {
      const controller = new AbortController()
      const signal = controller.signal

      const fetchData = async () => {
        if (!hasLoadedFirst) {
          setLoading(true)
        }

        try {
          const accessToken = localStorage.getItem("accessToken")
          if (!accessToken) {
            setError("No access token found. Please log in again.")
            return
          }

          // Prepare filter parameters
          const params = {
            limit: itemsPerPage,
            page: filter?.currentPage,
          }

          // Add search parameter if it exists
          if (filter?.search) params.search = filter.search

          // Add other filter parameters if they exist and are not empty
          if (filter?.stateOfResidence) params.stateOfResidence = filter.stateOfResidence
          if (filter?.lgaOfResidence) params.lgaOfResidence = filter.lgaOfResidence
          if (filter?.senatorialDistrict) params.senatorialDistrict = filter.senatorialDistrict
          if (filter?.stateOfOrigin) params.stateOfOrigin = filter.stateOfOrigin
          if (filter?.lgaOfOrigin) params.lga = filter.lgaOfOrigin // Note: The backend expects 'lga' for lgaOfOrigin
          if (filter?.sector) params.sector = filter.sector
          if (filter?.tradeArea) params.tradeArea = filter.tradeArea
          if (filter?.role) params.role = filter.role
          if (filter?.fromDate) params.fromDate = filter.fromDate
          if (filter?.toDate) params.toDate = filter.toDate
          if (filter?.sort) params.sort = filter.sort

          const response = await axios.get(`${API_BASE_URL}/userscert`, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: signal,
          })

          if (response.data && response.data.success && response.data.data) {
            const { users, pagination } = response.data.data
            setUsers(users || [])
            setPagination({
              currentPage: pagination?.currentPage || 1,
              totalPages: pagination?.totalPages || 1,
              totalUsers: pagination?.totalUsers || 0,
              pageSize: pagination?.pageSize || 25,
            })
            sethasLoadedFirst(true)
          } else {
            toast.error("Failed to fetch users data")
          }
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error("Error fetching users:", error)
            setError("Failed to fetch users: " + (error.response?.data?.message || error.message))
            toast.error("Failed to fetch users")
          }
        } finally {
          setLoading(false)
          setcsvData([])
        }
      }

      fetchData()

      return () => {
        controller.abort()
      }
    }
  }, [
    filter?.search,
    filter?.currentPage,
    filter?.stateOfResidence,
    filter?.lgaOfResidence,
    filter?.sector,
    filter?.tradeArea,
    filter?.role,
    filter?.fromDate,
    filter?.toDate,
    filter?.senatorialDistrict,
    filter?.stateOfOrigin,
    filter?.lgaOfOrigin,
    filter?.sort,
    isEditing,
    isMounted,
    itemsPerPage,
    hasLoadedFirst,
  ])

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setEditMode(false)
  }

  const handleSort = (field) => {
    const currentSort = filter.sort
    let newSort = `-${field}`

    // If already sorting by this field, toggle direction
    if (currentSort === `-${field}`) {
      newSort = field
    } else if (currentSort === field) {
      newSort = `-${field}`
    }

    setFilter((prev) => ({ ...prev, sort: newSort }))
  }

  // Add this function to handle custom bank input
  const handleCustomBankChange = (e) => {
    setCustomBank(e.target.value)
  }

  // Add this function to add custom bank
  const handleAddCustomBank = (e) => {
    e.preventDefault()
    if (customBank.trim()) {
      handleInputChange("bankAccount.bank", customBank)
      setSelectedBank(customBank)
      setCustomBank("")
    }
  }

  // Add this function to validate account number
  const validateAccountNumber = (value) => /^\d{10}$/.test(value)

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        {loading && !hasLoadedFirst && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
            <Spinner />
          </div>
        )}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">View, edit and export user data</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/biodata")}>
              <UserCircle className="mr-2 h-4 w-4" /> Update Profile
            </Button>

            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium mb-4">Filters</h2>
          <div className="flex gap-[20px] flex-wrap mb-4">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Search</p>
              <Input
                className="text-[12px] placeholder:text-[12px]"
                placeholder="Name or email"
                value={searchv}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            {/* Fix the state of residence filter dropdown */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State of Residence</p>
              <Select
                value={filter?.stateOfResidence}
                onValueChange={(value) => handleFilterChange("stateOfResidence", value)}
              >
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

            {/* Fix the LGA of residence filter dropdown */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">LGA of Residence</p>
              <Select
                value={filter.lgaOfResidence}
                onValueChange={(value) => handleFilterChange("lgaOfResidence", value)}
              >
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

            {/* Add these two filter elements after the existing state and LGA filters */}
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">State of Origin</p>
              <Select
                value={filter?.stateOfOrigin}
                onValueChange={(value) => handleFilterChange("stateOfOrigin", value)}
              >
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select State of Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-[12px]" value="all">
                      All States
                    </SelectItem>
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
              <p className="text-left text-[14px] mb-1">LGA of Origin</p>
              <Select value={filter.lgaOfOrigin} onValueChange={(value) => handleFilterChange("lgaOfOrigin", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select LGA of Origin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-[12px]" value="all">
                      All LGAs
                    </SelectItem>
                    {states
                      .find((state) => state.value === filter.stateOfOrigin)
                      ?.lgas.map((lga) => (
                        <SelectItem className="text-[12px]" key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      )) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Senatorial District</p>
              <Select
                value={filter.senatorialDistrict || ""}
                onValueChange={(value) => handleFilterChange("senatorialDistrict", value)}
              >
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-[12px]" value="all">
                      All Districts
                    </SelectItem>
                    {states
                      .find((state) => state.value === filter.stateOfResidence)
                      ?.senatorialDistricts?.map((district) => (
                        <SelectItem className="text-[12px]" key={district} value={district}>
                          {district}
                        </SelectItem>
                      )) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">Role</p>
              <Select value={filter?.role} onValueChange={(value) => handleFilterChange("role", value)}>
                <SelectTrigger className="text-[12px]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem className="text-[12px]" value="all">
                      All Roles
                    </SelectItem>
                    <SelectItem className="text-[12px]" value="artisan_user">
                      Artisan User
                    </SelectItem>
                    <SelectItem className="text-[12px]" value="intending_artisan">
                      Intending Artisan
                    </SelectItem>
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
                    <SelectItem className="text-[12px]" value="all">
                      All Sectors
                    </SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem className="text-[12px]" key={sector._id} value={sector._id}>
                        {sector.name}
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
                    <SelectItem className="text-[12px]" value="all">
                      All Trade Areas
                    </SelectItem>
                    {tradeAreas
                      .filter((ta) => !filter.sector || ta.sectorId === filter.sector)
                      .map((ta) => (
                        <SelectItem className="text-[12px]" key={ta._id} value={ta._id}>
                          {ta.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-[20px] flex-wrap mb-4">
            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">From Date</p>
              <Input
                type="date"
                className="text-[12px]"
                value={filter.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              />
            </div>

            <div className="w-[200px]">
              <p className="text-left text-[14px] mb-1">To Date</p>
              <Input
                type="date"
                className="text-[12px]"
                value={filter.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
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
              {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : <Cross1Icon className="ml-2" />}
            </Button>
          </div>
        </div>

        <div className="gap-2 flex justify-between w-full mt-4">
          <h2 className="font-medium">Total Records Found: {pagination?.totalUsers || 0}</h2>
          {userRole === "superadmin" && (
          <div className="gap-2 flex flex-row-reverse justify-start mb-4">
            <Button onClick={downloadPDF} className="ml-2" variant="outline" disabled={loading || !users?.length}>
              <FileText className="mr-2 h-4 w-4" /> Export PDF
              {loading ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
            </Button>

            {!csvData?.length ? (
              <Button onClick={downloadCSV} variant="outline" disabled={loadingCSV || !users?.length}>
                <Download className="mr-2 h-4 w-4" /> Generate CSV
                {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
              </Button>
            ) : (
              <CSVLink
                data={csvData}
                filename="user-management-report.csv"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                disabled={loadingCSV || !users?.length}
              >
                <Download className="mr-2 h-4 w-4" /> Download CSV
                {loadingCSV ? <SewingPinFilledIcon className="animate-spin ml-2" /> : null}
              </CSVLink>
            )}
          </div>
          )}
        </div>

        <Table className={`${loading ? "opacity-30" : ""} overflow-x-auto`}>
          <TableHeader>
            <TableRow>
              <TableHead>S/N</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("firstName")}>
                Name {filter.sort === "firstName" ? "↑" : filter.sort === "-firstName" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("gender")}>
                Gender {filter.sort === "gender" ? "↑" : filter.sort === "-gender" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                Email {filter.sort === "email" ? "↑" : filter.sort === "-email" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("role")}>
                Role {filter.sort === "role" ? "↑" : filter.sort === "-role" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("stateOfResidence")}>
                State of Residence/LGA{" "}
                {filter.sort === "stateOfResidence" ? "↑" : filter.sort === "-stateOfResidence" ? "↓" : ""}
              </TableHead>
              <TableHead>
                Address
              </TableHead>
              <TableHead className="cursor-pointer">
                Senatorial District{" "}
                {filter.sort === "senatorialDistrict" ? "↑" : filter.sort === "-senatorialDistrict" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("stateOfOrigin")}>
                State of Origin/LGA{" "}
                {filter.sort === "stateOfOrigin" ? "↑" : filter.sort === "-stateOfOrigin" ? "↓" : ""}
              </TableHead>
              
              <TableHead>Contact</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("hasDisability")}>
                Disability Status{" "}
                {filter.sort === "hasDisability" ? "↑" : filter.sort === "-hasDisability" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
                Registration Date {filter.sort === "createdAt" ? "↑" : filter.sort === "-createdAt" ? "↓" : ""}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("currentVerificationStatus")}>
                Verification Status{" "}
                {filter.sort === "currentVerificationStatus"
                  ? "↑"
                  : filter.sort === "-currentVerificationStatus"
                    ? "↓"
                    : ""}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id || index}>
                <TableCell className="text-left text-[12px]">{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell className="text-left max-w-[200px] text-[12px]">
                  {`${user.firstName || ""} ${user.lastName || ""}`}
                </TableCell>
                <TableCell className="text-left text-[12px]">{user?.gender}</TableCell>
                <TableCell className="text-left text-[12px]">{user.email || ""}</TableCell>
                <TableCell className="text-left text-[12px]">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.role === "artisan_user"
                        ? "bg-green-100 text-green-800"
                        : user.role === "intending_artisan"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role || ""}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-left text-[12px]">{user?.stateOfResidence || "---"}</span>
                      <span className="text-left text-[10px]">{user?.lgaOfResidence || "---"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left text-[12px]">{user?.street || "---"}</TableCell>
                <TableCell className="text-left text-[12px]">{user?.senatorialDistrict || "---"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-left text-[12px]">{user?.stateOfOrigin || "---"}</span>
                      <span className="text-left text-[10px]">{user?.lga || "---"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <div className="flex flex-row gap-1 items-center">
                        <PhoneCall className="size-[14px]" />
                        <span className="text-left text-[10px]">{user?.phoneNumber || "---"}</span>
                      </div>

                      <div className="flex flex-row gap-1 items-center">
                        <Mail className="size-[14px]" />
                        <span className="text-left text-[10px]">{user?.email || "---"}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left text-[12px]">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-left text-[12px]">{user?.hasDisability || "---"}</span>
                      <span className="text-left text-[10px]">{user?.disabilityType || "---"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-left text-[12px]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "---"}
                </TableCell>
                <TableCell className="text-left text-[12px]">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.currentVerificationStatus === "approved"
                        ? "bg-green-100 text-green-800"
                        : user.currentVerificationStatus === "denied"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user.currentVerificationStatus || "pending"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[800px] sm:w-[900px] md:w-[1020px] overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>User Details</SheetTitle>
                          <SheetDescription>View and manage user information</SheetDescription>
                        </SheetHeader>

                        {selectedUser && !editMode && (
                          <div className="py-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden">
                                  <img
                                    src={selectedUser?.profileImage || "/placeholder.svg?height=96&width=96"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{`${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedUser.role} • {selectedUser.email}
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <h4 className="font-medium">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">First Name:</p>
                                    <p>{selectedUser.firstName || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Last Name:</p>
                                    <p>{selectedUser.lastName || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Middle Name:</p>
                                    <p>{selectedUser.middleName || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Gender:</p>
                                    <p>{selectedUser.gender || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Date of Birth:</p>
                                    <p>{selectedUser.dob || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Marital Status:</p>
                                    <p>{selectedUser.maritalStatus || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">NIN:</p>
                                    <p>{selectedUser.nin || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Has Disability:</p>
                                    <p>{selectedUser.hasDisability ? "Yes" : "No"}</p>
                                  </div>
                                  {selectedUser.hasDisability && (
                                    <div>
                                      <p className="font-medium">Disability Type:</p>
                                      <p>{selectedUser.disabilityType || "---"}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <h4 className="font-medium">Contact Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">Email:</p>
                                    <p>{selectedUser.email || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Phone Number:</p>
                                    <p>{selectedUser.phoneNumber || "---"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <h4 className="font-medium">Location</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">State of Origin:</p>
                                    <p>{selectedUser.stateOfOrigin || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">LGA of Origin:</p>
                                    <p>{selectedUser.lga || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">State of Residence:</p>
                                    <p>{selectedUser.stateOfResidence || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">LGA of Residence:</p>
                                    <p>{selectedUser.lgaOfResidence || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Senatorial District:</p>
                                    <p>{selectedUser.senatorialDistrict || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Street Address:</p>
                                    <p>{selectedUser.street || "---"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <h4 className="font-medium">Education</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">School:</p>
                                    <p>{selectedUser.education?.school || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Highest Qualification:</p>
                                    <p>{selectedUser.education?.highestQualification || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Graduation Year:</p>
                                    <p>{selectedUser.education?.graduationYear || "---"}</p>
                                  </div>
                                  {selectedUser.education?.eduUpload && (
                                    <div>
                                      <p className="font-medium">Education Document:</p>
                                      {/* <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(selectedUser.education.eduUpload, "_blank")}
                                        className="flex items-center gap-2 mt-1"
                                      >
                                        <Eye className="h-4 w-4" />
                                        View Document
                                      </Button> */}
                                      
                                      <FilePreview fileUrl={selectedUser.education.eduUpload} />
                                  
                                    </div>
                                  )}
                                </div>
                              </div>

                              {selectedUser.priorSkillsCerts && selectedUser.priorSkillsCerts.length > 0 && (
                                <div className="grid gap-2">
                                  <h4 className="font-medium">Skills & Certifications</h4>
                                  {selectedUser.priorSkillsCerts.map((cert, index) => (
                                    <div key={index} className="border p-2 rounded-md">
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <p className="font-medium">Sector:</p>
                                          <p>
                                            {sectors.find((s) => s._id === cert.sector)?.name || cert.sector || "---"}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Trade Area:</p>
                                          <p>
                                            {tradeAreas.find((ta) => ta._id === cert.tradeArea)?.name ||
                                              cert.tradeArea ||
                                              "---"}
                                          </p>
                                        </div>
                                        {cert.name && (
                                          <div>
                                            <p className="font-medium">Certificate Name:</p>
                                            <p>{cert.name || "---"}</p>
                                          </div>
                                        )}
                                        {cert.year && (
                                          <div>
                                            <p className="font-medium">Year:</p>
                                            <p>{cert.year || "---"}</p>
                                          </div>
                                        )}
                                        {cert.priUpload && (
                                          <div>
                                            <p className="font-medium">Certificate Document:</p>
                                            {/* <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() => window.open(cert.priUpload, "_blank")}
                                              className="flex items-center gap-2 mt-1"
                                            >
                                              <Eye className="h-4 w-4" />
                                              View Certificate
                                            </Button> */}
                                              <FilePreview fileUrl={cert?.priUpload} />
                                           
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {selectedUser.experience && selectedUser.experience.length > 0 && (
                                <div className="grid gap-2">
                                  <h4 className="font-medium">Experience</h4>
                                  {selectedUser.experience.map((exp, index) => (
                                    <div key={index} className="border p-2 rounded-md">
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                          <p className="font-medium">Project Title:</p>
                                          <p>{exp.projectTitle || "---"}</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Date Range:</p>
                                          <p>
                                            {exp.dateFrom || "---"} to {exp.dateTo || "---"}
                                          </p>
                                        </div>
                                        <div className="col-span-2">
                                          <p className="font-medium">Description:</p>
                                          <p>{exp.description || "---"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="grid gap-2">
                                <h4 className="font-medium">Bank Information</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">Account Name:</p>
                                    <p>{selectedUser.bankAccount?.accountName || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Account Number:</p>
                                    <p>{selectedUser.bankAccount?.accountNumber || "---"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Bank:</p>
                                    <p>{selectedUser.bankAccount?.bank || "---"}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <h4 className="font-medium">Account Status</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">Certified Status:</p>
                                    <p>{selectedUser.certifiedStatus ? "Certified" : "Not Certified"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">License Status:</p>
                                    <p>{selectedUser.licenseStatus ? "Licensed" : "Not Licensed"}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Verification Status:</p>
                                    <p
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        selectedUser.currentVerificationStatus === "approved"
                                          ? "bg-green-100 text-green-800"
                                          : selectedUser.currentVerificationStatus === "denied"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {selectedUser.currentVerificationStatus || "pending"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Registration Date:</p>
                                    <p>
                                      {selectedUser.createdAt
                                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                                        : "---"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        )}

                        {selectedUser && editMode && editedUser && (
                          <div className="py-4">
                            <div className="space-y-6">
                              <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-full overflow-hidden">
                                  <img
                                    src={editedUser.profileImage || "/placeholder.svg?height=96&width=96"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold">{`${editedUser.firstName || ""} ${editedUser.lastName || ""}`}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {editedUser.role} • {editedUser.email}
                                  </p>
                                </div>
                                <div className="ml-auto">
                                  <UploadButton
                                    fileUrl={editedUser.profileImage}
                                    handleFileChange={(url) => handleInputChange("profileImage", url)}
                                    removeFile={() => handleInputChange("profileImage", "")}
                                    accept=".jpg, .png, .jpeg"

                                  />
                                </div>
                              </div>
                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                      id="firstName"
                                      value={editedUser.firstName || ""}
                                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                      id="lastName"
                                      value={editedUser.lastName || ""}
                                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="middleName">Middle Name</Label>
                                    <Input
                                      id="middleName"
                                      value={editedUser.middleName || ""}
                                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                                    />
                                  </div>

                                  {/* Gender Selection */}
                                  <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                      value={editedUser.gender || ""}
                                      onValueChange={(value) => handleInputChange("gender", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="male">Male</SelectItem>
                                          <SelectItem value="female">Female</SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                      id="dob"
                                      type="date"
                                      value={editedUser.dob || ""}
                                      onChange={(e) => handleInputChange("dob", e.target.value)}
                                    />
                                  </div>

                                  {/* Marital Status */}
                                  <div className="space-y-2">
                                    <Label htmlFor="maritalStatus">Marital Status</Label>
                                    <Select
                                      value={editedUser.maritalStatus || ""}
                                      onValueChange={(value) => handleInputChange("maritalStatus", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select marital status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="single">Single</SelectItem>
                                          <SelectItem value="married">Married</SelectItem>
                                          <SelectItem value="divorced">Divorced</SelectItem>
                                          <SelectItem value="widowed">Widowed</SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="nin">NIN</Label>
                                    <Input
                                      id="nin"
                                      value={editedUser.nin || ""}
                                      onChange={(e) => handleInputChange("nin", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                                    <div className="space-y-4">
                                      <Label htmlFor="hasDisability" className="text-left text-xs text-gray-600">
                                        Has disability?
                                      </Label>
                                      <input
                                        type="checkbox"
                                        id="hasDisability"
                                        checked={editedUser.hasDisability || false}
                                        onChange={(e) => {
                                          handleInputChange("hasDisability", e.target.checked)
                                          if (!e.target.checked) {
                                            handleInputChange("disabilityType", "")
                                          }
                                        }}
                                        className="w-4 h-4"
                                      />
                                    </div>

                                    {editedUser.hasDisability && (
                                      <div className="space-y-4">
                                        <Label htmlFor="disabilityType" className="text-left text-xs text-gray-600">
                                          Type of Disability
                                        </Label>
                                        <Select
                                          value={editedUser.disabilityType || ""}
                                          onValueChange={(value) => handleInputChange("disabilityType", value)}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select disability type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectGroup>
                                              <SelectItem value="visual">Visual</SelectItem>
                                              <SelectItem value="hearing">Hearing</SelectItem>
                                              <SelectItem value="mobility">Mobility</SelectItem>
                                              <SelectItem value="cognitive">Cognitive</SelectItem>
                                              <SelectItem value="other">Other</SelectItem>
                                            </SelectGroup>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                      id="email"
                                      type="email"
                                      value={editedUser.email || ""}
                                      onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                      id="phoneNumber"
                                      value={editedUser.phoneNumber || ""}
                                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="profileImage">Profile Image URL</Label>
                                    <Input
                                      id="profileImage"
                                      value={editedUser.profileImage || ""}
                                      onChange={(e) => handleInputChange("profileImage", e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Location</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  {/* Fix the State of Origin dropdown in the edit section */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="stateOfOrigin">State of Origin</Label>
                                    <Select
                                      value={editedUser.stateOfOrigin || ""}
                                      onValueChange={(value) => handleInputChange("stateOfOrigin", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select State" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {states.map((item) => (
                                            <SelectItem value={item.value} key={item.value}>
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Fix the LGA of Origin dropdown in the edit section */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="lga">LGA of Origin</Label>
                                    <Select
                                      value={editedUser.lga || ""}
                                      onValueChange={(value) => handleInputChange("lga", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select LGA" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {states
                                            .find((state) => state.value === editedUser.stateOfOrigin)
                                            ?.lgas.map((lga) => (
                                              <SelectItem value={lga} key={lga}>
                                                {lga}
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Fix the State of Residence dropdown in the edit section */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="stateOfResidence">State of Residence</Label>
                                    <Select
                                      value={editedUser.stateOfResidence || ""}
                                      onValueChange={(value) => handleInputChange("stateOfResidence", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select State" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {states.map((item) => (
                                            <SelectItem value={item.value} key={item.value}>
                                              {item.label}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Fix the LGA of Residence dropdown in the edit section */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="lgaOfResidence">LGA of Residence</Label>
                                    <Select
                                      value={editedUser.lgaOfResidence || ""}
                                      onValueChange={(value) => handleInputChange("lgaOfResidence", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select LGA" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {states
                                            .find((state) => state.value === editedUser.stateOfResidence)
                                            ?.lgas.map((lga) => (
                                              <SelectItem value={lga} key={lga}>
                                                {lga}
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Convert Senatorial District to a dropdown in the edit section */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="senatorialDistrict">Senatorial District</Label>
                                    <Select
                                      value={editedUser.senatorialDistrict || ""}
                                      onValueChange={(value) => handleInputChange("senatorialDistrict", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Senatorial District" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {states
                                            .find((state) => state.value === editedUser.stateOfResidence)
                                            ?.senatorialDistricts?.map((district) => (
                                              <SelectItem value={district} key={district}>
                                                {district}
                                              </SelectItem>
                                            )) || []}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="street">Street Address</Label>
                                    <Textarea
                                      id="street"
                                      value={editedUser.street || ""}
                                      onChange={(e) => handleInputChange("street", e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Education</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="education-school">School</Label>
                                    <Input
                                      id="education-school"
                                      value={editedUser.education?.school || ""}
                                      onChange={(e) => handleInputChange("education.school", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="education-highestQualification">Highest Qualification</Label>
                                    <Select
                                      value={editedUser.education?.highestQualification || ""}
                                      onValueChange={(value) =>
                                        handleInputChange("education.highestQualification", value)
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select highest qualification" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="pslc">Primary School Leaving Certificate (PSLC)</SelectItem>
                                        <SelectItem value="ssec">
                                          Senior Secondary Education Certificate (SSEC)
                                        </SelectItem>
                                        <SelectItem value="graduate">Graduate</SelectItem>
                                        <SelectItem value="post-graduate">Post-Graduate</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="education-graduationYear">Graduation Year</Label>
                                    <Input
                                      id="education-graduationYear"
                                      type="number"
                                      min={1900}
                                      max={new Date().getFullYear()}
                                      value={editedUser.education?.graduationYear || ""}
                                      onChange={(e) => {
                                        const value = Math.max(
                                          1900,
                                          Math.min(new Date().getFullYear(), Number(e.target.value)),
                                        )
                                        handleInputChange("education.graduationYear", value.toString())
                                      }}
                                      placeholder={`Enter year between 1900 and ${new Date().getFullYear()}`}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="education-document">Education Document</Label>
                                    <UploadButton
                                      fileUrl={editedUser.education?.eduUpload || ""}
                                      handleFileChange={(url) => handleInputChange("education.eduUpload", url)}
                                      removeFile={() => handleInputChange("education.eduUpload", "")}
                                      accept=".jpg, .png, .jpeg, .pdf, .doc, .docx"

                                    />
                                    
                                  </div>
                                </div>
                              </div>

                              {/* <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Account Status</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                      value={editedUser.role || ""}
                                      onChange={(value) => handleInputChange("role", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="artisan_user">Artisan User</SelectItem>
                                        <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                                        <SelectItem value="regular_user">Regular User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="certifiedStatus">Certified Status</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="certifiedStatus"
                                        checked={editedUser.certifiedStatus || false}
                                        onChange={(checked) => handleInputChange("certifiedStatus", checked)}
                                      />
                                      <label
                                        htmlFor="certifiedStatus"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Certified
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="licenseStatus">License Status</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="licenseStatus"
                                        checked={editedUser.licenseStatus || false}
                                        onChange={(checked) => handleInputChange("licenseStatus", checked)}
                                      />
                                      <label
                                        htmlFor="licenseStatus"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Licensed
                                      </label>
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="verificationStatus">Verification Status</Label>
                                    <Select
                                      value={editedUser.currentVerificationStatus || ""}
                                      onChange={(value) => handleInputChange("currentVerificationStatus", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select verification status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="denied">Denied</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div> */}

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Account Status</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  {/* Role Selection */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                      value={editedUser?.role || ""}
                                      onValueChange={(value) => handleInputChange("role", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Role" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="artisan_user">Artisan User</SelectItem>
                                        <SelectItem value="intending_artisan">Intending Artisan</SelectItem>
                                        <SelectItem value="regular_user">Regular User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Certified Status */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="certifiedStatus">Certified Status</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="certifiedStatus"
                                        checked={editedUser?.certifiedStatus || false}
                                        onCheckedChange={(checked) => handleInputChange("certifiedStatus", checked)}
                                      />
                                      <label
                                        htmlFor="certifiedStatus"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Certified
                                      </label>
                                    </div>
                                  </div>

                                  {/* License Status */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="licenseStatus">License Status</Label>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="licenseStatus"
                                        checked={editedUser?.licenseStatus || false}
                                        onCheckedChange={(checked) => handleInputChange("licenseStatus", checked)}
                                      />
                                      <label
                                        htmlFor="licenseStatus"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                      >
                                        Licensed
                                      </label>
                                    </div>
                                  </div>

                                  {/* Verification Status */}
                                  <div className="grid gap-2">
                                    <Label htmlFor="verificationStatus">Verification Status</Label>
                                    <Select
                                      value={editedUser?.currentVerificationStatus || ""}
                                      onValueChange={(value) => handleInputChange("currentVerificationStatus", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select verification status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="denied">Denied</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Skills & Certifications</h3>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">
                                      Add skills and certifications for this user
                                    </p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addArrayItem("priorSkillsCerts", {
                                          sector: "",
                                          tradeArea: [],
                                          hasCertificate: false,
                                          name: "",
                                          year: "",
                                          priUpload: "",
                                        })
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <Plus className="h-4 w-4" /> Add Skill
                                    </Button>
                                  </div>

                                  {/* List of skills */}
                                  {(editedUser?.priorSkillsCerts || []).length > 0 ? (
                                    (editedUser?.priorSkillsCerts || []).map((cert, index) => (
                                      <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeArrayItem("priorSkillsCerts", index)}
                                          className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {/* Sector Selection */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`cert-sector-${index}`}>Sector</Label>
                                            <Select
                                              value={cert.sector || ""}
                                              onValueChange={(value) => {
                                                const updatedCert = { ...cert, sector: value, tradeArea: [] }
                                                handleInputChange("priorSkillsCerts", updatedCert, index)
                                              }}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select sector" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  {sectors.map((sector) => (
                                                    <SelectItem key={sector._id} value={sector.name}>
                                                      {sector.name}
                                                    </SelectItem>
                                                  ))}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Trade Areas (Multi-Select) */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`cert-tradeArea-${index}`}>Trade Areas (Multiple)</Label>

                                            {/* Display selected trade areas as tags */}
                                            {cert.tradeArea &&
                                              Array.isArray(cert.tradeArea) &&
                                              cert.tradeArea.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                  {cert.tradeArea.map((taName, taIndex) => (
                                                    <div
                                                      key={taIndex}
                                                      className="flex items-center bg-blue-100 px-2 py-1 rounded-md"
                                                    >
                                                      <span className="text-sm">{taName}</span>
                                                      <button
                                                        type="button"
                                                        className="ml-2 text-red-500"
                                                        onClick={() => removeTradeAreaFromSkill(index, taName)}
                                                      >
                                                        <X className="h-3 w-3" />
                                                      </button>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}

                                            {/* Trade area dropdown */}
                                            <Select
                                              onValueChange={(value) => addTradeAreaToSkill(index, value)}
                                              disabled={!cert.sector}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Add trade area" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectGroup>
                                                  {tradeAreas
                                                    .filter((ta) => {
                                                      // Filter trade areas by sector and exclude already selected ones
                                                      const sectorMatch = sectors.find((s) => s.name === cert.sector)
                                                      return (
                                                        sectorMatch &&
                                                        sectorMatch._id === ta.sectorId &&
                                                        (!cert.tradeArea || !cert.tradeArea.includes(ta.name))
                                                      )
                                                    })
                                                    .map((ta) => (
                                                      <SelectItem key={ta._id} value={ta.name}>
                                                        {ta.name}
                                                      </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {/* Certificate Fields */}
                                          <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                              <Checkbox
                                                id={`has-certificate-${index}`}
                                                checked={cert.hasCertificate || false}
                                                onCheckedChange={(checked) => {
                                                  const updatedCert = {
                                                    ...cert,
                                                    hasCertificate: checked,
                                                    name: checked ? cert.name : "",
                                                    year: checked ? cert.year : "",
                                                    priUpload: checked ? cert.priUpload : "",
                                                  }
                                                  handleInputChange("priorSkillsCerts", updatedCert, index)
                                                }}
                                              />
                                              <Label htmlFor={`has-certificate-${index}`}>
                                                I have a certificate for this skill
                                              </Label>
                                            </div>
                                          </div>

                                          {cert.hasCertificate && (
                                            <>
                                              <div className="space-y-2">
                                                <Label htmlFor={`cert-name-${index}`}>Certificate Name</Label>
                                                <Input
                                                  id={`cert-name-${index}`}
                                                  value={cert.name || ""}
                                                  onChange={(e) => {
                                                    const updatedCert = { ...cert, name: e.target.value }
                                                    handleInputChange("priorSkillsCerts", updatedCert, index)
                                                  }}
                                                  placeholder="Enter certificate name"
                                                />
                                              </div>

                                              <div className="space-y-2">
                                                <Label htmlFor={`cert-year-${index}`}>Year Obtained</Label>
                                                <Input
                                                  id={`cert-year-${index}`}
                                                  type="number"
                                                  min="1900"
                                                  max={new Date().getFullYear()}
                                                  value={cert.year || ""}
                                                  onChange={(e) => {
                                                    const updatedCert = { ...cert, year: e.target.value }
                                                    handleInputChange("priorSkillsCerts", updatedCert, index)
                                                  }}
                                                  placeholder="Enter year"
                                                />
                                              </div>

                                              <div>
                                                <Label
                                                  htmlFor={`cert-upload-${index}`}
                                                  className="text-left text-xs text-gray-600"
                                                >
                                                  Upload Certificate
                                                </Label>
                                                <UploadButton
                                                  fileUrl={cert.priUpload}
                                                  title={`certificate-${index}`}
                                                  handleFileChange={(newFileUrl) => {
                                                    const updatedPriorSkillsCerts = [...editedUser.priorSkillsCerts]
                                                    updatedPriorSkillsCerts[index] = {
                                                      ...updatedPriorSkillsCerts[index],
                                                      priUpload: newFileUrl,
                                                    }
                                                    handleInputChange(
                                                      "priorSkillsCerts",
                                                      updatedPriorSkillsCerts,
                                                      index,
                                                    )
                                                  }}
                                                  accept=".jpg, .png, .jpeg, .pdf"
                                                  removeFile={() => {
                                                    const updatedPriorSkillsCerts = [...editedUser.priorSkillsCerts]
                                                    updatedPriorSkillsCerts[index] = {
                                                      ...updatedPriorSkillsCerts[index],
                                                      priUpload: null,
                                                    }
                                                    handleInputChange(
                                                      "priorSkillsCerts",
                                                      updatedPriorSkillsCerts,
                                                      index,
                                                    )
                                                  }}
                                                />
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm italic">
                                      No skills or certifications added. Click "Add Skill" to add skills.
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Experience</h3>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">Add work experience for this user</p>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        addArrayItem("experience", {
                                          projectTitle: "",
                                          description: "",
                                          dateFrom: "",
                                          dateTo: "",
                                        })
                                      }
                                      className="flex items-center gap-1"
                                    >
                                      <Plus className="h-4 w-4" /> Add Experience
                                    </Button>
                                  </div>

                                  {/* List of experiences */}
                                  {(editedUser?.experience || []).length > 0 ? (
                                    (editedUser?.experience || []).map((exp, index) => (
                                      <div key={index} className="grid gap-4 p-4 border rounded-md relative">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeArrayItem("experience", index)}
                                          className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {/* Project Title */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`exp-title-${index}`}>Project Title</Label>
                                            <Input
                                              id={`exp-title-${index}`}
                                              value={exp.projectTitle || ""}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "experience",
                                                  { ...exp, projectTitle: e.target.value },
                                                  index,
                                                )
                                              }
                                              placeholder="Enter project title"
                                            />
                                          </div>

                                          {/* Date From */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`exp-dateFrom-${index}`}>Date From</Label>
                                            <Input
                                              id={`exp-dateFrom-${index}`}
                                              type="date"
                                              value={exp.dateFrom || ""}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "experience",
                                                  { ...exp, dateFrom: e.target.value },
                                                  index,
                                                )
                                              }
                                            />
                                          </div>

                                          {/* Date To */}
                                          <div className="space-y-2">
                                            <Label htmlFor={`exp-dateTo-${index}`}>Date To</Label>
                                            <Input
                                              id={`exp-dateTo-${index}`}
                                              type="date"
                                              value={exp.dateTo || ""}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "experience",
                                                  { ...exp, dateTo: e.target.value },
                                                  index,
                                                )
                                              }
                                            />
                                          </div>

                                          {/* Description */}
                                          <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor={`exp-description-${index}`}>Description</Label>
                                            <Textarea
                                              id={`exp-description-${index}`}
                                              value={exp.description || ""}
                                              onChange={(e) =>
                                                handleInputChange(
                                                  "experience",
                                                  { ...exp, description: e.target.value },
                                                  index,
                                                )
                                              }
                                              placeholder="Enter project description"
                                              rows={3}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-center py-4 text-gray-500 text-sm italic">
                                      No experience added. Click "Add Experience" to add work experience.
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Replace the entire Bank Account Details section in the edit mode with this updated version */}
                              <div className="border-b pb-4">
                                <h3 className="text-lg font-medium mb-4">Bank Account Details</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="grid gap-2">
                                    <Label htmlFor="bankAccountName">Account Name</Label>
                                    <Input
                                      id="bankAccountName"
                                      value={editedUser.bankAccount?.accountName || ""}
                                      onChange={(e) => handleInputChange("bankAccount.accountName", e.target.value)}
                                    />
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="bankAccountNumber">Account Number</Label>
                                    <Input
                                      id="bankAccountNumber"
                                      value={editedUser.bankAccount?.accountNumber || ""}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                                        handleInputChange("bankAccount.accountNumber", value)
                                      }}
                                      type="text"
                                      pattern="\d{10}"
                                      maxLength={10}
                                    />
                                    {editedUser.bankAccount?.accountNumber &&
                                      !validateAccountNumber(editedUser.bankAccount?.accountNumber) && (
                                        <p className="text-sm text-red-500">Account number must be 10 digits</p>
                                      )}
                                  </div>

                                  <div className="grid gap-2">
                                    <Label htmlFor="bankName">Bank</Label>
                                    <Select
                                      value={selectedBank}
                                      onValueChange={(value) => {
                                        setSelectedBank(value)
                                        if (value !== "Others") {
                                          handleInputChange("bankAccount.bank", value)
                                        }
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select bank" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {banks.map((bank) => (
                                            <SelectItem key={bank.id} value={bank.name}>
                                              {bank.name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {selectedBank === "Others" && (
                                  <div className="flex items-center mt-4 gap-2">
                                    <Input
                                      type="text"
                                      id="customBank"
                                      placeholder="Enter custom bank name"
                                      value={customBank}
                                      onChange={handleCustomBankChange}
                                      className="flex-grow"
                                    />
                                    <Button onClick={handleAddCustomBank} variant="secondary">
                                      Add Bank
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <SheetFooter className="pt-4">
                          {!editMode ? (
                            <div className="flex justify-between w-full">
                              <Button variant="outline" onClick={() => handleEditUser(selectedUser)}>
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

                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
    </ProtectedRoute>
  )
}

export default UserManagement
