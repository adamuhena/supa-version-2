import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainingCenterGroups = ({ trainingCenterId }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [evaluation, setEvaluation] = useState({ userId: '', score: '', feedback: '' });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-center-groups/${trainingCenterId}`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, [trainingCenterId]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setEvaluation({ userId: '', score: '', feedback: '' });
  };

  const handleEvaluationChange = (e) => {
    setEvaluation({ ...evaluation, [e.target.name]: e.target.value });
  };

  const handleSubmitEvaluation = async () => {
    try {
      await axios.post(`${API_BASE_URL}/evaluate-user`, {
        groupId: selectedGroup._id,
        ...evaluation
      });
      alert('Evaluation submitted successfully!');
      setEvaluation({ userId: '', score: '', feedback: '' });
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('Failed to submit evaluation');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Training Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Groups</h3>
          <ul className="space-y-2">
            {groups.map(group => (
              <li 
                key={group._id} 
                className={`cursor-pointer p-2 rounded ${selectedGroup?._id === group._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => handleGroupSelect(group)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>
        {selectedGroup && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Group Details</h3>
            <p>Name: {selectedGroup.name}</p>
            <p>Training Period: {selectedGroup.trainingPeriod}</p>
            <p>Status: {selectedGroup.status}</p>
            <h4 className="text-lg font-semibold mt-4 mb-2">Users</h4>
            <ul>
              {selectedGroup.users.map(user => (
                <li key={user._id}>{user.firstName} {user.lastName}</li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold mt-4 mb-2">Evaluate User</h4>
            <div className="space-y-2">
              <select
                name="userId"
                value={evaluation.userId}
                onChange={handleEvaluationChange}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select a user</option>
                {selectedGroup.users.map(user => (
                  <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
                ))}
              </select>
              <input
                type="number"
                name="score"
                placeholder="Score"
                value={evaluation.score}
                onChange={handleEvaluationChange}
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                name="feedback"
                placeholder="Feedback"
                value={evaluation.feedback}
                onChange={handleEvaluationChange}
                className="w-full px-3 py-2 border rounded"
              ></textarea>
              <button
                onClick={handleSubmitEvaluation}
                disabled={!evaluation.userId || !evaluation.score}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                Submit Evaluation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingCenterGroups;

