import React,{ useState, useEffect }  from 'react';
import axios from 'axios';
import { Users, UserPlus, School, UsersRound } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <Icon className="h-8 w-8 text-emerald-500" />
    </div>
  </div>
);

export default function Metrics() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]); // Holds user data
  const [trainingCenters, setTrainingCenters] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);

  console.log(users);

  let artisan_userCount = 0;
  let intending_artisanCount = 0;
  let training_centerCount = 0;
  let training_groupCount = 0;
  
  users.forEach(user  => {
    if (user.role === "artisan_user") {
      artisan_userCount++;
    }
    if (user.role === "intending_artisan") {
      intending_artisanCount++;
    }
  });

  trainingCenters.forEach( trainingCenter => {
    if (trainingCenter) {
      training_centerCount++;
  }}) //.status === "active"
    
  trainingGroups.forEach( trainingGroup => {
    if (trainingGroup) {
      training_groupCount++;
  }}) //.status === "active"


  
console.log(training_centerCount)
console.log(artisan_userCount)
console.log(intending_artisanCount)

useEffect(() => {
  const fetchTrainingCenters = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.get(`${API_BASE_URL}/training-centers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setTrainingCenters(response.data.data); // Assume data is an array of users
      }
    } catch (error) {
      console.error("Error fetching training centers:", error);
    }
  };

  fetchTrainingCenters();
}, []);

    // Fetch trainingCenters from the database
    useEffect(() => {
      const fetchTrainingGroups = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
  
          const response = await axios.get(`${API_BASE_URL}/training-groups`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (response.data.success) {
            setTrainingGroups(response.data.data); // Assume data is an array of users
          }
        } catch (error) {
          console.error("Error fetching training Groups:", error);
        }
      };
  
      fetchTrainingGroups();
    }, []);

     // Fetch users from the database
     useEffect(() => {
      const fetchUsers = async () => {
        try {
          const accessToken = localStorage.getItem("accessToken");
  
          const response = await axios.get(`${API_BASE_URL}/users`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (response.data.success) {
            setUsers(response.data.data); // Assume data is an array of users
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
  
      fetchUsers();
    }, []);
  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard title="Registered Artisans" value={artisan_userCount} icon={Users} />
      <MetricCard title="Intending Artisans" value={intending_artisanCount} icon={UserPlus} />
      <MetricCard title="Training Centers" value={training_centerCount} icon={School} />
      <MetricCard title="Training Center Groups" value={training_groupCount} icon={UsersRound} />
    </div>
  );
}

