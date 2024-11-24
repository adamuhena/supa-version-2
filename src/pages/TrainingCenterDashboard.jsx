import React, { useState, useEffect } from 'react'
import axios from 'axios'

function TrainingCenterDashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [trainingGroups, setTrainingGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('NOT_STARTED')

  useEffect(() => {
    fetchTrainingGroups()
  }, [])

  const fetchTrainingGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      setTrainingGroups(response.data)
    } catch (error) {
      console.error('Error fetching training groups:', error)
    }
  }

  const handleUpdateGroup = async () => {
    try {
      await axios.put(`${API_BASE_URL}/training-groups/${selectedGroup.id}`, {
        startDate,
        endDate,
        status
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      })
      fetchTrainingGroups()
    } catch (error) {
      console.error('Error updating group:', error)
    }
  }

  const handleEvaluateUser = async (userId) => {
    // Implement user evaluation logic here
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Training Center Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Training Groups</h2>
          <select
            onChange={(e) => setSelectedGroup(trainingGroups.find(g => g.id === e.target.value))}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a training group</option>
            {trainingGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Group Details</h2>
          {selectedGroup && (
            <>
              <div className="mb-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
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
          )}
        </div>
      </div>
      {selectedGroup && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Users in Group</h2>
          <ul>
            {selectedGroup.users.map(user => (
              <li key={user.id} className="mb-2">
                {user.name}
                <button
                
onClick={() => handleEvaluateUser(user.id)}
                  className="ml-2 py-1 px-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Evaluate
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default TrainingCenterDashboard

