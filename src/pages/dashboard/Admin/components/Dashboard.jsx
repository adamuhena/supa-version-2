import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import Calendar from './Calendar';
import { BarChart } from './charts/BarChart';
import NigeriaMap from './charts/NigeriaMap';
import { PieChart } from './charts/PieChart';
import Metrics from './Metrics';
import Spinner from "@/components/layout/spinner";
import State from './charts/State';

// Custom hook to fetch data
const useFetchData = (urls) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const headers = { Authorization: `Bearer ${accessToken}` };

        // Fetch all data concurrently
        const responses = await Promise.all(
          urls.map((url) => axios.get(url, { headers }))
        );

        const newData = urls.reduce((acc, url, index) => {
          acc[url] = responses[index].data.data;
          return acc;
        }, {});
        setData(newData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [urls]);

  return { data, loading, error };
};

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // URLs to fetch data from
  const urls = [
    `${API_BASE_URL}/training-centers`,
    `${API_BASE_URL}/training-groups`,
    `${API_BASE_URL}/users`,
  ];

  const { data, loading, error } = useFetchData(urls);

  const { users = [], trainingCenters = [], trainingGroups = [] } = data;

  // Memoize derived data to prevent unnecessary recalculations
  const genderData = useMemo(() => {
    return [
      {
        name: 'Male',
        value: users.filter(
          (user) => user.gender === 'Male' && ['artisan_user', 'intending_artisan'].includes(user.role)
        ).length,
      },
      {
        name: 'Female',
        value: users.filter(
          (user) => user.gender === 'Female' && ['artisan_user', 'intending_artisan'].includes(user.role)
        ).length,
      },
    ];
  }, [users]);

  const certificationData = useMemo(() => {
    const certifiedCount = users.filter(
      (user) => user.certified && ['artisan_user', 'intending_artisan'].includes(user.role)
    ).length;
    const nonCertifiedCount = users.filter(
      (user) => ['artisan_user', 'intending_artisan'].includes(user.role) && !user.certified
    ).length;

    return [
      { name: 'Certified', value: certifiedCount },
      { name: 'Non-Certified', value: nonCertifiedCount },
    ];
  }, [users]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4 font-bold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 ">
          <div className="col-span-full lg:col-span-12">
            <Metrics />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 py-4">
          <div className="col-span-full sm:col-span-2 lg:col-span-9">
            <NigeriaMap />
          </div>

          <div className="col-span-full sm:col-span-2 lg:col-span-3 gap-4">
            <State />
          </div>
        </div>

        {/* Second Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 ">
          <div className="col-span-full lg:col-span-12">
            {/* <ArtisanDistributionChart/> */}
          </div>
        </div>

        {/* Second Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="col-span-full lg:col-span-3">
            <Metrics />
          </div>

          <div className="col-span-full sm:col-span-2 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PieChart title="Gender Distribution" data={genderData} />
            <PieChart title="Certified vs Non-Certified" data={certificationData} />
          </div>

          <div className="col-span-full lg:col-span-3">
            <Calendar />
          </div>
          <div>
            <BarChart title="Distribution by Disability" data={certificationData} />
          </div>
        </div>
      </div>
    </div>
  );
}
