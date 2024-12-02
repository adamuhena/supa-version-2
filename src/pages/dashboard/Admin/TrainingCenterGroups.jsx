// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Settings, LogOut, UserCircle } from "lucide-react"
// import DashboardPage from '@/components/layout/DashboardLayout'
// import ProtectedRoute from "@/components/ProtectedRoute";
// import useLogout from '@/pages/loginPage/logout'

// function TrainigCenterGroup() {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [users, setUsers] = useState([]);
//   const [trainingCenters, setTrainingCenters] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedTrainingCenter, setSelectedTrainingCenter] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const logout = useLogout();

//   useEffect(() => {
//     fetchUsers();
//     fetchTrainingCenters();
//   }, []);

//   // // Fetch users with potential optimization
//   // const fetchUsers = async () => {
//   //   setIsLoading(true);
//   //   try {
//   //     const response = await axios.get(`${API_BASE_URL}/users`, {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//   //     });
//   //     console.log('Users response:', response.data);
//   //     setUsers(response.data); // Assuming the API response is an array of users
//   //   } catch (error) {
//   //     console.error('Error fetching users:', error);
//   //     setError('Failed to fetch users');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // // Fetch training centers with potential optimization
//   // const fetchTrainingCenters = async () => {
//   //   setIsLoading(true);
//   //   try {
//   //     const response = await axios.get(`${API_BASE_URL}/training-centers`, {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//   //     });
//   //     console.log('Training Centers response:', response.data);
//   //     setTrainingCenters(response.data); // Assuming the API response is an array of training centers
//   //   } catch (error) {
//   //     console.error('Error fetching training centers:', error);
//   //     setError('Failed to fetch training centers');
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

// // Update the fetchUsers function
// const fetchUsers = async () => {
//   setIsLoading(true);
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//     });
//     console.log('Users response:', response.data);
//     setUsers(response.data.data); // Access the data field
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     setError('Failed to fetch users');
//   } finally {
//     setIsLoading(false);
//   }
// };

// // Update the fetchTrainingCenters function
// const fetchTrainingCenters = async () => {
//   setIsLoading(true);
//   try {
//     const response = await axios.get(`${API_BASE_URL}/training-centers`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//     });
//     console.log('Training Centers response:', response.data);
//     setTrainingCenters(response.data.data); // Access the data field
//   } catch (error) {
//     console.error('Error fetching training centers:', error);
//     setError('Failed to fetch training centers');
//   } finally {
//     setIsLoading(false);
//   }
// };

//   const handleAssignUsers = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post(
//         `${API_BASE_URL}/training-groups`,
//         {
//           name: groupName,
//           trainingCenterId: selectedTrainingCenter,
//           userIds: selectedUsers,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         }
//       );
//       // Reset form and fetch updated data (consider specific updates if needed)
//       setSelectedUsers([]);
//       setSelectedTrainingCenter('');
//       setGroupName('');
//       fetchUsers();
//       fetchTrainingCenters();
//     } catch (error) {
//       console.error('Error assigning users:', error);
//       setError('Failed to assign users');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Double console.log issue (likely due to React Strict Mode)
//   // Consider removing when deploying to production
//   if (process.env.NODE_ENV !== 'production') {
//     console.log('Users:', users);
//     console.log('Training Centers:', trainingCenters);
//   }

//   // Rendering logic with potential conditional rendering improvements
//   return (
//     <ProtectedRoute>
//       <DashboardPage title="Artisan Dashboard">
//         <div className="container mx-auto p-6">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">USER MANAGEMENT</h1>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate('/biodata')}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>
              
//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>

