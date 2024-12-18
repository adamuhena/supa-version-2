// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TrainingPeriodForm = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [formData, setFormData] = useState({
//     name: '',
//     startDate: '',
//     endDate: '',
//     trainingCenter: '',
//   });
//   const [trainingCenters, setTrainingCenters] = useState([]);
//   const [userType, setUserType] = useState('intending_artisan');

//   useEffect(() => {
//     const fetchTrainingCenters = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/training-centers`);
//         setTrainingCenters(response.data);
//       } catch (error) {
//         console.error('Error fetching training centers:', error);
//       }
//     };
//     fetchTrainingCenters();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_BASE_URL}/training-periods`, {
//         ...formData,
//         userType,
//       });
//       alert('Training period created successfully!');
//       setFormData({
//         name: '',
//         startDate: '',
//         endDate: '',
//         trainingCenter: '',
//       });
//       setUserType('intending_artisan');
//     } catch (error) {
//       console.error('Error creating training period:', error);
//       alert('Failed to create training period');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
//       <h2 className="text-2xl font-bold mb-4">Create Training Period</h2>
//       <div className="mb-4">
//         <label htmlFor="name" className="block mb-2">Period Name</label>
//         <input
//           type="text"
//           id="name"
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//           className="w-full px-3 py-2 border rounded"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="startDate" className="block mb-2">Start Date</label>
//         <input
//           type="date"
//           id="startDate"
//           name="startDate"
//           value={formData.startDate}
//           onChange={handleChange}
//           required
//           className="w-full px-3 py-2 border rounded"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="endDate" className="block mb-2">End Date</label>
//         <input
//           type="date"
//           id="endDate"
//           name="endDate"
//           value={formData.endDate}
//           onChange={handleChange}
//           required
//           className="w-full px-3 py-2 border rounded"
//         />
//       </div>
//       <div className="mb-4">
//         <label htmlFor="trainingCenter" className="block mb-2">Training Center</label>
//         <select
//           id="trainingCenter"
//           name="trainingCenter"
//           value={formData.trainingCenter}
//           onChange={handleChange}
//           required
//           className="w-full px-3 py-2 border rounded"
//         >
//           <option value="">Select a training center</option>
//           {trainingCenters.map(center => (
//             <option key={center._id} value={center._id}>{center.name}</option>
//           ))}
//         </select>
//       </div>
//       <div className="mb-4">
//         <label htmlFor="userType" className="block mb-2">User Type</label>
//         <select
//           id="userType"
//           value={userType}
//           onChange={(e) => setUserType(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         >
//           <option value="intending_artisan">Intending Artisan</option>
//           <option value="artisan_user">Artisan User</option>
//         </select>
//       </div>
//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//         Create Training Period
//       </button>
//     </form>
//   );
// };

// export default TrainingPeriodForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

const TrainingPeriodForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    trainingCenter: "",
  });
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [userType, setUserType] = useState("intending_artisan");

  useEffect(() => {
    const fetchTrainingCenters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-centers`);
        console.log("Training Centers Response:", response.data); // Debugging response
        if (Array.isArray(response.data)) {
          setTrainingCenters(response.data);
        } else {
          console.error("Expected an array but got:", response.data);
          setTrainingCenters([]);
        }
      } catch (error) {
        console.error("Error fetching training centers:", error);
        setTrainingCenters([]);
      }
    };
    fetchTrainingCenters();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/training-periods`, {
        ...formData,
        userType,
      });
      alert("Training period created successfully!");
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        trainingCenter: "",
      });
      setUserType("intending_artisan");
    } catch (error) {
      console.error(
        "Error creating training period:",
        error.response?.data || error.message
      );
      alert("Failed to create training period");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Training Period</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">
          Period Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="startDate" className="block mb-2">
          Start Date
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="block mb-2">
          End Date
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="trainingCenter" className="block mb-2">
          Training Center
        </label>
        <select
          id="trainingCenter"
          name="trainingCenter"
          value={formData.trainingCenter}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded">
          <option value="">Select a training center</option>
          {Array.isArray(trainingCenters) &&
            trainingCenters.map((center) => (
              <option key={center._id} value={center._id}>
                {center.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="userType" className="block mb-2">
          User Type
        </label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full px-3 py-2 border rounded">
          <option value="intending_artisan">Intending Artisan</option>
          <option value="artisan_user">Artisan User</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Training Period
      </button>
    </form>
  );
};

export default TrainingPeriodForm;
