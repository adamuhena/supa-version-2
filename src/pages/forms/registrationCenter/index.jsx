// // import React, { useState, useEffect } from "react";
// // import { Stepper, Step } from "react-form-stepper";
// // import CompanyInfo from "./CompanyInfo";

// // import Instructors from "./Instructors";
// // import VerificationDocuments from "./VerificationDocuments";
// // import Declaration from "./Declaration";
// // import RegisterSuccess from "../../../components/SuccessRegister";
// // import { toast } from "sonner";
// // import axios from "axios";
// // import "./index.css";
// // import { DotPattern } from "../../../components/ui/dot-pattern";
// // import { cn } from "../../../lib/utils";
// // import LegalInfo from "./LegalInfo.jsx";
// // import TrainingAmenities from "./Amenities";
// // import BankDetails from "./BankDetails.jsx";
// // import useLogout from "@/pages/loginPage/logout";
// // import { LogOutIcon } from "lucide-react";
// // import ProtectedRoute from "@/components/ProtectedRoute";
// // import { API_BASE_URL } from "@/config/env";

// // const checkValidateCompanyInfo = ({ form }) => {
// //   let erroMsg = "";

// //   if (!form?.itfRegistered) {
// //     erroMsg = "Centre register status is required!";
// //   }

// //   if (!form?.trainingNature) {
// //     erroMsg = "Nature of training is required!";
// //   }

// //   if (!form?.ownership) {
// //     erroMsg = "Ownership is required!";
// //   }

// //   if (!form?.establishmentDate) {
// //     erroMsg = "Establishment Date is required!";
// //   }

// //   if (!form?.email) {
// //     erroMsg = "Email is required!";
// //   }

// //   if (!form?.phoneNumber) {
// //     erroMsg = "Phone is required!";
// //   }

// //   if (!form?.contactPerson) {
// //     erroMsg = "Name of contact person is required!";
// //   }

// //   if (!form?.address) {
// //     erroMsg = "Training Centre address is required!";
// //   }

// //   if (!form?.trainingCentreName) {
// //     erroMsg = "Training Centre Name is required!";
// //   }

// //   if (!form?.areaOffice) {
// //     erroMsg = "Area Office is required!";
// //   }

// //   if (!form?.state) {
// //     erroMsg = "State   is required!";
// //   }

// //   return { erroMsg };
// // };

// // const checkAmeanities = ({ form }) => {
// //   let erroMsg = "";

// //   if (!form?.portableWater || !form?.observeBreak) {
// //     erroMsg = "Please complete form to proceed!";
// //   }

// //   return { erroMsg };
// // };

// // const checkAsssessment = ({ form }) => {
// //   let erroMsg = "";

// //   if (
// //     !form?.traineeInstructorRatio ||
// //     !form?.practicalTheoryRatio ||
// //     !form?.trainingDurationPerDay ||
// //     !form?.trainingDurationPerWeek ||
// //     !form?.weeklyTrainingSchedule ||
// //     !form?.trainingCurriculum
// //   ) {
// //     erroMsg = "Please complete form to proceed!";
// //   }

// //   return { erroMsg };
// // };

// // // const checkLegal = ({ form }) => {
// // //   let erroMsg = "";

// // //   if (!form?.legalRegistration) {
// // //     erroMsg = "Please complete legal registration to proceed!";
// // //   }

// // //   return { erroMsg };
// // // };
// // const checkLegal = ({ form }) => {
// //   let erroMsg = "";

// //   // Ensure legal registration exists
// //   if (!form?.legalRegistration) {
// //     erroMsg = "Please complete legal registration to proceed!";
// //     return { erroMsg };
// //   }

// //   // Validate tradeAreas array
// //   const tradeAreas = form?.tradeAreas || [];

// //   // Check if at least one trade area is provided
// //   if (tradeAreas.length === 0) {
// //     erroMsg = "At least one Trade Area is required!";
// //     return { erroMsg };
// //   }

// //   // Validate each trade area fields
// //   const invalidTradeArea = tradeAreas.find((area, index) => {
// //     return (
// //       !area.sector?.trim() ||
// //       !area.tradeArea?.trim() ||
// //       area.instructors === 0 ||
// //       area.trainees === 0 ||
// //       !area.facilities?.trim() ||
// //       !area.equipment?.trim() ||
// //       !area.tools?.trim()
// //     );
// //   });

// //   if (invalidTradeArea) {
// //     erroMsg = "Please complete all Trade Area details!";
// //     return { erroMsg };
// //   }

// //   return { erroMsg };
// // };

// // const checkValidateBank = ({ form }) => {
// //   let erroMsg = "";
// //   if (
// //     !form?.bankAccount?.accountName ||
// //     !form?.bankAccount?.accountNumber ||
// //     !form?.bankAccount?.bank
// //   ) {
// //     erroMsg = "All bank details are required!";
// //   }

// //   if (form?.bankAccount?.accountNumber?.length !== 10) {
// //     erroMsg = "Account number must be 10 digits!";
// //   }

// //   return { erroMsg };
// // };

// // const TrainingCenterForm = () => {
// //   const [step, setStep] = useState(0);

