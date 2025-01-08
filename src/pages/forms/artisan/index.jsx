// import React, { useEffect, useState } from "react";

// import { Stepper, Step } from "react-form-stepper";
// import ProfessionalInformation from "./professionalInformation";
// import Education from "./education";
// import PriorSkill from "./priorSkillCertificates";
// import Experience from "./experience";
// import BankDetails from "./bankDetails";
// import Declaration from "./declaration";
// import "./index.css";
// import { DotPattern } from "../../../components/ui/dot-pattern";
// import { cn } from "../../../lib/utils";
// import RegisterSuccess from "../../../components/SuccessRegister/index";
// import axios from "axios";
// import { toast } from "sonner";
// import PageLayout from "../../../components/layout/pageLayout";

// const ArtisanForm = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [step, setStep] = useState(0);
//   const [form, setForm] = useState({
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     phone: "",
//     nin: "", // Updated for NIN
//     password: "",
//     gender: "",
//     maritalStatus: "",
//     stateOfOrigin: "",
//     lga: "",
//     stateOfResidence: "",
//     lgaOfResidence: "",
//     street: "",
//     hasDisability: false,
//     disabilityType: "", // New field for type of disability
//     email: "",
//     education: {
//       school: "",
//       highest_qualification: "",
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
//     userType: "artisan_user", // Default user type
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
//       {step === 5 ? (
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

import React, { useEffect, useState } from "react";

import { Stepper, Step } from "react-form-stepper";
import ProfessionalInformation from "./professionalInformation";
import Education from "./education";
import PriorSkill from "./priorSkillCertificates";
import Experience from "./experience";
import BankDetails from "./bankDetails";
import Declaration from "./declaration";
import "./index.css";
import { DotPattern } from "../../../components/ui/dot-pattern";
import { cn } from "../../../lib/utils";
import RegisterSuccess from "../../../components/SuccessRegister/index";
import axios from "axios";
import { toast } from "sonner";
import PageLayout from "../../../components/layout/pageLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from "@/pages/loginPage/logout";
import { LogOutIcon } from "lucide-react";
import { API_BASE_URL } from "@/config/env";

const checkValidatePersonalInfo = ({ form }) => {
  let erroMsg = "";
  if (!form?.hasDisability) {
    erroMsg = "Disability status is required!";
  }

  if (!form?.maritalStatus) {
    erroMsg = "Marital Status is required!";
  }

  if (!form?.street) {
    erroMsg = "Residential Address is required!";
  }

  if (!form?.senetorialDistrict) {
    erroMsg = "Senetorial District is required!";
  }

  if (!form?.lgaOfResidence) {
    erroMsg = "LGA of residence is required!";
  }

  if (!form?.stateOfResidence) {
    erroMsg = "State of residence is required!";
  }

  if (!form?.lga) {
    erroMsg = "LGA of origin is required!";
  }

  if (!form?.stateOfOrigin) {
    erroMsg = "State of origin is required!";
  }

  if (!form?.gender) {
    erroMsg = "Gender is required!";
  }

  if (!form?.lastName?.trim()?.length) {
    erroMsg = "Last name is required!";
  }

  if (!form?.firstName?.trim()?.length) {
    erroMsg = "First name is required!";
  }

  return { erroMsg };
};

const checkValidateEducation = ({ form }) => {
  let erroMsg = "";
  if (
    !form?.education?.school ||
    !form?.education?.highest_qualification ||
    !form?.education?.graduation_year
  ) {
    erroMsg = "All education fields are required!";
  }
  return { erroMsg };
};

const checkValidatePrior = ({ form }) => {
  let erroMsg = "";
  if (
    !form?.priorSkillsCerts?.[0]?.name ||
    !form?.priorSkillsCerts?.[0]?.year
  ) {
    erroMsg = "At least one prior skill is required!";
  }
  return { erroMsg };
};

const checkValidateExp = ({ form }) => {
  let erroMsg = "";
  if (
    !form?.experience?.[0]?.project_title ||
    !form?.experience?.[0]?.description ||
    !form?.experience?.[0]?.date_from ||
    !form?.experience?.[0]?.date_to
  ) {
    erroMsg = "At least one experience is required!";
  }
  return { erroMsg };
};

