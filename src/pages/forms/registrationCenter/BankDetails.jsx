const BankDetails = ({ form, setForm }) => {
    const updateField = (field, value) => {
      setForm((prev) => ({
        ...prev,
        bankAccount: { ...prev.bankAccount, [field]: value },
      }));
    };
  
    return (
      <div>
        <input
          type="text"
          placeholder="Account Name"
          value={form.bankAccount.accountName}
          onChange={(e) => updateField("accountName", e.target.value)}
        />
        <input
          type="text"
          placeholder="Account Number"
          value={form.bankAccount.accountNumber}
          onChange={(e) => updateField("accountNumber", e.target.value)}
        />
        <input
          type="text"
          placeholder="Bank"
          value={form.bankAccount.bank}
          onChange={(e) => updateField("bank", e.target.value)}
        />
      </div>
    );
  };
  
  export default BankDetails;
  