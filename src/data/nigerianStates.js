export const stateData = {
  abia: { name: "Abia", coordinates: [7.607, 5.661] },
  adamawa: { name: "Adamawa", coordinates: [12.434, 9.627] },
  akwaibom: { name: "Akwa Ibom", coordinates: [7.803, 4.906] },
  anambra: { name: "Anambra", coordinates: [6.968, 6.235] },
  bauchi: { name: "Bauchi", coordinates: [9.957, 10.342] },
  bayelsa: { name: "Bayelsa", coordinates: [6.124, 4.679] },
  benue: { name: "Benue", coordinates: [9.047, 7.327] },
  borno: { name: "Borno", coordinates: [13.315, 12.127] },
  crossriver: { name: "Cross River", coordinates: [8.581, 5.951] },
  delta: { name: "Delta", coordinates: [5.796, 5.524] },
  ebonyi: { name: "Ebonyi", coordinates: [8.064, 6.318] },
  edo: { name: "Edo", coordinates: [5.971, 6.587] },
  ekiti: { name: "Ekiti", coordinates: [5.317, 7.721] },
  enugu: { name: "Enugu", coordinates: [7.432, 6.541] },
  abuja: { name: "Federal Capital Territory", coordinates: [7.066, 8.821] },
  gombe: { name: "Gombe", coordinates: [11.244, 10.524] },
  imo: { name: "Imo", coordinates: [7.015, 5.555] },
  jigawa: { name: "Jigawa", coordinates: [9.463, 12.413] },
  kaduna: { name: "Kaduna", coordinates: [7.546, 10.621] },
  kano: { name: "Kano", coordinates: [8.521, 11.805] },
  katsina: { name: "Katsina", coordinates: [7.67, 12.586] },
  kebbi: { name: "Kebbi", coordinates: [4.12, 12.128] },
  kogi: { name: "Kogi", coordinates: [7.175, 7.418] },
  kwara: { name: "Kwara", coordinates: [4.958, 8.651] },
  lagos: { name: "Lagos", coordinates: [3.867, 6.545] },
  nasarawa: { name: "Nasarawa", coordinates: [8.249, 8.592] },
  niger: { name: "Niger", coordinates: [5.795, 9.872] },
  ogun: { name: "Ogun", coordinates: [3.426, 7.037] },
  ondo: { name: "Ondo", coordinates: [4.873, 6.885] },
  osun: { name: "Osun", coordinates: [4.572, 7.519] },
  oyo: { name: "Oyo", coordinates: [3.594, 8.172] },
  plateau: { name: "Plateau", coordinates: [9.669, 9.065] },
  rivers: { name: "Rivers", coordinates: [6.816, 4.962] },
  sokoto: { name: "Sokoto", coordinates: [5.383, 13.244] },
  taraba: { name: "Taraba", coordinates: [10.88, 7.827] },
  yobe: { name: "Yobe", coordinates: [11.599, 11.929] },
  zamfara: { name: "Zamfara", coordinates: [6.301, 12.133] }
};

// Helper function to get state metadata
export const getStateMetadata = (stateName) => {
  const stateInfo = nigeria.find(state => state.name === stateName);
  return {
    cities: stateInfo?.cities || [],
    lgas: stateInfo?.lgas || [],
    senatorialDistricts: stateInfo?.senatorialDistricts || [],
    code: stateInfo?.code || ''
  };
};

export default stateData;