const checkValidateBank = ({ form }) => {
  let erroMsg = "";
  if (
    !form?.bankAccount?.accountName ||
    !form?.bankAccount?.accountNumber ||
    !form?.bankAccount?.bank
  ) {
    erroMsg = "All bank details are required!";
  }

  if (form?.bankAccount?.accountNumber?.length !== 10) {
    erroMsg = "Account number must be 10 digits!";
  }

  return { erroMsg };
};

const ArtisanForm = () => {
  // Retrieve userID from local storage
  const userID = localStorage.getItem("userId"); // Replace 'userID' with your storage key if different

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dob: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    senetorialDistrict: "",
    street: "",
    hasDisability: false,
    disabilityType: "",
    education: {
      school: "",
      highest_qualification: "",
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

  const goFront = () => {
    if (step === 0) {
      const erroMsg = checkValidatePersonalInfo({ form })?.erroMsg;
      if (erroMsg) {
        return toast.error(erroMsg, { position: "top-right" });
      }
    }

    if (step === 1) {
      const erroMsg = checkValidateEducation({ form })?.erroMsg;
      if (erroMsg) {
        return toast.error(erroMsg, { position: "top-right" });
      }
    }

    // if (step === 2) {
    //   const erroMsg = checkValidatePrior({ form })?.erroMsg;
    //   if (erroMsg) {
    //     return toast.error(erroMsg, { position: "top-right" });
    //   }
    // }

    if (step === 3) {
      const erroMsg = checkValidateExp({ form })?.erroMsg;
      if (erroMsg) {
        return toast.error(erroMsg, { position: "top-right" });
      }
    }

    if (step === 4) {
      const erroMsg = checkValidateBank({ form })?.erroMsg;
      if (erroMsg) {
        return toast.error(erroMsg, { position: "top-right" });
      }
    }

    setStep((prevStep) => prevStep + 1);
  };
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

  const onChangeBankInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      bankAccount: {
        ...prevForm.bankAccount,
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

  const controlButtons = (
    <div className="flex w-full justify-end">
      {step > 0 && (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-white mr-2 border-[#00524d] border-[1px] ">
          Back
        </button>
      )}
      {step === 5 ? (
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

  const logout = useLogout();

  return (
    <div>
      <ProtectedRoute>
        <RegisterSuccess show={show} setShow={setShow} />
        <PageLayout>
          <div className="">
            <div>
              <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900 border-b-[1px]">
                <h2 className="header  text-xs pr-96 text-gray-100/65 text-slate-100 ]"></h2>
                <button
                  onClick={logout}
                  className="absolute top-20 flex flex-row gap-4 right-16 hover:bg-slate-800 text-white text-sm">
                  LogOut <LogOutIcon />
                </button>
                <Stepper
                  activeStep={step}
                  className="border-b-gray-300 scale-[0.8] ">
                  <Step
                    index={0}
                    label={
                      <span className="text-sm font-semibold text-white">
                        {" "}
                        Personal Information{" "}
                      </span>
                    }
                  />
                  <Step
                    index={1}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Education{" "}
                      </span>
                    }
                  />
                  <Step
                    index={2}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Prior Skill Certificates{" "}
                      </span>
                    }
                  />
                  <Step
                    index={3}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Experience{" "}
                      </span>
                    }
                  />
                  <Step
                    index={4}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Bank Details{" "}
                      </span>
                    }
                  />
                  <Step
                    index={5}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Declaration{" "}
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
                    className={cn("fill-neutral-400/40 ")}
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
                    <Experience
                      controlButtons={controlButtons}
                      form={form}
                      onchangeInput={onchangeInput}
                    />
                  )}
                  {step === 4 && (
                    <BankDetails
                      form={form}
                      onChangeBankInput={onChangeBankInput}
                      controlButtons={controlButtons}
                    />
                  )}
                  {step === 5 && (
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
      </ProtectedRoute>
    </div>
  );
};

export default ArtisanForm;
