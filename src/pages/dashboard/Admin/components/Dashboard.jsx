import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Calendar from "./Calendar";
import { PieChart } from "./charts/PieChart";
import Metrics from "./Metrics";
import State from "./charts/State";
import Spinner from "../../../../components/layout/spinner";
import NigerianMap from "../../../../components/NigerianMap";
import RecentRegistrations from "./RecentRegistrations";
import { StateDistribution } from "./StatesDistribution";
import { API_BASE_URL } from "@/config/env";
import DistributionDashboard from "./distribution-dashboard";

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchAnalytics = async () => {
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (!accessToken) {
  //     setError("Access token is missing. Please log in again.");
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     });
  //     if (response.data.success) {
  //       setAnalyticsData(response.data.data[0] || {});
  //     } else {
  //       throw new Error(
  //         response.data.message || "Failed to fetch analytics data"
  //       );
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAnalytics();
  // }, []);

  // const genderDistribution = useMemo(() => {
  //   const genderData = analyticsData.genderDistribution || [];
  //   const groupByRoleAndGender = (role) => {
  //     const filteredData = genderData.filter((entry) => entry.role === role);
  //     return [
  //       {
  //         name: "Male",
  //         value: filteredData.find((e) => e.gender === "male")?.count || 0,
  //       },
  //       {
  //         name: "Female",
  //         value: filteredData.find((e) => e.gender === "female")?.count || 0,
  //       },
  //     ];
  //   };

  //   return {
  //     artisanGenderData: groupByRoleAndGender("artisan_user"),
  //     intendingArtisanGenderData: groupByRoleAndGender("intending_artisan"),
  //   };
  // }, [analyticsData]);

//   if (loading)
//     return (
//           <div className="flex justify-center items-center h-screen">
//             <Spinner />
//           </div>
//         );

//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="container mx-auto px-4 py-4">
//         <Metrics />
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
//           <div className="col-span-full lg:col-span-9">
//             <NigerianMap />
//           </div>
//           <div className="col-span-full lg:col-span-3">
//             <RecentRegistrations />
//           </div>
//         </div>
//         <div className="grid grid-cols-12 lg:grid-cols-12 gap-4 py-4">
//           {/* <div className="col-span-full lg:col-span-9">
//             <StateDistribution />
//           </div>
//           <div className="col-span-full lg:col-span-3">
//             <State />
//           </div> */}
//           <DistributionDashboard/>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
//           {/* <Calendar /> */}
          
//         </div>
//       </div>
//     </div>
//   );
// }
// if (loading) {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <Spinner />
//     </div>
//   );
// }

// if (error) {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-50">
//       <div className="text-center p-6 bg-white rounded-lg shadow-lg">
//         <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
//         <p className="text-gray-600">{error}</p>
//         <button
//           onClick={fetchAnalytics}
//           className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     </div>
//   );
// }


return (
  <div className="min-h-screen bg-gray-50">
      {/* Metrics Section */}
      {/* <section className="mb-8">
        <Metrics />

      </section> */}

      {/* Map and Recent Registrations */}
      {/* <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8"> */}
        {/* <div className="lg:col-span-8 bg-white rounded-lg shadow-md p-6"> */}
        {/* <div className="lg:col-span-8 pt-4">
          <NigerianMap />
        </div> */}
        {/* <div className="lg:col-span-4 bg-white rounded-lg shadow-md p-6"> */}
        {/* <div className="lg:col-span-4  ">
          <RecentRegistrations />
        </div> */}
      {/* </section> */}

      {/* Distribution Dashboard */}
      {/* <section className="bg-white rounded-lg shadow-md p-6 mb-8"> */}
        <DistributionDashboard />
      {/* </section> */}

      {/* Additional Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Gender Distribution */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
          <PieChart
            data={genderDistribution.artisanGenderData}
            title="Artisan Gender Distribution"
          />
        </div> */}

        {/* State Distribution */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">State Distribution</h2>
          <State />
        </div> */}

        {/* Calendar Section */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <Calendar />
        </div> */}
      </section>
    </div>
);
}