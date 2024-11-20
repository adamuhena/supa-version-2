const Directors = ({ form, setForm }) => {
    const updateDirector = (id, field, value) => {
      setForm((prev) => ({
        ...prev,
        directors: prev.directors.map((dir) =>
          dir.id === id ? { ...dir, [field]: value } : dir
        ),
      }));
    };
  
    const addDirector = () => {
      setForm((prev) => ({
        ...prev,
        directors: [
          ...prev.directors,
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
      }));
    };
  
    const removeDirector = (id) => {
      setForm((prev) => ({
        ...prev,
        directors: prev.directors.filter((dir) => dir.id !== id),
      }));
    };
  
    return (
      <div>
        {form.directors.map((director, index) => (
          <div key={director.id}>
            <input
              type="text"
              placeholder="Full Name"
              value={director.fullName}
              onChange={(e) => updateDirector(director.id, "fullName", e.target.value)}
            />
            {/* Add other fields */}
            <button onClick={() => removeDirector(director.id)}>Remove</button>
          </div>
        ))}
        <button onClick={addDirector}>Add Director</button>
      </div>
    );
  };
  
  export default Directors;
  