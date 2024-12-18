import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

const UserGroups = ({ userId }) => {
  const [assignedGroups, setAssignedGroups] = useState([]);

  useEffect(() => {
    const fetchAssignedGroups = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user-groups/${userId}`
        );
        setAssignedGroups(response.data);
      } catch (error) {
        console.error("Error fetching assigned groups:", error);
      }
    };
    fetchAssignedGroups();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Assigned Groups</h2>
      {assignedGroups.length > 0 ? (
        <ul className="space-y-4">
          {assignedGroups.map((group) => (
            <li key={group._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p>Training Period: {group.trainingPeriod}</p>
              <p>
                Start Date: {new Date(group.startDate).toLocaleDateString()}
              </p>
              <p>End Date: {new Date(group.endDate).toLocaleDateString()}</p>
              <p>Status: {group.status}</p>
              <p>Training Center: {group.trainingCenter.trainingCentreName}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not assigned to any groups.</p>
      )}
    </div>
  );
};

export default UserGroups;
