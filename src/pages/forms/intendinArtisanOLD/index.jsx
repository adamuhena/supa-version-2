// import React, { useEffect, useState } from "react";

// import { Stepper, Step } from "react-form-stepper";
// import ProfessionalInformation from "./professionalInformation";
// import Education from "./education";
// import PriorSkill from "./priorSkillCertificates";
// import Declaration from "./declaration";
// import BankDetails from "./bankDetails";
// import "./index.css";
// import { DotPattern } from "../../../components/ui/dot-pattern";
// import { cn } from "../../../lib/utils";
// import RegisterSuccess from "../../../components/SuccessRegister";
// import axios from "axios";
// import { toast } from "sonner";
// import PageLayout from "../../../components/layout/pageLayout";

// const IntendingArtisanForm = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [step, setStep] = useState(0);
//   const [form, setForm] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     //phone: "",
//     //nin: "", // Updated for NIN
//     //password: "",
//     gender: "",
//     maritalStatus: "",
//     stateOfOrigin: "",
//     lga: "",
//     stateOfResidence: "",
//     lgaOfResidence: "",
//     street: "",
//     hasDisability: false,
//     disabilityType: "", // New field for type of disability
//     //email: "",
//     education: {
//       school: "",
//       highestQualification: "",
//       graduationYear: "",
//       eduUpload: "", // New field for uploaded education document
//     },
//     priorSkillsCerts: [
//       {
//         id: `${new Date().getTime()}${Math.random()}`,
//         sector: "",
//         tradeArea: "",
//         name: "",
//         year: "",
//         priUpload: "", // New field for uploaded certificate
//       },
//     ],
//     experience: [
//       {
//         id: `${new Date().getTime()}${Math.random()}`,
//         projectTitle: "",
//         description: "",
//         dateFrom: "",
//         dateTo: "",
//         exUpload: "", // New field for uploaded experience document
//       },
//     ],
//     bankAccount: {
//       accountName: "",
//       accountNumber: "",
//       bank: "",
//     },
//     role: "intending_artisan", // Default user type
//     certifiedStatus: false, // New field for certified status
//     licenseStatus: false, // New field for license status
//     agree: false, // New field for user account status
//     profileImage: "", // New field for profile picture upload
//   });

//   const [show, setShow] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const goFront = () => setStep((prevStep) => prevStep + 1);
//   const goBack = () => setStep((prevStep) => prevStep - 1);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [step]);

//   const onchangeInput = (id, value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       [id]: value,
//     }));
//   };

//   const onchangeEducationInput = (id, value) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       education: {
//         ...prevForm.education,
//         [id]: value,
//       },
//     }));
//   };

