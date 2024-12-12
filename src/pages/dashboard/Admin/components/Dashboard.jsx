import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Calendar from './Calendar';
import { BarChart } from './charts/BarChart';
import NigerianMap from '../../../../components/NigerianMap';
import { PieChart } from './charts/PieChart';
import Metrics from './Metrics';
import State from './charts/State';
import Spinner from '../../../../components/layout/spinner';

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]); // Make sure this is an empty array
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const accessToken = localStorage.getItem('accessToken');

  const fetchData = async (url, setter, setError) => {
    try {
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setter(response.data.data);
      }
    } catch (err) {
      setError((prevErrors) => ({
        ...prevErrors,
        [url]: 'Failed to fetch data.',
      }));
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchData(`${API_BASE_URL}/training-centers`, setTrainingCenters, setError),
        fetchData(`${API_BASE_URL}/training-groups`, setTrainingGroups, setError),
        fetchData(`${API_BASE_URL}/dashboard-analytics`, setUsers, setError),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Ensure that users is an array before using filter
  const artisanGenderData = useMemo(() => {
    if (Array.isArray(users)) {
      const genderDistribution = users.filter((user) => user.role === 'artisan_user');
      const maleCount = genderDistribution.filter((user) => user.gender === 'male').length;
      const femaleCount = genderDistribution.filter((user) => user.gender === 'female').length;
      return [
        { name: 'Male', value: maleCount },
        { name: 'Female', value: femaleCount },
      ];
    }
    return []; // Return an empty array if users is not an array
  }, [users]);

  const intendingArtisanGenderData = useMemo(() => {
    if (Array.isArray(users)) {
      const genderDistribution = users.filter((user) => user.role === 'intending_artisan');
      const maleCount = genderDistribution.filter((user) => user.gender === 'male').length;
      const femaleCount = genderDistribution.filter((user) => user.gender === 'female').length;
      return [
        { name: 'Male', value: maleCount },
        { name: 'Female', value: femaleCount },
      ];
    }
    return []; // Return an empty array if users is not an array
  }, [users]);

  const certificationData = useMemo(() => {
    if (Array.isArray(users)) {
      const certifiedCount = users.filter((user) => user.certified).length;
      const nonCertifiedCount = users.length - certifiedCount;
      return [
        { name: 'Certified', value: certifiedCount },
        { name: 'Non-Certified', value: nonCertifiedCount },
      ];
    }
    return []; // Return an empty array if users is not an array
  }, [users]);

  if (loading) return <div className="text-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <Metrics />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
          <div className="col-span-full lg:col-span-9">
            <NigerianMap />
          </div>
          <div className="col-span-full lg:col-span-3">
            <State />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="grid  gap-4">
          <PieChart title="Certified vs Non-Certified" data={certificationData} />
        </div>
        <div className="grid gap-4">
          <PieChart title="Gender Distribution - Artisan Users" data={artisanGenderData} />
        </div>
        <div className="grid  gap-4">
          <PieChart title="Gender Distribution - Intending Artisans" data={intendingArtisanGenderData} />
        </div>
        <Calendar />

        </div>
        
      </div>
    </div>
  );
}
