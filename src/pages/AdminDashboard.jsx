import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchTrainingCenters();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      console.log('Users response:', response.data);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrainingCenters = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      console.log('Training Centers response:', response.data);
      setTrainingCenters(response.data || []);
    } catch (error) {
      console.error('Error fetching training centers:', error);
      setError('Failed to fetch training centers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignUsers = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/training-groups`,
        {
          name: groupName,
          trainingCenterId: selectedTrainingCenter,
          userIds: selectedUsers,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      // Reset form and fetch updated data
      setSelectedUsers([]);
      setSelectedTrainingCenter('');
      setGroupName('');
      fetchUsers();
      fetchTrainingCenters();
    } catch (error) {
      console.error('Error assigning users:', error);
      setError('Failed to assign users');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <select
            value={selectedTrainingCenter}
            onChange={(e) => setSelectedUsers(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select an Artisan</option>
          <ul>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <li key={user._id}>
                  <input
                    type="checkbox"
                    id={`user-${user._id}`}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => {
                      setSelectedUsers((prev) =>
                        prev.includes(user._id)
                          ? prev.filter((id) => id !== user._id)
                          : [...prev, user._id]
                      );
                    }}
                  />
                  <label htmlFor={`user-${user._id}`}>{`${user.firstName} ${user.lastName}`}</label>
                </li>
              ))
            ) : (
              <p>No users available.</p>
            )}
          </ul>
          </select>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Training Centers</h2>
          <select
            value={selectedTrainingCenter}
            onChange={(e) => setSelectedTrainingCenter(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a training center</option>
            {Array.isArray(trainingCenters) && trainingCenters.length > 0 ? (
              trainingCenters.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.name}
                </option>
              ))
            ) : (
              <option value="">No training centers available</option>
            )}
          </select>
        </div>
      </div>
      <div className="mt-4">
      <label
          htmlFor="groupName"
          className="block text-sm font-medium text-gray-700"
        >
          Group Name
        </label>
        <input
          id="groupName"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter group name"
        />
      </div>
      <button
        className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleAssignUsers}
      >
        Assign Users to Training Center
      </button>
    </div>
  );
}

export default AdminDashboard;