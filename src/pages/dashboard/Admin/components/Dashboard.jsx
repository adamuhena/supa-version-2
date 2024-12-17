import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Calendar from './Calendar';
import { PieChart } from './charts/PieChart';
import Metrics from './Metrics';
import State from './charts/State';
import Spinner from '../../../../components/layout/spinner';
import NigerianMap from '../../../../components/NigerianMap';
import RecentRegistrations from './RecentRegistrations';
import { StateDistribution } from './StatesDistribution';

export default function Dashboard() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchAnalytics = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Access token is missing. Please log in again.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setAnalyticsData(response.data.data[0] || {});
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const genderDistribution = useMemo(() => {
    const genderData = analyticsData.genderDistribution || [];
    const groupByRoleAndGender = (role) => {
      const filteredData = genderData.filter((entry) => entry.role === role);
      return [
        { name: 'Male', value: filteredData.find((e) => e.gender === 'male')?.count || 0 },
        { name: 'Female', value: filteredData.find((e) => e.gender === 'female')?.count || 0 },
      ];
    };

    return {
      artisanGenderData: groupByRoleAndGender('artisan_user'),
      intendingArtisanGenderData: groupByRoleAndGender('intending_artisan'),
    };
  }, [analyticsData]);

  if (loading) return <div className="text-center"><Spinner /></div>;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-4">
        <Metrics />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
          <div className="col-span-full lg:col-span-9">
            <NigerianMap />
          </div>
          <div className="col-span-full lg:col-span-3">
          <RecentRegistrations />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
          <div className="col-span-full lg:col-span-9">
          <StateDistribution/>
          </div>
          <div className="col-span-full lg:col-span-3">
            <State />
          </div>
        </div> 
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
         
          <Calendar />
        </div>

        
        
      </div>
    </div>
  );
}
