
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

// const checkValidatePersonalInfo = ({ form }) => {
//   let erroMsg = "";
//   if (!form?.hasDisability) {
//     erroMsg = "Disability status is required!";
//   }

//   if (!form?.maritalStatus) {
//     erroMsg = "Marital Status is required!";
//   }

//   if (!form?.street) {
//     erroMsg = "Residential Address is required!";
//   }

//   if (!form?.senetorialDistrict) {
//     erroMsg = "Senetorial District is required!";
//   }

//   if (!form?.lgaOfResidence) {
//     erroMsg = "LGA of residence is required!";
//   }

//   if (!form?.stateOfResidence) {
//     erroMsg = "State of residence is required!";
//   }

//   if (!form?.lga) {
//     erroMsg = "LGA of origin is required!";
//   }

//   if (!form?.stateOfOrigin) {
//     erroMsg = "State of origin is required!";
//   }

//   if (!form?.gender) {
//     erroMsg = "Gender is required!";
//   }

//   if (!form?.lastName?.trim()?.length) {
//     erroMsg = "Last name is required!";
//   }

//   if (!form?.firstName?.trim()?.length) {
//     erroMsg = "First name is required!";
//   }

//   return { erroMsg };
// };

const checkValidateEducation = ({ form }) => {
  let erroMsg = "";
  if (
    !form?.education?.school ||
    !form?.education?.highestQualification ||
    !form?.education?.graduationYear
  ) {
    erroMsg = "All education fields are required!";
  }

  return { erroMsg };
};

// const checkValidatePrior = ({ form }) => {
//   let erroMsg = "";
//   if (!form?.priorSkillsCerts?.[0]?.id) {
//     erroMsg = "At least one intending skill is required!";
//   }
//   return { erroMsg };
// };

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
    // firstName: "",
    // middleName: "",
    // lastName: "",
    // gender: "",
    // dob: "",
    // maritalStatus: "",
    // stateOfOrigin: "",
    // lga: "",
    // stateOfResidence: "",
    // lgaOfResidence: "",
    // senetorialDistrict: "",
    // street: "",
    // hasDisability: "",
    // disabilityType: "",
    education: {
      school: "",
      highestQualification: "",
      graduationYear: "",
      eduUpload: "",
    },
    // priorSkillsCerts: [
    //   {
    //     id: `${new Date().getTime()}${Math.random()}`,
    //     sector: "",
    //     tradeArea: "",
    //     name: "",
    //     year: "",
    //     priUpload: "",
    //   },
    // ],
    // experience: [
    //   {
    //     id: `${new Date().getTime()}${Math.random()}`,
    //     projectTitle: "",
    //     description: "",
    //     dateFrom: "",
    //     dateTo: "",
    //     exUpload: "",
    //   },
    // ],
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
    // if (step === 0) {
    //   const erroMsg = checkValidatePersonalInfo({ form })?.erroMsg;
    //   if (erroMsg) {
    //     return toast.error(erroMsg, { position: "top-right" });
    //   }
    // }

    if (step === 0) {
      const erroMsg = checkValidateEducation({ form })?.erroMsg;
      if (erroMsg) {
        return toast.error(erroMsg, { position: "top-right" });
      }
    }

    // if (step === 1) {
    //   const erroMsg = checkValidatePrior({ form })?.erroMsg;
    //   if (erroMsg) {
    //     return toast.error(erroMsg, { position: "top-right" });
    //   }
    // }

    if (step === 1) {
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
    // if (!form.firstName || !form.lastName || !form.gender) {
    //   toast.error("Please fill all required fields.", {
    //     position: "top-right",
    //   });
    //   return;
    // }

    setLoading(true); // Disable button and show loading state

    try {
      const payload = {
        ...form,
        _id: userID, // Include userID in the payload
      };

      // POST request to submit KYC
      const response = await axios.patch(
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
    <div className="flex w-full justify-end gap-3">
      {step > 0 && (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]">
          Back
        </button>
      )}
      {step === 2 ? (
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
                  {/* <Step
                    index={0}
                    label={
                      <span className="text-sm font-semibold text-white">
                        {" "}
                        Personal Information{" "}
                      </span>
                    }
                  /> */}
                  <Step
                    index={0}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Education{" "}
                      </span>
                    }
                  />
                  {/* <Step
                    index={1}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Intendin Skill
                      </span>
                    }
                  /> */}

                  <Step
                    index={1}
                    label={
                      <span className="text-sm font-semibold text-white ">
                        {" "}
                        Bank Details{" "}
                      </span>
                    }
                  />
                  <Step
                    index={2}
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
                  {/* {step === 0 && (
                    <ProfessionalInformation
                      controlButtons={controlButtons}
                      form={form}
                      onchangeInput={onchangeInput}
                    />
                  )} */}
                  {step === 0 && (
                    <Education
                      controlButtons={controlButtons}
                      form={form}
                      onchangeEducationInput={onchangeEducationInput}
                    />
                  )}
                  {/* {step === 1 && (
                    <PriorSkill
                      controlButtons={controlButtons}
                      form={form}
                      onchangeInput={onchangeInput}
                    />
                  )} */}

                  {step === 1 && (
                    <BankDetails
                      form={form}
                      onChangeBankInput={onChangeBankInput}
                      controlButtons={controlButtons}
                    />
                  )}
                  {step === 2 && (
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
