import axios from 'axios';
import React, { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import Calendar from './Calendar';
import { BarChart } from './charts/BarChart';
import NigeriaMap from './charts/NigeriaMap';
import NigeriaMap from './charts/NigeriaMap';
import { PieChart } from './charts/PieChart';
import Metrics from './Metrics';
import Metrics from './Metrics';

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (url, setter) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        setter(response.data.data);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(`${API_BASE_URL}/training-centers`, setTrainingCenters),
        fetchData(`${API_BASE_URL}/training-groups`, setTrainingGroups),
        fetchData(`${API_BASE_URL}/users`, setUsers),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  const genderData = [
    { 
      name: 'Male', 
      value: users.filter(
        (user) => user.gender === 'Male' && 
                  (user.role === 'artisan_user' || user.role === 'intending_artisan')
      ).length 
    },
    { 
      name: 'Female', 
      value: users.filter(
        (user) => user.gender === 'Female' && 
                  (user.role === 'artisan_user' || user.role === 'intending_artisan')
      ).length 
    },
  ];
  
  const certificationData = [
    { 
      name: 'Certified', 
      value: users.filter(
        (user) => user.certified && 
                  (user.role === 'artisan_user' || user.role === 'intending_artisan')
      ).length 
    },
    { 
      name: 'Non-Certified', 
      value: users.filter(
        (user) => (user.role === 'artisan_user' || user.role === 'intending_artisan')
      ).length - users.filter(
        (user) => user.certified && 
                  (user.role === 'artisan_user' || user.role === 'intending_artisan')
      ).length
    },
  ];
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;


  const skillDistributionData = [
    { subject: 'Carpentry', A: 120, fullMark: 150 },
    { subject: 'Plumbing', A: 98, fullMark: 150 },
    { subject: 'Electrical', A: 86, fullMark: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
         {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 ">
          <div className="col-span-1 lg:col-span-12">
            <Metrics />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 py-4">
          {/* <div className="col-span-1 sm:col-span-2 lg:col-span-9">
            <RadarChart title="Skill Distribution" data={skillDistributionData} />
          </div> */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-9">
            <NigeriaMap />
          </div>

          <div className="col-span-1 lg:col-span-3 gap-4">
            <div>
              <BarChart title="Distribution by Disability" data={certificationData} />
            </div>
            <div>
              <PieChart title="Certified vs Non-Certified" data={certificationData} />   
            </div>
          </div>

        </div>
        {/* Second Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 ">
          <div className="col-span-1 lg:col-span-12">
            {/* <ArtisanDistributionChart/> */}
          </div>
        </div>

        {/* Second Grid Layout */} 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Metrics Section */}
          <div className="col-span-1 lg:col-span-3">
            <Metrics />
          </div>

          {/* Pie Charts */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PieChart title="Gender Distribution" data={genderData} />
            <PieChart title="Certified vs Non-Certified" data={certificationData} />
          </div>

          {/* Calendar Section */}
          <div className="col-span-1 lg:col-span-3">
            <Calendar />
          </div>
        </div>

      </div>
    </div>
  );
}
