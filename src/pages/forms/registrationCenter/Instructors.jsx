const Instructors = ({ form, setForm }) => {
    const updateInstructor = (id, field, value) => {
      setForm((prev) => ({
        ...prev,
        instructors: prev.instructors.map((inst) =>
          inst.id === id ? { ...inst, [field]: value } : inst
        ),
      }));
    };
  
    const addInstructor = () => {
      setForm((prev) => ({
        ...prev,
        instructors: [
          ...prev.instructors,
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
      }));
    };
  
    const removeInstructor = (id) => {
      setForm((prev) => ({
        ...prev,
        instructors: prev.instructors.filter((inst) => inst.id !== id),
      }));
    };
  
    return (
      <div>
        <h2>Instructors</h2>
        {form.instructors.map((instructor, index) => (
          <div key={instructor.id} className="mb-4 p-4 border rounded">
            <h3>Instructor {index + 1}</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={instructor.fullName}
              onChange={(e) => updateInstructor(instructor.id, "fullName", e.target.value)}
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={instructor.dateOfBirth}
              onChange={(e) => updateInstructor(instructor.id, "dateOfBirth", e.target.value)}
            />
            <input
              type="text"
              placeholder="Nationality"
              value={instructor.nationality}
              onChange={(e) => updateInstructor(instructor.id, "nationality", e.target.value)}
            />
            <input
              type="text"
              placeholder="Residential Address"
              value={instructor.residentialAddress}
              onChange={(e) =>
                updateInstructor(instructor.id, "residentialAddress", e.target.value)
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={instructor.email}
              onChange={(e) => updateInstructor(instructor.id, "email", e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={instructor.phoneNumber}
              onChange={(e) => updateInstructor(instructor.id, "phoneNumber", e.target.value)}
            />
            <input
              type="text"
              placeholder="Qualifications"
              value={instructor.qualifications}
              onChange={(e) =>
                updateInstructor(instructor.id, "qualifications", e.target.value)
              }
            />
            <button
              onClick={() => removeInstructor(instructor.id)}
              className="btn-danger"
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={addInstructor} className="btn-primary">
          Add Instructor
        </button>
      </div>
    );
  };
  
  export default Instructors;
  