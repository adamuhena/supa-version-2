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
  const [users, setUsers] = useState([]);
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  const fetchData = async (url, setter, setError) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
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
        fetchData(`${API_BASE_URL}/users`, setUsers, setError),
      ]);
      setLoading(false);
    };
    fetchAllData();
  }, []);

  const genderData = useMemo(() => {
    return [
      { name: 'Male', value: users.filter((u) => u.gender === 'Male').length },
      { name: 'Female', value: users.filter((u) => u.gender === 'Female').length },
    ];
  }, [users]);

  const certificationData = useMemo(() => {
    return [
      { name: 'Certified', value: users.filter((u) => u.certified).length },
      { name: 'Non-Certified', value: users.length - users.filter((u) => u.certified).length },
    ];
  }, [users]);

  if (loading) return <div className="text-center"><Spinner/></div>;

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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <PieChart title="Gender Distribution" data={genderData} />
          <PieChart title="Certified vs Non-Certified" data={certificationData} />
        </div>
        <Calendar />
      </div>
    </div>
  );
}
