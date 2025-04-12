import React from 'react';

// const MapTooltip = ({ stateName, data, position }) => {
//   if (!data) return null;

//   return (
//     <div
//       className="absolute z-10 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200"
//       style={{
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         transform: 'translate(-300%, -250%)'  // Adjusted transform
//       }}
//     >
//       <h3 className="font-semibold text-sm">{stateName}</h3>
//       <div className="text-xs space-y-1">
//         <p>Residents: {data.residenceCount.toLocaleString()}</p>
//         <p>Origin: {data.originCount.toLocaleString()}</p>
//         <p className="font-medium">Total: {data.total.toLocaleString()}</p>
//       </div>
//     </div>
//   );
// };

// export default MapTooltip;

// import React from 'react';

const MapTooltip = ({ stateName, data, position }) => {
  if (!data) return null;

  return (
    <div
      className="absolute z-50 bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200/50 min-w-[250px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-200%, -200%)'
      }}
    >
      <h3 className="font-bold text-lg mb-2">{stateName}</h3>
      
      <div className="space-y-2">
        {/* Residence Statistics */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Current Residence:</h4>
          <div className="ml-2">
            <p className="text-sm">
              Total: {data.residenceCount?.total?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-600">
              Artisans: {data.residenceCount?.artisan_user?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-600">
              Intending: {data.residenceCount?.intending_artisan?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Origin Statistics */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700">State of Origin:</h4>
          <div className="ml-2">
            <p className="text-sm">
              Total: {data.originCount?.total?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-600">
              Artisans: {data.originCount?.artisan_user?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-600">
              Intending: {data.originCount?.intending_artisan?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Training Centers */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700">Training Centers:</h4>
          <p className="text-sm ml-2">
            Total: {data.trainingCenters?.toLocaleString() || '0'}
          </p>
          {/* {data.centersList && data.centersList.length > 0 && (
            <div className="ml-2 mt-1">
              <p className="text-xs text-gray-600 font-semibold">Centers:</p>
              <ul className="text-xs text-gray-500 max-h-[100px] overflow-y-auto">
                {data.centersList.map((center, index) => (
                  <li key={center.id || index} className="truncate">
                    {center.name}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MapTooltip;