//   const submit = async () => {
//     setLoading(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/kyc`, form);
//       setShow(true);
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error(error?.response?.data?.message || "An error occurred!", {
//         position: "top-right",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const controlButtons = (
//     <div className="flex w-full justify-end">
//       {step > 0 && (
//         <button
//           disabled={loading}
//           onClick={goBack}
//           className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]"
//         >
//           Back
//         </button>
//       )}
//       {step === 4 ? (
//         form.agree && (
//           <button
//             disabled={loading}
//             onClick={submit}
//             className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         )
//       ) : (
//         <button
//           onClick={goFront}
//           className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
//         >
//           Next
//         </button>
//       )}
//     </div>
//   );

//   return (
//     <div>
//       <RegisterSuccess show={show} setShow={setShow} />
//       <PageLayout>
//         <div className="">
//           <div>
//             <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900 border-b-[1px]">
//               <h1 className="header  text-xl text-emerald-600 ]">
//                 Intending Artisan KYC
//               </h1>
//               <Stepper
//                 activeStep={step}
//                 className="border-b-gray-300 scale-[0.8] "
//               >
//                 <Step index={0} label={
//                   <span className="text-sm font-semibold text-white">  Personal Information </span>} />
//                 <Step index={1} label={
//                   <span className="text-sm font-semibold text-white "> Education </span>} />
//                 <Step index={2} label={
//                   <span className="text-sm font-semibold text-white "> Intending Skill </span>} />
//                   <Step index={3} label={
//                   <span className="text-sm font-semibold text-white "> Bank Details </span>} />
//                 <Step index={4} label={
//                   <span className="text-sm font-semibold text-white "> Declaration </span>} />

//               </Stepper>
//             </div>
//             <div>
//               <div className="relative py-[30px]">
//                 <DotPattern
//                   width={20}
//                   height={20}
//                   cx={1}
//                   cy={1}
//                   cr={1}
//                   className={cn("fill-neutral-400/40 ")}
//                 />
//                 {step === 0 && (
//                   <ProfessionalInformation
//                     controlButtons={controlButtons}
//                     form={form}
//                     onchangeInput={onchangeInput}
//                   />
//                 )}
//                 {step === 1 && (
//                   <Education
//                     controlButtons={controlButtons}
//                     form={form}
//                     onchangeEducationInput={onchangeEducationInput}
//                   />
//                 )}
//                 {step === 2 && (
//                   <PriorSkill
//                     controlButtons={controlButtons}
//                     form={form}
//                     onchangeInput={onchangeInput}
//                   />
//                 )}
//                 {step === 3 && (
//                   <BankDetails
//                     form={form}
//                     onchangeInput={onchangeInput}
//                     controlButtons={controlButtons}
//                   />
//                 )}
//                 {step === 4 && (
//                   <Declaration
//                     form={form}
//                     onchangeInput={onchangeInput}
//                     controlButtons={controlButtons}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </PageLayout>
//     </div>
//   );
// };

// export default IntendingArtisanForm;

import React, { useEffect, useState } from "react";
import { Stepper, Step } from "react-form-stepper";
import ProfessionalInformation from "./professionalInformation";
import Education from "./education";
import PriorSkill from "./priorSkillCertificates";
import Declaration from "./declaration";
import BankDetails from "./bankDetails";
import "./index.css";
import { DotPattern } from "../../../components/ui/dot-pattern";
import { cn } from "../../../lib/utils";
import RegisterSuccess from "../../../components/SuccessRegister";
import axios from "axios";
import { toast } from "sonner";
import PageLayout from "../../../components/layout/pageLayout";
import { API_BASE_URL } from "@/config/env";

const IntendingArtisanForm = () => {
  // Retrieve userID from local storage
  const userID = localStorage.getItem("userID"); // Replace 'userID' with your storage key if different

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    street: "",
    hasDisability: false,
    disabilityType: "",
    education: {
      school: "",
      highestQualification: "",
      graduationYear: "",
      eduUpload: "",
    },
    priorSkillsCerts: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        sector: "",
        tradeArea: "",
        name: "",
        year: "",
        priUpload: "",
      },
    ],
    experience: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        projectTitle: "",
        description: "",
        dateFrom: "",
        dateTo: "",
        exUpload: "",
      },
    ],
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    role: "intending_artisan",
    certifiedStatus: false,
    licenseStatus: false,
    agree: false,
    profileImage: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const goFront = () => setStep((prevStep) => prevStep + 1);
  const goBack = () => setStep((prevStep) => prevStep - 1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const onchangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const onchangeEducationInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      education: {
        ...prevForm.education,
        [id]: value,
      },
    }));
  };

  const submit = async () => {
    // Ensure userID exists
    if (!userID) {
      toast.error("User ID is missing. Please log in again.", {
        position: "top-right",
      });
      return;
    }

    // Perform basic validation (you can expand this)
    if (!form.firstName || !form.lastName || !form.gender) {
      toast.error("Please fill all required fields.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true); // Disable button and show loading state

    try {
      const payload = {
        ...form,
        _id: userID, // Include userID in the payload
      };

      console.log("userID", userID);
      // POST request to submit KYC
      const response = await axios.post(
        `${API_BASE_URL}/kyc/${userID}`,
        payload
      );

      // Success: Display success message
      toast.success("KYC submitted successfully!", {
        position: "top-right",
      });

      // Show success modal
      setShow(true);
    } catch (error) {
      // Error handling
      console.error("Error submitting KYC:", error);

      // Display specific or fallback error message
      toast.error(error?.response?.data?.message || "An error occurred!", {
        position: "top-right",
      });
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  const onChangeBankInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      bankAccount: {
        ...prevForm.bankAccount,
        [id]: value,
      },
    }));
  };

  const controlButtons = (
    <div className="flex w-full justify-end">
      {step > 0 && (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]">
          Back
        </button>
      )}
      {step === 4 ? (
        form.agree && (
          <button
            disabled={loading}
            onClick={submit}
            className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
            {loading ? "Submitting..." : "Submit"}
          </button>
        )
      ) : (
        <button
          onClick={goFront}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
          Next
        </button>
      )}
    </div>
  );

  return (
    <div>
      <RegisterSuccess show={show} setShow={setShow} />
      <PageLayout>
        <div className="">
          <div>
            <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900 border-b-[1px]">
              <h1 className="header text-xl text-emerald-600">
                Intending Artisan KYC
              </h1>
              <Stepper
                activeStep={step}
                className="border-b-gray-300 scale-[0.8]">
                <Step
                  index={0}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Personal Information
                    </span>
                  }
                />
                <Step
                  index={1}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Education
                    </span>
                  }
                />
                <Step
                  index={2}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Intending Skill
                    </span>
                  }
                />
                <Step
                  index={3}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Bank Details
                    </span>
                  }
                />
                <Step
                  index={4}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Declaration
                    </span>
                  }
                />
              </Stepper>
            </div>
            <div>
              <div className="relative py-[30px]">
                <DotPattern
                  width={20}
                  height={20}
                  cx={1}
                  cy={1}
                  cr={1}
                  className={cn("fill-neutral-400/40")}
                />
                {step === 0 && (
                  <ProfessionalInformation
                    controlButtons={controlButtons}
                    form={form}
                    onchangeInput={onchangeInput}
                  />
                )}
                {step === 1 && (
                  <Education
                    controlButtons={controlButtons}
                    form={form}
                    onchangeEducationInput={onchangeEducationInput}
                  />
                )}
                {step === 2 && (
                  <PriorSkill
                    controlButtons={controlButtons}
                    form={form}
                    onchangeInput={onchangeInput}
                  />
                )}
                {step === 3 && (
                  <BankDetails
                    onchangeInput={onchangeInput}
                    controlButtons={controlButtons}
                    onChangeBankInput={onChangeBankInput}
                  />
                )}
                {step === 4 && (
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
      </PageLayout>
    </div>
  );
};

export default IntendingArtisanForm;
