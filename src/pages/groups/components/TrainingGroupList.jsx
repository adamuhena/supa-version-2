// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TrainingGroupList = () => {
//   const [groups, setGroups] = useState([]);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         const response = await axios.get('/api/training-groups');
//         setGroups(response.data);
//       } catch (error) {
//         console.error('Error fetching groups:', error);
//       }
//     };
//     fetchGroups();
//   }, []);

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Training Groups</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {groups.map(group => (
//           <div key={group._id} className="bg-white shadow-md rounded-lg p-4">
//             <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
//             <p>Training Period: {group.trainingPeriod}</p>
//             <p>Start Date: {new Date(group.startDate).toLocaleDateString()}</p>
//             <p>End Date: {new Date(group.endDate).toLocaleDateString()}</p>
//             <p>Status: {group.status}</p>
//             <p>Training Center: {group.trainingCenter.trainingCentreName}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TrainingGroupList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

const TrainingGroupList = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/tgroup`);

        // Ensure that response data is an array
        if (Array.isArray(response.data)) {
          setGroups(response.data);
        } else {
          console.error("Expected an array, but got:", response.data);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Training Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group._id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              <p>Training Period: {group.trainingPeriod}</p>
              <p>
                Start Date: {new Date(group.startDate).toLocaleDateString()}
              </p>
              <p>End Date: {new Date(group.endDate).toLocaleDateString()}</p>
              <p>Status: {group.status}</p>
              <p>
                Training Center:{" "}
                {group.trainingCenter?.trainingCentreName || "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p>No training groups found</p>
        )}
      </div>
    </div>
  );
};

export default TrainingGroupList;
