import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserPlus, School, UsersRound } from "lucide-react";
import { API_BASE_URL } from "@/config/env";

// Reusable MetricCard component
const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-emerald-500" />
    </div>
  </div>
);

export default function Metrics() {
  const [users, setUsers] = useState([]); // Holds userCounts data
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  // Fetch userCounts data from the dashboard analytics API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/dashboard-analytics`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data.success) {
          setUsers(response.data.data?.[0]?.userCounts || []);
        }
      } catch (error) {
        console.error("Error fetching user counts:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch trainingCenters data
  useEffect(() => {
    const fetchTrainingCenters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-centers`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setTrainingCenters(response.data.data || []);
      } catch (error) {
        console.error("Error fetching training centers:", error);
      }
    };

    fetchTrainingCenters();
  }, []);

  // Fetch trainingGroups data
  useEffect(() => {
    const fetchTrainingGroups = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/training-groups`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setTrainingGroups(response.data.data || []);
      } catch (error) {
        console.error("Error fetching training groups:", error);
      }
    };

    fetchTrainingGroups();
  }, []);

  // Calculate counts for metrics
  const artisan_userCount =
    users.find((user) => user._id === "artisan_user")?.count || 0;
  const intending_artisanCount =
    users.find((user) => user._id === "intending_artisan")?.count || 0;
  const training_centerCount = trainingCenters.length;
  const training_groupCount = trainingGroups.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Registered Artisans"
        value={artisan_userCount}
        icon={Users}
      />
      <MetricCard
        title="Intending Artisans"
        value={intending_artisanCount}
        icon={UserPlus}
      />
      <MetricCard
        title="Training Centers"
        value={training_centerCount}
        icon={School}
      />
      <MetricCard
        title="Trade Area Groups"
        value={training_groupCount}
        icon={UsersRound}
      />
    </div>
  );
}
