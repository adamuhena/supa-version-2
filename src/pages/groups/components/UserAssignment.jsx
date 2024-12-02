import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserAssignment = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [userType, setUserType] = useState('intending_artisan');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsResponse = await axios.get(`${API_BASE_URL}/tgroup`);
        setGroups(groupsResponse.data);
        fetchUsers();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
        params: { userType }
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userType]);

  const handleAssign = async () => {
    try {
      await axios.post(`${API_BASE_URL}/tgroup/${selectedGroup}/assign`, { userId: selectedUser });
      alert('User assigned successfully!');
    } catch (error) {
      console.error('Error assigning user:', error);
      alert('Failed to assign user');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Assign User to Group</h2>
      <div className="mb-4">
        <label htmlFor="group" className="block mb-2">Select Group</label>
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
      <div className="mb-4">
        <label htmlFor="userType" className="block mb-2">User Type</label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="intending_artisan">Intending Artisan</option>
          <option value="artisan_user">Artisan User</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="user" className="block mb-2">Select User</label>
        <select
          id="user"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select a user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAssign}
        disabled={!selectedGroup || !selectedUser}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        Assign User
      </button>
    </div>
  );
};

export default UserAssignment;

