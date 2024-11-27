import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/layout/spinner";

const TrainingGroupsList = ({ userId }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainingGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-groups`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });

        // Filter groups based on the provided userId
        const filteredGroups = response.data.data.filter(
          (group) => group.trainingCenter._id === userId
        );

        setTrainingGroups(filteredGroups || []);
      } catch (error) {
        console.error("Error fetching training groups:", error);
        setError("Failed to fetch training groups");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingGroups();
  }, [API_BASE_URL, userId]);

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-6">
      <Card className="border-2 border-red-400 p-4 rounded-lg shadow-md">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Training Groups List</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Group Name</th>
                <th className="px-4 py-2 border-b">Start Date</th>
                <th className="px-4 py-2 border-b">End Date</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Users Assigned</th>
              </tr>
            </thead>
            <tbody>
              {trainingGroups.map((group) => (
                <tr key={group._id}>
                  <td className="px-4 py-2 border-b">{group.name}</td>
                  <td className="px-4 py-2 border-b">{group.startDate}</td>
                  <td className="px-4 py-2 border-b">{group.endDate}</td>
                  <td className="px-4 py-2 border-b">{group.status}</td>
                  <td className="px-4 py-2 border-b">{group.users.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingGroupsList;
