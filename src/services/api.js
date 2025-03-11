import React, { useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

const accessToken = localStorage.getItem("accessToken");

// Create an Axios instance for reuse
const api = axios.create({
  baseURL: API_BASE_URL,
});

// export const fetchUserDist = async () => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (!accessToken) {
//     console.error("Access token is missing");
//     return {}; // Return empty object if token is not found
//   }

//   try {
//     // Make sure to pass the access token in the Authorization header
//     const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const dist = {};

//     // Access locationDistributions correctly from the response structure
//     const locationDistributions =
//       response.data.data?.[0]?.locationDistributions || [];

//     if (!Array.isArray(locationDistributions)) {
//       console.error("Expected locationDistributions to be an array");
//       return {};
//     }

//     locationDistributions.forEach((location) => {
//       const { _id, count } = location;
//       const stateOfResidence = _id.stateOfResidence;

//       if (!stateOfResidence) return;

//       const state = stateOfResidence.toLowerCase();
//       if (!dist[state]) {
//         dist[state] = { artisan_users: 0, intending_artisans: 0 };
//       }

//       // Assuming the count is the total number of users in that state
//       dist[state].artisan_users += count; // Adjust this if you have separate counts for artisan_users and intending_artisans
//     });

//     return dist;
//   } catch (error) {
//     console.error("Error fetching user distribution:", error);
//     throw error; // Rethrow error after logging
//   }
// };

// export const fetchUserDist = async () => {
//   const accessToken = localStorage.getItem("accessToken");
//   if (!accessToken) {
//     console.error("Access token is missing");
//     return {}; // Return empty object if token is not found
//   }

//   try {
//     // Make sure to pass the access token in the Authorization header
//     const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     const dist = {};

//     // Access locationDistributions correctly from the response structure
//     const locationDistributions =
//       response.data.data?.[0]?.locationDistributions || [];

//     if (!Array.isArray(locationDistributions)) {
//       console.error("Expected locationDistributions to be an array");
//       return {};
//     }

//     locationDistributions.forEach((location) => {
//       const { _id, count } = location;
//       const stateOfResidence = _id.stateOfResidence;

//       if (!stateOfResidence) return;

//       const state = stateOfResidence.toLowerCase();
//       if (!dist[state]) {
//         dist[state] = { artisan_users: 0, intending_artisans: 0 };
//       }

//       // Assuming the count is the total number of users in that state
//       dist[state].artisan_users += count; // Adjust this if you have separate counts for artisan_users and intending_artisans
//     });

//     return dist;
//   } catch (error) {
//     console.error("Error fetching user distribution:", error);
//     throw error; // Rethrow error after logging
//   }
// };


export const fetchUserDist = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("Access token is missing");
    return {}; // Return empty object if token is not found
  }

  try {
    // Make sure to pass the access token in the Authorization header
    const response = await axios.get(`${API_BASE_URL}/dashboard-analytics`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const dist = {};

    // Access locationDistributions correctly from the response structure
    const locationDistributions =
      response.data.data?.[0]?.locationDistributions || [];

    if (!Array.isArray(locationDistributions)) {
      console.error("Expected locationDistributions to be an array");
      return {};
    }

    locationDistributions.forEach((location) => {
      const { _id, count } = location;
      const { stateOfResidence, role } = _id;

      if (!stateOfResidence || !role) return;

      const state = stateOfResidence.toLowerCase();
      if (!dist[state]) {
        dist[state] = { artisan_users: 0, intending_artisans: 0 };
      }

      if (role === "artisan_user") {
        dist[state].artisan_users += count;
      } else if (role === "intending_artisan") {
        dist[state].intending_artisans += count;
      }
    });

    return dist;
  } catch (error) {
    console.error("Error fetching user distribution:", error);
    throw error; // Rethrow error after logging
  }
};



export const fetchUserDistribution = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });



    // Process the response to group users by stateOfResidence
    const distribution = {};

    // Access the nested data array from the response
    const users = response.data.data;

    if (!Array.isArray(users)) {
      console.error("Expected users data to be an array");
      return {};
    }

    users.forEach((user) => {
      if (!user.stateOfResidence) return;

      const state = user.stateOfResidence.toLowerCase();
      if (!distribution[state]) {
        distribution[state] = {
          artisan_users: 0,
          intending_artisans: 0,
        };
      }

      if (user.role === "artisan_user") {
        distribution[state].artisan_users++;
      } else if (user.role === "intending_artisan") {
        distribution[state].intending_artisans++;
      }
    });

    return distribution;
  } catch (error) {
    console.error("Error fetching user distribution:", error);
    throw error;
  }
};

export const fetchSectors = async (accessToken) => {
  try {
    // Send GET request to fetch sectors
    const response = await axios.get(`${API_BASE_URL}/sectors`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assuming response.data contains the sectors
    if (response.data.success) {
      // Return sectors if success
      return response.data.data;
    } else {
      // Handle the error case where response doesn't contain the expected structure
      throw new Error(response.data.message || "Failed to fetch sectors");
    }
  } catch (error) {
    // Handle the error
    console.error("Error fetching sectors:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
};
