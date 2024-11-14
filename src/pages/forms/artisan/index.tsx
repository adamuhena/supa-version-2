import React, { useEffect, useState } from "react";
import Footer from "../../../components/layout/footer";
import NavBar from "../../../components/layout/navbar";
import { Stepper, Step } from "react-form-stepper";
import ProfessionalInformation from "./professionalInformation";

import Education from "./education";
import PriorSkill from "./priorSkillCertificates";
import Experience from "./experience";
import Declaration from "./declaration";
import "./index.css";

import { DotPattern } from "../../../components/ui/dot-pattern";
import { cn } from "../../../lib/utils";
import RegisterSuccess from "../../../components/SuccessRegister";
import axios from "axios";
import { toast } from "sonner";
function ArtisanForm() {
  const [step, setStep] = useState(0);

  const goFront = () => {
    setStep(step + 1);
  };
  const goBack = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    gender: "",
    maritalStatus: "",
    sector: "",
    tradeArea: "",
    state: "",
    lga: "",
    street: "",
    city: "",
    hasDisability: false,
    email: "",

    education: {
      school: "",
      highest_qualification: "",
      graduation_year: "",
    },

    priorSkillsCerts: [
      {
        id: new Date().getTime().toString() + Math.random(),
        name: "",
        year: "",
      },
    ],

    experience: [
      {
        id: new Date().getTime().toString() + Math.random(),
        project_title: "",
        description: "",
        date_from: "",
        date_to: "",
      },
    ],
    agree: false,
  });

  const onchangeInput = (id, value) => {
    setForm((x) => ({
      ...x,
      [id]: value,
    }));
  };

  const onchangeEducationInput = (id, value) => {
    setForm((x) => ({
      ...x,
      education: {
        ...x?.education,
        [id]: value,
      },
    }));
  };

  const [show, setshow] = React.useState(false);
  const [loading, setloading] = React.useState(false);

  const submit = async () => {
    setloading(true);
    try {
      await axios.post("http://localhost:3000/api/users", form);
      setshow(true);
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message || "An error occured!", {
        position: "top-right",
      });
    } finally {
      setloading(false);
    }
  };

  const controlButtons = (
    <div className="flex w-full  justify-end">
      {step === 0 ? null : (
        <button
          disabled={loading}
          onClick={goBack}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] btextg-[#00524d] ">
          Back
        </button>
      )}
      {step === 4 ? (
        form?.agree ? (
          <button
            disabled={loading}
            onClick={submit}
            className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
            {loading ? "Submitting..." : "Submit"}
          </button>
        ) : null
      ) : (
        <button
          onClick={goFront}
          className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
          Next
        </button>
      )}
    </div>
  );

  return (
    <div>
      <RegisterSuccess show={show} setshow={setshow} />

      <NavBar sticky={false} />

      <div className="">
        <div>
          <h1 className="header text-[24px] font-[600]">
            Artisan registration form
          </h1>
          <div className="sticky top-0  z-10 bg-white border-b-[1px]">
            <Stepper
              activeStep={step}
              className=" border-b-gray-300 scale-[0.8]">
              <Step index={0} label="Professional Information" />
              <Step index={1} label="Education" />
              <Step index={2} label="Prior Skill Certificates " />
              <Step index={3} label="Experience " />
              <Step index={4} label="Declaration " />
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

              {step === 0 ? (
                <ProfessionalInformation
                  controlButtons={controlButtons}
                  form={form}
                  onchangeInput={onchangeInput}
                />
              ) : null}

              {step === 1 ? (
                <Education
                  controlButtons={controlButtons}
                  form={form}
                  onchangeEducationInput={onchangeEducationInput}
                />
              ) : null}
              {step === 2 ? (
                <PriorSkill
                  controlButtons={controlButtons}
                  form={form}
                  onchangeInput={onchangeInput}
                />
              ) : null}
              {step === 3 ? (
                <Experience
                  controlButtons={controlButtons}
                  form={form}
                  onchangeInput={onchangeInput}
                />
              ) : null}
              {step === 4 ? (
                <Declaration
                  form={form}
                  onchangeInput={onchangeInput}
                  controlButtons={controlButtons}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ArtisanForm;
