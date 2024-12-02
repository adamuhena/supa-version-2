import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserReassignment = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsResponse = await axios.get(`${API_BASE_URL}/tgroup`);
        setGroups(groupsResponse.data);

        const usersResponse = await axios.get(`${API_BASE_URL}/users`);
        console.log('Users Response:', usersResponse.data); // Log the response structure
        if (Array.isArray(usersResponse.data.data)) {
          setUsers(usersResponse.data.data);
        } else {
          console.error('Expected an array of users, but got:', usersResponse.data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setUsers([]); // Fallback in case of error
      }
    };
    fetchData();
  }, []);

  const handleReassign = async () => {
    try {
      await axios.post(`${API_BASE_URL}/${selectedGroup}/assign`, { userId: selectedUser });
      alert('User reassigned successfully!');
    } catch (error) {
      console.error('Error reassigning user:', error.response?.data || error.message);
      alert('Failed to reassign user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Reassign User</h2>
      <div className="mb-4">
        <label htmlFor="user" className="block mb-2">Select User</label>
        <select
          id="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a user</option>
          {Array.isArray(users) && users.map(user => (
            <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="group" className="block mb-2">Select New Group</label>
        <select
          id="group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a group</option>
          {groups.map(group => (
            <option key={group._id} value={group._id}>{group.name}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleReassign}
        disabled={!selectedUser || !selectedGroup}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        Reassign User
      </button>
    </div>
  );
};

export default UserReassignment;