// //   // const [form, setForm] = useState({
// //   //   state: "",
// //   //   lga: "",
// //   //   areaOffice: "",
// //   //   address: "",
// //   //   contactPerson: "",
// //   //   establishmentDate: null, // Will be set as a Date object
// //   //   ownership: "",
// //   //   otherOwnership: "",
// //   //   trainingCentreName: "",
// //   //   trainingNature: "",
// //   //   itfRegistered: "",
// //   //   itfRegistrationNumber: "",
// //   //   bankAccount: {
// //   //     accountName: "",
// //   //     accountNumber: "",
// //   //     bank: "",
// //   //   },
// //   //   amenities: {
// //   //     portableWater: "",
// //   //     observeBreak: "",
// //   //     breakTime: "",
// //   //     otherComments: "",
// //   //   },
// //   //   assessment: {
// //   //     traineeInstructorRatio: "",
// //   //     practicalTheoryRatio: "",
// //   //     trainingDurationPerDay: "",
// //   //     trainingDurationPerWeek: "",
// //   //     weeklyTrainingSchedule: "",
// //   //     trainingCurriculum: "",
// //   //     curriculumAttachment: "",
// //   //     attendanceRegister: "",
// //   //     infrastructure: [
// //   //       {
// //   //         type: "",
// //   //         number: 0,
// //   //       },
// //   //     ],
// //   //     utilities: [
// //   //       {
// //   //         type: "",
// //   //         number: 0,
// //   //         functional: false,
// //   //         notFunctional: false,
// //   //         remarks: "",
// //   //       },
// //   //     ],
// //   //     totalFloorArea: 0,
// //   //   },
// //   //   legalInfo: {
// //   //     legalRegistration: "",
// //   //     supportingDocuments: [],
// //   //     tradeAreas: [
// //   //       {
// //   //         tradeArea: "",
// //   //         instructors: 0,
// //   //         trainees: 0,
// //   //         facilities: "",
// //   //         equipment: "",
// //   //         tools: "",
// //   //       },
// //   //     ],
// //   //     instructorCredentials: [],
// //   //     additionalDetails: "",
// //   //   },
// //   //   agree: false,
// //   //   regNum: "",
// //   //   createdAt: null, // Will be set as a Date object
// //   //   updatedAt: null, // Will be set as a Date object
// //   // });
// //   const [form, setForm] = useState({
// //     state: "",
// //     lga: "",
// //     areaOffice: "",
// //     address: "",
// //     contactPerson: "",
// //     establishmentDate: null, // Will be set as a Date object
// //     ownership: "",
// //     otherOwnership: "",
// //     trainingCentreName: "",
// //     trainingNature: "",
// //     itfRegistered: "",
// //     itfRegistrationNumber: "",
// //     bankAccount: {
// //       accountName: "",
// //       accountNumber: "",
// //       bank: "",
// //     },
// //     amenities: {
// //       portableWater: "",
// //       observeBreak: "",
// //       breakTime: "",
// //       otherComments: "",
// //     },
// //     assessment: {
// //       traineeInstructorRatio: "",
// //       practicalTheoryRatio: "",
// //       trainingDurationPerDay: "",
// //       trainingDurationPerWeek: "",
// //       weeklyTrainingSchedule: "",
// //       trainingCurriculum: "",
// //       curriculumAttachment: "",
// //       attendanceRegister: "",
// //       infrastructure: [
// //         {
// //           type: "",
// //           number: 0,
// //         },
// //       ],
// //       utilities: [
// //         {
// //           type: "",
// //           number: 0,
// //           functional: false,
// //           notFunctional: false,
// //           remarks: "",
// //         },
// //       ],
// //       totalFloorArea: 0,
// //     },
// //     legalInfo: {
// //       legalRegistration: "",
// //       supportingDocuments: [],
// //       tradeAreas: [
// //         {
// //           sector: "",
// //           tradeArea: "",
// //           instructors: 0,
// //           trainees: 0,
// //           facilities: "",
// //           equipment: "",
// //           tools: "",
// //         },
// //       ],
// //       instructorCredentials: [],
// //       additionalDetails: "",
// //     },
// //     verificationDocuments: {
// //       certificateOfRegistration: "",
// //       taxClearanceCertificate: "",
// //       proofOfAddress: "",
// //       accreditationCertificate: "",
// //     },
// //     agree: false,
// //     regNum: "",
// //     createdAt: null, // Will be set as a Date object
// //     updatedAt: null, // Will be set as a Date object
// //   });

// //   const onChangeBankInput = (id, value) => {
// //     setForm((prevForm) => ({
// //       ...prevForm,
// //       bankAccount: {
// //         ...prevForm.bankAccount,
// //         [id]: value,
// //       },
// //     }));
// //   };

// //   const [show, setShow] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }, [step]);

// //   const goNext = () => {
// //     if (step === 0) {
// //       const erroMsg = checkValidateCompanyInfo({ form })?.erroMsg;
// //       if (erroMsg) {
// //         return toast.error(erroMsg, { position: "top-right" });
// //       }
// //     }

// //     if (step === 1) {
// //       const erroMsg = checkAmeanities({ form })?.erroMsg;
// //       if (erroMsg) {
// //         return toast.error(erroMsg, { position: "top-right" });
// //       }
// //     }

