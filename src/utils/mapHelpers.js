export const getStateCenter = (state) => {
  return stateData[state.toLowerCase()]?.coordinates || [0, 0];
};

export const formatStateName = (state) => {
  return stateData[state.toLowerCase()]?.name || state;
};

export const getStateId = (stateName) => {
  return Object.keys(stateData).find(
    key => stateData[key].name.toLowerCase() === stateName.toLowerCase()
  );
};