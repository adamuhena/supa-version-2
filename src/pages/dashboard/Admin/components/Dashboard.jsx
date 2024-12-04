import React from 'react';
import Metrics from './Metrics';
import Calendar from './Calendar';
import { BarChart } from './charts/BarChart';
import { PieChart } from './charts/PieChart';
import { MapChart } from './charts/MapChart';
import { LineChart } from './charts/LineChart';
import { RadarChart } from './charts/RadarChart';
import NigeriaMap from './charts/NigeriaMap';

export default function Dashboard() {
  // Replace these with actual data
  const genderData = [
    { name: 'Male', value: 60 },
    { name: 'Female', value: 40 },
  ];

  const certificationData = [
    { name: 'Certified', value: 80 },
    { name: 'Non-Certified', value: 20 },
  ];

  const skillDistributionData = [
    { subject: 'Carpentry', A: 120, fullMark: 150 },
    { subject: 'Plumbing', A: 98, fullMark: 150 },
    { subject: 'Electrical', A: 86, fullMark: 150 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Main Grid Layout */}
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

        {/* Second Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-4">
          {/* <div className="col-span-1 sm:col-span-2 lg:col-span-9">
            <RadarChart title="Skill Distribution" data={skillDistributionData} />
          </div> */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-9">
            <NigeriaMap />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <BarChart title="Distribution by Disability" data={certificationData} />
          </div>
        </div>

        {/* Third Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 pt-4">
          <div className="col-span-1 lg:col-span-3">
            <MapChart title="Senatorial Distribution" data={genderData} />
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LineChart title="Registration Trend" data={genderData} />
            <BarChart title="State of Residence" data={certificationData} />
          </div>

          <div className="col-span-1 lg:col-span-3">
            <Metrics />
          </div>
        </div>
      </div>
    </div>
  );
}
