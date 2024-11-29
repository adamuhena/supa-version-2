import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '@/components/layout/spinner';

const UserGroupDetails = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [groupDetails, setGroupDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const userId = localStorage.getItem('userId');

      if (!accessToken || !userId) {
        setError('User is not authenticated.');
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/group-details`, {
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
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }  
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Training Center</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation</th>
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {groupDetails.map((group, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.groupName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.startDate ? new Date(group.startDate).toLocaleDateString(): "Not started"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.endDate ? new Date(group.endDate).toLocaleDateString() : "Not ended"}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <div>
                  <p>{group.trainingCenter.name}</p>
                  <p>{group.trainingCenter.sector}</p>
                  <p>{group.trainingCenter.address}</p>
                  <p>{group.trainingCenter.email}</p>
                  <p>{group.trainingCenter.phoneNumber}</p>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {group.evaluation ? (
                  <>
                    <p>Score: {group.evaluation.score}</p>
                    <p>Feedback: {group.evaluation.feedback}</p>
                  </>
                ) : (
                  <p>No evaluation available</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserGroupDetails;
