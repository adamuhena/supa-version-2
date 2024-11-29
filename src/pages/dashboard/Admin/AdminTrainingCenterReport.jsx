import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardPage from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/layout/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TrainingCenterReport = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  // Fetch training center reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/trainingcenter/report`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setReports(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Memoized CSV Data
  const csvData = useMemo(() => {
    if (!reports.length) return [];
    const headers = ["Training Center", "Address", "State", "LGA", "Phone", "Email"];
    const rows = reports.map(({ name, address, state, lga, phone, email }) => [
      name,
      address,
      state,
      lga,
      phone,
      email,
    ]);
    return [headers, ...rows];
  }, [reports]);

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    const headers = ["Training Center", "Address", "State", "LGA", "Phone", "Email"];
    const data = reports.map(({ name, address, state, lga, phone, email }) => [
      name,
      address,
      state,
      lga,
      phone,
      email,
    ]);
    doc.setFontSize(16);
    doc.text("Training Center Report", 20, 20);
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 30,
    });
    doc.save("Training_Center_Report.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardPage title="Training Center Report">
        <div className="container mx-auto py-6">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Training Center Reports</h1>
            <div className="flex gap-2">
              {reports.length > 0 && (
                <>
                  <CSVLink data={csvData} filename="training_center_report.csv">
                    <Button>Download CSV</Button>
                  </CSVLink>
                  <Button onClick={generatePDF}>Download PDF</Button>
                </>
              )}
            </div>
          </header>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Training Center</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>State</TableHead>
                <TableHead>LGA</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((center) => (
                <TableRow key={center.id}>
                  <TableCell>{center.name}</TableCell>
                  <TableCell>{center.address}</TableCell>
                  <TableCell>{center.state}</TableCell>
                  <TableCell>{center.lga}</TableCell>
                  <TableCell>{center.phone}</TableCell>
                  <TableCell>{center.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardPage>
    </ProtectedRoute>
  );
};

export default TrainingCenterReport;
