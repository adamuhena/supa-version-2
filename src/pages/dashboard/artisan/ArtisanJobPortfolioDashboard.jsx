import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import useLogout from "@/pages/loginPage/logout";
import { LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import UploadButton from "@/components/UploadButton";
import Spinner from "@/components/Spinner";
import { toast } from "sonner";

const ArtisanDashboard = () => {
  const logout = useLogout();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getPortfolio = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!userId) return null;
    console.log("we got here 2");

    setLoading(true);

    try {
      if (!accessToken || !userId) {
        return; // If no token or userId, you can handle this with a redirect or error state
      }

      const response = await axios.get(
        `${API_BASE_URL}/marketplace/portfolio`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            artisan_id: userId,
          },
        }
      );

      setData(response?.data?.data?.portfolio || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPortfolio();
  }, []);

  // Add a new image object
  const handleAddImage = async (imageUrl) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!userId) return null;
    console.log("we got here 2");

    setLoading(true);

    try {
      if (!accessToken || !userId) {
        return; // If no token or userId, you can handle this with a redirect or error state
      }

      await axios.patch(
        `${API_BASE_URL}/marketplace/portfolio`,
        {
          artisan_id: userId,
          typeOfUpdate: "add",
          imageId: new Date().getTime().toString(),
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Added successfully.");
      getPortfolio();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error?.response?.data?.message || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  // Remove an image by index

  const handleRemoveImage = async (imageId) => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!userId) return null;
    console.log("we got here 2");

    setLoading(true);

    try {
      if (!accessToken || !userId) {
        return; // If no token or userId, you can handle this with a redirect or error state
      }

      await axios.patch(
        `${API_BASE_URL}/marketplace/portfolio`,
        {
          artisan_id: userId,
          typeOfUpdate: "delete",
          imageId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Deleted successfully.");
      getPortfolio();
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error?.response?.data?.message || "An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute href="/trainee/dashboard">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            My Recent Works ({data?.length || 0})
          </h1>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <div className="mb-4 w-full flex items-start justify-start">
          <div>
            <UploadButton
              title={"Add New Image"}
              handleFileChange={(url) => {
                console.log("url", url);

                handleAddImage(url);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className=" flex items-center justify-center w-full py-[25px]">
            <Spinner className={"w-[40px] h-[40px]"} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {(data || []).map((img, idx) => (
            <div
              key={idx}
              className="border rounded shadow flex flex-col items-center h-[228px] overflow-hidden ">
              <img
                src={img?.imageUrl}
                alt="Image"
                className="w-full max-h-[180px] mb-2 rounded object-cover flex-1 border"
              />
              <div className="px-4 pb-2 max-h-[30px]">
                <Button
                  className="h-[30px]"
                  variant="destructive"
                  onClick={() => handleRemoveImage(img?.imageId)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!data?.length && !loading ? (
          <h1 className="text-red-500 text-center py-[50px] w-full">
            You do not have an images uploaded yet!
          </h1>
        ) : null}
      </div>
    </ProtectedRoute>
  );
};

export default ArtisanDashboard;