// //     if (step === 2) {
// //       const erroMsg = checkAsssessment({ form })?.erroMsg;
// //       if (erroMsg) {
// //         return toast.error(erroMsg, { position: "top-right" });
// //       }
// //     }
// //     // if (step === 3) {
// //     //   const erroMsg = checkDocuments({ form })?.erroMsg;
// //     //   if (erroMsg) {
// //     //     return toast.error(erroMsg, { position: "top-right" });
// //     //   }
// //     // }
// //     if (step === 4) {
// //       const erroMsg = checkLegal({ form })?.erroMsg;
// //       if (erroMsg) {
// //         return toast.error(erroMsg, { position: "top-right" });
// //       }
// //     }

// //     if (step === 5) {
// //       const erroMsg = checkValidateBank({ form })?.erroMsg;
// //       if (erroMsg) {
// //         return toast.error(erroMsg, { position: "top-right" });
// //       }
// //     }

// //     setStep((prev) => prev + 1);
// //   };

// //   const goBack = () => setStep((prev) => prev - 1);

// //   const onchangeInput = (id, value) => {
// //     setForm((prevForm) => ({
// //       ...prevForm,
// //       [id]: value,
// //     }));
// //   };
// //   const userID = localStorage.getItem("userId"); // Replace 'userID' with your storage key if different

// //   const submitForm = async () => {
// //     // Ensure userID exists
// //     if (!userID) {
// //       toast.error("User ID is missing. Please log in again.", {
// //         position: "top-right",
// //       });
// //       return;
// //     }

