import React, { useState, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import CompanyInfo from "./companyInfo";
import Directors from "./Directors";
import Instructors from "./Instructors";
import BankDetails from "./BankDetails";
import VerificationDocuments from "./VerificationDocuments";
import Declaration from "./Declaration";
import RegisterSuccess from "../../../components/SuccessRegister";
import { toast } from "sonner";
import axios from "axios";
import "./index.css";
import { DotPattern } from "../../../components/ui/dot-pattern";
import { cn } from "../../../lib/utils";
import ProtectedRoute from "@/components/ProtectedRoute";
import { API_BASE_URL } from "@/config/env";

const TrainingCenterForm = () => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    state: "",
    areaOffice: "",
    trainingCentreName: "",
    address: "",
    contactPerson: "",
    role: "training_center", // Fixed value based on the schema
    phoneNumber: "",
    email: "",
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
  

  const submitForm = async () => {
    // Ensure userID exists
    if (!userID) {
      toast.error("User ID is missing. Please log in again.", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/training-center/${userID}`, form);
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
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-gray-300 text-[#00524d]">
          Back
        </button>
      )}
      {step === 5 ? (
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

  return (
    <div>
      <ProtectedRoute>
        <RegisterSuccess show={show} setShow={setShow} />
        <div className="container">
          <div>
            <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900 border-b-[1px]">
              <h1 className="header text-xl text-emerald-600">
                Training Center KYC
              </h1>
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
                      Directors
                    </span>
                  }
                />
                <Step
                  index={2}
                  label={
                    <span className="text-sm font-semibold text-white">
                      Instructors
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
                      Verification Documents
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
                  <Directors
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
                  <BankDetails
                    form={form}
                    setForm={setForm}
                    controlButtons={controlButtons}
                    onChangeBankInput={onChangeBankInput}
                  />
                )}
                {step === 4 && (
                  <VerificationDocuments
                    form={form}
                    setForm={setForm}
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
      </ProtectedRoute>
    </div>
  );
};

export default TrainingCenterForm;
