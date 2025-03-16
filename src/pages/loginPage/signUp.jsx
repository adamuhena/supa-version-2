// "use client"

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

// export default function SignupForm() {
//   const location = useLocation()
//   const initialTab = location.state?.tab || "artisan_user"
//   const [signupAs, setRole] = useState(initialTab)
//   const [sectors, setSectors] = useState([])
//   const [sectorLoading, setSectorLoading] = useState(true)
//   const [sectorError, setSectorError] = useState(null)
//   const [formData, setFormData] = useState({
//     nin: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     trainingCentreName: "",
//     regNum: "",
//     state: "",
//     lga: "",
//     legalInfo: {
//       tradeAreas: [
//         {
//           sector: "",
//           tradeArea: "",
//         },
//       ],
//     },
//   });
//     // sector: "",
//     // tradeArea: "",
  
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const navigate = useNavigate()
//   const [lgas, setLgas] = useState([])

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

//   const handleSectorChange = (sectorName) => {
//     setFormData({ ...formData, sector: sectorName, tradeArea: "" })
//   }

//   const handleRoleChange = (newRole) => {
//     setRole(newRole)
//     setFormData({
//       nin: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//       trainingCentreName: "",
//       regNum: "",
//       state: "",
//       lga: "",
//       sector: "",
//       tradeArea: "",
//       legalInfo: {
//         tradeAreas: [
//           {
//             sector: "",
//             tradeArea: "",
//           },
//         ],
//       },
//     });
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

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault()
//   //   setLoading(true)
//   //   setError(null)

//   //   // START VALIDATION
//   //   let errorMsg = ""

//   //   // Format the phone number to start with "234" if it starts with "0"
//   //   const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
//   //     ? "234" + formData.phoneNumber.slice(1)
//   //     : formData.phoneNumber

//   //   // Update the phone number in formData
//   //   formData.phoneNumber = formattedPhoneNumber

//   //   if (formData.password.trim() !== formData.confirmPassword.trim()) {
//   //     errorMsg = "Passwords do not match!"
//   //   } else if (formData.password.trim().length < 6) {
//   //     errorMsg = "Password must be at least 6 characters!"
//   //   } else if (!isOnlyNumbers(formData.phoneNumber)) {
//   //     errorMsg = "Phone number must be numeric!"
//   //   } else if (formData.phoneNumber.trim().length !== 13) {
//   //     errorMsg = "Phone number must be 13 digits!"
//   //   } else if (signupAs !== "training_center" && (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)) {
//   //     errorMsg = "NIN must be 11 numeric digits!"
//   //   }

//   //   if (errorMsg) {
//   //     toast.error(errorMsg, { position: "top-right" })
//   //     setLoading(false)
//   //     return
//   //   }
//   //   // END VALIDATION

//   //   const endpoint =
//   //     signupAs === "training_center" ? `${API_BASE_URL}/training-centers/register` : `${API_BASE_URL}/signup`

//   //   const payload =
//   //     signupAs === "training_center"
//   //       ? {
//   //           trainingCentreName: formData.trainingCentreName,
//   //           regNum: formData.regNum,
//   //           email: formData.email,
//   //           phoneNumber: formData.phoneNumber,
//   //           password: formData.password,
//   //           confirm_password: formData.confirmPassword,
//   //           state: formData.state,
//   //           lga: formData.lga,
//   //           // Now adding the legalInfo block (reflecting your backend schema)
//   //       // legalInfo: {
//   //       //   tradeAreas: [
//   //       //     {
//   //       //       // You might be sending ObjectId of sector from the frontend if you fetched them from the DB
//   //       //       sector: formData.legalInfo.tradeAreas.sector && formData.legalInfo.tradeAreas.sector.length > 0 
//   //       //     ? formData.legalInfo.tradeAreas.sector.map(sectorId => sectorId) // Ensure this is an array of ObjectId
//   //       //     : [], // Default to an empty array if no sector is selected
//   //       //   tradeArea: formData.legalInfo.tradeAreas.tradeArea || "",
//   //       //     }
//   //       //   ],
//   //       // },
//   //       //     sector: formData.sector,
//   //       //     tradeArea: formData.tradeArea,
//   //       legalInfo: {
//   //         tradeAreas: [
//   //           {
//   //             sector: formData._id || "", // Ensure this is the selected sector
//   //             tradeArea: formData._id || "", // Ensure this is the selected trade area
//   //           }
//   //         ],
//   //       },
//   //           agree: false,
//   //           role: signupAs,
//   //         }
//   //       : {
//   //           role: signupAs,
//   //           nin: formData.nin,
//   //           email: formData.email,
//   //           phoneNumber: formData.phoneNumber,
//   //           password: formData.password,
//   //           confirm_password: formData.confirmPassword,
//   //           agree: false,
//   //         }

//   //   try {
//   //     const response = await axios.post(endpoint, payload, {
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //     })

//   //     console.log("Response:", response.data) // Debugging log

//   //     if (response.data.success) {
//   //       // Set authentication state
//   //       setAuthState(response.data.data)

//   //       // Success toast
//   //       toast.success("Signup successful 🚀!", {
//   //         description: "Login Successfully",
//   //         position: "top-right",
//   //         duration: 2000,
//   //       })

//   //       // Redirect based on role
//   //       setTimeout(() => {
//   //         const role = response.data.data.trainingCenter
//   //           ? response.data.data.trainingCenter.role
//   //           : response.data.data.user.role