//           <div className="mt-6">
//             <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
//               <CardHeader>
//                 <CardTitle>User List</CardTitle>
//               </CardHeader>
//               <CardContent>
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Users</h2>
//           <ul>
//             {users.length > 0 ? (
//               users.map((user) => (
//                 <li key={user._id}>
//                   <input
//                     type="checkbox"
//                     id={`user-${user._id}`}
//                     checked={selectedUsers.includes(user._id)}
//                     onChange={() => {
//                       setSelectedUsers((prev) =>
//                         prev.includes(user._id)
//                           ? prev.filter((id) => id !== user._id)
//                           : [...prev, user._id]
//                       );
//                     }}
//                   />
//                   <label htmlFor={`user-${user._id}`}>{`${user.firstName} ${user.lastName}`}</label>
//                 </li>
//               ))
//             ) : (
//               <p>No users available.</p>
//             )}
//           </ul>
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Training Centers</h2>
//           <select
//             value={selectedTrainingCenter}
//             onChange={(e) => setSelectedTrainingCenter(e.target.value)}
//             className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           >
//             <option value="">Select a training center</option>
//             {trainingCenters.length > 0 ? (
//               trainingCenters.map((center) => (
//                 <option key={center._id} value={center._id}>
//                   {center.trainingCentreName}
//                 </option>
//               ))
//             ) : (
//               <option value="">No training centers available</option>
//             )}
//           </select>
//         </div>
//       </div>
//       <div className="mt-4">
//         <label
//           htmlFor="groupName"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Group Name
//         </label>
//         <input
//           id="groupName"
//           type="text"
//           value={groupName}
//           onChange={(e) => setGroupName(e.target.value)}
//           className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//           placeholder="Enter group name"
//         />
//       </div>
//       <button
//         className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         onClick={handleAssignUsers}
//       >
//         Assign Users to Training Center
//       </button>
//     </div>
//     </CardContent>
//             </Card>
//           </div>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   );
// }

// export default TrainigCenterGroup;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { UserCircle, LogOut } from "lucide-react";
// import DashboardPage from "@/components/layout/DashboardLayout";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import useLogout from "@/pages/loginPage/logout";

// function TrainigCenterGroup() {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const [users, setUsers] = useState([]);
//   const [trainingCenters, setTrainingCenters] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [selectedTrainingCenter, setSelectedTrainingCenter] = useState('');
//   const [groupName, setGroupName] = useState('');
//   const [selectedRole, setSelectedRole] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedLga, setSelectedLga] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const logout = useLogout();

//   useEffect(() => {
//     fetchUsers();
//     fetchTrainingCenters();
//   }, []);

