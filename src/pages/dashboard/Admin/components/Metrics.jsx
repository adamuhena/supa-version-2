import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Users, UserPlus, School, UsersRound } from 'lucide-react';
import Spinner from "@/components/layout/spinner";

const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md ">
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Fetch all data concurrently
      const [usersResponse, trainingCentersResponse, trainingGroupsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`, { headers }),
        axios.get(`${API_BASE_URL}/training-centers`, { headers }),
        axios.get(`${API_BASE_URL}/training-groups`, { headers }),
      ]);

      setUsers(usersResponse.data.data);
      setTrainingCenters(trainingCentersResponse.data.data);
      setTrainingGroups(trainingGroupsResponse.data.data);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data once when the component mounts
  }, []);

  // Memoize the counts to avoid recalculating on every render
  const counts = useMemo(() => {
    let artisan_userCount = 0;
    let intending_artisanCount = 0;
    let training_centerCount = trainingCenters.length;
    let training_groupCount = trainingGroups.length;

    users.forEach((user) => {
      if (user.role === "artisan_user") artisan_userCount++;
      if (user.role === "intending_artisan") intending_artisanCount++;
    });

    return {
      artisan_userCount,
      intending_artisanCount,
      training_centerCount,
      training_groupCount,
    };
  }, [users, trainingCenters, trainingGroups]); // Recalculate only when these change

  if (loading) {
    return <div class="flex justify-center items-center h-screen">
    <Spinner/>
</div> // Show loading indicator
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Registered Artisans" value={counts.artisan_userCount} icon={Users} />
      <MetricCard title="Intending Artisans" value={counts.intending_artisanCount} icon={UserPlus} />
      <MetricCard title="Training Centers" value={counts.training_centerCount} icon={School} />
      <MetricCard title="Training Center Groups" value={counts.training_groupCount} icon={UsersRound} />
    </div>
  );
}
