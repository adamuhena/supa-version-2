import axios from "axios";
import { useState } from "react";

import { toast } from "sonner";
import { API_BASE_URL } from "@/config/env";

export const useFileUpload = () => {
  const [loading, setLoading] = useState(false);

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const onUploadProgress = (progressEvent) => {
    const percentage = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setUploadPercentage(percentage);
  };

  const handleImageUpload = async (data, cb = () => {}) => {
    let response;
    try {
      axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
      setLoading(true);
      const request = await axios.post(`${API_BASE_URL}/upload/file`, data, {
        onUploadProgress,
      });
      response = request.data;
      setLoading(false);
      cb();
      // return request.data;
    } catch (e) {
      response = {
        error: true,
        message:
          e?.response?.status === 413
            ? "File too large"
            : e?.response?.data?.message || "An error occured",
        status: e?.response?.status || 400,
        data: e?.response?.data?.data || undefined,
      };

      toast.error(
        "There seems to be a network error, the file is too large or the file format is not accepted."
      );
    } finally {
      axios.defaults.headers.post["Content-Type"] = "application/json";
      setLoading(false);
    }
    return response;
  };
  return { handleImageUpload, loading, uploadPercentage };
};
