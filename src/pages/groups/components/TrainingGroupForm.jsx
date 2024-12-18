import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

const TrainingGroupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    trainingPeriod: "",
    trainingCenter: "",
    startDate: "",
    endDate: "",
  });
  const [trainingPeriods, setTrainingPeriods] = useState([]);

  useEffect(() => {
    const fetchTrainingPeriods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-periods`);
        setTrainingPeriods(response.data);
      } catch (error) {
        console.error("Error fetching training periods:", error);
      }
    };
    fetchTrainingPeriods();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/tgroup`, formData);
      alert("Training group created successfully!");
      setFormData({
        name: "",
        trainingPeriod: "",
        trainingCenter: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create training group");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Create Training Group</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">
          Group Name
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
        <label htmlFor="trainingPeriod" className="block mb-2">
          Training Period
        </label>
        <select
          id="trainingPeriod"
          name="trainingPeriod"
          value={formData.trainingPeriod}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded">
          <option value="">Select a training period</option>
          {trainingPeriods.map((period) => (
            <option key={period._id} value={period._id}>
              {period.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="trainingCenter" className="block mb-2">
          Training Center
        </label>
        <input
          type="text"
          id="trainingCenter"
          name="trainingCenter"
          value={formData.trainingCenter}
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
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create Group
      </button>
    </form>
  );
};

export default TrainingGroupForm;
