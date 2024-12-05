import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardPage from '@/components/layout/DashboardLayout';
import Spinner from '@/components/layout/spinner';

const TrainingGroupDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groupDetails, setGroupDetails] = useState([]);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to toggle modal visibility
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Track selected group ID

  // Fetch all group details
  useEffect(() => {
    const fetchGroupDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');

      if (!accessToken) {
        setError('User is not authenticated.');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/training-groups`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.data.success) {
          setGroupDetails(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Failed to fetch group details.');
        console.error(err);
      }
    };

    fetchGroupDetails();
  }, []);

  // Fetch users for the selected group
  const fetchGroupUsers = async (groupId) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      setError('User is not authenticated.');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/training-groupby/${groupId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setSelectedGroupUsers(response.data.data);
        setShowModal(true); // Show the modal when users are fetched
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to fetch group users.');
      console.error(err);
    }
  };

  // Handle the click on the "View Users" button
  const handleViewUsers = (groupId) => {
    setSelectedGroupId(groupId); // Set the selected group ID
    fetchGroupUsers(groupId); // Fetch the users for the selected group
  };

  if (!groupDetails || error) {
    return (
      <div className="flex justify-center items-center h-screen">
        {error ? <div>Error: {error}</div> : <Spinner />}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardPage>
        <div>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupDetails.map((group) => (
                <tr key={group._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.startDate ? new Date(group.startDate).toLocaleDateString() : "Not started"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.endDate ? new Date(group.endDate).toLocaleDateString() : "Not ended"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.trainingCenter?.name || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.users.length || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <button
                      onClick={() => handleViewUsers(group._id)} // Use the new function
                      className="text-blue-500 hover:underline"
                    >
                      View Users
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal for displaying users in the selected group */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
                <h2 className="text-lg font-semibold">Users in Selected Group</h2>
                <ul className="mt-4">
                  {selectedGroupUsers.map((user) => (
                    <li key={user._id} className="py-1">
                      {user.firstName} {user.lastName} - {user.email}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default TrainingGroupDetails;
