import React, { useState } from "react";
import Footer from "../../../components/layout/footer";
import NavBar from "../../../components/layout/navbar";
import { Stepper, Step } from "react-form-stepper";
import BioDataForm from "./BioDataForm";
import PersonalInformation from "./personalData";
import EducationalBackground from "./educationalBackground";
import "./index.css";

function ArtisanForm() {
  const [step, setStep] = useState(0);

  const goFront = () => {
    setStep(step + 1);
  };
  const goBack = () => {
    setStep(step - 1);
  };
  return (
    <div>
      <NavBar />

      <h1>Artisan registration form</h1>
      <Stepper activeStep={step}>
        <Step index={0} label="Bio Data" />
        <Step index={1} label="Personal Information" />
        <Step index={2} label="Educational Background" />
      </Stepper>

      {step === 0 ? <BioDataForm /> : null}
      {step === 1 ? <PersonalInformation /> : null}
      {step === 2 ? <EducationalBackground /> : null}

      <div className="form_stepper_control">
        {step === 0 ? null : <button onClick={goBack}>Back</button>}
        {step === 2 ? null : <button onClick={goFront}>Next</button>}
      </div>
      <Footer />
    </div>
  );
}

export default ArtisanForm;
