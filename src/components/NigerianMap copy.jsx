import React, { useState, useEffect } from "react";
import { MapIcon } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import MapTooltip from "./MapTooltip";
import nigeriaTopoData from "../data/nigeriaTopo.json";
import { stateData } from "../data/nigerianStates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NigerianMap = ({ analyticsData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tooltip, setTooltip] = useState({
    show: false,
    state: "",
    position: { x: 0, y: 0 },
    data: null,
  });

  console.log("analyticsData", analyticsData);

  // Add effect to handle loading state
  useEffect(() => {
    if (analyticsData) {
      setIsLoading(false);
    }
  }, [analyticsData]);

  // Update the getStateData function
  const getStateData = (stateId) => {
    const stateInfo = stateData[stateId];
    if (!stateInfo) return null;

    const stateResidence = analyticsData?.stateOfResidenceDistribution?.find(
      (state) => state._id?.toLowerCase() === stateInfo.name?.toLowerCase()
    );

    const stateOrigin = analyticsData?.stateOfOriginDistribution?.find(
      (state) => state._id?.toLowerCase() === stateInfo.name?.toLowerCase()
    );

    const centers = analyticsData?.trainingCenterStats?.centersByState?.find(
      (state) => state._id?.toLowerCase() === stateInfo.name?.toLowerCase()
    );

    return {
      name: stateInfo.name,
      residenceCount: {
        total: stateResidence?.total || 0,
        artisan_user: stateResidence?.artisan_user || 0,
        intending_artisan: stateResidence?.intending_artisan || 0,
      },
      // originCount: {
      //   total: stateOrigin?.total || 0,
      //   artisan_user: stateOrigin?.artisan_user || 0,
      //   intending_artisan: stateOrigin?.intending_artisan || 0
      // },
      trainingCenters: centers?.count || 0,
      centersList: centers?.centers || [],
      total: stateResidence?.total || 0,
      stateTotal: stateOrigin?.total || 0, // Add this line
    };
  };

  // Get color based on the total number of users
  const getColorByDensity = (stateId) => {
    const data = getStateData(stateId);
    if (!data) return "#e5e7eb";

    const total = data.total;
    if (total > 30000) return "#FF6347"; // Tomato Red for extreme density
    if (total > 25000) return "#FF5733"; // Red-Orange for very high density
    if (total > 20000) return "#C70039"; // Dark Red for high density
    if (total > 15000) return "#900C3F"; // Deep Pink for high density
    if (total > 10000) return "#581845"; // Dark Purple for moderate-high density
    if (total > 8000) return "#D2691E"; // Chocolate for very high density
    if (total > 6000) return "#FF8C00"; // Dark Orange for high density
    if (total > 5000) return "#20B2AA"; // LightSeaGreen for medium density
    if (total > 3000) return "#3CB371"; // MediumSeaGreen for moderate density
    if (total > 2000) return "#2E8B57"; // SeaGreen for medium density
    if (total > 1000) return "#228B22"; // ForestGreen for low-medium density
    if (total > 500) return "#006400"; // DarkGreen for low density
    if (total > 100) return "#8B0000"; // DarkRed for very low density
    return "#E0FFFF"; // Light Cyan for minimal density
  };

  // Handle mouse hover event
  const handleMouseMove = (event, stateName, stateId) => {
    // Get the relative position within the SVG
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setTooltip({
      show: true,
      state: stateName,
      position: {
        x: event.clientX,
        y: event.clientY,
      },
      data: getStateData(stateId),
    });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, show: false }));
  };

  // Calculate total sum of artisans and intending artisans
  const totalArtisans = Object.keys(stateData).reduce((sum, stateId) => {
    const state = getStateData(stateId);
    return sum + state.total;
  }, 0);

  const totalbyState = Object.keys(stateData).reduce((sum, stateId) => {
    const state = getStateData(stateId);
    return sum + state.stateTotal;
  }, 0);

  const tCenter = Object.keys(stateData).reduce((sum, stateId) => {
    const state = getStateData(stateId);
    return sum + state.trainingCenters;
  }, 0);

  // Convert TopoJSON to GeoJSON
  const nigeriaGeoData = feature(
    nigeriaTopoData,
    nigeriaTopoData.objects.default
  );

  // Create map projection
  const projection = geoMercator()
    .center([8.6753, 9.082]) // Nigeria's approximate center
    .scale(2500)
    .translate([400, 400]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <Card className="bg-white shadow-lg relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
            <p className="text-sm text-gray-600">Loading map data...</p>
          </div>
        </div>
      )}

      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapIcon className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Nigerian Artisan Distribution Map
            </CardTitle>
          </div>
          {/* Add a small loading indicator in the header when refreshing */}
          {isLoading && (
            <div className="animate-spin h-4 w-4 border-2 border-emerald-500 rounded-full border-t-transparent" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full pt-0 max-w-4xl mx-auto">
          <svg viewBox="0 150 800 450" className="w-full h-auto rounded-lg">
            <g>
              {nigeriaGeoData.features.map((feature) => {
                const stateName = feature.properties.name;
                const stateId = Object.keys(stateData).find(
                  (key) => stateData[key].name === stateName
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
                const stateData = getStateData(stateId);
                const total = stateData.total;

                return (
                  <text
                    key={`label-${stateId}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dy=".3em"
                    className="text-[8px] font-medium pointer-events-none"
                    fill={total > 500 ? "#fff" : "#374151"}>
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
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md border border-gray-100">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="grid grid-cols-1 gap-1.5">
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

          {/* Total Sum */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-4">
              <p className="text-xs text-gray-900">
                Total by State of Residence:{" "}
                <span className="text-emerald-600">
                  {totalArtisans.toLocaleString()}
                </span>
              </p>
              <span className="text-gray-300">|</span>
              <p className="text-xs text-gray-900">
                Total by State of Origin:{" "}
                <span className="text-emerald-600">
                  {totalbyState.toLocaleString()}
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-900 mt-2">
              Total Training Centre by State:{" "}
              <span className="text-emerald-600">
                {tCenter.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NigerianMap;
