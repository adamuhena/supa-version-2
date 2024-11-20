import React from "react";

const CompanyInfo = ({ form, setForm }) => {
    const updateField = (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e) => updateField("companyName", e.target.value)}
        />
        <input
          type="text"
          placeholder="Sector"
          value={form.sector}
          onChange={(e) => updateField("sector", e.target.value)}
        />
        {/* Add other fields here */}
      </div>
    );
  };
  export default CompanyInfo;
  