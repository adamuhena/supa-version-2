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


const TrainingCenterForm = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    companyName: "",
    sector: "",
    regNum: "",
    address: "",
    email: "",
    phoneNumber: "",
    nin: "",
    password: "",
    agree: false,
    directors: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        fullName: "",
        dateOfBirth: "",
        nationality: "",
        residentialAddress: "",
        email: "",
        phoneNumber: "",
        meansOfIdentification: "",
      },
    ],
    instructors: [
      {
        id: `${new Date().getTime()}${Math.random()}`,
        fullName: "",
        dateOfBirth: "",
        nationality: "",
        residentialAddress: "",
        email: "",
        phoneNumber: "",
        qualifications: "",
      },
    ],
    bankAccount: {
      accountName: "",
      accountNumber: "",
      bank: "",
    },
    verificationDocuments: {
      certificateOfRegistration: "",
      taxClearanceCertificate: "",
      proofOfAddress: "",
      accreditationCertificate: "",
    },
  });

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
    // Add validation logic for each step
    if (step === 0 && !form.companyName) {
      toast.error("Company name is required.");
      return false;
    }
    // Add further validations for other steps as needed
    return true;
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/training-center`, form);
      toast.success("Training Center Registered Successfully!");
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

  return (
    <div>
      <RegisterSuccess show={show} setShow={setShow} />
      <div className="container">
        <div>
          <div className="sticky top-0 pt-16 pb-0 z-10 bg-slate-900 border-b-[1px]">
            <h1 className="header  text-xl text-emerald-600 ]">
              Training Center KYC
            </h1>
            <Stepper activeStep={step}
              className="border-b-gray-300 scale-[0.8] " >

              <Step index={0} label={
                <span className="text-sm font-semibold text-white" >Company Information</span>} />
              <Step index={1} label={
                <span className="text-sm font-semibold text-white" >Directors</span>} />
              <Step index={2} label={
                <span className="text-sm font-semibold text-white" >Instructors</span>} />
              <Step index={3} label={
                <span className="text-sm font-semibold text-white" >Bank Details</span>} />
              <Step index={4} label={
                <span className="text-sm font-semibold text-white" >Verification Documents</span>} />
              <Step index={5} label={
                <span className="text-sm font-semibold text-white" >Declaaration</span>} />
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
                className={cn("fill-neutral-400/40 ")}
              />

              {step === 0 && <CompanyInfo form={form} setForm={setForm} />}
              {step === 1 && <Directors form={form} setForm={setForm} />}
              {step === 2 && <Instructors form={form} setForm={setForm} />}
              {step === 3 && <BankDetails form={form} setForm={setForm} />}
              {step === 4 && <VerificationDocuments form={form} setForm={setForm} />}
              {step === 5 && <Declaration form={form} setForm={setForm} submitForm={submitForm} />}


            </div>
          </div>

        </div>
      </div>




      {/* <div className="flex justify-between mt-4">
        {step > 0 && (
          <button onClick={goBack} disabled={loading} className="btn-secondary">
            Back
          </button>
        )}
        {step < 5 ? (
          <button onClick={goNext} disabled={loading} className="btn-primary">
            Next
          </button>
        ) : (
          <button onClick={submitForm} disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div> */}
    </div>
  );
};

export default TrainingCenterForm;
