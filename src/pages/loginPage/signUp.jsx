"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import PageLayout from "../../components/layout/pageLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { toast } from "sonner"
import Spinner from "../../components/Spinner"
import { API_BASE_URL } from "@/config/env"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { states } from "@/data/nigeria.ts"
import { fetchSectors } from "@/services/api"
import { Plus, Trash2 } from "lucide-react"
import UploadButton from "@/components/UploadButton"

export default function SignupForm() {
  // const [signupAs, setSignupAs] = useState("artisan_user");
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen width
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640); // Tailwind 'sm' breakpoint

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Dynamic color based on selected value (mobile dropdown trigger color)
  const getTriggerColor = () => {
    switch (signupAs) {
      case "artisan_user":
        return "bg-emerald-800 text-white font-bold";
      case "intending_artisan":
        return "bg-red-600 text-white font-bold";
      case "training_center":
        return "bg-blue-600 text-white font-bold";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // const handleRoleChange = (value) => {
  //   setSignupAs(value);
  // };

  const location = useLocation();
  const initialTab = location.state?.tab || "artisan_user";
  const [signupAs, setRole] = useState(initialTab);
  const [sectors, setSectors] = useState([]);
  const [sectorLoading, setSectorLoading] = useState(true);
  const [sectorError, setSectorError] = useState(null);
  
  const [ninVerificationStep, setNinVerificationStep] = useState(1); // 1: Enter NIN, 2: Form fields
  const [ninVerifying, setNinVerifying] = useState(false);
  const [ninError, setNinError] = useState("");
  const [ninData, setNinData] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "", // Added middleName back for NIN data
    lastName: "",
    nin: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    trainingCentreName: "",
    regNum: "",
    state: "",
    lga: "",
    address: "",
    street: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    senatorialDistrict: "",
    stateOfOrigin: "",
    // sector: "",
    // tradeArea: "",
    hasDisability: false,
    disabilityType: "",
    priorSkillsCerts: [], // Initialize as an array
    legalInfo: {
      tradeAreas: [],
    },
    profileImage: "",
    dateOfBirth: "", // Added dateOfBirth for NIN data
  });

  const checkNinInDatabase = async (nin) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/check-nin/${nin}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking NIN in database:", error);
      return false;
    }
  };

  const verifyNinWithService = async (nin) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-nin`, { nin });
      return response.data;
    } catch (error) {
      console.error("Error verifying NIN:", error);
      throw error;
    }
  };

  const handleNinVerification = async () => {
    if (!formData.nin || formData.nin.length !== 11) {
      setNinError("NIN must be 11 digits");
      return;
    }

    setNinVerifying(true);
    setNinError("");

    try {
      // First check if NIN exists in database
      const existsInDb = await checkNinInDatabase(formData.nin);
      
      if (existsInDb) {
        setNinError("This NIN is already registered in our system");
        setNinVerifying(false);
        return;
      }

      // If not in database, verify with external service
      const verificationResult = await verifyNinWithService(formData.nin);
      
      if (verificationResult.success) {
        setNinData(verificationResult.data);
        setFormData(prev => ({
          ...prev,
          firstName: verificationResult.data.firstname || "",
          middleName: verificationResult.data.middlename || "",
          lastName: verificationResult.data.lastname || "",
          stateOfOrigin: verificationResult.data.stateoforigin || "",
          lga: verificationResult.data.lgaoforigin || "",
          dateOfBirth: verificationResult.data.dateofbirth || "",
          profileImage: verificationResult.data.profileimage || "",
          gender: verificationResult.data.gender || "",
        }));
        
        // Move to next step
        setNinVerificationStep(2);
        toast.success("NIN verified successfully! Please complete the remaining fields.");
      } else {
        setNinError("NIN verification failed. Please check your NIN and try again.");
      }
    } catch (error) {
      setNinError("Failed to verify NIN. Please try again.");
    } finally {
      setNinVerifying(false);
    }
  };

  const resetNinVerification = () => {
    setNinVerificationStep(1);
    setNinData(null);
    setNinError("");
    setFormData(prev => ({
      ...prev,
      firstName: "",
      middleName: "",
      lastName: "",
      stateOfOrigin: "",
      lga: "",
      dateOfBirth: "",
      profileImage: "",
      gender: "",
      nin: "",
    }));
  };

  // Add this function to handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Add this function to handle select change
  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [lgas, setLgas] = useState([]);
  const [selectedSectorId, setSelectedSectorId] = useState("");
  const [lgasOfOrigin, setLgasOfOrigin] = useState([]);
  // Add a new state variable for senatorial districts
  const [senatorialDistricts, setSenatorialDistricts] = useState([]);
  const [profileImageError, setProfileImageError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetchSectors(accessToken);
        setSectors(response);
      } catch (err) {
        setSectorError("Failed to fetch sectors");
        console.error(err);
      } finally {
        setSectorLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update the handleSectorChange function to store both the sector name and ID
  const handleSectorChange = (sectorName) => {
    // Find the selected sector object from the sectors array
    const selectedSector = sectors.find((sector) => sector.name === sectorName);

    if (selectedSector) {
      setSelectedSectorId(selectedSector._id);

      // Update formData with the sector name and reset tradeArea
      setFormData({
        ...formData,
        // sector: sectorName,
        tradeArea: "",
        // Initialize legalInfo.tradeAreas with the correct structure
        legalInfo: {
          ...formData.legalInfo,
          tradeAreas: [
            {
              sector: [selectedSector._id], // Store as array of ObjectId
              tradeArea: [],
              instructors: "",
              trainees: "",
              facilities: "",
              equipment: "",
              tools: "",
            },
          ],
        },
      });
    }
  };

  // Update the trade area handler to store in the correct format
  const handleTradeAreaChange = (tradeAreaName) => {
    const selectedSector = sectors.find(
      (sector) => sector.name === formData.sector
    );
    const selectedTradeArea = selectedSector?.tradeAreas?.find(
      (ta) => ta.name === tradeAreaName
    );

    if (selectedTradeArea) {
      setFormData({
        ...formData,
        tradeArea: tradeAreaName,
        legalInfo: {
          ...formData.legalInfo,
          tradeAreas: [
            {
              ...formData.legalInfo.tradeAreas[0],
              tradeArea: [selectedTradeArea._id], // Store trade area ID as array of ObjectIds
            },
          ],
        },
      });
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      maritalStatus: "",
      dob: "",
      nin: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      trainingCentreName: "",
      regNum: "",
      state: "",
      lga: "",
      address: "",
      street: "",
      stateOfResidence: "",
      lgaOfResidence: "",
      senatorialDistrict: "",
      stateOfOrigin: "",
      hasDisability: false, // Ensure this is a boolean
      disabilityType: "", // Ensure this is a string
      priorSkillsCerts:
        newRole === "intending_artisan"
          ? [{ sector: "", tradeAreas: [], name: "", year: "" }]
          : [],
      legalInfo: {
        tradeAreas: [],
      },
      dateOfBirth: "",
    });
    setSelectedSectorId("");
    setNinVerificationStep(1);
    setNinData(null);
    setNinError("");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStateChange = (stateName) => {
    setFormData({ ...formData, state: stateName, lga: "" });
    const selectedState = states.find((state) => state.value === stateName);
    setLgas(selectedState ? selectedState.lgas : []);
  };

  const handlePriorSkillsCertChange = (index, field, value) => {
    const updatedPriorSkillsCerts = [...formData.priorSkillsCerts];

    if (field === "sector") {
      // Check if this sector is already selected in another entry
      const sectorAlreadySelected = formData.priorSkillsCerts.some(
        (cert, i) => i !== index && cert.sector === value
      );

      if (sectorAlreadySelected) {
        toast.error(
          "This sector is already selected. Please choose a different sector.",
          {
            position: "top-right",
          }
        );
        return;
      }

      // When sector changes, reset trade areas to empty array
      updatedPriorSkillsCerts[index] = {
        ...updatedPriorSkillsCerts[index],
        sector: value,
        tradeAreas: [], // Reset to empty array when sector changes
      };
    } else if (field === "tradeArea") {
      // Add trade area to the array if it doesn't exist already
      const tradeAreas = updatedPriorSkillsCerts[index].tradeAreas || [];
      if (!tradeAreas.includes(value)) {
        updatedPriorSkillsCerts[index] = {
          ...updatedPriorSkillsCerts[index],
          tradeAreas: [...tradeAreas, value],
        };
      }
    } else {
      // Handle other fields normally
      updatedPriorSkillsCerts[index] = {
        ...updatedPriorSkillsCerts[index],
        [field]: value,
      };
    }

    setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts });
  };

  // const addPriorSkillsCert = () => {
  //   setFormData({
  //     ...formData,
  //     priorSkillsCerts: [...formData.priorSkillsCerts, { sector: "", tradeAreas: [] }],
  //   })
  // }

  const addPriorSkillsCert = () => {
    setFormData({
      ...formData,
      priorSkillsCerts: [
        ...formData.priorSkillsCerts,
        {
          sector: "",
          tradeAreas: [],
          name: "",
          year: "",
          priUpload: "",
          hasCertificate: false,
        },
      ],
    });
  };

  const removePriorSkillsCert = (index) => {
    const updatedPriorSkillsCerts = formData.priorSkillsCerts.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, priorSkillsCerts: updatedPriorSkillsCerts });
  };

  const handleTradeAreaSectorChange = (index, sectorName) => {
    const selectedSector = sectors.find((sector) => sector.name === sectorName);

    if (selectedSector) {
      // Check if this sector is already selected in another trade area
      const sectorAlreadySelected = formData.legalInfo.tradeAreas.some(
        (tradeArea, i) =>
          i !== index &&
          tradeArea.sector &&
          tradeArea.sector.length > 0 &&
          tradeArea.sector[0] === selectedSector._id
      );

      if (sectorAlreadySelected) {
        toast.error(
          "This sector is already selected. Please choose a different sector.",
          {
            position: "top-right",
          }
        );
        return;
      }

      const updatedTradeAreas = [...formData.legalInfo.tradeAreas];
      updatedTradeAreas[index] = {
        ...updatedTradeAreas[index],
        sector: [selectedSector._id],
        tradeArea: [], // Reset trade area when sector changes
        instructors: updatedTradeAreas[index]?.instructors || "",
        trainees: updatedTradeAreas[index]?.trainees || "",
        facilities: updatedTradeAreas[index]?.facilities || "",
        equipment: updatedTradeAreas[index]?.equipment || "",
        tools: updatedTradeAreas[index]?.tools || "",
      };

      setFormData({
        ...formData,
        legalInfo: {
          ...formData.legalInfo,
          tradeAreas: updatedTradeAreas,
        },
      });
    }
  };

  const handleTradeAreaMultipleChange = (index, value) => {
    const tradeAreaItem = formData.legalInfo.tradeAreas[index];
    const sectorId = tradeAreaItem.sector[0];
    const selectedSector = sectors.find((sector) => sector._id === sectorId);
    const selectedTradeArea = selectedSector?.tradeAreas?.find(
      (ta) => ta.name === value
    );

    if (selectedTradeArea) {
      const updatedTradeAreas = [...formData.legalInfo.tradeAreas];

      // Check if tradeArea array exists, if not initialize it
      if (!updatedTradeAreas[index].tradeArea) {
        updatedTradeAreas[index].tradeArea = [];
      }

      // Add the trade area ID to the array if it doesn't already exist
      if (!updatedTradeAreas[index].tradeArea.includes(selectedTradeArea._id)) {
        updatedTradeAreas[index] = {
          ...updatedTradeAreas[index],
          tradeArea: [
            ...updatedTradeAreas[index].tradeArea,
            selectedTradeArea._id,
          ],
        };
      }

      setFormData({
        ...formData,
        legalInfo: {
          ...formData.legalInfo,
          tradeAreas: updatedTradeAreas,
        },
      });
    }
  };

  const handleTradeAreaFieldChange = (index, field, value) => {
    const updatedTradeAreas = [...formData.legalInfo.tradeAreas];
    updatedTradeAreas[index] = {
      ...updatedTradeAreas[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      legalInfo: {
        ...formData.legalInfo,
        tradeAreas: updatedTradeAreas,
      },
    });
  };

  const addTradeArea = () => {
    setFormData({
      ...formData,
      legalInfo: {
        ...formData.legalInfo,
        tradeAreas: [
          ...formData.legalInfo.tradeAreas,
          {
            sector: [],
            tradeArea: [],
            instructors: "",
            trainees: "",
            facilities: "",
            equipment: "",
            tools: "",
          },
        ],
      },
    });
  };

  const removeTradeArea = (index) => {
    const updatedTradeAreas = formData.legalInfo.tradeAreas.filter(
      (_, i) => i !== index
    );
    setFormData({
      ...formData,
      legalInfo: {
        ...formData.legalInfo,
        tradeAreas: updatedTradeAreas,
      },
    });
  };

  function isOnlyNumbers(str) {
    return /^\d+$/.test(str);
  }

  const setAuthState = (userData) => {
    // Set is logged in flag
    localStorage.setItem("isLoggedIn", "true");

    // Handle different user types
    if (userData.trainingCenter) {
      // For training center
      localStorage.setItem("userRole", userData.trainingCenter.role);
      localStorage.setItem("userId", userData.trainingCenter._id);
      localStorage.setItem(
        "isFirstTimeUser",
        userData.trainingCenter.agree || false
      );
      localStorage.setItem(
        "trainingCentreName",
        userData.trainingCenter.trainingCentreName
      );
      localStorage.setItem("regNum", userData.trainingCenter.regNum);
    } else if (userData.user) {
      // For artisan and intending artisan
      localStorage.setItem("userRole", userData.user.role);
      localStorage.setItem("userId", userData.user._id);
      localStorage.setItem("isFirstTimeUser", userData.user.agree || false);
      localStorage.setItem("user", JSON.stringify(userData.user));
    }

    // Handle tokens
    if (userData.accessToken) {
      localStorage.setItem(
        "accessToken",
        typeof userData.accessToken === "object"
          ? userData.accessToken.accessToken
          : userData.accessToken
      );
    }

    if (userData.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        typeof userData.refreshToken === "object"
          ? userData.refreshToken.refreshToken
          : userData.refreshToken
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // START VALIDATION
    let errorMsg = "";
    console.log(
      "Form data before submission:",
      JSON.stringify(formData, null, 2)
    );
    // Format the phone number to start with "234" if it starts with "0"
    const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
      ? "234" + formData.phoneNumber.slice(1)
      : formData.phoneNumber;

    // Update the phone number in formData
    formData.phoneNumber = formattedPhoneNumber;

    if (formData.hasDisability && !formData.disabilityType) {
      errorMsg = "Please select a disability type";
    } else if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errorMsg = "Passwords do not match!";
    } else if (formData.password.trim().length < 6) {
      errorMsg = "Password must be at least 6 characters!";
    } else if (!isOnlyNumbers(formData.phoneNumber)) {
      errorMsg = "Phone number must be numeric!";
    } else if (formData.phoneNumber.trim().length !== 13) {
      errorMsg = "Phone number must be 13 digits!";
    } else if (
      signupAs !== "training_center" &&
      (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)
    ) {
      errorMsg = "NIN must be 11 numeric digits!";
    } else if (signupAs !== "training_center" && formData.gender === "") {
      errorMsg = "Please select a gender!";
    }
    // else if (
    //   (signupAs === "artisan_user" ) &&
    //   formData.priorSkillsCerts.length > 0 &&
    //   (!formData.priorSkillsCerts[0].sector ||
    //     !formData.priorSkillsCerts[0].tradeAreas ||
    //     formData.priorSkillsCerts[0].tradeAreas.length === 0 ||
    //     !formData.priorSkillsCerts[0].name ||
    //     !formData.priorSkillsCerts[0].year)
    // )  {
    //   errorMsg = "Sector and at least one Trade Area are required!"
    // }
    // Update the validation check:
    else if (
      signupAs === "artisan_user" &&
      formData.priorSkillsCerts.length === 0
    ) {
      errorMsg = "Please add at least one prior skill or certificate";
    } else if (
      signupAs === "artisan_user" &&
      formData.priorSkillsCerts.length > 0 &&
      (!formData.priorSkillsCerts[0].sector ||
        !formData.priorSkillsCerts[0].tradeAreas ||
        formData.priorSkillsCerts[0].tradeAreas.length === 0 ||
        (formData.priorSkillsCerts[0].hasCertificate &&
          (!formData.priorSkillsCerts[0].name ||
            !formData.priorSkillsCerts[0].year ||
            !formData.priorSkillsCerts[0].priUpload))) // Check if hasCertificate is true)
    ) {
      errorMsg = formData.priorSkillsCerts[0].hasCertificate
        ? "Please complete all certificate details!"
        : "Sector and at least one Trade Area are required!";
    } else if (
      signupAs === "intending_artisan" &&
      (!formData.priorSkillsCerts[0].sector ||
        !formData.priorSkillsCerts[0].tradeAreas)
    ) {
      errorMsg = "Sector and Trade Area are required!"
    } 
    
    // else if (
    //   signupAs === "training_center" &&
    //   (formData.legalInfo.tradeAreas.length === 0 ||
    //     !formData.legalInfo.tradeAreas[0].sector ||
    //     formData.legalInfo.tradeAreas[0].sector.length === 0)
    // ) {
    //   errorMsg = "At least one Sector and Trade Area is required!"
    // }

    // Validate trade areas for training center
    else if (signupAs === "training_center") {
      if (formData.legalInfo.tradeAreas.length === 0) {
        toast.error("Please add at least one trade area");
        return;
      }

      // Validate each trade area
      for (let i = 0; i < formData.legalInfo.tradeAreas.length; i++) {
        const tradeArea = formData.legalInfo.tradeAreas[i];
        
        if (!tradeArea.sector || tradeArea.sector.length === 0) {
          toast.error(`Please select a sector for trade area ${i + 1}`);
          return;
        }
        
        if (!tradeArea.tradeArea || tradeArea.tradeArea.length === 0) {
          toast.error(`Please select at least one trade area for sector ${i + 1}`);
          return;
        }
        
        if (!tradeArea.instructors) {
          toast.error(`Please enter number of instructors for trade area ${i + 1}`);
          return;
        }
        
        if (!tradeArea.trainees) {
          toast.error(`Please enter number of trainees for trade area ${i + 1}`);
          return;
        }
        
        if (!tradeArea.facilities) {
          toast.error(`Please enter facilities for trade area ${i + 1}`);
          return;
        }
        
        if (!tradeArea.equipment) {
          toast.error(`Please enter equipment for trade area ${i + 1}`);
          return;
        }
        
        if (!tradeArea.tools) {
          toast.error(`Please enter tools for trade area ${i + 1}`);
          return;
        }
      }
    }

    if (errorMsg) {
      toast.error(errorMsg, { position: "top-right" });
      setLoading(false);
      return;
    }
    // END VALIDATION

    const endpoint =
      signupAs === "training_center"
        ? `${API_BASE_URL}/training-centers/register`
        : `${API_BASE_URL}/signup`;

    const submissionData = {
      ...formData,
      hasDisability: Boolean(formData.hasDisability), // Ensure it's a boolean
      disabilityType:
        typeof formData.disabilityType === "object"
          ? formData.disabilityType.default || ""
          : formData.disabilityType,
    };

    console.log(
      "Form data before submission:",
      JSON.stringify(submissionData, null, 2)
    );
    // First, log the form data before submission to verify the values
    console.log("Form data before submission:", {
      ...formData,
      senatorialDistrict: formData.senatorialDistrict, // verify this exists
    });
    const payload =
      signupAs === "training_center"
        ? {
            trainingCentreName: submissionData.trainingCentreName,
            regNum: submissionData.regNum,
            email: submissionData.email,
            phoneNumber: submissionData.phoneNumber,
            password: submissionData.password,
            confirm_password: submissionData.confirmPassword,
            state: submissionData.state,
            lga: submissionData.lga,
            address: submissionData.address,
            sector: submissionData.sector,
            tradeArea: submissionData.tradeArea,
            legalInfo: submissionData.legalInfo,
            agree: false,
            role: signupAs,
          }
        : {
            firstName: submissionData.firstName,
            middleName: submissionData.middleName, // Added middleName
            lastName: submissionData.lastName,
            stateOfResidence: submissionData.stateOfResidence,
            lgaOfResidence: submissionData.lgaOfResidence,
            senatorialDistrict: submissionData.senatorialDistrict,
            stateOfOrigin: submissionData.stateOfOrigin,
            lga: submissionData.lga,
            street: submissionData.street,
            gender: submissionData.gender, // Add gender here
            maritalStatus: submissionData.maritalStatus, // Add maritalStatus
            dob: submissionData.dateOfBirth, // Use dateOfBirth from NIN data
            hasDisability: submissionData.hasDisability, // Add hasDisability
            disabilityType: submissionData.disabilityType, // Add disabilityType
            priorSkillsCerts: submissionData.priorSkillsCerts.map((cert) => ({
              sector: cert.sector,
              tradeArea: cert.tradeAreas || [],
              name: cert.name || "",
              year: cert.year || "",
              priUpload: cert.priUpload || "",
              hasCertificate: cert.hasCertificate || false,
            })),
            role: signupAs,
            nin: submissionData.nin,
            email: submissionData.email,
            phoneNumber: submissionData.phoneNumber,
            password: submissionData.password,
            profileImage: submissionData.profileImage,
            confirm_password: submissionData.confirmPassword,
            agree: false,
          };
    // Prepare the payload with the correct structure for legalInfo.tradeAreas
    // const payload =
    //   signupAs === "training_center"
    //     ? {
    //         trainingCentreName: formData.trainingCentreName,
    //         regNum: formData.regNum,
    //         email: formData.email,
    //         phoneNumber: formData.phoneNumber,
    //         password: formData.password,
    //         confirm_password: formData.confirmPassword,
    //         state: formData.state,
    //         lga: formData.lga,
    //         address: formData.address,
    //         sector: formData.sector,
    //         tradeArea: formData.tradeArea,
    //         legalInfo: formData.legalInfo,
    //         agree: false,
    //         role: signupAs,
    //       }
    //     : {
    //         firstName: formData.firstName,
    //         //middleName: formData.middleName,
    //         lastName: formData.lastName,
    //         stateOfResidence: formData.stateOfResidence,
    //         lgaOfResidence: formData.lgaOfResidence,
    //         senatorialDistrict: formData.senatorialDistrict,
    //         stateOfOrigin: formData.stateOfOrigin,
    //         lga: formData.lga,
    //         street: formData.street,
    //         gender: formData.gender, // Add gender here
    //         maritalStatus: formData.maritalStatus, // Add maritalStatus
    //         dob: formData.dob, // Add dob
    //         hasDisability: formData.hasDisability, // Add hasDisability
    //         disabilityType: formData.disabilityType, // Add disabilityType
    //         priorSkillsCerts: formData.priorSkillsCerts.map((cert) => ({
    //           sector: cert.sector,
    //           tradeArea: cert.tradeArea,
    //         })),
    //         role: signupAs,
    //         nin: formData.nin,
    //         email: formData.email,
    //         phoneNumber: formData.phoneNumber,
    //         password: formData.password,
    //         confirm_password: formData.confirmPassword,
    //         agree: false,
    //       }

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json"
        },
      });

      console.log("Response:", response.data); // Debugging log

      if (response.data.success) {
        // Set authentication state\
        setAuthState(response.data.data);

        // Success toast
        toast.success("Signup successful 🚀!", {
          description: "Login Successfully",
          position: "top-right",
          duration: 2000,
        });

        // Redirect based on role
        setTimeout(() => {
          const role = response.data.data.trainingCenter
            ? response.data.data.trainingCenter.role
            : response.data.data.user.role;

          switch (role) {
            case "artisan_user":
              navigate("/register/artisan");
              break;
            case "intending_artisan":
              navigate("/register/intendingArtisan");
              break;
            case "training_center":
              navigate("/register/trainingcenter");
              break;
            default:
              navigate("/dashboard");
          }
        }, 2000);
      } else {
        toast.error(`Signup failed: ${response.data.message}`, {
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Signup error:", error); // Debugging log
      const message = "Error!";
      const description =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : error?.response?.data?.message ||
            "An error occurred. Please try again.";
      setError("Error signing up. Please try again.");
      toast.error(message, {
        description,
        position: "top-right",
        style: { textAlign: "left" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStateOfOriginChange = (stateName) => {
    setFormData({ ...formData, stateOfOrigin: stateName, lga: "" });
    const selectedState = states.find((state) => state.value === stateName);
    setLgasOfOrigin(selectedState ? selectedState.lgas : []);
  };

  // Update the handleStateOfResidenceChange function to also set senatorial districts
  const handleStateOfResidenceChange = (stateName) => {
    setFormData({
      ...formData,
      stateOfResidence: stateName,
      lgaOfResidence: "",
      senatorialDistrict: "",
    });
    const selectedState = states.find((state) => state.value === stateName);
    setLgas(selectedState ? selectedState.lgas : []);
    setSenatorialDistricts(
      selectedState ? selectedState.senatorialDistricts || [] : []
    );
  };

  return (
    <PageLayout>
      {/* <section className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4"> */}
      {/* <div className="min-h-screen bg-gradient-to-br from-slate-850 to-slate-900 flex items-center justify-center p-4"> */}
        <div className="flex min-h-screen items-start bg-slate-900 justify-center pt-24 pb-24">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Join our platform and start your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={signupAs} onValueChange={setRole} className="w-full">
                <TabsList
                  className={`grid w-full grid-cols-3 mb-6 ${
                    isMobile ? "h-auto" : "h-12"
                  }`}>
                  <TabsTrigger
                    value="artisan_user"
                    className={`${
                      isMobile
                        ? "text-xs py-2 px-1"
                        : "text-sm font-medium py-2 px-4"
                    } ${
                      signupAs === "artisan_user"
                        ? "bg-emerald-800 text-white"
                        : "bg-gray-100 text-gray-700"
                    } transition-all duration-200 hover:bg-emerald-700 hover:text-white`}>
                    {isMobile ? "Artisan" : "Artisan User"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="intending_artisan"
                    className={`${
                      isMobile
                        ? "text-xs py-2 px-1"
                        : "text-sm font-medium py-2 px-4"
                    } ${
                      signupAs === "intending_artisan"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    } transition-all duration-200 hover:bg-red-500 hover:text-white`}>
                    {isMobile ? "Intending" : "Intending Artisan"}
                  </TabsTrigger>
                  <TabsTrigger
                    value="training_center"
                    className={`${
                      isMobile
                        ? "text-xs py-2 px-1"
                        : "text-sm font-medium py-2 px-4"
                    } ${
                      signupAs === "training_center"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    } transition-all duration-200 hover:bg-blue-500 hover:text-white`}>
                    {isMobile ? "Training" : "Training Center"}
                  </TabsTrigger>
                </TabsList>

                {/* Artisan User Form */}
                <TabsContent value="artisan_user">
                  {ninVerificationStep === 1 ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          NIN Verification Required
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Please enter your National Identification Number (NIN) to verify your identity and auto-populate your basic information.
                        </p>
                      </div>
                      
                      <div className="max-w-md mx-auto space-y-4">
                        <LabelInput
                          name="nin"
                          label="National Identification Number (NIN)"
                          type="tel"
                          pattern="\d{11}"
                          value={formData.nin}
                          onChange={handleChange}
                          placeholder="12345678953"
                          required={true}
                        />
                        
                        {ninError && (
                          <div className="text-red-600 text-sm text-center">{ninError}</div>
                        )}
                        
                        <Button 
                          type="button" 
                          onClick={handleNinVerification}
                          disabled={ninVerifying || !formData.nin || formData.nin.length !== 11}
                          className="w-full bg-emerald-800 hover:bg-emerald-700"
                        >
                          {ninVerifying ? <Spinner /> : "Verify NIN"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-800">NIN Verified Successfully</p>
                              <p className="text-xs text-green-600">Your basic information has been auto-populated</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetNinVerification}
                            className="text-xs bg-transparent"
                          >
                            Change NIN
                          </Button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload("profileImage", e.target.files[0])}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={formData.profileImage || "/default-profile.png"}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-emerald-800 shadow"
                          />
                           
                          <UploadButton
                            fileUrl={formData?.profileImage}
                            handleFileChange={(url) => {
                              setFormData((old) => ({ ...old, profileImage: url }));
                              setProfileImageError("");
                              if (typeof updateProfilePicture === "function") updateProfilePicture(url);
                            }}
                            removeFile={() => {
                              setFormData((old) => ({ ...old, profileImage: "" }));
                              setProfileImageError("Profile image is required.");
                              if (typeof updateProfilePicture === "function") updateProfilePicture("");
                            }}
                            className="w-10 h-8 text-sm"
                          />
                          <Label htmlFor="profile-image-upload" className="text-xl mb-2">
                           <span className="text-red-600">*</span>
                        </Label>
                        </div>
                        {profileImageError && (
                          <div className="text-red-600 text-sm mt-1">{profileImageError}</div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInput
                          name="email"
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="abc@email.com"
                          required={true}
                        />

                        <LabelInput
                          name="phoneNumber"
                          label="Phone Number"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="2347012345643"
                          required={true}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <LabelInput
                          name="firstName"
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          required={true}
                          disabled={!!ninData} // Disable if populated from NIN
                        />
                        <LabelInput
                          name="middleName"
                          label="Middle Name"
                          value={formData.middleName}
                          onChange={handleChange}
                          placeholder="David"
                          disabled={!!ninData} // Disable if populated from NIN
                        />
                        <LabelInput
                          name="lastName"
                          label="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Smith"
                          required={true}
                          disabled={!!ninData} // Disable if populated from NIN
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <LabelInput
                          name="nin"
                          label="National ID"
                          type="tel"
                          pattern="\d{11}"
                          value={formData.nin}
                          onChange={handleChange}
                          placeholder="12345678953"
                          required={true}
                          disabled={true} // Always disabled after verification
                        />

                        <div className="">
                          <Label
                            htmlFor="gender"
                            className="text-left text-xs text-gray-600">
                            Gender{" "}
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.gender}
                            onValueChange={(value) =>
                              setFormData({ ...formData, gender: value })
                            }
                            required={formData.gender}
                            disabled={!!ninData} // Disable if populated from NIN
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="maritalStatus"
                            className="text-left text-xs text-gray-600">
                            Marital Status{" "}
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.maritalStatus}
                            onValueChange={(value) =>
                              setFormData({ ...formData, maritalStatus: value })
                            }>
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

                        <div className="space-y-2">
                          <Label
                            htmlFor="dateOfBirth"
                            className="text-left text-xs text-gray-600">
                            Date of Birth{" "}
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className="w-full"
                            required
                            max={get18YearsAgoDate()}
                            disabled={!!ninData} // Disable if populated from NIN
                          />
                        </div>
                      </div>

                      {/* ... existing disability fields ... */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="hasDisability"
                            className="text-left text-xs text-gray-600">
                            Do you have a disability?
                          </Label>
                          <input
                            type="checkbox"
                            id="hasDisability"
                            name="hasDisability"
                            checked={formData.hasDisability}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                hasDisability: e.target.checked,
                                disabilityType: e.target.checked
                                  ? formData.disabilityType
                                  : "",
                              });
                            }}
                            className="w-4 h-4"
                          />
                        </div>

                        {formData.hasDisability && (
                          <div className="space-y-2">
                            <Label
                              htmlFor="disabilityType"
                              className="text-left text-xs text-gray-600">
                              Type of Disability
                            </Label>
                            <Select
                              value={formData.disabilityType}
                              onValueChange={(value) =>
                                setFormData({
                                  ...formData,
                                  disabilityType: value,
                                })
                              }>
                              <SelectTrigger>
                                <SelectValue placeholder="Select disability type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="visual">Visual</SelectItem>
                                  <SelectItem value="hearing">Hearing</SelectItem>
                                  <SelectItem value="mobility">
                                    Mobility
                                  </SelectItem>
                                  <SelectItem value="cognitive">
                                    Cognitive
                                  </SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* ... existing residence fields ... */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="stateOfResidence"
                            className="text-left text-xs text-gray-600">
                            State of Residence
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.stateOfResidence}
                            onValueChange={(value) => {
                              setFormData({
                                ...formData,
                                stateOfResidence: value,
                                lgaOfResidence: "",
                              });
                              const selectedState = states.find(
                                (state) => state.value === value
                              );
                              setLgas(selectedState ? selectedState.lgas : []);
                              setSenatorialDistricts(
                                selectedState
                                  ? selectedState.senatorialDistricts || []
                                  : []
                              );
                            }}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {states.map((state) => (
                                  <SelectItem
                                    key={state.value}
                                    value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lgaOfResidence"
                            className="text-left text-xs text-gray-600">
                            LGA of Residence
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.lgaOfResidence}
                            onValueChange={(value) =>
                              setFormData({ ...formData, lgaOfResidence: value })
                            }
                            disabled={!lgas.length}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select LGA" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {lgas.map((lga) => (
                                  <SelectItem key={lga} value={lga}>
                                    {lga}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Senatorial District */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="senatorialDistrict"
                            className="text-left text-xs text-gray-600">
                            Senatorial District
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.senatorialDistrict}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                senatorialDistrict: value,
                              })
                            }
                            disabled={!senatorialDistricts.length}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select senatorial district" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {senatorialDistricts.map((district) => (
                                  <SelectItem key={district} value={district}>
                                    {district}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <LabelInput
                          name="street"
                          label="Official Address"
                          type="text"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="No 1, House Street, house City"
                          required={true}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="stateOfOrigin"
                            className="text-left text-xs text-gray-600">
                            State of Origin
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.stateOfOrigin}
                            onValueChange={(value) => {
                              setFormData({
                                ...formData,
                                stateOfOrigin: value,
                                lga: "",
                              });
                              const selectedState = states.find(
                                (state) => state.value === value
                              );
                              setLgasOfOrigin(
                                selectedState ? selectedState.lgas : []
                              );
                            }}
                            disabled={!!ninData} // Disable if populated from NIN
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {states.map((state) => (
                                  <SelectItem
                                    key={state.value}
                                    value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lga"
                            className="text-left text-xs text-gray-600">
                            LGA of Origin
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Select
                            value={formData.lga}
                            onValueChange={(value) =>
                              setFormData({ ...formData, lga: value })
                            }
                            disabled={!lgasOfOrigin.length || !!ninData} // Disable if populated from NIN
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select LGA" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {lgasOfOrigin.map((lga) => (
                                  <SelectItem key={lga} value={lga}>
                                    {lga}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Prior Skills Certificates */}

                      <div className="space-y-4">
                        {/* Header with Label and Add Button */}
                        <div className="flex justify-between items-center">
                          <Label className="text-left text-xs text-gray-600">
                            Prior Skills/Certificates{" "}
                            <span className="text-red-600 ml-[4px] text-[13px]">
                              *
                            </span>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addPriorSkillsCert}
                            className="flex items-center gap-1 bg-transparent">
                            <Plus className="h-4 w-4" /> Add Skill
                          </Button>
                        </div>

                        {/* Skills List or Empty State */}
                        {formData.priorSkillsCerts.length > 0 ? (
                          formData.priorSkillsCerts.map((cert, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-4 p-4 border rounded-md relative">
                              {/* Delete Button */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removePriorSkillsCert(index)}
                                className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              {/* Sector and Trade Areas */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Sector Selection */}
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`cert-sector-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Sector{" "}
                                    <span className="text-red-600 ml-[4px] text-[13px]">
                                      *
                                    </span>
                                  </Label>
                                  <Select
                                    value={cert.sector}
                                    onValueChange={(value) =>
                                      handlePriorSkillsCertChange(
                                        index,
                                        "sector",
                                        value
                                      )
                                    }
                                    disabled={sectorLoading}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select sector" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {sectors?.map((sector) => (
                                          <SelectItem
                                            key={sector._id}
                                            value={sector.name}>
                                            {sector.name}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Trade Areas (Multi-Select) */}
                                <div className="space-y-4">
                                  <Label
                                    htmlFor={`cert-tradeArea-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Trade Areas (Select Multiple){" "}
                                    <span className="text-red-600 ml-[4px] text-[13px]">
                                      *
                                    </span>
                                  </Label>
                                  <div className="flex flex-col gap-2">
                                    {/* Selected Trade Areas */}
                                    {cert.tradeAreas &&
                                      cert.tradeAreas.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {cert.tradeAreas.map(
                                            (taName, taIndex) => (
                                              <div
                                                key={taIndex}
                                                className="flex items-center bg-blue-100 px-2 py-1 rounded-md">
                                                <span className="text-sm">
                                                  {taName}
                                                </span>
                                                <button
                                                  type="button"
                                                  className="ml-2 text-red-500"
                                                  onClick={() => {
                                                    const updatedPriorSkillsCerts =
                                                      [
                                                        ...formData.priorSkillsCerts,
                                                      ];
                                                    updatedPriorSkillsCerts[
                                                      index
                                                    ] = {
                                                      ...updatedPriorSkillsCerts[
                                                        index
                                                      ],
                                                      tradeAreas:
                                                        updatedPriorSkillsCerts[
                                                          index
                                                        ].tradeAreas.filter(
                                                          (name) =>
                                                            name !== taName
                                                        ),
                                                    };
                                                    setFormData({
                                                      ...formData,
                                                      priorSkillsCerts:
                                                        updatedPriorSkillsCerts,
                                                    });
                                                  }}>
                                                  ×
                                                </button>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}

                                    {/* Trade Area Dropdown */}
                                    <Select
                                      onValueChange={(value) =>
                                        handlePriorSkillsCertChange(
                                          index,
                                          "tradeArea",
                                          value
                                        )
                                      }
                                      disabled={!cert.sector}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Add trade area" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {sectors
                                            ?.find(
                                              (sector) =>
                                                sector.name === cert.sector
                                            )
                                            ?.tradeAreas?.filter(
                                              (ta) =>
                                                !cert.tradeAreas?.includes(
                                                  ta.name
                                                )
                                            )
                                            .map((ta) => (
                                              <SelectItem
                                                key={ta._id}
                                                value={ta.name}>
                                                {ta.name}
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              {/* Has Certificate Checkbox */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`has-certificate-${index}`}
                                      checked={cert.hasCertificate || false}
                                      onChange={(e) => {
                                        const updatedPriorSkillsCerts = [
                                          ...formData.priorSkillsCerts,
                                        ];
                                        updatedPriorSkillsCerts[index] = {
                                          ...updatedPriorSkillsCerts[index],
                                          hasCertificate: e.target.checked,
                                          // Reset certificate fields if unchecked
                                          name: e.target.checked ? cert.name : "",
                                          year: e.target.checked ? cert.year : "",
                                        };
                                        setFormData({
                                          ...formData,
                                          priorSkillsCerts:
                                            updatedPriorSkillsCerts,
                                        });
                                      }}
                                      className="w-4 h-4"
                                    />
                                    <Label
                                      htmlFor={`has-certificate-${index}`}
                                      className="text-left text-xs text-gray-600">
                                      I have a certificate for this skill
                                    </Label>
                                  </div>
                                </div>
                              </div>

                              {/* Certificate Details (conditionally shown) */}
                              {cert.hasCertificate && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Certificate Name */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`cert-name-${index}`}
                                        className="text-left text-xs text-gray-600">
                                        Certificate Name
                                      </Label>
                                      <Input
                                        id={`cert-name-${index}`}
                                        value={cert.name || ""}
                                        onChange={(e) =>
                                          handlePriorSkillsCertChange(
                                            index,
                                            "name",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter certificate name"
                                        className="w-full"
                                      />
                                    </div>

                                    {/* Year Obtained */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`cert-year-${index}`}
                                        className="text-left text-xs text-gray-600">
                                        Year Obtained
                                      </Label>
                                      <Input
                                        id={`cert-year-${index}`}
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear()}
                                        value={cert.year || ""}
                                        onChange={(e) =>
                                          handlePriorSkillsCertChange(
                                            index,
                                            "year",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Enter year"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>

                                  {/* Certificate Upload */}
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor={`cert-upload-${index}`}
                                      className="text-left text-xs text-gray-600">
                                      Upload Certificate
                                    </Label>
                                    <UploadButton
                                      fileUrl={cert.priUpload}
                                      title={`certificate-${index}`}
                                      handleFileChange={(newFileUrl) => {
                                        const updatedPriorSkillsCerts = [
                                          ...formData.priorSkillsCerts,
                                        ];
                                        updatedPriorSkillsCerts[index] = {
                                          ...updatedPriorSkillsCerts[index],
                                          priUpload: newFileUrl,
                                        };
                                        setFormData({
                                          ...formData,
                                          priorSkillsCerts:
                                            updatedPriorSkillsCerts,
                                        });
                                      }}
                                      accept=".jpg, .png, .jpeg, .pdf"
                                      removeFile={() => {
                                        const updatedPriorSkillsCerts = [
                                          ...formData.priorSkillsCerts,
                                        ];
                                        updatedPriorSkillsCerts[index] = {
                                          ...updatedPriorSkillsCerts[index],
                                          priUpload: null,
                                        };
                                        setFormData({
                                          ...formData,
                                          priorSkillsCerts:
                                            updatedPriorSkillsCerts,
                                        });
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm italic">
                            No prior skills added. Click "Add Skill" to add your
                            previous skills or certifications.
                          </div>
                        )}
                      </div>

                      <PasswordFields
                        formData={formData}
                        onChange={handleChange}
                        required
                      />
                      <Button type="submit" className="w-full bg-emerald-800">
                        {loading ? <Spinner /> : "Sign Up"}
                      </Button>
                    </form>
                  )}
                </TabsContent>

                {/* Intending Artisan Form */}
                <TabsContent value="intending_artisan">
                  {ninVerificationStep === 1 ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          NIN Verification Required
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                          Please enter your National Identification Number (NIN) to verify your identity and auto-populate your basic information.
                        </p>
                      </div>
                      
                      <div className="max-w-md mx-auto space-y-4">
                        <LabelInput
                          name="nin"
                          label="National Identification Number (NIN)"
                          type="tel"
                          pattern="\d{11}"
                          value={formData.nin}
                          onChange={handleChange}
                          placeholder="12345678953"
                          required={true}
                        />
                        
                        {ninError && (
                          <div className="text-red-600 text-sm text-center">{ninError}</div>
                        )}
                        
                        <Button 
                          type="button" 
                          onClick={handleNinVerification}
                          disabled={ninVerifying || !formData.nin || formData.nin.length !== 11}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          {ninVerifying ? <Spinner /> : "Verify NIN"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-800">NIN Verified Successfully</p>
                              <p className="text-xs text-green-600">Your basic information has been auto-populated</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetNinVerification}
                            className="text-xs bg-transparent"
                          >
                            Change NIN
                          </Button>
                        </div>
                      </div>

                      {/* ... existing intending artisan form fields with similar modifications ... */}
                      
                      <PasswordFields
                        formData={formData}
                        onChange={handleChange}
                        required
                      />
                      <Button type="submit" className="w-full bg-red-600">
                        {loading ? <Spinner /> : "Sign Up"}
                      </Button>
                    </form>
                  )}
                </TabsContent>

                {/* Training Center Form */}
                <TabsContent value="training_center">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div>
                        <LabelInput
                          name="trainingCentreName"
                          label="Company Name"
                          value={formData.trainingCentreName}
                          onChange={handleChange}
                          placeholder="Company Name here"
                          required
                        />
                      </div>
                      <div>
                        <LabelInput
                          name="regNum"
                          label="Reg Number"
                          type="text"
                          value={formData.regNum}
                          onChange={handleChange}
                          placeholder="RC-123456"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <LabelInput
                        name="email"
                        label="Company Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="company@email.com"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <LabelInput
                        name="phoneNumber"
                        label="Company Phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="2347012345643"
                        required
                      />
                    </div>

                    {/* Second Row: State and LGA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2">
                        <Label
                          htmlFor="state"
                          className="text-left text-xs text-gray-600">
                          State
                          <span className="text-red-600 ml-[4px] text-[13px]">
                            *
                          </span>
                        </Label>
                        <Select
                          value={formData.state}
                          onValueChange={handleStateChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {states.map((state) => (
                                <SelectItem
                                  key={state.value}
                                  value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="lga"
                          className="text-left text-xs text-gray-600">
                          LGA
                          <span className="text-red-600 ml-[4px] text-[13px]">
                            *
                          </span>
                        </Label>
                        <Select
                          value={formData.lga}
                          onValueChange={(value) => {
                            console.log("Selected LGA:", value); // Debugging step
                            setFormData({ ...formData, lga: value });
                          }}
                          disabled={!lgas.length}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LGA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {lgas.map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                  {lga}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Address (below State and LGA) */}
                    <div>
                      <LabelInput
                        name="address"
                        label="Company Address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="No 1, Company Street, Company City"
                      />
                    </div>

                    {/* Multiple Trade Areas with Sectors */}
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-left text-xs text-gray-600">
                          Sectors & Trade Areas
                          <span className="text-red-600 ml-[4px] text-[13px]">
                            *
                          </span>
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTradeArea}
                          className="flex items-center gap-1 bg-transparent">
                          <Plus className="h-4 w-4" /> Add Trade Area
                        </Button>
                      </div>

                      {formData.legalInfo.tradeAreas.length > 0 ? (
                        formData.legalInfo.tradeAreas.map(
                          (tradeAreaItem, index) => (
                            <div
                              key={index}
                              className="grid grid-cols-1 gap-4 p-4 border rounded-md relative">
                              {index > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTradeArea(index)}
                                  className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`sector-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Sector
                                  </Label>
                                  <Select
                                    value={
                                      sectors?.find(
                                        (sector) =>
                                          sector._id === tradeAreaItem.sector[0]
                                      )?.name || ""
                                    }
                                    onValueChange={(value) =>
                                      handleTradeAreaSectorChange(index, value)
                                    }
                                    disabled={sectorLoading}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select sector" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        {sectors?.map((sector) => (
                                          <SelectItem
                                            key={sector._id}
                                            value={sector.name}>
                                            {sector.name}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`tradeArea-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Trade Areas (Select Multiple)
                                  </Label>
                                  <div className="flex flex-col gap-2">
                                    {/* Display selected trade areas */}
                                    {tradeAreaItem.tradeArea &&
                                      tradeAreaItem.tradeArea.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-2">
                                          {tradeAreaItem.tradeArea.map(
                                            (taId, taIndex) => {
                                              const taName = sectors
                                                ?.find(
                                                  (sector) =>
                                                    sector._id ===
                                                    tradeAreaItem.sector[0]
                                                )
                                                ?.tradeAreas?.find(
                                                  (ta) => ta._id === taId
                                                )?.name;

                                              return taName ? (
                                                <div
                                                  key={taId}
                                                  className="flex items-center bg-blue-100 px-2 py-1 rounded-md">
                                                  <span className="text-sm">
                                                    {taName}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    className="ml-2 text-red-500"
                                                    onClick={() => {
                                                      // Remove this trade area
                                                      const updatedTradeAreas =
                                                        [
                                                          ...formData.legalInfo
                                                            .tradeAreas,
                                                        ];
                                                      updatedTradeAreas[index] =
                                                        {
                                                          ...updatedTradeAreas[
                                                            index
                                                          ],
                                                          tradeArea:
                                                            updatedTradeAreas[
                                                              index
                                                            ].tradeArea.filter(
                                                              (id) =>
                                                                id !== taId
                                                            ),
                                                        };

                                                      setFormData({
                                                        ...formData,
                                                        legalInfo: {
                                                          ...formData.legalInfo,
                                                          tradeAreas:
                                                            updatedTradeAreas,
                                                        },
                                                      });
                                                    }}>
                                                    ×
                                                  </button>
                                                </div>
                                              ) : null;
                                            }
                                          )}
                                        </div>
                                      )}

                                    {/* Trade area selector */}
                                    <Select
                                      onValueChange={(value) =>
                                        handleTradeAreaMultipleChange(
                                          index,
                                          value
                                        )
                                      }
                                      disabled={!tradeAreaItem.sector.length}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Add trade area" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {sectors
                                            ?.find(
                                              (sector) =>
                                                sector._id ===
                                                tradeAreaItem.sector[0]
                                            )
                                            ?.tradeAreas?.filter(
                                              (ta) =>
                                                !tradeAreaItem.tradeArea?.includes(
                                                  ta._id
                                                )
                                            )
                                            .map((ta) => (
                                              <SelectItem
                                                key={ta._id}
                                                value={ta.name}>
                                                {ta.name}
                                              </SelectItem>
                                            ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>

                              {/* Additional fields for each trade area */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`instructors-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Instructors
                                  </Label>
                                  <Input
                                    id={`instructors-${index}`}
                                    value={tradeAreaItem.instructors}
                                    onChange={(e) =>
                                      handleTradeAreaFieldChange(
                                        index,
                                        "instructors",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Number of instructors"
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`trainees-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Trainees
                                  </Label>
                                  <Input
                                    id={`trainees-${index}`}
                                    value={tradeAreaItem.trainees}
                                    onChange={(e) =>
                                      handleTradeAreaFieldChange(
                                        index,
                                        "trainees",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Number of trainees"
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`facilities-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Facilities
                                  </Label>
                                  <Input
                                    id={`facilities-${index}`}
                                    value={tradeAreaItem.facilities}
                                    onChange={(e) =>
                                      handleTradeAreaFieldChange(
                                        index,
                                        "facilities",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Available facilities"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`equipment-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Equipment
                                  </Label>
                                  <Input
                                    id={`equipment-${index}`}
                                    value={tradeAreaItem.equipment}
                                    onChange={(e) =>
                                      handleTradeAreaFieldChange(
                                        index,
                                        "equipment",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Available equipment"
                                    className="w-full"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor={`tools-${index}`}
                                    className="text-left text-xs text-gray-600">
                                    Tools
                                  </Label>
                                  <Input
                                    id={`tools-${index}`}
                                    value={tradeAreaItem.tools}
                                    onChange={(e) =>
                                      handleTradeAreaFieldChange(
                                        index,
                                        "tools",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Available tools"
                                    className="w-full"
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                          <div className="text-center py-4 text-gray-500 text-sm italic">
                            No trade areas added. Click "Add Trade Area" to add
                            sectors and trade areas.
                          </div>
                        )}
                      </div>

                    {/* Password Fields */}
                    <PasswordFields
                      formData={formData}
                      onChange={handleChange}
                    />

                    {/* Submit Button */}
                    <Button type="submit" className="w-full bg-blue-600">
                      {loading ? <Spinner /> : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              <div className="mt-4 text-center text-sm">
                Already have an account?-
                <Link to="/login" className=" text-emerald-900 hover:underline">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    {/* </section> */}
    </PageLayout>
  );
}

// Input field with label component
const LabelInput = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) => (
  <div className="space-y-2">
    <div className="w-full flex ">
      <div htmlFor={name} className="text-left text-xs text-gray-600">
        {label}
        {required ? (
          <span className="text-red-600 ml-[4px] text-[13px]">*</span>
        ) : undefined}
      </div>
    </div>

    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full"
    />
  </div>
);

// Password fields component
const PasswordFields = ({ formData, onChange, required }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <div className="w-full flex">
        <div htmlFor={"password"} className="text-left text-xs text-gray-600">
          New Password
          {required ? (
            <span className="text-red-600 ml-[4px] text-[13px]">*</span>
          ) : undefined}
        </div>
      </div>
      <Input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onChange}
        placeholder="************"
        required
        className="w-full"
      />
    </div>
    <div className="space-y-2">
      <div className="w-full flex">
        <div
          htmlFor={"confirmPassword"}
          className="text-left text-xs text-gray-600">
          Confirm New Password
          {required ? (
            <span className="text-red-600 ml-[4px] text-[13px]">*</span>
          ) : undefined}
        </div>
      </div>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={onChange}
        placeholder="************"
        required
        className="w-full"
      />
    </div>
  </div>
);

function get18YearsAgoDate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 10);
  return today.toISOString().split("T")[0];
}
