import React, { useState, useEffect } from "react";
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
import useLogout from '@/pages/loginPage/logout';
import { LogOutIcon } from "lucide-react";
// import ProtectedRoute from "@/components/ProtectedRoute";

const TrainingCenterForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    state: "",
    areaOffice: "",
    address: "",
    contactPerson: "",
    establishmentDate: null, // Will be set as a Date object
    ownership: "",
    otherOwnership: "",
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
      infrastructure: [
        {
          type: "",
          number: 0,
        },
      ],
      utilities: [
        {
          type: "",
          number: 0,
          functional: false,
          notFunctional: false,
          remarks: "",
        },
      ],
      totalFloorArea: 0,
    },
    legalInfo: {
      legalRegistration: "",
      supportingDocuments: [],
      tradeAreas: [
        {
          tradeArea: "",
          instructors: 0,
          trainees: 0,
          facilities: "",
          equipment: "",
          tools: "",
        },
      ],
      instructorCredentials: [],
      additionalDetails: "",
    },
    agree: false,
    regNum: "",
    createdAt: null, // Will be set as a Date object
    updatedAt: null, // Will be set as a Date object
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
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const goBack = () => setStep((prev) => prev - 1);

  const validateStep = () => {
    // if (step === 0 && !form.companyName) {
    //   toast.error("Company name is required.");
    //   return false;
    // }
    // Add further validations for other steps as needed
    return true;
  };

  const onchangeInput = (id, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };
  const userID = localStorage.getItem("userId"); // Replace 'userID' with your storage key if different
  console.log("userID", userID);

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
    try {
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
    <div className="flex w-full justify-end">
      {step > 0 && (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]"
        >
          Back
        </button>
      )}
      {step === 5 ? (
        form.agree && (
          <button
            disabled={loading}
            onClick={submitForm}
            className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )
      ) : (
        <button
          onClick={goNext}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
        >
          Next
        </button>
      )}
    </div>
  );

  const logout = useLogout();


  return (
    <div>
      {/*<ProtectedRoute>*/}
      <RegisterSuccess show={show} setShow={setShow} />
      <div className="">
        <div>
          <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900  border-b-[1px]">
            <h1 className="header text-sm text-emerald-600">
            </h1>
            <button
              onClick={logout}
              className="absolute top-20 flex flex-row gap-4 right-16 hover:bg-slate-800 text-white text-sm"
            >
             LogOut <LogOutIcon />
            </button>
            <Stepper
              activeStep={step}
              className="border-b-gray-300 scale-[0.8]"
            >
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
                    Legal and Trade Information
                  </span>
                }
              />
              <Step
                index={4}
                label={
                  <span className="text-sm font-semibold text-white">
                    Bank Details
                  </span>
                }
              />
              <Step
                index={5}
                label={
                  <span className="text-sm font-semibold text-white">
                    Declaration
                  </span>
                }
              />
            </Stepper>
          </div>

          <div>
            <div className="relative py-7">
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
                <LegalInfo
                  form={form}
                  setForm={setForm}
                  controlButtons={controlButtons}
                  onChangeBankInput={onChangeBankInput}
                />
              )}
              {step === 4 && (
                <BankDetails
                  form={form}
                  setForm={setForm}
                  controlButtons={controlButtons}
                  onChangeBankInput={onChangeBankInput}
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
      {/*</ProtectedRoute>*/}
    </div>
  );
};

export default TrainingCenterForm;
