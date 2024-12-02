import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupEvaluation = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupDetails, setGroupDetails] = useState(null);
  const [evaluation, setEvaluation] = useState({ userId: '', score: '', feedback: '' });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tgroup`);
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const fetchGroupDetails = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/${selectedGroup}`);
          setGroupDetails(response.data);
        } catch (error) {
          console.error('Error fetching group details:', error);
        }
      };
      fetchGroupDetails();
    }
  }, [selectedGroup]);

  const handleEvaluationChange = (e) => {
    setEvaluation({ ...evaluation, [e.target.name]: e.target.value });
  };

  const handleSubmitEvaluation = async () => {
    try {
      await axios.post(`${API_BASE_URL}/${selectedGroup}/evaluate`, evaluation);
      alert('Evaluation submitted successfully!');
      setEvaluation({ userId: '', score: '', feedback: '' });
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      alert('Failed to submit evaluation');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Group Evaluation</h2>
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
      {groupDetails && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Group Details</h3>
          <p>Name: {groupDetails.name}</p>
          <p>Training Period: {groupDetails.trainingPeriod}</p>
          <p>Status: {groupDetails.status}</p>
          <h4 className="text-lg font-semibold mt-4 mb-2">Users</h4>
          <ul>
            {groupDetails.users.map(user => (
              <li key={user._id}>{user.firstName} {user.lastName}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Submit Evaluation</h3>
        <div className="mb-2">
          <label htmlFor="userId" className="block mb-1">User</label>
          <select
            id="userId"
            name="userId"
            value={evaluation.userId}
            onChange={handleEvaluationChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select a user</option>
            {groupDetails?.users.map(user => (
              <option key={user._id} value={user._id}>{user.firstName} {user.lastName}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label htmlFor="score" className="block mb-1">Score</label>
          <input
            type="number"
            id="score"
            name="score"
            value={evaluation.score}
            onChange={handleEvaluationChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="feedback" className="block mb-1">Feedback</label>
          <textarea
            id="feedback"
            name="feedback"
            value={evaluation.feedback}
            onChange={handleEvaluationChange}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>
        <button
          onClick={handleSubmitEvaluation}
          disabled={!evaluation.userId || !evaluation.score}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Submit Evaluation
        </button>
      </div>
    </div>
  );
};

export default GroupEvaluation;

