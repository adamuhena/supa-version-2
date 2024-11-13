import React, { useState } from "react";
import Footer from "../../../components/layout/footer";
import NavBar from "../../../components/layout/navbar";
import { Stepper, Step } from "react-form-stepper";
import BioDataForm from "./BioData";
import PersonalInformation from "./professionalInformation";
import Education from "./education";
import PriorSkill from "./PriorSkillCertificates";
import Experience from "./experience";
import Declaration from "./Declaration";
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
      <NavBar sticky={false} />

      <h1>Artisan registration form</h1>
      <Stepper activeStep={step}>
        <Step index={0} label="Bio Data" />
        <Step index={1} label="Professional Information" />
        <Step index={2} label="Education" />
        <Step index={3} label="Prior Skill Certificates " />
        <Step index={4} label="Experience " />
        <Step index={5} label="Declaration " />
      </Stepper>

      {step === 0 ? <BioDataForm /> : null}
      {step === 1 ? <PersonalInformation /> : null}
      {step === 2 ? <Education /> : null}
      {step === 3 ? <PriorSkill /> : null}
      {step === 4 ? <Experience /> : null}
      {step === 5 ? <Declaration /> : null}

      <div className="form_stepper_control">
        {step === 0 ? null : <button onClick={goBack}>Back</button>}
        {step === 5 ? null : <button onClick={goFront}>Next</button>}
      </div>
      <Footer />
    </div>
  );
}

export default ArtisanForm;
