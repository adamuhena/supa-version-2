import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";

const TrainingManagement = () => {
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");
  const [periods, setPeriods] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ name: "", year: "" });
  const [newGroup, setNewGroup] = useState({
    name: "",
    period: "",
    trainingCenter: "",
    startTime: "",
    endTime: "",
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [evaluation, setEvaluation] = useState({ score: "", comments: "" });
  const [userRole2, setUserRole] = useState("");

 

  useEffect(() => {
    fetchUserRole();
    fetchPeriods();
    fetchTrainingGroups();
    fetchUsers();
    fetchTrainingCenters();
  }, []);

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/periods`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPeriods(response.data);
    } catch (error) {
      console.error("Error fetching periods:", error);
    }
  };

  const fetchTrainingGroups = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-groups`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTrainingGroups(response.data);
    } catch (error) {
      console.error("Error fetching training groups:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTrainingCenters = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTrainingCenters(response.data.data);
    } catch (error) {
      console.error("Error fetching training centers:", error);
    }
  };

  const handleCreatePeriod = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/periods`, newPeriod, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNewPeriod({ name: "", year: "" });
      fetchPeriods();
    } catch (error) {
      console.error("Error creating period:", error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/training-groups`, newGroup, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setNewGroup({
        name: "",
        period: "",
        trainingCenter: "",
        startTime: "",
        endTime: "",
      });
      fetchTrainingGroups();
    } catch (error) {
      console.error("Error creating training group:", error);
    }
  };

  const handleAssignUser = async () => {
    if (!selectedGroup || !selectedUser) return;
    try {
      await axios.post(
        `${API_BASE_URL}/training-groups/${selectedGroup}/assign`,
        { userId: selectedUser },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchTrainingGroups();
    } catch (error) {
      console.error("Error assigning user to group:", error);
    }
  };

  const handleRemoveUser = async (groupId, userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/training-groups/${groupId}/remove`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchTrainingGroups();
    } catch (error) {
      console.error("Error removing user from group:", error);
    }
  };

  const handleEvaluateUser = async (groupId, userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/training-groups/${groupId}/evaluate/${userId}`,
        evaluation,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEvaluation({ score: "", comments: "" });
      fetchTrainingGroups();
    } catch (error) {
      console.error("Error evaluating user:", error);
    }
  };

  const renderAdminView = () => (
    <>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Period</h2>
        <form onSubmit={handleCreatePeriod} className="space-y-2">
          <input
            type="text"
            placeholder="Period Name"
            value={newPeriod.name}
            onChange={(e) =>
              setNewPeriod({ ...newPeriod, name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Year"
            value={newPeriod.year}
            onChange={(e) =>
              setNewPeriod({ ...newPeriod, year: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Period
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create Training Group</h2>
        <form onSubmit={handleCreateGroup} className="space-y-2">
          <input
            type="text"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="border p-2 rounded"
          />
          <select
            value={newGroup.period}
            onChange={(e) =>
              setNewGroup({ ...newGroup, period: e.target.value })
            }
            className="border p-2 rounded">
            <option value="">Select Period</option>
            {periods.map((period) => (
              <option key={period._id} value={period._id}>
                {period.name} - {period.year}
              </option>
            ))}
          </select>
          <select
            value={newGroup.trainingCenter}
            onChange={(e) =>
              setNewGroup({ ...newGroup, trainingCenter: e.target.value })
            }
            className="border p-2 rounded">
            <option value="">Select Training Center</option>
            {/* {trainingCenters.map((center) => (
              <option key={center._id} value={center._id}>
                {center.trainingCentreName}
              </option>
            ))} */}
            {trainingCenters?.length > 0 &&
              Array.isArray(trainingCenters) &&
              trainingCenters.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.trainingCentreName}
                </option>
              ))}
          </select>
          <input
            type="datetime-local"
            placeholder="Start Time"
            value={newGroup.startTime}
            onChange={(e) =>
              setNewGroup({ ...newGroup, startTime: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            value={newGroup.endTime}
            onChange={(e) =>
              setNewGroup({ ...newGroup, endTime: e.target.value })
            }
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded">
            Create Training Group
          </button>
        </form>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assign User to Group</h2>
        <div className="space-y-2">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="border p-2 rounded">
            <option value="">Select Training Group</option>
            {trainingGroups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border p-2 rounded">
            <option value="">Select User</option>
            {/* {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))} */}
            {users?.length > 0 &&
              Array.isArray(users) &&
              users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user?.firstName} {user?.lastName}
                </option>
              ))}
          </select>
          <button
            onClick={handleAssignUser}
            className="bg-purple-500 text-white px-4 py-2 rounded">
            Assign User to Group
          </button>
        </div>
      </div>
    </>
  );

  const renderTrainingCenterView = () => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Your Training Groups</h2>
      <ul>
        {trainingGroups.map((group) => (
          <li key={group._id} className="mb-4">
            <h3 className="font-semibold">{group.name}</h3>
            <p>
              Period:{" "}
              {group.period
                ? `${group.period.name} - ${group.period.year}`
                : "N/A"}
            </p>
            <p>Start: {new Date(group.startTime).toLocaleString()}</p>
            <p>End: {new Date(group.endTime).toLocaleString()}</p>
            <h4 className="font-semibold mt-2">Users:</h4>
            <ul>
              {group.users.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between">
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  <div>
                    <input
                      type="number"
                      placeholder="Score"
                      min="0"
                      max="100"
                      value={evaluation.score}
                      onChange={(e) =>
                        setEvaluation({ ...evaluation, score: e.target.value })
                      }
                      className="border p-1 rounded w-16 mr-2"
                    />
                    <input
                      type="text"
                      placeholder="Comments"
                      value={evaluation.comments}
                      onChange={(e) =>
                        setEvaluation({
                          ...evaluation,
                          comments: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-40 mr-2"
                    />
                    <button
                      onClick={() => handleEvaluateUser(group._id, user._id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                      Evaluate
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Training Management</h1>
      {userRole === "admin" && renderAdminView()}
      {userRole === "training_center" && renderTrainingCenterView()}
      {userRole === "admin" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">All Training Groups</h2>
          <ul>
            {trainingGroups.map((group) => (
              <li key={group._id} className="mb-4">
                <h3 className="font-semibold">{group.name}</h3>
                <p>
                  Period: {group.period?.name} - {group.period?.year}
                </p>
                <p>
                  Training Center:{" "}
                  {group.trainingCenter
                    ? group.trainingCenter.trainingCentreName
                    : "N/A"}
                </p>
                <p>Start: {new Date(group.startTime).toLocaleString()}</p>
                <p>End: {new Date(group.endTime).toLocaleString()}</p>
                <h4 className="font-semibold mt-2">Users:</h4>
                <ul>
                  {group.users.map((user) => (
                    <li
                      key={user._id}
                      className="flex items-center justify-between">
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <button
                        onClick={() => handleRemoveUser(group._id, user._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;
