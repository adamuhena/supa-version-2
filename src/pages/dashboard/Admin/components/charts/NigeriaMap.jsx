// import React, { useEffect, useRef, useState } from "react";
// import Highcharts from "highcharts/highmaps";
// import axios from "axios";  // Add axios

// const NigeriaMap = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//   const chartRef = useRef(null);
//   const [userData, setUserData] = useState([]);
//   const accessToken = localStorage.getItem("accessToken");

//   // Fetch the topology (map data) from the JSON file
//   const fetchTopology = async () => {
//     try {
//       const response = await fetch("/ng-all.topo.json");
//       if (!response.ok) throw new Error("Failed to fetch map topology");
//       return await response.json();
//     } catch (error) {
//       console.error("Error fetching topology data:", error);
//       return null; // Return null if fetch fails
//     }
//   };

//   // Fetch user data from the database
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/users`,{
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//       );  // Replace with your actual endpoint
//       setUserData(response.data.users || response.data); 
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   // Prepare the data for Highcharts by counting artisan_user and intending_artisan per state
//   const prepareChartData = () => {
//     const stateData = {
//       "ng-ri": { artisan_user: 0, intending_artisan: 0 },
//       "ng-kt": { artisan_user: 0, intending_artisan: 0 },
//       "ng-so": { artisan_user: 0, intending_artisan: 0 },
//       "ng-za": { artisan_user: 0, intending_artisan: 0 },
//       "ng-yo": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ke": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ad": { artisan_user: 0, intending_artisan: 0 },
//       "ng-bo": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ak": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ab": { artisan_user: 0, intending_artisan: 0 },
//       "ng-im": { artisan_user: 0, intending_artisan: 0 },
//       "ng-by": { artisan_user: 0, intending_artisan: 0 },
//       "ng-be": { artisan_user: 0, intending_artisan: 0 },
//       "ng-cr": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ta": { artisan_user: 0, intending_artisan: 0 },
//       "ng-kw": { artisan_user: 0, intending_artisan: 0 },
//       "ng-la": { artisan_user: 7, intending_artisan: 0 },
//       "ng-ni": { artisan_user: 0, intending_artisan: 0 },
//       "ng-fc": { artisan_user: 0, intending_artisan: 90 },
//       "ng-og": { artisan_user: 0, intending_artisan: 0 },
//       "ng-on": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ek": { artisan_user: 0, intending_artisan: 0 },
//       "ng-os": { artisan_user: 0, intending_artisan: 0 },
//       "ng-oy": { artisan_user: 0, intending_artisan: 0 },
//       "ng-an": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ba": { artisan_user: 0, intending_artisan: 0 },
//       "ng-go": { artisan_user: 0, intending_artisan: 0 },
//       "ng-de": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ed": { artisan_user: 0, intending_artisan: 0 },
//       "ng-en": { artisan_user: 0, intending_artisan: 0 },
//       "ng-eb": { artisan_user: 0, intending_artisan: 0 },
//       "ng-kd": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ko": { artisan_user: 0, intending_artisan: 0 },
//       "ng-pl": { artisan_user: 0, intending_artisan: 0 },
//       "ng-na": { artisan_user: 0, intending_artisan: 0 },
//       "ng-ji": { artisan_user: 0, intending_artisan: 0 },
//       "ng-kn": { artisan_user: 0, intending_artisan: 0 },
//     };

//     userData.forEach(user => {
//       const stateCode = `ng-${user.state.toLowerCase()}`; // Assuming user.state contains the state name
//       if (stateData[stateCode]) {
//         // Count the user based on role
//         if (user.role === "artisan_user") {
//           stateData[stateCode].artisan_user++;
//         } else if (user.role === "intending_artisan") {
//           stateData[stateCode].intending_artisan++;
//         }
//       }
//     });

//     // Format the data for Highcharts
//     return Object.entries(stateData).map(([state, counts]) => ({
//       state,
//       artisan_user: counts.artisan_user,
//       intending_artisan: counts.intending_artisan,
//     }));
//   };

//   useEffect(() => {
//     (async () => {
//       const topology = await fetchTopology();
//       if (!topology) return;
  
//       await fetchUserData(); // Fetch user data
  
//       if (Array.isArray(userData)) {
//         const chartData = prepareChartData(); // Prepare data for the map
//         if (chartRef.current) {
//           Highcharts.mapChart(chartRef.current, {
//             chart: {
//               map: topology,
//             },
//             title: {
//               text: "Distribution by State",
//             },
//             subtitle: {
//               text: "Artisan & Intending Artisan Distribution in Nigeria",
//             },
//             mapNavigation: {
//               enabled: true,
//               buttonOptions: {
//                 verticalAlign: "bottom",
//               },
//             },
//             colorAxis: {
//               min: 0,
//               max: 50,
//               colors: ['#FF0000', '#FFFF00', '#00FF00'],
//             },
//             series: [
//               {
//                 data: chartData.map(state => ({
//                   name: state.state,
//                   value: state.artisan_user + state.intending_artisan,
//                 })),
//                 name: "Artisan & Intending Artisan Distribution",
//                 states: {
//                   hover: {
//                     color: "#BADA55",
//                   },
//                 },
//                 dataLabels: {
//                   enabled: true,
//                   format: "{point.name}",
//                 },
//               },
//             ],
//           });
//         }
//       } else {
//         console.error("User data is not an array:", userData);
//       }
//     })();
//   }, [userData]);
  
//   return (
//     <div ref={chartRef} className="h-[500px] max-w mx-auto" id="container"></div>
//   );
// };

// export default NigeriaMap;


import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts/highmaps";

const NigeriaMap = () => {
  const chartRef = useRef([]);

  const fetchTopology = async () => {
    try {
      const response = await fetch(
        // "https://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json"
        "/ng-all.topo.json"
      );
      if (!response.ok) throw new Error("Failed to fetch map topology");
      return await response.json();
    } catch (error) {
      console.error("Error fetching topology data:", error);
      return null; // Return null if fetch fails
    }
  };

  useEffect(() => {
    (async () => {
      const topology = await fetchTopology();
      if (!topology) return;

      const data = [
        ["ng-ri", 10],
        ["ng-kt", 11],
        ["ng-so", 12],
        ["ng-za", 13],
        ["ng-yo", 14],
        ["ng-ke", 15],
        ["ng-ad", 16],
        ["ng-bo", 17],
        ["ng-ak", 18],
        ["ng-ab", 19],
        ["ng-im", 20],
        ["ng-by", 21],
        ["ng-be", 22],
        ["ng-cr", 23],
        ["ng-ta", 24],
        ["ng-kw", 25],
        ["ng-la", 26],
        ["ng-ni", 27],
        ["ng-fc", 28],
        ["ng-og", 29],
        ["ng-on", 30],
        ["ng-ek", 31],
        ["ng-os", 32],
        ["ng-oy", 33],
        ["ng-an", 34],
        ["ng-ba", 35],
        ["ng-go", 36],
        ["ng-de", 37],
        ["ng-ed", 38],
        ["ng-en", 39],
        ["ng-eb", 40],
        ["ng-kd", 41],
        ["ng-ko", 42],
        ["ng-pl", 43],
        ["ng-na", 44],
        ["ng-ji", 45],
        ["ng-kn", 46],
      ]

      if (chartRef.current) {
        Highcharts.mapChart(chartRef.current, {
          chart: {
            map: topology,
          },
          title: {
            text: "Distribution by State",
          },
          subtitle: {
            text: 'Artisan & Intending Artisan: <a href="#">Nigeria</a>',
          },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: "bottom",
            },
          },
          colorAxis: {
            min: 0,
            max: 50, // Adjust the maximum value
            colors: ['#FF0000', '#FFFF00', '#00FF00'], // Custom color palette
          },
          series: [
            {
              data: data,
              name: "Random data",
              states: {
                hover: {
                  color: "#BADA55",
                },
              },
              dataLabels: {
                enabled: true,
                format: "{point.name}",
              },
            },
          ],
        });
      }
    })();
  }, []);

  return (
    <div
      ref={chartRef}
      className="h-[500px] max-w mx-auto"
      id="container"
    ></div>
  );
};

export default NigeriaMap;

// import React, { useState, useEffect } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import Tooltip from "react-simple-tooltip";

// const geoUrl =
//   "https://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json";

//   const data = [
//     ["ng-ri", 10],
//     ["ng-kt", 11],
//     ["ng-so", 12],
//     ["ng-za", 13],
//     ["ng-yo", 14],
//     ["ng-ke", 15],
//     ["ng-ad", 16],
//     ["ng-bo", 17],
//     ["ng-ak", 18],
//     ["ng-ab", 19],
//     ["ng-im", 20],
//     ["ng-by", 21],
//     ["ng-be", 22],
//     ["ng-cr", 23],
//     ["ng-ta", 24],
//     ["ng-kw", 25],
//     ["ng-la", 26],
//     ["ng-ni", 27],
//     ["ng-fc", 28],
//     ["ng-og", 29],
//     ["ng-on", 30],
//     ["ng-ek", 31],
//     ["ng-os", 32],
//     ["ng-oy", 33],
//     ["ng-an", 34],
//     ["ng-ba", 35],
//     ["ng-go", 36],
//     ["ng-de", 37],
//     ["ng-ed", 38],
//     ["ng-en", 39],
//     ["ng-eb", 40],
//     ["ng-kd", 41],
//     ["ng-ko", 42],
//     ["ng-pl", 43],
//     ["ng-na", 44],
//     ["ng-ji", 45],
//     ["ng-kn", 46],
//   ]

// const NigeriaMap = () => {
//   const [topology, setTopology] = useState(null);
//   const [tooltipContent, setTooltipContent] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(geoUrl);
//         if (!response.ok) throw new Error("Failed to fetch map data");
//         const json = await response.json();
//         setTopology(json);
//       } catch (error) {
//         console.error("Error fetching map data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const getRegionData = (geo) => {
//     const region = data.find((d) => d.id === geo.properties.ISO_3166_2);
//     return region
//       ? { color: `rgba(34, 139, 34, ${region.value / 30})`, ...region }
//       : { color: "#EEE", value: 0, name: "Unknown" }; // Default values for undefined regions
//   };

//   if (!topology) return <div>Loading...</div>;

//   return (
//     <div style={{ position: "relative" }}>
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 2800,
//           center: [8, 10],
//         }}
//         style={{
//           width: "100%",
//           maxWidth: "800px",
//           height: "500px",
//           margin: "0 auto",
//         }}
//       >
//         <Geographies geography={topology}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const { color, name, value } = getRegionData(geo);
//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill={color}
//                   stroke="#000"
//                   onMouseEnter={() => {
//                     setTooltipContent(`${name}: ${value}`);
//                   }}
//                   onMouseLeave={() => {
//                     setTooltipContent("");
//                   }}
//                   style={{
//                     default: { outline: "none" },
//                     hover: { outline: "none", stroke: "white", strokeWidth: 1.5 },
//                     pressed: { outline: "none" },
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//       {tooltipContent && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             left: "10px",
//             backgroundColor: "white",
//             padding: "10px",
//             borderRadius: "5px",
//             boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
//             pointerEvents: "none",
//           }}
//         >
//           {tooltipContent}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NigeriaMap;

// import React, { useState, useEffect } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { Tooltip } from "@/components/ui/tooltip"

// const geoUrl =
//   "https://code.highcharts.com/mapdata/countries/ng/ng-all.topo.json";

// const data = [
//   ["ng-ri", 10],
//   ["ng-kt", 11],
//   ["ng-so", 12],
//   ["ng-za", 13],
//   ["ng-yo", 14],
//   ["ng-ke", 15],
//   ["ng-ad", 16],
//   ["ng-bo", 17],
//   ["ng-ak", 18],
//   ["ng-ab", 19],
//   ["ng-im", 20],
//   ["ng-by", 21],
//   ["ng-be", 22],
//   ["ng-cr", 23],
//   ["ng-ta", 24],
//   ["ng-kw", 25],
//   ["ng-la", 26],
//   ["ng-ni", 27],
//   ["ng-fc", 28],
//   ["ng-og", 29],
//   ["ng-on", 30],
//   ["ng-ek", 31],
//   ["ng-os", 32],
//   ["ng-oy", 33],
//   ["ng-an", 34],
//   ["ng-ba", 35],
//   ["ng-go", 36],
//   ["ng-de", 37],
//   ["ng-ed", 38],
//   ["ng-en", 39],
//   ["ng-eb", 40],
//   ["ng-kd", 41],
//   ["ng-ko", 42],
//   ["ng-pl", 43],
//   ["ng-na", 44],
//   ["ng-ji", 45],
//   ["ng-kn", 46],
// ];

// const NigeriaMap = () => {
//   const [topology, setTopology] = useState(null);
//   const [tooltipContent, setTooltipContent] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(geoUrl);
//         if (!response.ok) throw new Error("Failed to fetch map data");
//         const json = await response.json();
//         setTopology(json);
//       } catch (error) {
//         console.error("Error fetching map data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const getRegionData = (geo) =>
//     data.find((d) => d[0] === geo.properties.ISO_3166_2) || {
//       color: "#ffffff",
//       value: 0,
//       name: "Unknown",
//     };

//   if (!topology) return <div>Loading...</div>;

//   return (
//     <div style={{ position: "relative" }}>
//       <ComposableMap
//         projection="geoMercator"
//         projectionConfig={{
//           scale: 2800,
//           center: [8, 10],
//         }}
//         style={{
//           width: "100%",
//           maxWidth: "800px",
//           height: "500px",
//           margin: "0 auto",
//         }}
//       >
//         <Geographies geography={topology}>
//           {({ geographies }) =>
//             geographies.map((geo) => {
//               const { color, name, value } = getRegionData(geo);
//               return (
//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill={color}
//                   stroke="#000"
//                   onMouseEnter={() => {
//                     setTooltipContent(`${name}: ${value}`);
//                   }}
//                   onMouseLeave={() => {
//                     setTooltipContent("");
//                   }}
//                   style={{
//                     default: { outline: "none" },
//                     hover: { outline: "none", stroke: "white", strokeWidth: 1.5 },
//                     pressed: { outline: "none" },
//                   }}
//                 />
//               );
//             })
//           }
//         </Geographies>
//       </ComposableMap>
//       {tooltipContent && (
//         <Tooltip content={tooltipContent} />
//       )}
//     </div>
//   );
// };

// export default NigeriaMap;