//   //         switch (role) {
//   //           case "artisan_user":
//   //             navigate("/register/artisan")
//   //             break
//   //           case "intending_artisan":
//   //             navigate("/register/intendingArtisan")
//   //             break
//   //           case "training_center":
//   //             navigate("/register/trainingcenter")
//   //             break
//   //           default:
//   //             navigate("/dashboard")
//   //         }
//   //       }, 2000)
//   //     } else {
//   //       toast.error(`Signup failed: ${response.data.message}`, {
//   //         duration: 2000,
//   //       })
//   //     }
//   //   } catch (error) {
//   //     console.error("Signup error:", error) // Debugging log
//   //     const message = "Error!"
//   //     const description =
//   //       typeof error?.response?.data === "string"
//   //         ? error?.response?.data
//   //         : error?.response?.data?.message || "An error occurred. Please try again."
//   //     setError("Error signing up. Please try again.")
//   //     toast.error(message, {
//   //       description,
//   //       position: "top-right",
//   //       style: { textAlign: "left" },
//   //     })
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
  
//     let errorMsg = "";
  
//     const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
//       ? "234" + formData.phoneNumber.slice(1)
//       : formData.phoneNumber;
  
//     formData.phoneNumber = formattedPhoneNumber;
  
//     // VALIDATION
//     if (formData.password.trim() !== formData.confirmPassword.trim()) {
//       errorMsg = "Passwords do not match!";
//     } else if (formData.password.trim().length < 6) {
//       errorMsg = "Password must be at least 6 characters!";
//     } else if (!isOnlyNumbers(formData.phoneNumber)) {
//       errorMsg = "Phone number must be numeric!";
//     } else if (formData.phoneNumber.trim().length !== 13) {
//       errorMsg = "Phone number must be 13 digits!";
//     } else if (
//       signupAs !== "training_center" &&
//       (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)
//     ) {
//       errorMsg = "NIN must be 11 numeric digits!";
//     }
  
//     if (errorMsg) {
//       toast.error(errorMsg, { position: "top-right" });
//       setLoading(false);
//       return;
//     }
  
//     // Build payload according to signup type
//     let payload = {};
  
//     if (signupAs === "training_center") {
//       // Prepare legalInfo.tradeAreas
//       const tradeAreasPayload = (formData?.legalInfo?.tradeAreas || []).map((tradeAreaItem) => {
//         // Example sector value: an array of ObjectIds (but yours might currently be a string)
//         return {
//           sector: Array.isArray(tradeAreaItem.sector)
//             ? tradeAreaItem.sector // Already array, fine
//             : [tradeAreaItem.sector], // Wrap in array if not already
//           tradeArea: tradeAreaItem.tradeArea || [],
//         };
//       });
  
//       payload = {
//         trainingCentreName: formData.trainingCentreName,
//         regNum: formData.regNum,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         password: formData.password,
//         confirm_password: formData.confirmPassword,
//         state: formData.state,
//         lga: formData.lga,
//         legalInfo: {
//           tradeAreas: tradeAreasPayload,
//         },
//         agree: false,
//         role: signupAs,
//       };
//     } else {
//       payload = {
//         role: signupAs,
//         nin: formData.nin,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         password: formData.password,
//         confirm_password: formData.confirmPassword,
//         agree: false,
//       };
//     }
  
//     console.log("Payload to submit:", payload); // Debugging line
  
//     try {
//       const endpoint =
//         signupAs === "training_center"
//           ? `${API_BASE_URL}/training-centers/register`
//           : `${API_BASE_URL}/signup`;
  
//       const response = await axios.post(endpoint, payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
  
//       console.log("Response:", response.data);
  
//       if (response.data.success) {
//         setAuthState(response.data.data);
  
//         toast.success("Signup successful 🚀!", {
//           description: "Login Successfully",
//           position: "top-right",
//           duration: 2000,
//         });
  
//         setTimeout(() => {
//           const role = response.data.data.trainingCenter
//             ? response.data.data.trainingCenter.role
//             : response.data.data.user.role;
  
//           switch (role) {
//             case "artisan_user":
//               navigate("/register/artisan");
//               break;
//             case "intending_artisan":
//               navigate("/register/intendingArtisan");
//               break;
//             case "training_center":
//               navigate("/register/trainingcenter");
//               break;
//             default:
//               navigate("/dashboard");
//           }
//         }, 2000);
//       } else {
//         toast.error(`Signup failed: ${response.data.message}`, {
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       const description =
//         typeof error?.response?.data === "string"
//           ? error?.response?.data
//           : error?.response?.data?.message || "An error occurred. Please try again.";
  
//       setError("Error signing up. Please try again.");
//       toast.error("Error!", {
//         description,
//         position: "top-right",
//         style: { textAlign: "left" },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
//       <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0">
//         <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
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
//           <Card className="w-full max-w-4xl pt-4 overflow-hidden">
//             <CardHeader className="md:hidden">
//               <CardTitle className="text-2xl font-bold text-gray-600 ">SignUp Today</CardTitle>
//               <CardDescription className="text-xs">
//                 {" "}
//                 Access your personal dashboard and track your progress.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs value={signupAs} onValueChange={handleRoleChange} className="w-full">
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
//                 </TabsList>

