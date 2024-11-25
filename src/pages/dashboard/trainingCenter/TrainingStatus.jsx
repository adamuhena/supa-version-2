

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, LogOut, UserCircle } from "lucide-react"
import DashboardPage from '@/components/layout/DashboardLayout'
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from '@/pages/loginPage/logout'


function TrainingStatus() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("NOT_STARTED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluationModal, setEvaluationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const logout = useLogout();

  useEffect(() => {
    const fetchTrainingGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-groups`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        console.log('Training Groups response:', response.data);
        setTrainingGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching training groups:", error);
        setError('Failed to fetch training groups');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingGroups();
  }, [API_BASE_URL]);

  useEffect(() => {
    console.log('Selected Group:', selectedGroup);
    if (selectedGroup) {
      setStartDate(selectedGroup.startDate || "");
      setEndDate(selectedGroup.endDate || "");
      setStatus(selectedGroup.status || "NOT_STARTED");
    }
  }, [selectedGroup]);

  const handleUpdateGroup = async () => {
    try {
      if (selectedGroup) {
        const response = await axios.put(
          `${API_BASE_URL}/training-groups/${selectedGroup._id}`,
          { startDate, endDate, status },
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        );
        console.log('Update response:', response.data);
        setTrainingGroups((prevGroups) => 
          prevGroups.map(group => group._id === selectedGroup._id ? { ...group, startDate, endDate, status } : group)
        );
      } else {
        console.error("No selected group to update.");
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  };

  const handleGroupSelect = (e) => {
    const groupId = e.target.value;
    console.log('Selected Group Value:', groupId);
  
    const group = trainingGroups.find((g) => g._id === groupId) || null;
    console.log('Found Group:', group);
  
    setSelectedGroup(group);
  };

  const handleEvaluateUser = (userId) => {
    setSelectedUser(userId);
    setEvaluationModal(true);
  };

  const submitEvaluation = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/training-groups/${selectedGroup._id}/evaluate`,
        {
          userId: selectedUser,
          score: parseFloat(score),
          feedback
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        }
      );
      setEvaluationModal(false);
      setScore('');
      setFeedback('');
      // Refresh the training group data
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setTrainingGroups(response.data.data || []);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          <div className="mt-6">
            <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
              <CardHeader>
                <CardTitle>User List</CardTitle>
              </CardHeader>
              <CardContent>
                
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Training Center Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Training Groups</h2>
          <select
            onChange={handleGroupSelect}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a training group</option>
            {trainingGroups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Group Details</h2>
          {selectedGroup ? (
            <>
              <div className="mb-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <button
                onClick={handleUpdateGroup}
                className="mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Group
              </button>
            </>
          ) : (
            <p className="text-gray-500">Select a group to view details.</p>
          )}
        </div>
      </div>

      {selectedGroup && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Users in Group</h2>
          <ul>
            {selectedGroup.users && selectedGroup.users.length > 0 ? (
              selectedGroup.users.map((user) => (
                <li key={user._id} className="mb-2">
                  {user.firstName +" "+ user.lastName}
                  <button
                    onClick={() => handleEvaluateUser(user._id)}
                    className="ml-2 py-1 px-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Evaluate
                  </button>
                </li>
              ))
            ) : (
              <p>No users in this group.</p>
            )}
          </ul>
        </div>
      )}

      {evaluationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Evaluate User</h3>
              <div className="mt-2 px-7 py-3">
                <input
                  type="number"
                  placeholder="Score (0-100)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <textarea
                  placeholder="Feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={submitEvaluation}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  Submit Evaluation
                </button>
                <button
                  onClick={() => setEvaluationModal(false)}
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </CardContent>
            </Card>
          </div>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
}

export default TrainingStatus;