// //     // Get the token from localStorage
// //     const token = localStorage.getItem("accessToken"); // Replace 'accessToken' with the actual key if different
// //     if (!token) {
// //       toast.error("Authorization token is missing. Please log in again.", {
// //         position: "top-right",
// //       });
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await axios.patch(`${API_BASE_URL}/training-centers/${userID}`, form, {
// //         headers: {
// //           Authorization: `Bearer ${token}`, // Attach the bearer token
// //           "Content-Type": "application/json",
// //         },
// //       });
// //       toast.success("Training Center Registered Successfully!");
// //       setShow(true); // Show success modal or message
// //     } catch (error) {
// //       toast.error(error?.response?.data?.message || "Submission failed!");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const controlButtons = (
// //     <div className="flex w-full justify-end gap-3">
// //       {step > 0 && (
// //         <button
// //           disabled={loading}
// //           onClick={goBack}
// //           className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]">
// //           Back
// //         </button>
// //       )}
// //       {step === 6 ? (
// //         form.agree && (
// //           <button
// //             disabled={loading}
// //             onClick={submitForm}
// //             className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
// //             {loading ? "Submitting..." : "Submit"}
// //           </button>
// //         )
// //       ) : (
// //         <button
// //           onClick={goNext}
// //           className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
// //           Next
// //         </button>
// //       )}
// //     </div>
// //   );

// //   const logout = useLogout();

// //   return (
// //     <div>
// //       <ProtectedRoute>
// //       <RegisterSuccess show={show} setShow={setShow} />
// //       <div className="">
// //         <div>
// //           <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900  border-b-[1px]">
// //             <h1 className="header text-sm text-emerald-600"></h1>
// //             <button
// //               onClick={logout}
// //               className="absolute top-20 flex flex-row gap-4 right-16 hover:bg-slate-800 text-white text-sm">
// //               LogOut <LogOutIcon />
// //             </button>
// //             <Stepper
// //               activeStep={step}
// //               className="border-b-gray-300 scale-[0.8]">
// //               <Step
// //                 index={0}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Company Information
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={1}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Training Center Amenities
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={2}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Training Centre Assessment
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={3}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Document Verification
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={4}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Legal and Trade Information
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={5}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Bank Details
// //                   </span>
// //                 }
// //               />
// //               <Step
// //                 index={6}
// //                 label={
// //                   <span className="text-sm font-semibold text-white">
// //                     Declaration
// //                   </span>
// //                 }
// //               />
// //             </Stepper>
// //           </div>

// //           <div>
// //             <div className="relative py-7">
// //               <DotPattern
// //                 width={20}
// //                 height={20}
// //                 cx={1}
// //                 cy={1}
// //                 cr={1}
// //                 className={cn("fill-neutral-400/40")}
// //               />

// //               {step === 0 && (
// //                 <CompanyInfo
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //               {step === 1 && (
// //                 <TrainingAmenities
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //               {step === 2 && (
// //                 <Instructors
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //               {step === 3 && (
// //                 <VerificationDocuments
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //               {step === 4 && (
// //                 <LegalInfo
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //               {step === 5 && (
// //                 <BankDetails
// //                   form={form}
// //                   setForm={setForm}
// //                   controlButtons={controlButtons}
// //                   onChangeBankInput={onChangeBankInput}
// //                 />
// //               )}
// //               {step === 6 && (
// //                 <Declaration
// //                   form={form}
// //                   onchangeInput={onchangeInput}
// //                   controlButtons={controlButtons}
// //                 />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       </ProtectedRoute>
// //     </div>
// //   );
// // };

// // export default TrainingCenterForm;

// "use client"

// import { useState, useEffect } from "react"
// import { Stepper, Step } from "react-form-stepper"
// import CompanyInfo from "./CompanyInfo"

// import Instructors from "./Instructors"
// import VerificationDocuments from "./VerificationDocuments"
// import Declaration from "./Declaration"
// import RegisterSuccess from "../../../components/SuccessRegister"
// import { toast } from "sonner"
// import axios from "axios"
// import "./index.css"
// import { DotPattern } from "../../../components/ui/dot-pattern"
// import { cn } from "../../../lib/utils"
// import LegalInfo from "./LegalInfo.jsx"
// import TrainingAmenities from "./Amenities"
// import BankDetails from "./BankDetails.jsx"
// import useLogout from "@/pages/loginPage/logout"
// import { LogOutIcon } from "lucide-react"
// import ProtectedRoute from "@/components/ProtectedRoute"
// import { API_BASE_URL } from "@/config/env"

// const checkValidateCompanyInfo = ({ form }) => {
//   let erroMsg = ""

//   if (!form?.itfRegistered) {
//     erroMsg = "Centre register status is required!"
//   }

//   if (!form?.trainingNature) {
//     erroMsg = "Nature of training is required!"
//   }

//   if (!form?.ownership) {
//     erroMsg = "Ownership is required!"
//   }

//   if (!form?.establishmentDate) {
//     erroMsg = "Establishment Date is required!"
//   }

//   if (!form?.phoneNumber) {
//     erroMsg = "Phone is required!"
//   }

//   if (!form?.contactPerson) {
//     erroMsg = "Name of contact person is required!"
//   }

//   if (!form?.address) {
//     erroMsg = "Training Centre address is required!"
//   }

//   if (!form?.areaOffice) {
//     erroMsg = "Area Office is required!"
//   }

//   if (!form?.state) {
//     erroMsg = "State   is required!"
//   }

//   return { erroMsg }
// }

// const checkAmeanities = ({ form }) => {
//   let erroMsg = ""

//   if (!form?.amenities?.portableWater || !form?.amenities?.observeBreak) {
//     erroMsg = "Please complete form to proceed!"
//   }

//   return { erroMsg }
// }

// // const checkAsssessment = ({ form }) => {
// //   let erroMsg = ""

// //   if (
// //     !form?.traineeInstructorRatio ||
// //     !form?.practicalTheoryRatio ||
// //     !form?.trainingDurationPerDay ||
// //     !form?.trainingDurationPerWeek ||
// //     !form?.weeklyTrainingSchedule ||
// //     !form?.trainingCurriculum
// //   ) {
// //     erroMsg = "Please complete form to proceed!"
// //   }

// //   return { erroMsg }
// // }

// const checkAsssessment = ({ form }) => {
//   let errorMsg = ""

//   const assessment = form?.assessment

//   if (
//     !assessment?.traineeInstructorRatio ||
//     !assessment?.practicalTheoryRatio ||
//     !assessment?.trainingDurationPerDay ||
//     !assessment?.trainingDurationPerWeek ||
//     !assessment?.weeklyTrainingSchedule ||
//     !assessment?.trainingCurriculum
//   ) {
//     errorMsg = "Please complete the assessment form to proceed!"
//   }

//   if (
//     assessment?.trainingCurriculum === "yes" &&
//     !assessment?.curriculumAttachment
//   ) {
//     errorMsg = "Please attach the curriculum to proceed!"
//   }

//   return { errorMsg }
// }

// // const checkLegal = ({ form }) => {
// //   let erroMsg = "";

// //   if (!form?.legalRegistration) {
// //     erroMsg = "Please complete legal registration to proceed!";
// //   }

// //   return { erroMsg };
// // };
// const checkLegal = ({ form }) => {
//   let errorMsg = "";

//   // Ensure legal registration exists
//   if (!form?.legalRegistration) {
//     errorMsg = "Please complete legal registration to proceed!";
//     return { errorMsg };
//   }

//   // Validate tradeAreas array
//   const tradeAreas = form?.tradeAreas || [];

//   // Check if at least one trade area is provided
//   if (tradeAreas.length === 0) {
//     errorMsg = "At least one Trade Area is required!";
//     return { errorMsg };
//   }

//   // Validate each trade area field
//   const invalidTradeArea = tradeAreas.find((area, index) => {
//     return (
//       !area.sector?.trim() ||
//       !area.tradeArea?.trim() ||
//       area.instructors <= 0 ||  // Check if number of instructors is positive
//       area.trainees <= 0 ||     // Check if number of trainees is positive
//       !area.facilities?.trim() ||
//       !area.equipment?.trim() ||
//       !area.tools?.trim()
//     );
//   });

//   if (invalidTradeArea) {
//     errorMsg = "Please complete all Trade Area details!";
//     return { errorMsg };
//   }

//   return { errorMsg };
// }

// const checkValidateBank = ({ form }) => {
//   let erroMsg = ""
//   if (!form?.bankAccount?.accountName || !form?.bankAccount?.accountNumber || !form?.bankAccount?.bank) {
//     erroMsg = "All bank details are required!"
//   }

//   if (form?.bankAccount?.accountNumber?.length !== 10) {
//     erroMsg = "Account number must be 10 digits!"
//   }

//   return { erroMsg }
// }

// const TrainingCenterForm = () => {
//   const [step, setStep] = useState(0)

//   // const [form, setForm] = useState({
//   //   state: "",
//   //   lga: "",
//   //   areaOffice: "",
//   //   address: "",
//   //   contactPerson: "",
//   //   establishmentDate: null, // Will be set as a Date object
//   //   ownership: "",
//   //   otherOwnership: "",
//   //   trainingCentreName: "",
//   //   trainingNature: "",
//   //   itfRegistered: "",
//   //   itfRegistrationNumber: "",
//   //   bankAccount: {
//   //     accountName: "",
//   //     accountNumber: "",
//   //     bank: "",
//   //   },
//   //   amenities: {
//   //     portableWater: "",
//   //     observeBreak: "",
//   //     breakTime: "",
//   //     otherComments: "",
//   //   },
//   //   assessment: {
//   //     traineeInstructorRatio: "",
//   //     practicalTheoryRatio: "",
//   //     trainingDurationPerDay: "",
//   //     trainingDurationPerWeek: "",
//   //     weeklyTrainingSchedule: "",
//   //     trainingCurriculum: "",
//   //     curriculumAttachment: "",
//   //     attendanceRegister: "",
//   //     infrastructure: [
//   //       {
//   //         type: "",
//   //         number: 0,
//   //       },
//   //     ],
//   //     utilities: [
//   //       {
//   //         type: "",
//   //         number: 0,
//   //         functional: false,
//   //         notFunctional: false,
//   //         remarks: "",
//   //       },
//   //     ],
//   //     totalFloorArea: 0,
//   //   },
//   //   legalInfo: {
//   //     legalRegistration: "",
//   //     supportingDocuments: [],
//   //     tradeAreas: [
//   //       {
//   //         tradeArea: "",
//   //         instructors: 0,
//   //         trainees: 0,
//   //         facilities: "",
//   //         equipment: "",
//   //         tools: "",
//   //       },
//   //     ],
//   //     instructorCredentials: [],
//   //     additionalDetails: "",
//   //   },
//   //   agree: false,
//   //   regNum: "",
//   //   createdAt: null, // Will be set as a Date object
//   //   updatedAt: null, // Will be set as a Date object
//   // });
//   const [form, setForm] = useState({
//     state: "",
//     lga: "",
//     areaOffice: "",
//     address: "",
//     contactPerson: "",
//     establishmentDate: null,
//     ownership: "",
//     otherOwnership: "",
//     trainingCentreName: "",
//     trainingNature: "",
//     itfRegistered: "",
//     itfRegistrationNumber: "",
//     bankAccount: {
//       accountName: "",
//       accountNumber: "",
//       bank: "",
//     },
//     amenities: {
//       portableWater: "",
//       observeBreak: "",
//       breakTime: "",
//       otherComments: "",
//     },
//     assessment: {
//       traineeInstructorRatio: "",
//       practicalTheoryRatio: "",
//       trainingDurationPerDay: "",
//       trainingDurationPerWeek: "",
//       weeklyTrainingSchedule: "",
//       trainingCurriculum: "",
//       curriculumAttachment: "",
//       attendanceRegister: "",
//       infrastructure: [],
//       utilities: [],
//       totalFloorArea: 0,
//     },
//     legalInfo: {
//       legalRegistration: "",
//       supportingDocuments: [],
//       tradeAreas: [],
//       instructorCredentials: [],
//       additionalDetails: "",
//     },
//     verificationDocuments: {
//       certificateOfRegistration: "",
//       taxClearanceCertificate: "",
//       proofOfAddress: "",
//       accreditationCertificate: "",
//     },
//     agree: false,
//     regNum: "",
//   })

//   const onChangeBankInput = (id, value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       bankAccount: {
//         ...prevForm.bankAccount,
//         [id]: value,
//       },
//     }))
//   }

//   const [show, setShow] = useState(false)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }, [step])

//   const goNext = () => {
//     if (step === 0) {
//       const erroMsg = checkValidateCompanyInfo({ form })?.erroMsg
//       if (erroMsg) {
//         return toast.error(erroMsg, { position: "top-right" })
//       }
//     }

//     if (step === 1) {
//       const erroMsg = checkAmeanities({ form })?.erroMsg
//       if (erroMsg) {
//         return toast.error(erroMsg, { position: "top-right" })
//       }
//     }

//     if (step === 2) {
//       const erroMsg = checkAsssessment({ form })?.erroMsg
//       if (erroMsg) {
//         return toast.error(erroMsg, { position: "top-right" })
//       }
//     }
//     // if (step === 3) {
//     //   const erroMsg = checkDocuments({ form })?.erroMsg;
//     //   if (erroMsg) {
//     //     return toast.error(erroMsg, { position: "top-right" });
//     //   }
//     // }
//     if (step === 4) {
//       const erroMsg = checkLegal({ form })?.erroMsg
//       if (erroMsg) {
//         return toast.error(erroMsg, { position: "top-right" })
//       }
//     }

//     if (step === 5) {
//       const erroMsg = checkValidateBank({ form })?.erroMsg
//       if (erroMsg) {
//         return toast.error(erroMsg, { position: "top-right" })
//       }
//     }

//     setStep((prev) => prev + 1)
//   }

//   const goBack = () => setStep((prev) => prev - 1)

//   const onchangeInput = (id, value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [id]: value,
//     }))
//   }
//   const userID = localStorage.getItem("userId") // Replace 'userID' with your storage key if different

//   const submitForm = async () => {
//     // Ensure userID exists
//     if (!userID) {
//       toast.error("User ID is missing. Please log in again.", {
//         position: "top-right",
//       })
//       return
//     }

//     // Get the token from localStorage
//     const token = localStorage.getItem("accessToken") // Replace 'accessToken' with the actual key if different
//     if (!token) {
//       toast.error("Authorization token is missing. Please log in again.", {
//         position: "top-right",
//       })
//       return
//     }

//     setLoading(true)
//     console.log("Submitting form data:", JSON.stringify(form, null, 2))
//     try {
//       await axios.patch(`${API_BASE_URL}/training-centers/${userID}`, form, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Attach the bearer token
//           "Content-Type": "application/json",
//         },
//       })
//       toast.success("Training Center Registered Successfully!")
//       setShow(true) // Show success modal or message
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Submission failed!")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const controlButtons = (
//     <div className="flex w-full justify-end gap-3">
//       {step > 0 && (
//         <button
//           disabled={loading}
//           onClick={goBack}
//           className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]"
//         >
//           Back
//         </button>
//       )}
//       {step === 6 ? (
//         form.agree && (
//           <button
//             disabled={loading}
//             onClick={submitForm}
//             className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         )
//       ) : (
//         <button onClick={goNext} className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
//           Next
//         </button>
//       )}
//     </div>
//   )

//   const logout = useLogout()

//   return (
//     <div>
//       <ProtectedRoute>
//         <RegisterSuccess show={show} setShow={setShow} />
//         <div className="">
//           <div>
//             <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900  border-b-[1px]">
//               <h1 className="header text-sm text-emerald-600"></h1>
//               <button
//                 onClick={logout}
//                 className="absolute top-20 flex flex-row gap-4 right-16 hover:bg-slate-800 text-white text-sm"
//               >
//                 LogOut <LogOutIcon />
//               </button>
//               <Stepper activeStep={step} className="border-b-gray-300 scale-[0.8]">
//                 <Step index={0} label={<span className="text-sm font-semibold text-white">Company Information</span>} />
//                 <Step
//                   index={1}
//                   label={<span className="text-sm font-semibold text-white">Training Center Amenities</span>}
//                 />
//                 <Step
//                   index={2}
//                   label={<span className="text-sm font-semibold text-white">Training Centre Assessment</span>}
//                 />
//                 <Step
//                   index={3}
//                   label={<span className="text-sm font-semibold text-white">Document Verification</span>}
//                 />
//                 <Step
//                   index={4}
//                   label={<span className="text-sm font-semibold text-white">Legal and Trade Information</span>}
//                 />
//                 <Step index={5} label={<span className="text-sm font-semibold text-white">Bank Details</span>} />
//                 <Step index={6} label={<span className="text-sm font-semibold text-white">Declaration</span>} />
//               </Stepper>
//             </div>

//             <div>
//               <div className="relative py-7">
//                 <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className={cn("fill-neutral-400/40")} />

//                 {step === 0 && <CompanyInfo form={form} setForm={setForm} controlButtons={controlButtons} />}
//                 {step === 1 && <TrainingAmenities form={form} setForm={setForm} controlButtons={controlButtons} />}
//                 {step === 2 && <Instructors form={form} setForm={setForm} controlButtons={controlButtons} />}
//                 {step === 3 && <VerificationDocuments form={form} setForm={setForm} controlButtons={controlButtons} />}
//                 {step === 4 && <LegalInfo form={form} setForm={setForm} controlButtons={controlButtons} />}
//                 {step === 5 && (
//                   <BankDetails
//                     form={form}
//                     setForm={setForm}
//                     controlButtons={controlButtons}
//                     onChangeBankInput={onChangeBankInput}
//                   />
//                 )}
//                 {step === 6 && (
//                   <Declaration form={form} onchangeInput={onchangeInput} controlButtons={controlButtons} />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </ProtectedRoute>
//     </div>
//   )
// }

// export default TrainingCenterForm

"use client";

import { useState, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import CompanyInfo from "./CompanyInfo";

import Instructors from "./Instructors";
import VerificationDocuments from "./VerificationDocuments";
import Declaration from "./Declaration";
import RegisterSuccess from "../../../components/SuccessRegister";
import { toast } from "sonner";
import axios from "axios";
import "./index.css";
import { DotPattern } from "../../../components/ui/dot-pattern";
import { cn } from "../../../lib/utils";
import LegalInfo from "./LegalInfo.jsx";
import TrainingAmenities from "./Amenities";
import BankDetails from "./BankDetails.jsx";
import useLogout from "@/pages/loginPage/logout";
import { LogOutIcon } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/config/env";

const checkValidateCompanyInfo = ({ form }) => {
  let erroMsg = "";

  if (!form?.itfRegistered) {
    erroMsg = "Centre register status is required!";
  }

  if (!form?.trainingNature) {
    erroMsg = "Nature of training is required!";
  }

  if (!form?.ownership) {
    erroMsg = "Ownership is required!";
  }

  if (!form?.establishmentDate) {
    erroMsg = "Establishment Date is required!";
  }

  if (!form?.phoneNumber) {
    erroMsg = "Phone is required!";
  }

  if (!form?.contactPerson) {
    erroMsg = "Name of contact person is required!";
  }

  if (!form?.address) {
    erroMsg = "Training Centre address is required!";
  }

  if (!form?.areaOffice) {
    erroMsg = "Area Office is required!";
  }

  if (!form?.state) {
    erroMsg = "State   is required!";
  }

  return { erroMsg };
};

const checkAmeanities = ({ form }) => {
  let erroMsg = "";

  if (!form?.amenities?.portableWater || !form?.amenities?.observeBreak) {
    erroMsg = "Please complete form to proceed!";
  }

  return { erroMsg };
};

const checkAsssessment = ({ form }) => {
  let errorMsg = "";

  const assessment = form?.assessment || {};

  if (
    !assessment.traineeInstructorRatio ||
    !assessment.practicalTheoryRatio ||
    !assessment.trainingDurationPerDay ||
    !assessment.trainingDurationPerWeek ||
    !assessment.weeklyTrainingSchedule ||
    !assessment.trainingCurriculum
  ) {
    errorMsg = "Please complete the assessment form to proceed!";
  }

  if (
    assessment.trainingCurriculum === "yes" &&
    !assessment.curriculumAttachment
  ) {
    errorMsg = "Please attach the curriculum to proceed!";
  }

  return { errorMsg };
};

const checkLegal = ({ form }) => {
  try {
    // Debug the form structure
    console.log("Form structure:", JSON.stringify(form, null, 2));

    // Check if legalInfo exists
    if (!form || !form.legalInfo) {
      return { erroMsg: "Legal information is required!" };
    }

    const legalInfo = form.legalInfo;

    // Ensure legal registration exists and is not empty
    if (
      !legalInfo.legalRegistration ||
      legalInfo.legalRegistration.trim() === ""
    ) {
      return { erroMsg: "Please complete legal registration to proceed!" };
    }

    // Validate tradeAreas array - ensure it exists
    const tradeAreas = legalInfo.tradeAreas || [];

    // Check if at least one trade area is provided
    if (!tradeAreas.length) {
      return { erroMsg: "At least one Trade Area is required!" };
    }

    // Validate each trade area field
    for (let i = 0; i < tradeAreas.length; i++) {
      const area = tradeAreas[i] || {};

      if (!area.sector || area.sector.trim() === "") {
        return { erroMsg: `Trade Area #${i + 1}: Sector is required!` };
      }

      if (!area.tradeArea || `${area?.tradeArea}`.trim() === "") {
        return { erroMsg: `Trade Area #${i + 1}: Trade Area is required!` };
      }

      // Convert to number and check if valid
      const instructors = Number(area.instructors);
      if (isNaN(instructors) || instructors <= 0) {
        return {
          erroMsg: `Trade Area #${
            i + 1
          }: Number of instructors must be greater than 0!`,
        };
      }

      // Convert to number and check if valid
      const trainees = Number(area.trainees);
      if (isNaN(trainees) || trainees <= 0) {
        return {
          erroMsg: `Trade Area #${
            i + 1
          }: Number of trainees must be greater than 0!`,
        };
      }

      if (!area.facilities || area.facilities.trim() === "") {
        return { erroMsg: `Trade Area #${i + 1}: Facilities are required!` };
      }

      if (!area.equipment || area.equipment.trim() === "") {
        return { erroMsg: `Trade Area #${i + 1}: Equipment is required!` };
      }

      if (!area.tools || area.tools.trim() === "") {
        return { erroMsg: `Trade Area #${i + 1}: Tools are required!` };
      }
    }

    return { erroMsg: "" };
  } catch (error) {
    console.error("Error in checkLegal validation:", error);
    return { erroMsg: "Validation error: " + error.message };
  }
};

const checkValidateBank = ({ form }) => {
  let erroMsg = "";

  const bankAccount = form?.bankAccount || {};

  if (
    !bankAccount.accountName ||
    !bankAccount.accountNumber ||
    !bankAccount.bank
  ) {
    erroMsg = "All bank details are required!";
  }

  if (bankAccount.accountNumber && bankAccount.accountNumber.length !== 10) {
    erroMsg = "Account number must be 10 digits!";
  }

  return { erroMsg };
};

const TrainingCenterForm = () => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    state: "",
    lga: "",
    areaOffice: "",
    address: "",
    contactPerson: "",
    establishmentDate: null,
    ownership: "",
    otherOwnership: "",
    trainingCentreName: "",
    trainingNature: "",
    itfRegistered: "",
    itfRegistrationNumber: "",
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    amenities: {
      portableWater: "",
      observeBreak: "",
      breakTime: "",
      otherComments: "",
    },
    assessment: {
      traineeInstructorRatio: "",
      practicalTheoryRatio: "",
      trainingDurationPerDay: "",
      trainingDurationPerWeek: "",
      weeklyTrainingSchedule: "",
      trainingCurriculum: "",
      curriculumAttachment: "",
      attendanceRegister: "",
      infrastructure: [],
      utilities: [],
      totalFloorArea: 0,
    },
    legalInfo: {
      legalRegistration: "",
      supportingDocuments: "",
      tradeAreas: [],
      instructorCredentials: "",
      additionalDetails: "",
    },
    verificationDocuments: {
      certificateOfRegistration: "",
      taxClearanceCertificate: "",
      proofOfAddress: "",
      accreditationCertificate: "",
    },
    agree: false,
    regNum: "",
  });

  const onChangeBankInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      bankAccount: {
        ...prevForm.bankAccount,
        [id]: value,
      },
    }));
  };

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const goNext = () => {
    try {
      if (step === 0) {
        const { erroMsg } = checkValidateCompanyInfo({ form });
        if (erroMsg) {
          return toast.error(erroMsg, { position: "top-right" });
        }
      }

      if (step === 1) {
        const { erroMsg } = checkAmeanities({ form });
        if (erroMsg) {
          return toast.error(erroMsg, { position: "top-right" });
        }
      }

      if (step === 2) {
        const { erroMsg } = checkAsssessment({ form });
        if (erroMsg) {
          return toast.error(erroMsg, { position: "top-right" });
        }
      }

      if (step === 4) {
        console.log("Checking legal info...");
        const { erroMsg } = checkLegal({ form });
        if (erroMsg) {
          console.log("Legal validation error:", erroMsg);
          return toast.error(erroMsg, { position: "top-right" });
        }
      }

      if (step === 5) {
        const { erroMsg } = checkValidateBank({ form });
        if (erroMsg) {
          return toast.error(erroMsg, { position: "top-right" });
        }
      }

      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error in goNext function:", error);
      toast.error("An error occurred while validating the form", {
        position: "top-right",
      });
    }
  };

  const goBack = () => setStep((prev) => prev - 1);

  const onchangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };
  const userID = localStorage.getItem("userId"); // Replace 'userID' with your storage key if different

  const submitForm = async () => {
    // Ensure userID exists
    if (!userID) {
      toast.error("User ID is missing. Please log in again.", {
        position: "top-right",
      });
      return;
    }

    // Get the token from localStorage
    const token = localStorage.getItem("accessToken"); // Replace 'accessToken' with the actual key if different
    if (!token) {
      toast.error("Authorization token is missing. Please log in again.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    console.log("Submitting form data:", JSON.stringify(form, null, 2));

    try {
      console.log("form", form);

      await axios.patch(`${API_BASE_URL}/training-centers/${userID}`, form, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the bearer token
          "Content-Type": "application/json",
        },
      });
      toast.success("Training Center Registered Successfully!");
      setShow(true); // Show success modal or message
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submission failed!");
    } finally {
      setLoading(false);
    }
  };

  const controlButtons = (
    <div className="flex w-full justify-end gap-3">
      {step > 0 && (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]">
          Back
        </button>
      )}
      {step === 6 ? (
        form.agree && (
          <button
            disabled={loading}
            onClick={submitForm}
            className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
            {loading ? "Submitting..." : "Submit"}
          </button>
        )
      ) : (
        <button
          onClick={goNext}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
          Next
        </button>
      )}
    </div>
  );

  const logout = useLogout();

  return (
    <div>
      <ProtectedRoute>
        <RegisterSuccess show={show} setShow={setShow} />
        <div className="">
          <div>
            <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900  border-b-[1px] ">
              <h1 className="header text-sm text-emerald-600"></h1>
              <button
                onClick={logout}
                className="absolute top-20 flex flex-row gap-4 right-16 hover:bg-slate-800 text-white text-sm">
                LogOut <LogOutIcon />
              </button>
              <Stepper
                activeStep={step}
                className="border-b-gray-300 scale-[0.8]">
                <Step
                  index={0}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Company Information
                    </span>
                  }
                />
                <Step
                  index={1}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Training Center Amenities
                    </span>
                  }
                />
                <Step
                  index={2}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Training Centre Assessment
                    </span>
                  }
                />
                <Step
                  index={3}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Document Verification
                    </span>
                  }
                />
                <Step
                  index={4}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Legal and Trade Information
                    </span>
                  }
                />
                <Step
                  index={5}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Bank Details
                    </span>
                  }
                />
                <Step
                  index={6}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Declaration
                    </span>
                  }
                />
              </Stepper>
            </div>

            <div>
              <div className="relative py-7 ">
                <DotPattern
                  width={20}
                  height={20}
                  cx={1}
                  cy={1}
                  cr={1}
                  className={cn("fill-neutral-400/40")}
                />

                {step === 0 && (
                  <CompanyInfo
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                  />
                )}
                {step === 1 && (
                  <TrainingAmenities
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                  />
                )}
                {step === 2 && (
                  <Instructors
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                  />
                )}
                {step === 3 && (
                  <VerificationDocuments
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                  />
                )}
                {step === 4 && (
                  <LegalInfo
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                  />
                )}
                {step === 5 && (
                  <BankDetails
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                    onChangeBankInput={onChangeBankInput}
                  />
                )}
                {step === 6 && (
                  <Declaration
                    form={form}
                    onchangeInput={onchangeInput}
                    controlButtons={controlButtons}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default TrainingCenterForm;
