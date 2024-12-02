import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportGenerator = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [filters, setFilters] = useState({
    trainingPeriod: '',
    status: '',
    startDate: '',
    endDate: '',
    trainingCenter: ''
  });
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-groups`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const generateReport = () => {
    const filteredGroups = groups.filter(group => {
      return (
        (!filters.trainingPeriod || group.trainingPeriod === filters.trainingPeriod) &&
        (!filters.status || group.status === filters.status) &&
        (!filters.startDate || new Date(group.startDate) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(group.endDate) <= new Date(filters.endDate)) &&
        (!filters.trainingCenter || group.trainingCenter.trainingCentreName === filters.trainingCenter)
      );
    });

    const report = {
      totalGroups: filteredGroups.length,
      totalUsers: filteredGroups.reduce((acc, group) => acc + group.users.length, 0),
      statusBreakdown: filteredGroups.reduce((acc, group) => {
        acc[group.status] = (acc[group.status] || 0) + 1;
        return acc;
      }, {}),
      groups: filteredGroups
    };

    setReport(report);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Report Generator</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="trainingPeriod" className="block mb-1">Training Period</label>
          <input
            type="text"
            id="trainingPeriod"
            name="trainingPeriod"
            value={filters.trainingPeriod}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block mb-1">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block mb-1">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="trainingCenter" className="block mb-1">Training Center</label>
          <input
            type="text"
            id="trainingCenter"
            name="trainingCenter"
            value={filters.trainingCenter}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>
      <button
        onClick={generateReport}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Generate Report
      </button>
      {report && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Report Summary</h3>
          <p>Total Groups: {report.totalGroups}</p>
          <p>Total Users: {report.totalUsers}</p>
          <h4 className="text-lg font-semibold mt-4 mb-2">Status Breakdown</h4>
          <ul>
            {Object.entries(report.statusBreakdown).map(([status, count]) => (
              <li key={status}>{status}: {count}</li>
            ))}
          </ul>
          <h4 className="text-lg font-semibold mt-4 mb-2">Groups</h4>
          <ul>
            {report.groups.map(group => (
              <li key={group._id} className="mb-2">
                <strong>{group.name}</strong> - {group.trainingPeriod}, Status: {group.status}, Users: {group.users.length}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;