//                 {/* Artisan User Form */}
//                 <TabsContent value="artisan_user">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <LabelInput
//                       name="nin"
//                       label="National ID"
//                       type="tel"
//                       pattern="\d{11}"
//                       value={formData.nin}
//                       onChange={handleChange}
//                       placeholder="12345678953"
//                       required={true}
//                     />
//                     <LabelInput
//                       name="email"
//                       label="Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="abc@email.com"
//                       required
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Phone Number"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields formData={formData} onChange={handleChange} required />
//                     <Button type="submit" className="w-full bg-emerald-800">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Intending Artisan Form */}
//                 <TabsContent value="intending_artisan">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <LabelInput
//                       name="nin"
//                       label="National ID"
//                       type="tel"
//                       pattern="\d{11}"
//                       value={formData.nin}
//                       onChange={handleChange}
//                       placeholder="12345678953"
//                       required={true}
//                     />
//                     <LabelInput
//                       name="email"
//                       label="Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="abc@email.com"
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Phone Number"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields formData={formData} onChange={handleChange} required />
//                     <Button type="submit" className="w-full bg-red-600">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Training Center Form */}
//                 <TabsContent value="training_center">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="flex flex-row  gap-8 ">
//                       <div className="flex-1">
//                         <LabelInput
//                           name="trainingCentreName"
//                           label="Company Name"
//                           value={formData.trainingCentreName}
//                           onChange={handleChange}
//                           placeholder="Company Name here"
//                           required
//                         />
//                       </div>
//                       <div className="flex-1">
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
//                     <div className="flex flex-row gap-8">
//                       <div className="flex-1 space-y-2">
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
//                       <div className="flex-1 space-y-2">
//                         <Label htmlFor="lga" className="text-left text-xs text-gray-600">
//                           LGA<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.lga}
//                           onValueChange={(value) => setFormData({ ...formData, lga: value })}
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
//                     <div className="flex flex-row gap-8">
//                       <div className="flex-1 space-y-2">
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
//                       <div className="flex-1 space-y-2">
//                         <Label htmlFor="tradeArea" className="text-left text-xs text-gray-600">
//                           Trade Area<span className="text-red-600 ml-[4px] text-[13px]">*</span>
//                         </Label>
//                         <Select
//                           value={formData.tradeArea}
//                           onValueChange={(value) => setFormData({ ...formData, tradeArea: value })}
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
//                     </div>
//                     <LabelInput
//                       name="email"
//                       label="Company Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="company@email.com"
//                       required
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Company Phone"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields formData={formData} onChange={handleChange} />
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
//   <div className="space-y-2">
//     <div className="w-full flex ">
//       <div htmlFor={"password"} className="text-left text-xs text-gray-600">
//         Password
//         {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
//       </div>
//     </div>

//     <Input
//       id="password"
//       name="password"
//       type="password"
//       value={formData.password}
//       onChange={onChange}
//       placeholder="************"
//       required
//       className="w-full"
//     />

//     <div className="w-full flex ">
//       <div htmlFor={"confirmPassword"} className="text-left text-xs text-gray-600">
//         Confirm Password
//         {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
//       </div>
//     </div>

//     <Input
//       id="confirmPassword"
//       name="confirmPassword"
//       type="password"
//       value={formData.confirmPassword}
//       onChange={onChange}
//       placeholder="************"
//       required
//       className="w-full"
//     />
//   </div>
// )


"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import axios from "axios"
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

