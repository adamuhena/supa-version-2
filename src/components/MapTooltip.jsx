import React from 'react';

const MapTooltip = ({ stateName, data, position }) => {
  if (!data) return null;

  return (
    <div
      className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
      style={{
        left: position.x,
        top: position.y,
        transform:'translate(-200%, -200%)',
      }}
    >
      <h3 className="font-bold text-lg mb-2">{stateName}</h3>
      <div className="space-y-1">
        <p className="text-sm">
          Artisans: <span className="font-semibold">{data.artisan_users}</span>
        </p>
        <p className="text-sm">
          Intending Artisans: <span className="font-semibold">{data.intending_artisans}</span>
        </p>
      </div>
    </div>
  );
};

export default MapTooltip;