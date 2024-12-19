import React, { useEffect, useState } from 'react';
import { MapIcon } from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import MapTooltip from './MapTooltip';
import { fetchUserDist } from '../services/api';
// import nigeriaTopoData from '../data/nigeriaTopo.json';
import nigeriaTopoData from '../data/nigeriaTopo.json'; // Import the TopoJSON file
import nigeriaTopo from '../data/nGTopo.json';
import { stateData } from '../data/nigerianStates'; // Your state data

const NigerianMap = () => {
  const [mapData, setMapData] = useState({});
  const [tooltip, setTooltip] = useState({
    show: false,
    state: '',
    position: { x: 0, y: 0 },
    data: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserDist();
        setMapData(data);
        
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    loadData();
  }, []);

  // Convert TopoJSON to GeoJSON
  const nigeriaGeoData = feature(nigeriaTopoData, nigeriaTopoData.objects.default);

  // Get color based on the total number of users
  const getColorByDensity = (stateId) => {
    const data = mapData[stateId.toLowerCase()];
    if (!data) return '#e5e7eb';

    const total = data.artisan_users + data.intending_artisans;
    if (total > 30000) return '#FF6347';  // Tomato Red for extreme density
    if (total > 25000) return '#FF5733';  // Red-Orange for very high density
    if (total > 20000) return '#C70039';  // Dark Red for high density
    if (total > 15000) return '#900C3F';  // Deep Pink for high density
    if (total > 10000) return '#581845';  // Dark Purple for moderate-high density
    if (total > 8000) return '#D2691E';  // Chocolate for very high density
    if (total > 6000) return '#FF8C00';  // Dark Orange for high density
    if (total > 5000) return '#20B2AA';  // LightSeaGreen for medium density
    if (total > 3000) return '#3CB371';  // MediumSeaGreen for moderate density
    if (total > 2000) return '#2E8B57';  // SeaGreen for medium density
    if (total > 1000) return '#228B22';  // ForestGreen for low-medium density
    if (total > 500) return '#006400';   // DarkGreen for low density
    if (total > 100) return '#8B0000';   // DarkRed for very low density
    return '#E0FFFF';  // Light Cyan for minimal density

  };

  // Handle mouse hover event
  const handleMouseMove = (event, stateName, stateId) => {
    const screenWidth = window.innerWidth;
    const offset = 1; // 2% of screen width
    setTooltip({
      show: true,
      state: stateName,
      position: {
        x: event.clientX , // X offset to place tooltip beside cursor
        y: event.clientY  // Y offset to place tooltip beside cursor
      },
      data: mapData[stateId.toLowerCase()]
    });
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Create map projection
  const projection = geoMercator()
    .center([8.6753, 9.0820]) // Nigeria's approximate center
    .scale(2500)
    .translate([400, 400]);

  const pathGenerator = geoPath().projection(projection);

  return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <header className="bg-white shadow-sm">
            <div className="flex items-center space-x-2">
              <MapIcon className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Nigerian Artisan Distribution Map
              </h1>
          </div>
        </header>
        <div className="relative w-full pt-0 max-w-4xl mx-auto">
          <svg
            viewBox="0 150 800 450"
            className="w-full h-auto rounded-lg"
          >
            <g>
              {nigeriaGeoData.features.map((feature) => {
                const stateName = feature.properties.name;
                const stateId = Object.keys(stateData).find(
                  key => stateData[key].name === stateName
                );

                if (!stateId) return null;

                return (
                  <path
                    key={stateId}
                    d={pathGenerator(feature)}
                    fill={getColorByDensity(stateId)}
                    stroke="#fff"
                    strokeWidth="1"
                    onMouseMove={(e) => handleMouseMove(e, stateName, stateId)}
                    onMouseLeave={handleMouseLeave}
                    className="transition-colors duration-200 hover:opacity-80"
                  />
                );
              })}

              {/* Add state labels */}
              {Object.entries(stateData).map(([stateId, state]) => {
                const [longitude, latitude] = state.coordinates;
                const [x, y] = projection([longitude, latitude]);
                const stateData = mapData[stateId.toLowerCase()];
                const total = stateData ? stateData.artisan_users || stateData.intending_artisans : 0;

                return (
                  <text
                    key={`label-${stateId}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dy=".3em"
                    className="text-[8px] font-medium pointer-events-none"
                    fill={total > 500 ? '#fff' : '#374151'}
                  >
                    {state.name}
                  </text>
                );
              })}
            </g>
          </svg>

          {/* Tooltip */}
          {tooltip.show && tooltip.data && (
            <MapTooltip
              stateName={tooltip.state}
              data={tooltip.data}
              position={tooltip.position}
            />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md">
            <h4 className="font-semibold text-xs mb-1">Legend</h4>
            <div className="space-y-0.5">
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#FF6347] mr-1"></div>
                <span>30,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#FF5733] mr-1"></div>
                <span>25,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#C70039] mr-1"></div>
                <span>20,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#900C3F] mr-1"></div>
                <span>15,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#581845] mr-1"></div>
                <span>10,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#D2691E] mr-1"></div>
                <span>8,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#FF8C00] mr-1"></div>
                <span>6,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#20B2AA] mr-1"></div>
                <span>5,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#3CB371] mr-1"></div>
                <span>3,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#2E8B57] mr-1"></div>
                <span>2,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#228B22] mr-1"></div>
                <span>1,000+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#006400] mr-1"></div>
                <span>500+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#8B0000] mr-1"></div>
                <span>100+</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 bg-[#E0FFFF] mr-1"></div>
                <span>&lt;100</span>
              </div>
            </div>
          </div>

        </div>

      </div>

  );
};

export default NigerianMap;