//   const fetchUsers = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/users`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setUsers(response.data.data); // Adjust based on API response structure
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setError('Failed to fetch users');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchTrainingCenters = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/training-centers`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//       });
//       setTrainingCenters(response.data.data); // Adjust based on API response structure
//     } catch (error) {
//       console.error('Error fetching training centers:', error);
//       setError('Failed to fetch training centers');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAssignUsers = async () => {
//     setIsLoading(true);
//     try {
//       await axios.post(
//         `${API_BASE_URL}/training-groups`,
//         {
//           name: groupName,
//           trainingCenterId: selectedTrainingCenter,
//           userIds: selectedUsers,
//         },
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
//         }
//       );
//       setSelectedUsers([]);
//       setSelectedTrainingCenter('');
//       setGroupName('');
//       fetchUsers();
//       fetchTrainingCenters();
//     } catch (error) {
//       console.error('Error assigning users:', error);
//       setError('Failed to assign users');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const filteredUsers = users.filter(
//     (user) =>
//       (!selectedRole || user.role === selectedRole) &&
//       (!selectedState || user.state === selectedState) &&
//       (!selectedLga || user.lgaOfResidence === selectedLga)
//   );

//   const filteredTrainingCenters = trainingCenters.filter(
//     (center) =>
//       (!selectedState || center.state === selectedState) &&
//       (!selectedLga || center.lga === selectedLga)
//   );

//   return (
//     <ProtectedRoute>
//       <DashboardPage title="Artisan Dashboard">
//         <div className="container mx-auto p-6">
//           <header className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold">User Management</h1>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => navigate('/biodata')}>
//                 <UserCircle className="mr-2 h-4 w-4" /> Update Profile
//               </Button>
//               <Button variant="destructive" onClick={logout}>
//                 <LogOut className="mr-2 h-4 w-4" /> Logout
//               </Button>
//             </div>
//           </header>

//           <div className="filters mb-4 grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Role</label>
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="block w-full mt-1 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">All Roles</option>
//                 <option value="artisan_user">Artisan</option>
//                 <option value="intending_artisan">Intending Artisan</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">State</label>
//               <select
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 className="block w-full mt-1 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">All States</option>
//                 {Array.from(new Set(users.map((user) => user.state))).map((state) => (
//                   <option key={state} value={state}>
//                     {state}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">LGA</label>
//               <select
//                 value={selectedLga}
//                 onChange={(e) => setSelectedLga(e.target.value)}
//                 className="block w-full mt-1 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">All LGAs</option>
//                 {Array.from(
//                   new Set(
//                     users
//                       .filter((user) => !selectedState || user.state === selectedState)
//                       .map((user) => user.lgaOfResidence)
//                   )
//                 ).map((lga) => (
//                   <option key={lga} value={lga}>
//                     {lga}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
//             <CardHeader>
//               <CardTitle>User List</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ul>
//                 {filteredUsers.length > 0 ? (
//                   filteredUsers.map((user) => (
//                     <li key={user._id}>
//                       <input
//                         type="checkbox"
//                         id={`user-${user._id}`}
//                         checked={selectedUsers.includes(user._id)}
//                         onChange={() => {
//                           setSelectedUsers((prev) =>
//                             prev.includes(user._id)
//                               ? prev.filter((id) => id !== user._id)
//                               : [...prev, user._id]
//                           );
//                         }}
//                       />
//                       <label htmlFor={`user-${user._id}`}>
//                         {`${user.firstName} ${user.lastName} (${user.role})`}
//                       </label>
//                     </li>
//                   ))
//                 ) : (
//                   <p>No users available.</p>
//                 )}
//               </ul>
//               <div className="mt-4">
//                 <label
//                   htmlFor="groupName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Group Name
//                 </label>
//                 <input
//                   id="groupName"
//                   type="text"
//                   value={groupName}
//                   onChange={(e) => setGroupName(e.target.value)}
//                   className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Enter group name"
//                 />
//               </div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Assign to Training Center
//                 </label>
//                 <select
//                   value={selectedTrainingCenter}
//                   onChange={(e) => setSelectedTrainingCenter(e.target.value)}
//                   className="block w-full mt-1 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   <option value="">Select a training center</option>
//                   {filteredTrainingCenters.length > 0 ? (
//                     filteredTrainingCenters.map((center) => (
//                       <option key={center._id} value={center._id}>
//                         {center.trainingCentreName}
//                       </option>
//                     ))
//                   ) : (
//                     <option value="">No training centers available</option>
//                   )}
//                 </select>
//               </div>
//               <button
//                 className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 onClick={handleAssignUsers}
//                 disabled={!selectedUsers.length || !selectedTrainingCenter}
//               >
//                 Assign Users
//               </button>
//             </CardContent>
//           </Card>
//         </div>
//       </DashboardPage>
//     </ProtectedRoute>
//   );
// }

// export default TrainigCenterGroup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, LogOut } from "lucide-react";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useLogout from "@/pages/loginPage/logout";

function TrainingCenterGroup() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTrainingCenter, setSelectedTrainingCenter] = useState('');
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, trainingCentersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }),
        axios.get(`${API_BASE_URL}/training-centers`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }),
      ]);
      setUsers(usersRes.data.data || []);
      setTrainingCenters(trainingCentersRes.data.data || []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (!selectedTrainingCenter) {
      setError('Please select a training center');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Create the new group and assign the users
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

      // Reset form
      setGroupName('');
      setSelectedUsers([]);
      setSelectedTrainingCenter('');
      fetchData(); // Refresh data
    } catch (err) {
      setError('Failed to create group');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => !selectedUsers.includes(user._id));

  return (
    <ProtectedRoute>
      <DashboardPage title="Artisan Dashboard">
        <div className="container mx-auto p-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">User Management</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/biodata')}>
                <UserCircle className="mr-2 h-4 w-4" /> Update Profile
              </Button>
<<<<<<< Updated upstream
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
=======
>>>>>>> Stashed changes
              <Button variant="destructive" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            </div>
          </header>

          {error && <p className="text-red-500">{error}</p>}

          <Card className="p-4 rounded-lg shadow-md">
            <CardHeader>
              <CardTitle>Create New Group</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="groupName">Group Name</label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label htmlFor="trainingCenter">Select Training Center</label>
                  <select
                    id="trainingCenter"
                    value={selectedTrainingCenter}
                    onChange={(e) => setSelectedTrainingCenter(e.target.value)}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select Training Center</option>
                    {trainingCenters.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="users">Select Users</label>
                  <select
                    id="users"
                    multiple
                    value={selectedUsers}
                    onChange={(e) =>
                      setSelectedUsers(Array.from(e.target.selectedOptions, (option) => option.value))
                    }
                    className="select select-bordered w-full"
                  >
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <Button onClick={handleCreateGroup} className="mt-4" isLoading={isLoading}>
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
}

export default TrainingCenterGroup;
