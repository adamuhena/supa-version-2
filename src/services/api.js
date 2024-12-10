import React, { useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

// Create an Axios instance for reuse
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchUserDistribution = async () => {
  try {
    const response = await
      api.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    
    console.log ("i got here ",response.data);
    
    // Process the response to group users by stateOfResidence
    const distribution = {};
    
    // Access the nested data array from the response
    const users = response.data.data;
    
    if (!Array.isArray(users)) {
      console.error('Expected users data to be an array');
      return {};
    }
    
    users.forEach(user => {
      if (!user.stateOfResidence) return;
      
      const state = user.stateOfResidence.toLowerCase();
      if (!distribution[state]) {
        distribution[state] = {
          artisan_users: 0,
          intending_artisans: 0
        };
      }
      
      if (user.role === 'artisan_user') {
        distribution[state].artisan_users++;
      } else if (user.role === 'intending_artisan') {
        distribution[state].intending_artisans++;
      }
    });
    
    return distribution;
  } catch (error) {
    console.error('Error fetching user distribution:', error);
    throw error;
  }
};

function PeriodicRequest() {
  useEffect(() => {
    // Function to send a request to the server
    const sendRequest = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sectors`,{
          headers: { Authorization: `Bearer ${accessToken}` },
        }); // Replace with your endpoint
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error making the request:', error);
      }
    };

    // Call the function immediately on mount
    sendRequest();

    // Set up an interval to call the function every 5 minutes
    const intervalId = setInterval(() => {
      sendRequest();
    }, 300000); // 300,000 ms = 5 minutes

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs only once

  return null; // This component does not render anything
}

export default PeriodicRequest;