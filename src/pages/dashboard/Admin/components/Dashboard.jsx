import React from 'react';
import Metrics from './Metrics';
import Calendar from './Calendar';
import RecentGroups from './RecentGroups';
import RecentRegistrations from './RecentRegistrations';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Metrics />
          <Calendar />
          <RecentRegistrations />
          <div className="md:col-span-2 lg:col-span-3">
            <RecentGroups />
          </div>
        </div>
      </div>
    </div>
  );
}

