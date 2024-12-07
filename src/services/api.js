import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance for reuse
const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchUserDistribution = async () => {
  try {
    const response = await api.get('/users');
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

      console.log("state: ", state)
      
      if (user.role === 'artisan_user') {
        distribution[state].artisan_users;
      } else if (user.role === 'intending_artisan') {
        distribution[state].intending_artisans;
      }
      console.log(distribution[state].intending_artisans++)
    });
    
    return distribution;
  } catch (error) {
    console.error('Error fetching user distribution:', error);
    throw error;
  }
};