export default function SignupForm() {
  const location = useLocation()
  const initialTab = location.state?.tab || "artisan_user"
  const [signupAs, setRole] = useState(initialTab)
  const [sectors, setSectors] = useState([])
  const [sectorLoading, setSectorLoading] = useState(true)
  const [sectorError, setSectorError] = useState(null)
  const [formData, setFormData] = useState({
    nin: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    trainingCentreName: "",
    regNum: "",
    state: "",
    lga: "",
    sector: "",
    tradeArea: "",
    // Initialize legalInfo with empty tradeAreas array
    legalInfo: {
      tradeAreas: [],
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [lgas, setLgas] = useState([])
  const [selectedSectorId, setSelectedSectorId] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetchSectors(accessToken)
        setSectors(response)
      } catch (err) {
        setSectorError("Failed to fetch sectors")
        console.error(err)
      } finally {
        setSectorLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update the handleSectorChange function to store both the sector name and ID
  const handleSectorChange = (sectorName) => {
    // Find the selected sector object from the sectors array
    const selectedSector = sectors.find((sector) => sector.name === sectorName)

    if (selectedSector) {
      setSelectedSectorId(selectedSector._id)

      // Update formData with the sector name and reset tradeArea
      setFormData({
        ...formData,
        sector: sectorName,
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
      })
    }
  }

  // Update the trade area handler to store in the correct format
  const handleTradeAreaChange = (tradeAreaName) => {
    const selectedSector = sectors.find((sector) => sector.name === formData.sector)
    const selectedTradeArea = selectedSector?.tradeAreas?.find((ta) => ta.name === tradeAreaName)

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
      })
    }
  }

  const handleRoleChange = (newRole) => {
    setRole(newRole)
    setFormData({
      nin: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      trainingCentreName: "",
      regNum: "",
      state: "",
      lga: "",
      sector: "",
      tradeArea: "",
      legalInfo: {
        tradeAreas: [],
      },
    })
    setSelectedSectorId("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleStateChange = (stateName) => {
    setFormData({ ...formData, state: stateName, lga: "" })
    const selectedState = states.find((state) => state.value === stateName)
    setLgas(selectedState ? selectedState.lgas : [])
  }

  function isOnlyNumbers(str) {
    return /^\d+$/.test(str)
  }

  const setAuthState = (userData) => {
    // Set is logged in flag
    localStorage.setItem("isLoggedIn", "true")

    // Handle different user types
    if (userData.trainingCenter) {
      // For training center
      localStorage.setItem("userRole", userData.trainingCenter.role)
      localStorage.setItem("userId", userData.trainingCenter._id)
      localStorage.setItem("isFirstTimeUser", userData.trainingCenter.agree || false)
      localStorage.setItem("trainingCentreName", userData.trainingCenter.trainingCentreName)
      localStorage.setItem("regNum", userData.trainingCenter.regNum)
    } else if (userData.user) {
      // For artisan and intending artisan
      localStorage.setItem("userRole", userData.user.role)
      localStorage.setItem("userId", userData.user._id)
      localStorage.setItem("isFirstTimeUser", userData.user.agree || false)
    }

    // Handle tokens
    if (userData.accessToken) {
      localStorage.setItem(
        "accessToken",
        typeof userData.accessToken === "object" ? userData.accessToken.accessToken : userData.accessToken,
      )
    }

    if (userData.refreshToken) {
      localStorage.setItem(
        "refreshToken",
        typeof userData.refreshToken === "object" ? userData.refreshToken.refreshToken : userData.refreshToken,
      )
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // START VALIDATION
    let errorMsg = ""

    // Format the phone number to start with "234" if it starts with "0"
    const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
      ? "234" + formData.phoneNumber.slice(1)
      : formData.phoneNumber

    // Update the phone number in formData
    formData.phoneNumber = formattedPhoneNumber

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      errorMsg = "Passwords do not match!"
    } else if (formData.password.trim().length < 6) {
      errorMsg = "Password must be at least 6 characters!"
    } else if (!isOnlyNumbers(formData.phoneNumber)) {
      errorMsg = "Phone number must be numeric!"
    } else if (formData.phoneNumber.trim().length !== 13) {
      errorMsg = "Phone number must be 13 digits!"
    } else if (signupAs !== "training_center" && (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)) {
      errorMsg = "NIN must be 11 numeric digits!"
    }

    if (errorMsg) {
      toast.error(errorMsg, { position: "top-right" })
      setLoading(false)
      return
    }
    // END VALIDATION

    const endpoint =
      signupAs === "training_center" ? `${API_BASE_URL}/training-centers/register` : `${API_BASE_URL}/signup`

    // Prepare the payload with the correct structure for legalInfo.tradeAreas
    const payload =
      signupAs === "training_center"
        ? {
            trainingCentreName: formData.trainingCentreName,
            regNum: formData.regNum,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            state: formData.state,
            lga: formData.lga,
            sector: formData.sector,
            tradeArea: formData.tradeArea,
            legalInfo: formData.legalInfo,
            agree: false,
            role: signupAs,
          }
        : {
            role: signupAs,
            nin: formData.nin,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            password: formData.password,
            confirm_password: formData.confirmPassword,
            agree: false,
          }

    try {
      const response = await axios.post(endpoint, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Response:", response.data) // Debugging log

      if (response.data.success) {
        // Set authentication state
        setAuthState(response.data.data)

        // Success toast
        toast.success("Signup successful 🚀!", {
          description: "Login Successfully",
          position: "top-right",
          duration: 2000,
        })

        // Redirect based on role
        setTimeout(() => {
          const role = response.data.data.trainingCenter
            ? response.data.data.trainingCenter.role
            : response.data.data.user.role

          switch (role) {
            case "artisan_user":
              navigate("/register/artisan")
              break
            case "intending_artisan":
              navigate("/register/intendingArtisan")
              break
            case "training_center":
              navigate("/register/trainingcenter")
              break
            default:
              navigate("/dashboard")
          }
        }, 2000)
      } else {
        toast.error(`Signup failed: ${response.data.message}`, {
          duration: 2000,
        })
      }
    } catch (error) {
      console.error("Signup error:", error) // Debugging log
      const message = "Error!"
      const description =
        typeof error?.response?.data === "string"
          ? error?.response?.data
          : error?.response?.data?.message || "An error occurred. Please try again."
      setError("Error signing up. Please try again.")
      toast.error(message, {
        description,
        position: "top-right",
        style: { textAlign: "left" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
      <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0">
        <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Left image section */}
          <div className="hidden md:block w-3/5 relative">
            {signupAs === "artisan_user" ? (
              <div className="flex h-full items-center justify-center bg-green-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-green-800">SignUp Today</h2>
                  <p className="text-green-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="I am an artisan in this trade area"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            ) : signupAs === "intending_artisan" ? (
              <div className="flex h-full items-center justify-center bg-red-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-red-800">SignUp Today</h2>
                  <p className="text-red-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="I am an intending artisan in this trade area"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center bg-blue-100 p-6">
                <div className="text-center">
                  <h2 className="mb-2 text-2xl font-bold text-blue-800">SignUp Today</h2>
                  <p className="text-blue-600">Access your personal dashboard and track your progress.</p>
                  <img
                    src="/hairdresser copy.jpeg?height=200&width=200"
                    alt="I am a training center"
                    className="mx-auto mt-4 h-48 w-48 object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card section */}
          <Card className="w-full max-w-4xl pt-4 overflow-hidden">
            <CardHeader className="md:hidden">
              <CardTitle className="text-2xl font-bold text-gray-600 ">SignUp Today</CardTitle>
              <CardDescription className="text-xs">
                {" "}
                Access your personal dashboard and track your progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={signupAs} onValueChange={handleRoleChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="artisan_user"
                    className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                  >
                    Artisan
                  </TabsTrigger>
                  <TabsTrigger
                    value="intending_artisan"
                    className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                  >
                    Intending Artisan
                  </TabsTrigger>
                  <TabsTrigger
                    value="training_center"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600"
                  >
                    Training Center
                  </TabsTrigger>
                </TabsList>

                {/* Artisan User Form */}
                <TabsContent value="artisan_user">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <LabelInput
                      name="nin"
                      label="National ID"
                      type="tel"
                      pattern="\d{11}"
                      value={formData.nin}
                      onChange={handleChange}
                      placeholder="12345678953"
                      required={true}
                    />
                    <LabelInput
                      name="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@email.com"
                      required
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
                    <PasswordFields formData={formData} onChange={handleChange} required />
                    <Button type="submit" className="w-full bg-emerald-800">
                      {loading ? <Spinner /> : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Intending Artisan Form */}
                <TabsContent value="intending_artisan">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <LabelInput
                      name="nin"
                      label="National ID"
                      type="tel"
                      pattern="\d{11}"
                      value={formData.nin}
                      onChange={handleChange}
                      placeholder="12345678953"
                      required={true}
                    />
                    <LabelInput
                      name="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@email.com"
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
                    <PasswordFields formData={formData} onChange={handleChange} required />
                    <Button type="submit" className="w-full bg-red-600">
                      {loading ? <Spinner /> : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Training Center Form */}
                <TabsContent value="training_center">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-row  gap-8 ">
                      <div className="flex-1">
                        <LabelInput
                          name="trainingCentreName"
                          label="Company Name"
                          value={formData.trainingCentreName}
                          onChange={handleChange}
                          placeholder="Company Name here"
                          required
                        />
                      </div>
                      <div className="flex-1">
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
                    <div className="flex flex-row gap-8">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="state" className="text-left text-xs text-gray-600">
                          State<span className="text-red-600 ml-[4px] text-[13px]">*</span>
                        </Label>
                        <Select value={formData.state} onValueChange={handleStateChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {states.map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="lga" className="text-left text-xs text-gray-600">
                          LGA<span className="text-red-600 ml-[4px] text-[13px]">*</span>
                        </Label>
                        <Select
                          value={formData.lga}
                          onValueChange={(value) => setFormData({ ...formData, lga: value })}
                          disabled={!lgas.length}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select LGA" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {lgas.map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                  {lga.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-row gap-8">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="sector" className="text-left text-xs text-gray-600">
                          Sector<span className="text-red-600 ml-[4px] text-[13px]">*</span>
                        </Label>
                        <Select value={formData.sector} onValueChange={handleSectorChange} disabled={sectorLoading}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sector" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sectors?.map((sector) => (
                                <SelectItem key={sector._id} value={sector.name}>
                                  {sector.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="tradeArea" className="text-left text-xs text-gray-600">
                          Trade Area<span className="text-red-600 ml-[4px] text-[13px]">*</span>
                        </Label>
                        <Select
                          value={formData.tradeArea}
                          onValueChange={handleTradeAreaChange}
                          disabled={!formData.sector}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select trade area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sectors
                                ?.find((sector) => sector.name === formData.sector)
                                ?.tradeAreas?.map((ta) => (
                                  <SelectItem key={ta._id} value={ta.name}>
                                    {ta.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <LabelInput
                      name="email"
                      label="Company Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="company@email.com"
                      required
                    />
                    <LabelInput
                      name="phoneNumber"
                      label="Company Phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="2347012345643"
                      required={true}
                    />
                    <PasswordFields formData={formData} onChange={handleChange} />
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
    </section>
  )
}

// Input field with label component
const LabelInput = ({ name, label, type = "text", value, onChange, placeholder, required = false }) => (
  <div className="space-y-2">
    <div className="w-full flex ">
      <div htmlFor={name} className="text-left text-xs text-gray-600">
        {label}
        {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
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
)

// Password fields component
const PasswordFields = ({ formData, onChange, required }) => (
  <div className="space-y-2">
    <div className="w-full flex ">
      <div htmlFor={"password"} className="text-left text-xs text-gray-600">
        Password
        {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
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

    <div className="w-full flex ">
      <div htmlFor={"confirmPassword"} className="text-left text-xs text-gray-600">
        Confirm Password
        {required ? <span className="text-red-600 ml-[4px] text-[13px]">*</span> : undefined}
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
)





  // const setAuthState = (userData) => {
  //   // Set is logged in flag
  //   localStorage.setItem("isLoggedIn", "true");

  //   // Handle different user types
  //   if (userData.trainingCenter.role === "training_center") {
  //     // For training center
  //     localStorage.setItem("userRole", userData.trainingCenter.role);
  //     localStorage.setItem("userId", userData.trainingCenter._id);
  //     localStorage.setItem(
  //       "isFirstTimeUser",
  //       userData.trainingCenter.agree || false
  //     );
  //     localStorage.setItem(
  //       "trainingCentreName",
  //       userData.trainingCenter.trainingCentreName
  //     );
  //     localStorage.setItem("regNum", userData.trainingCenter.regNum);
  //   } else {
  //     // For artisan and intending artisan
  //     localStorage.setItem("userRole", userData.user.role);
  //     localStorage.setItem("userId", userData.user._id);
  //     localStorage.setItem("isFirstTimeUser", userData.user.agree || false);
  //   }

  //   // Handle tokens
  //   localStorage.setItem(
  //     "accessToken",
  //     typeof userData.accessToken === "object"
  //       ? userData.accessToken.accessToken
  //       : userData.accessToken
  //   );

  //   localStorage.setItem(
  //     "refreshToken",
  //     typeof userData.refreshToken === "object"
  //       ? userData.refreshToken.refreshToken
  //       : userData.refreshToken
  //   );
  // };

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Button } from "../../components/ui/button";
// import { toast } from "sonner";
// import Spinner from "../../components/Spinner";
// import { API_BASE_URL } from "@/config/env";

// export default function SignupForm() {
//   const location = useLocation();
//   const initialTab = location.state?.tab || "artisan_user";
//   const [signupAs, setRole] = useState(initialTab);
//   const [formData, setFormData] = useState({
//     nin: "",
//     email: "",
//     phoneNumber: "",
//     password: "",
//     confirmPassword: "",
//     trainingCentreName: "",
//     regNum: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleRoleChange = (newRole) => {
//     setRole(newRole);
//     setFormData({
//       nin: "",
//       email: "",
//       phoneNumber: "",
//       password: "",
//       confirmPassword: "",
//       trainingCentreName: "",
//       regNum: "",
//     });
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   function isOnlyNumbers(str) {
//     return /^\d+$/.test(str);
//   }

//   const setAuthState = (userData) => {
//     // Set is logged in flag
//     localStorage.setItem("isLoggedIn", "true");

//     // Handle different user types
//     if (userData.trainingCenter) {
//       // For training center
//       localStorage.setItem("userRole", userData.trainingCenter.role);
//       localStorage.setItem("userId", userData.trainingCenter._id);
//       localStorage.setItem(
//         "isFirstTimeUser",
//         userData.trainingCenter.agree || false
//       );
//       localStorage.setItem(
//         "trainingCentreName",
//         userData.trainingCenter.trainingCentreName
//       );
//       localStorage.setItem("regNum", userData.trainingCenter.regNum);
//     } else if (userData.user) {
//       // For artisan and intending artisan
//       localStorage.setItem("userRole", userData.user.role);
//       localStorage.setItem("userId", userData.user._id);
//       localStorage.setItem("isFirstTimeUser", userData.user.agree || false);
//     }

//     // Handle tokens
//     if (userData.accessToken) {
//       localStorage.setItem(
//         "accessToken",
//         typeof userData.accessToken === "object"
//           ? userData.accessToken.accessToken
//           : userData.accessToken
//       );
//     }

//     if (userData.refreshToken) {
//       localStorage.setItem(
//         "refreshToken",
//         typeof userData.refreshToken === "object"
//           ? userData.refreshToken.refreshToken
//           : userData.refreshToken
//       );
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);
//     setError(null);

//     // START VALIDATION
//     let errorMsg = "";

//     // Format the phone number to start with "234" if it starts with "0"
//     const formattedPhoneNumber = formData.phoneNumber.startsWith("0")
//       ? "234" + formData.phoneNumber.slice(1)
//       : formData.phoneNumber;

//     // Update the phone number in formData
//     formData.phoneNumber = formattedPhoneNumber;

//     if (formData.password.trim() !== formData.confirmPassword.trim()) {
//       errorMsg = "Passwords do not match!";
//     } else if (formData.password.trim().length < 6) {
//       errorMsg = "Password must be at least 6 characters!";
//     } else if (!isOnlyNumbers(formData.phoneNumber)) {
//       errorMsg = "Phone number must be numeric!";
//     } else if (formData.phoneNumber.trim().length !== 13) {
//       errorMsg = "Phone number must be 13 digits!";
//     } else if (
//       signupAs !== "training_center" &&
//       (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)
//     ) {
//       errorMsg = "NIN must be 11 numeric digits!";
//     }

//     if (errorMsg) {
//       toast.error(errorMsg, { position: "top-right" });
//       setLoading(false);
//       return;
//     }
//     // END VALIDATION

//     const endpoint =
//       signupAs === "training_center"
//         ? `${API_BASE_URL}/training-centers/register`
//         : `${API_BASE_URL}/signup`;

//     const payload =
//       signupAs === "training_center"
//         ? {
//             trainingCentreName: formData.trainingCentreName,
//             regNum: formData.regNum,
//             email: formData.email,
//             phoneNumber: formData.phoneNumber,
//             password: formData.password,
//             confirm_password: formData.confirmPassword,
//             agree: false,
//             role: signupAs,
//           }
//         : {
//             role: signupAs,
//             nin: formData.nin,
//             email: formData.email,
//             phoneNumber: formData.phoneNumber,
//             password: formData.password,
//             confirm_password: formData.confirmPassword,
//             agree: false,
//           };

//     // console.log("payload", payload);
//     // return alert(4343);

//     try {
//       const response = await axios.post(endpoint, payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Response:", response.data); // Debugging log

//       if (response.data.success) {
//         // Set authentication state
//         setAuthState(response.data.data);

//         // Success toast
//         toast.success("Signup successful 🚀!", {
//           description: "Login Successfully",
//           position: "top-right",
//           duration: 2000,
//         });

//         // Redirect based on role
//         setTimeout(() => {
//           const role = response.data.data.trainingCenter
//             ? response.data.data.trainingCenter.role
//             : response.data.data.user.role;

//           switch (role) {
//             case "artisan_user":
//               navigate("/register/artisan");
//               break;
//             case "intending_artisan":
//               navigate("/register/intendingArtisan");
//               break;
//             case "training_center":
//               navigate("/register/trainingcenter");
//               break;
//             default:
//               navigate("/dashboard");
//           }
//         }, 2000);
//       } else {
//         toast.error(`Signup failed: ${response.data.message}`, {
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Signup error:", error); // Debugging log
//       const message = "Error!";
//       const description =
//         typeof error?.response?.data === "string"
//           ? error?.response?.data
//           : error?.response?.data?.message ||
//             "An error occurred. Please try again.";
//       setError("Error signing up. Please try again.");
//       toast.error(message, {
//         description,
//         position: "top-right",
//         style: { textAlign: "left" },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
//       <div className="flex items-center justify-center absolute top-0 left-0 right-0 bottom-0">
//         <div className="flex w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
//           {/* Left image section */}
//           <div className="hidden md:block w-3/5 relative">
//             {signupAs === "artisan_user" ? (
//               <div className="flex h-full items-center justify-center bg-green-100 p-6">
//                 <div className="text-center">
//                   <h2 className="mb-2 text-2xl font-bold text-green-800">
//                     SignUp Today
//                   </h2>
//                   <p className="text-green-600">
//                     Access your personal dashboard and track your progress.
//                   </p>
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
//                   <h2 className="mb-2 text-2xl font-bold text-red-800">
//                     SignUp Today
//                   </h2>
//                   <p className="text-red-600">
//                     Access your personal dashboard and track your progress.
//                   </p>
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
//                   <h2 className="mb-2 text-2xl font-bold text-blue-800">
//                     SignUp Today
//                   </h2>
//                   <p className="text-blue-600">
//                     Access your personal dashboard and track your progress.
//                   </p>
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
//           <Card className="w-full max-w-4xl pt-4 overflow-hidden">
//             <CardHeader className="md:hidden">
//               <CardTitle className="text-2xl font-bold text-gray-600 ">
//                 SignUp Today
//               </CardTitle>
//               <CardDescription className="text-xs">
//                 {" "}
//                 Access your personal dashboard and track your progress.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs
//                 value={signupAs}
//                 onValueChange={handleRoleChange}
//                 className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger
//                     value="artisan_user"
//                     className="data-[state=active]:bg-emerald-800 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                     Artisan
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="intending_artisan"
//                     className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                     Intending Artisan
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="training_center"
//                     className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-bold text-gray-600">
//                     Training Center
//                   </TabsTrigger>
//                 </TabsList>

//                 {/* Artisan User Form */}
//                 <TabsContent value="artisan_user">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <LabelInput
//                       name="nin"
//                       label="National ID"
//                       type="tel"
//                       pattern="\d{11}"
//                       value={formData.nin}
//                       onChange={handleChange}
//                       placeholder="12345678953"
//                       required={true}
//                     />
//                     <LabelInput
//                       name="email"
//                       label="Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="abc@email.com"
//                       required
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Phone Number"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields
//                       formData={formData}
//                       onChange={handleChange}
//                       required
//                     />
//                     <Button type="submit" className="w-full bg-emerald-800">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Intending Artisan Form */}
//                 <TabsContent value="intending_artisan">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <LabelInput
//                       name="nin"
//                       label="National ID"
//                       type="tel"
//                       pattern="\d{11}"
//                       value={formData.nin}
//                       onChange={handleChange}
//                       placeholder="12345678953"
//                       required={true}
//                     />
//                     <LabelInput
//                       name="email"
//                       label="Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="abc@email.com"
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Phone Number"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields
//                       formData={formData}
//                       onChange={handleChange}
//                       required
//                     />
//                     <Button type="submit" className="w-full bg-red-600">
//                       {loading ? <Spinner /> : "Sign Up"}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 {/* Training Center Form */}
//                 <TabsContent value="training_center">
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="flex flex-row  gap-8 ">
//                       <div className="flex-1">
//                         <LabelInput
//                           name="trainingCentreName"
//                           label="Company Name"
//                           value={formData.trainingCentreName}
//                           onChange={handleChange}
//                           placeholder="Company Name here"
//                           required
//                         />
//                       </div>
//                       <div className="flex-1">
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
//                     <LabelInput
//                       name="email"
//                       label="Company Email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="company@email.com"
//                       required
//                     />
//                     <LabelInput
//                       name="phoneNumber"
//                       label="Company Phone"
//                       type="tel"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       placeholder="2347012345643"
//                       required={true}
//                     />
//                     <PasswordFields
//                       formData={formData}
//                       onChange={handleChange}
//                     />
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
//   );
// }

// // Input field with label component
// const LabelInput = ({
//   name,
//   label,
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   required = false,
// }) => (
//   <div className="space-y-2">
//     <div className="w-full flex ">
//       <div htmlFor={name} className="text-left text-xs text-gray-600">
//         {label}
//         {required ? (
//           <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//         ) : undefined}
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
// );

// // Password fields component

// const PasswordFields = ({ formData, onChange, required }) => (
//   <div className="space-y-2">
//     <div className="w-full flex ">
//       <div htmlFor={"password"} className="text-left text-xs text-gray-600">
//         Password
//         {required ? (
//           <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//         ) : undefined}
//       </div>
//     </div>

//     <Input
//       id="password"
//       name="password"
//       type="password"
//       value={formData.password}
//       onChange={onChange}
//       placeholder="************"
//       required
//       className="w-full"
//     />

//     <div className="w-full flex ">
//       <div
//         htmlFor={"confirmPassword"}
//         className="text-left text-xs text-gray-600">
//         Confirm Password
//         {required ? (
//           <span className="text-red-600 ml-[4px] text-[13px]">*</span>
//         ) : undefined}
//       </div>
//     </div>

//     <Input
//       id="confirmPassword"
//       name="confirmPassword"
//       type="password"
//       value={formData.confirmPassword}
//       onChange={onChange}
//       placeholder="************"
//       required
//       className="w-full"
//     />
//   </div>
// );





  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //      // START VALIDATION
  //      let errorMsg = "";

  //      // Format the phone number to start with "234" if it starts with "0"
  //      const formattedPhoneNumber =
  //        formData.phoneNumber.startsWith("0")
  //          ? "234" + formData.phoneNumber.slice(1)
  //          : formData.phoneNumber;

  //      // Update the phone number in formData
  //      formData.phoneNumber = formattedPhoneNumber;

  //      if (formData.password.trim() !== formData.confirmPassword.trim()) {
  //        errorMsg = "Passwords do not match!";
  //      } else if (formData.password.trim().length < 6) {
  //        errorMsg = "Password must be at least 6 characters!";
  //      } else if (!isOnlyNumbers(formData.phoneNumber)) {
  //        errorMsg = "Phone number must be numeric!";
  //      } else if (formData.phoneNumber.trim().length !== 13) {
  //        errorMsg = "Phone number must be 13 digits!";
  //      } else if (
  //        signupAs !== "training_center" &&
  //        (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)
  //      ) {
  //        errorMsg = "NIN must be 11 numeric digits!";
  //      }

  //      if (errorMsg) {
  //        toast.error(errorMsg, { position: "top-right" });
  //        setLoading(false);
  //        return;
  //      }
  //      // END VALIDATION

  //   const endpoint =
  //     signupAs === "training_center"
  //       ? `${API_BASE_URL}/training-centers/register`
  //       : `${API_BASE_URL}/signup`;

  //   const payload =
  //     signupAs === "training_center"
  //       ? {
  //           trainingCentreName: formData.trainingCentreName,
  //           regNum: formData.regNum,
  //           email: formData.email,
  //           phoneNumber: formData.phoneNumber,
  //           password: formData.password,
  //           confirm_password: formData.confirmPassword,
  //           agree: false,
  //           role: signupAs,
  //         }
  //       : {
  //           role: signupAs,
  //           nin: formData.nin,
  //           email: formData.email,
  //           phoneNumber: formData.phoneNumber,
  //           password: formData.password,
  //           confirm_password: formData.confirmPassword,
  //           agree: false,
  //         };

  //   try {
  //     const response = await axios.post(endpoint, payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.data.success) {
  //       // Set authentication state
  //       setAuthState(response.data.data);

  //       // Success toast
  //       toast.success("Signup successful 🚀!", {
  //         description: "Login Successfully",
  //         position: "top-right",
  //         duration: 2000,
  //       });

  //       // Redirect based on role
  //       setTimeout(() => {
  //         const role = response.data.data.trainingCenter
  //           ? response.data.data.trainingCenter.role
  //           : response.data.data.user.role;

  //         switch (role) {
  //           case "artisan_user":
  //             navigate("/register/artisan");
  //             break;
  //           case "intending_artisan":
  //             navigate("/register/intendingArtisan");
  //             break;
  //           case "training_center":
  //             navigate("/register/trainingcenter");
  //             break;
  //           default:
  //             navigate("/dashboard");
  //         }
  //       }, 2000);
  //     } else {
  //       toast.error(`Signup failed: ${response.data.message}`,{
  //         duration: 2000,
  //       });
  //     }
  //   } catch (error) {
  //     const message = "Error!";
  //     const description =
  //       typeof error?.response?.data === "string"
  //         ? error?.response?.data
  //         : error?.response?.data?.message ||
  //           "An error occurred. Please try again.";
  //     setError('Error signing up. Please try again.');
  //     toast.error(message, {
  //       description,
  //       position: "top-right",
  //       style: { textAlign: "left" },
  //     });

  //       setLoading(false);

  //   } finally {

  //       setLoading(false);

  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError(null);

  //   // START VALIDATION
  //   let errorMsg = "";

  //   // Format the phone number to start with "234" if it starts with "0"
  //   const formattedPhoneNumber =
  //     formData.phoneNumber.startsWith("0")
  //       ? "234" + formData.phoneNumber.slice(1)
  //       : formData.phoneNumber;

  //   // Update the phone number in formData
  //   formData.phoneNumber = formattedPhoneNumber;

  //   if (formData.password.trim() !== formData.confirmPassword.trim()) {
  //     errorMsg = "Passwords do not match!";
  //   } else if (formData.password.trim().length < 6) {
  //     errorMsg = "Password must be at least 6 characters!";
  //   } else if (!isOnlyNumbers(formData.phoneNumber)) {
  //     errorMsg = "Phone number must be numeric!";
  //   } else if (formData.phoneNumber.trim().length !== 13) {
  //     errorMsg = "Phone number must be 13 digits!";
  //   } else if (
  //     signupAs !== "training_center" &&
  //     (!isOnlyNumbers(formData.nin) || formData.nin.trim().length !== 11)
  //   ) {
  //     errorMsg = "NIN must be 11 numeric digits!";
  //   }

  //   if (errorMsg) {
  //     toast.error(errorMsg, { position: "top-right" });
  //     setLoading(false);
  //     return;
  //   }
  //   // END VALIDATION

  //   const endpoint =
  //     signupAs === "training_center"
  //       ? `${API_BASE_URL}/training-centers/register`
  //       : `${API_BASE_URL}/signup`;

  //   const payload =
  //     signupAs === "training_center"
  //       ? {
  //           trainingCentreName: formData.trainingCentreName,
  //           regNum: formData.regNum,
  //           email: formData.email,
  //           phoneNumber: formData.phoneNumber,
  //           password: formData.password,
  //           confirmPassword: formData.confirmPassword,
  //           agree: false,
  //           role: signupAs,
  //         }
  //       : {
  //           nin: formData.nin,
  //           email: formData.email,
  //           phoneNumber: formData.phoneNumber,
  //           password: formData.password,
  //           confirmPassword: formData.confirmPassword,
  //           agree: false,
  //           role: signupAs,
  //         };

  //   try {
  //     const response = await axios.post(endpoint, payload, {
  //       headers: { "Content-Type": "application/json" },
  //     });

  //     if (response.data.success) {
  //       setAuthState(response.data.data);
  //       toast.success("Signup successful! 🚀 Redirecting...", {
  //         position: "top-right",
  //         duration: 2000,
  //       });

  //       const role = response.data.data.trainingCenter
  //         ? response.data.data.trainingCenter.role
  //         : response.data.data.user.role;

  //       const routes = {
  //         artisan_user: "/register/artisan",
  //         intending_artisan: "/register/intendingArtisan",
  //         training_center: "/register/trainingcenter",
  //       };

  //       setTimeout(() => navigate(routes[role] || "/dashboard"), 2000);
  //     } else {
  //       toast.error(`Signup failed: ${response.data.message}`);
  //     }
  //   } catch (error) {
  //     const description =
  //       error.response?.data?.message || "An error occurred. Please try again.";
  //     setError("Error signing up. Please try again.");
  //     toast.error("Signup failed!", { description, position: "top-right" });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


    // const setAuthState = (userData) => {
  //   // Set is logged in flag
  //   localStorage.setItem("isLoggedIn", "true");

  //   // Handle different user types
  //   if (userData.trainingCenter.role === "training_center") {
  //     // For training center
  //     localStorage.setItem("userRole", userData.trainingCenter.role);
  //     localStorage.setItem("userId", userData.trainingCenter._id);
  //     localStorage.setItem(
  //       "isFirstTimeUser",
  //       userData.trainingCenter.agree || false
  //     );
  //     localStorage.setItem(
  //       "trainingCentreName",
  //       userData.trainingCenter.trainingCentreName
  //     );
  //     localStorage.setItem("regNum", userData.trainingCenter.regNum);
  //   } else {
  //     // For artisan and intending artisan
  //     localStorage.setItem("userRole", userData.user.role);
  //     localStorage.setItem("userId", userData.user._id);
  //     localStorage.setItem("isFirstTimeUser", userData.user.agree || false);
  //   }

  //   // Handle tokens
  //   localStorage.setItem(
  //     "accessToken",
  //     typeof userData.accessToken === "object"
  //       ? userData.accessToken.accessToken
  //       : userData.accessToken
  //   );

  //   localStorage.setItem(
  //     "refreshToken",
  //     typeof userData.refreshToken === "object"
  //       ? userData.refreshToken.refreshToken
  //       : userData.refreshToken
  //   );
  // };
