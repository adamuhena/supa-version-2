import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";

export default function VerifyAdmission() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    const userId = searchParams.get("user");
    const verificationId = searchParams.get("verification");
    const assignmentId = searchParams.get("assignment");
    const periodId = searchParams.get("period");
    if (!userId || !verificationId || !assignmentId || !periodId) {
      setStatus("error");
      return;
    }
    async function fetchData() {
      try {
        // Call your backend endpoint
        const res = await axios.get(
          `${API_BASE_URL}/training/verify-admission-letter`,
          {
            params: {
              user: userId,
              verification: verificationId,
              assignment: assignmentId,
              period: periodId,
            },
          }
        );
        if (res.data.success) {
          setData(res.data.data);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    }
    fetchData();
  }, [searchParams]);

  if (status === "loading") {
    return <div className="p-8 text-center">Verifying admission letter...</div>;
  }
  if (status === "error") {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Invalid or unverified admission letter.
      </div>
    );
  }
  return (
    <div className="max-w-lg mx-auto p-8 mt-8 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Admission Letter Verified
      </h1>
      <div className="mb-2">
        Name:{" "}
        <span className="font-semibold">
          {data.user.firstName} {data.user.lastName}
        </span>
      </div>
      <div className="mb-2">
        Email: <span className="font-semibold">{data.user.email}</span>
      </div>
      <div className="mb-2">
        Training Center:{" "}
        <span className="font-semibold">
          {data.assignment.trainingCenterId?.trainingCentreName ||
            data.assignment.trainingCenterId?.name}
        </span>
      </div>
      <div className="mb-2">
        Status: <span className="font-semibold">{data.assignment.status}</span>
      </div>
      <div className="mb-2">
        Period:{" "}
        <span className="font-semibold">
          {data.period?.name} ({data.period?.year})
        </span>
      </div>
      <div className="mt-4 text-green-600 font-semibold">
        This admission letter is valid and authentic.
      </div>
    </div>
  );
} 