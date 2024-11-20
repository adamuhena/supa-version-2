
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

const ArtisanForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    nin: "", // Updated for NIN
    password: "",
    gender: "",
    maritalStatus: "",
    stateOfOrigin: "",
    lga: "",
    stateOfResidence: "",
    lgaOfResidence: "",
    street: "",
    hasDisability: false,
    disabilityType: "", // New field for type of disability
    email: "",
    education: {
      school: "",
      highestQualification: "",
      graduationYear: "",
      eduUpload: "", // New field for uploaded education document
    },
    priorSkillsCerts: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        sector: "",
        tradeArea: "",
        name: "",
        year: "",
        priUpload: "", // New field for uploaded certificate
      },
    ],
    experience: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        projectTitle: "",
        description: "",
        dateFrom: "",
        dateTo: "",
        exUpload: "", // New field for uploaded experience document
      },
    ],
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    userType: "artisan_user", // Default user type
    certifiedStatus: false, // New field for certified status
    licenseStatus: false, // New field for license status
    agree: false, // New field for user account status
    profileImage: "", // New field for profile picture upload
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
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/kyc`, form);
      setShow(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "An error occurred!", {
        position: "top-right",
      });
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
            onClick={submit}
            className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )
      ) : (
        <button
          onClick={goFront}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white"
        >
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
              <h2 className="header  text-xs pr-96 text-gray-100/65 text-slate-100 ]">
                
              </h2>
              <Stepper
                activeStep={step}
                className="border-b-gray-300 scale-[0.8] "
              >
                <Step index={0} label={
                  <span className="text-sm font-semibold text-white">  Personal Information </span>} />
                <Step index={1} label={
                  <span className="text-sm font-semibold text-white "> Education </span>} />
                <Step index={2} label={
                  <span className="text-sm font-semibold text-white "> Prior Skill Certificates </span>} />
                <Step index={3} label={
                  <span className="text-sm font-semibold text-white "> Experience </span>} />
                <Step index={4} label={
                  <span className="text-sm font-semibold text-white "> Bank Details </span>} />
                <Step index={5} label={
                  <span className="text-sm font-semibold text-white "> Declaration </span>} />
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
                    onchangeInput={onchangeInput}
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
    </div>
  );
};

export default ArtisanForm;