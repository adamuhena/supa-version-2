import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/config/env";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewRegistration() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        
        const response = await axios.get(
          `${API_BASE_URL}/recent-registrations?page=${page}&limit=3`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (response.data.success) {
          setRegistrations(response.data.data.registrations);
          setTotalPages(response.data.data.pagination.totalPages);
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [page]);

  const getTypeIcon = (role) => {
    switch (role) {
      case 'artisan_user':
        return '🛠️';
      case 'intending_artisan':
        return '👨‍🎓';
      case 'training_center':
        return '🏢';
      default:
        return '👤';
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200">
          {registrations.map((reg, index) => (
            <li key={index} className="py-0 pt-0">
              <div className="flex items-center space-x-4">
                <span className="text-m">{getTypeIcon(reg.role)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-normal text-gray-900 truncate">
                    {reg.name}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>{reg.role.replace('_', ' ').toUpperCase()}</span>
                    {reg.location && (
                      <>
                        <span>•</span>
                        <span>{reg.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(reg.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs bg-gray-100 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3.5 py-0 text-xs bg-gray-100 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}