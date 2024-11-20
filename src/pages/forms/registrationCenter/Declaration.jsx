import React, { useState } from "react";

const Declaration = ({ form, setForm, submitForm }) => {
    const [agreed, setAgreed] = useState(false);
  
    const handleAgreement = () => {
      setAgreed((prev) => !prev);
    };
  
    return (
      <div>
        <h2>Review and Declaration</h2>
        <div className="mb-6">
          <h3>Company Information</h3>
          <p><strong>Name:</strong> {form.companyName}</p>
          <p><strong>Sector:</strong> {form.sector}</p>
          <p><strong>Email:</strong> {form.email}</p>
          {/* Add other company fields */}
        </div>
  
        <div className="mb-6">
          <h3>Directors</h3>
          {form.directors.map((director, index) => (
            <div key={director.id}>
              <p><strong>Director {index + 1}:</strong></p>
              <p><strong>Name:</strong> {director.fullName}</p>
              <p><strong>Email:</strong> {director.email}</p>
              {/* Add other director fields */}
            </div>
          ))}
        </div>
  
        <div className="mb-6">
          <h3>Instructors</h3>
          {form.instructors.map((instructor, index) => (
            <div key={instructor.id}>
              <p><strong>Instructor {index + 1}:</strong></p>
              <p><strong>Name:</strong> {instructor.fullName}</p>
              <p><strong>Email:</strong> {instructor.email}</p>
              {/* Add other instructor fields */}
            </div>
          ))}
        </div>
  
        <div className="mb-6">
          <h3>Bank Details</h3>
          <p><strong>Account Name:</strong> {form.bankAccount.accountName}</p>
          <p><strong>Account Number:</strong> {form.bankAccount.accountNumber}</p>
          <p><strong>Bank:</strong> {form.bankAccount.bank}</p>
        </div>
  
        <div className="mb-6">
          <h3>Verification Documents</h3>
          <p>
            <strong>Certificate of Registration:</strong>{" "}
            {form.verificationDocuments.certificateOfRegistration ? "Uploaded" : "Not Uploaded"}
          </p>
          <p>
            <strong>Tax Clearance Certificate:</strong>{" "}
            {form.verificationDocuments.taxClearanceCertificate ? "Uploaded" : "Not Uploaded"}
          </p>
          {/* Add other documents */}
        </div>
  
        <div className="mt-6">
          <label>
            <input
              type="checkbox"
              checked={agreed}
              onChange={handleAgreement}
            />
            I hereby declare that the information provided is accurate and complete.
          </label>
        </div>
  
        <button
          onClick={submitForm}
          className="btn-primary mt-4"
          disabled={!agreed}
        >
          Submit
        </button>
      </div>
    );
  };
  
  export default Declaration;
  