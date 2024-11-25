import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecentRegistrations() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [registrations, setRegistrations] = useState([]); // Holds user data

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          // Sort the data by date and slice the first 4 records
          const sortedRegistrations = response.data.data
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort descending by date
            .slice(0, 4); // Get only the top 4 most recent

          setRegistrations(sortedRegistrations);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Registrations</h2>
      <ul className="divide-y divide-gray-200">
        {registrations.map((reg) => (
          <li key={reg.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{reg.firstName + " " + reg.lastName}</p>
                <p className="text-sm text-gray-500">{reg.role}</p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-emerald-600">
                {new Date(reg.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}

              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
