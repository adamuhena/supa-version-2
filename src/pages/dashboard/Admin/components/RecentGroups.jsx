import axios from 'axios';
import React, { useEffect, useState } from 'react';



export default function RecentGroups() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setTrainingGroups] = useState([]);


ß
    // Fetch trainingCenters from the database
    useEffect(() => {
      const fetchTrainingGroups = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
  
          const response = await axios.get(`${API_BASE_URL}/training-groups`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (response.data.success) {
            setTrainingGroups(response.data.data); // Assume data is an array of users
          }
        } catch (error) {
          console.error("Error fetching training Groups:", error);
        }
      };
  
      fetchTrainingGroups();
    }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Training Groups</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr key={group.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span>{group.trainingCenter.companyName} </span>
                  <span>{group.trainingCenter.state} </span>
                  <span>{group.trainingCenter.address} </span>
                  <span>{group.trainingCenter.phoneNumber} </span>
                  </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(group.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(group.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

