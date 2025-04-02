import React from 'react';

const MapTooltip = ({ stateName, data, position }) => {
  if (!data) return null;

  return (
    <div
      className="absolute z-10 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-300%, -250%)'  // Adjusted transform
      }}
    >
      <h3 className="font-semibold text-sm">{stateName}</h3>
      <div className="text-xs space-y-1">
        <p>Residents: {data.residenceCount.toLocaleString()}</p>
        <p>Origin: {data.originCount.toLocaleString()}</p>
        <p className="font-medium">Total: {data.total.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MapTooltip;


// import React from 'react';

// const MapTooltip = ({ stateName, data, position }) => {
//   if (!data) return null;

//   return (
//     <div
//       className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
//       style={{
//         left: position.x,
//         top: position.y,
//         transform:'translate(-200%, -200%)',
//       }}
//     >
//       <h3 className="font-bold text-lg mb-2">{stateName}</h3>
//       <div className="space-y-1">
//         <p className="text-sm">
//           Artisans: <span className="font-semibold">{data.artisan_users}</span>
//         </p>
//         <p className="text-sm">
//           Intending Artisans: <span className="font-semibold">{data.intending_artisans}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default MapTooltip;