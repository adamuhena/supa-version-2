const VerificationDocuments = ({ form, setForm }) => {
    const updateField = (field, value) => {
      setForm((prev) => ({
        ...prev,
        verificationDocuments: { ...prev.verificationDocuments, [field]: value },
      }));
    };
  
    return (
      <div>
        <input
          type="file"
          onChange={(e) => updateField("certificateOfRegistration", e.target.files[0])}
        />
        <input
          type="file"
          onChange={(e) => updateField("taxClearanceCertificate", e.target.files[0])}
        />
        {/* Add other fields */}
      </div>
    );
  };
  
  export default VerificationDocuments;
  