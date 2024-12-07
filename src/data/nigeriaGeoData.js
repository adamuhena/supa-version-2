export const nigeriaGeoData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Lagos" },
        geometry: {
          type: "Polygon",
          coordinates: [[[3.1, 6.3], [3.7, 6.3], [3.7, 6.7], [3.1, 6.7], [3.1, 6.3]]]
        }
      },
      // Add similar entries for other states with their actual boundaries
      {
        type: "Feature",
        properties: { name: "FCT Abuja" },
        geometry: {
          type: "Polygon",
          coordinates: [[[7.1, 8.8], [7.6, 8.8], [7.6, 9.3], [7.1, 9.3], [7.1, 8.8]]]
        }
      }
    ]
  };