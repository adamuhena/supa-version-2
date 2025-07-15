import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/HomePage/About";
import LoginForm from "./pages/loginPage/login";
import SignupForm from "./pages/loginPage/signUp";
import Register from "./pages/register/register";
import ArtisanForm from "./pages/forms/artisan/index";
import IntendingArtisanForm from "./pages/forms/intendinArtisan/index";
import TrainingCenterForm from "./pages/forms/registrationCenter/index";
import ArtisanDashboard from "./pages/dashboard/artisan/ArtisanDashboard";
import ArtisanJobRequestDashboard from "./pages/dashboard/artisan/ArtisanJobRequestDashboard";

import ArtisanJobPortfolioDashboard from "./pages/dashboard/artisan/ArtisanJobPortfolioDashboard";

import PublicRoute from "./components/PublicRoute";
import DocumentUpload from "./pages/dashboard/artisan/DocumentUpload";
import Biodata from "./pages/dashboard/BiodataPage";
import TrainingCenterDashboard from "./pages/dashboard/trainingCenter/TrainingCenterDashboard";
import AdminDashboard from "./pages/dashboard/Admin/adminDashboard";
import UserManagement from "./pages/dashboard/Admin/userManagement";
import AdminDashboardReports from "./pages/dashboard/Admin/adminDashboardReports";
import TrainingStatus from "./pages/dashboard/trainingCenter/TrainingStatus";
import TrainingManagement from "./pages/dashboard/Admin/TrainingManagement";
import TrainingGroupDetails from "./pages/dashboard/Admin/TrainingGroup";
import AdminDocumentVerification from "./pages/dashboard/Admin/AdminDocumentVerification";
import TrainingCenterReport from "./pages/dashboard/Admin/AdminTrainingCenterReport";
import AdminSectors from "./pages/dashboard/Admin/sectors";
import TrainingCenterBiodata from "./pages/dashboard/trainingCenter/TrainingCenterBiodata";
import ContactUs from "./pages/contact/Contact";
import UserCert from "./pages/dashboard/Admin/userMgt/UserManagement";
import ForgotPassword from "./pages/loginPage/ForgetPassword";
import TestPage from "./pages/testpage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotAuthorized from "./pages/loginPage/NotAuthorized";
import "./App.css";

import { AlertUsersToResetPassword } from "./components/AlertUsersToResetPassword";
import GalleryPage from "./pages/gallery/Gallery";
import ComingSoon from "./pages/HomePage/Comingsoon";
import PDFPreviewPage from "./pages/HomePage/PdfPreviewPage";
import DocPreview from "./pages/dashboard/Admin/page";
import { DocumentProvider } from "./pages/dashboard/Admin/preview/contexts/DocumentContext";
import Dashboard from "./pages/dashboard/Admin/preview/pages/Dashboard";
import CreateDocument from "./pages/dashboard/Admin/preview/pages/CreateDocument";
import EditDocument from "./pages/dashboard/Admin//preview/pages/EditDocument";
import DocumentPreview from "./pages/dashboard/Admin//preview/components/DocumentPreview";
import PDFPreviewPage2 from "./pages/dashboard/Admin/newPreview";
import TrainingCenterManagement from "./pages/dashboard/Admin/TrainingCenterMgt";
import DashboardLayout from "./components/layout/DashboardLayout";
import TrainingCenterMgt from "./pages/dashboard/Admin/TrainingCenterMgt/TrainingCenterManagement";
import TrainingAssignmentDashboard from "./pages/dashboard/Admin/Assignment/TrainingAssignmentDashboard";
import MarketplaceReport from "./pages/dashboard/Admin/marketplace-report";


function App() {
  return (
    <>
      <AlertUsersToResetPassword />
      <Router
        future={{
          v7_relativeSplatPath: true, // Enable the v7 splat path behavior
          v7_startTransition: true,
        }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/preview" element={<PDFPreviewPage />} />
          <Route path="/doc" element={<DocPreview />} />
          <Route path="/beneficiaries" element={<PDFPreviewPage2 />} />
          <Route path="/marketplace" element={<ComingSoon />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route path="/signUp" element={<SignupForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Training Centre Routes */}
          <Route
            path="training-center/biodata"
            element={
              <ProtectedRoute allowedRoles={["training_center"]}>
                <TrainingCenterBiodata />
              </ProtectedRoute>
            }
          />
          <Route
            path="register/artisan"
            element={
              <ProtectedRoute allowedRoles={["artisan_user"]}>
                <ArtisanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="register/intendingArtisan"
            element={
              <ProtectedRoute allowedRoles={["intending_artisan"]}>
                <IntendingArtisanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="register/trainingcenter"
            element={
              <ProtectedRoute allowedRoles={["training_center"]}>
                <TrainingCenterForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="training-center/groups"
            element={
              <ProtectedRoute
                allowedRoles={["superadmin", "training_center"]}>
                <TrainingStatus />
              </ProtectedRoute>
            }
          />
          <Route
            path="trainingcenter/dashboard"
            element={
              <ProtectedRoute allowedRoles={["training_center"]}>
                <TrainingCenterDashboard />
              </ProtectedRoute>
            }
          />
          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Admin and Superadmin Routes */}
            <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={["admin","superadmin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/usermanagement" element={<ProtectedRoute allowedRoles={["superadmin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="admin/marketplacereport/reports" element={<ProtectedRoute allowedRoles={["superadmin"]}>< MarketplaceReport/></ProtectedRoute>} />
            <Route path="/admin/training-centersmgt" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingCenterMgt /></ProtectedRoute>} />
            <Route path="admin/sectors" element={<ProtectedRoute allowedRoles={["superadmin"]}><AdminSectors /></ProtectedRoute>} />
            {/*admin only routes*/}
            <Route path="admin/certification" element={<ProtectedRoute allowedRoles={["superadmin", "admin"]}><UserCert /></ProtectedRoute>} />
            <Route path="training-center-management" element={<ProtectedRoute allowedRoles={["superadmin", "admin"]}><TrainingCenterManagement /></ProtectedRoute>} />
            

            <Route path="admin/training-status" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingManagement /></ProtectedRoute>} />
            <Route path="admin/dashboard/reports" element={<ProtectedRoute allowedRoles={["superadmin"]}><AdminDashboardReports /></ProtectedRoute>} />
            <Route path="admin/trainingcenter/reports" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingCenterReport /></ProtectedRoute>} />
            <Route path="document/verification" element={<ProtectedRoute allowedRoles={["superadmin"]}><AdminDocumentVerification /></ProtectedRoute>} />
            <Route path="training/groups" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingGroupDetails /></ProtectedRoute>} />
            <Route path="training-center/status" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingManagement /></ProtectedRoute>} />
            <Route path="biodata" element={<ProtectedRoute allowedRoles={["admin", "superadmin", "artisan_user", "intending_artisan"]}><Biodata /></ProtectedRoute>} />

            {/* Training Center Routes */}
            
            
            {/* <Route path="training/assign/smart" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><SmartAssignmentForm /></ProtectedRoute>} /> */}
            <Route path="training-assignment" element={<ProtectedRoute allowedRoles={["superadmin"]}><TrainingAssignmentDashboard /></ProtectedRoute>} />
            <Route path="training-center" element={<ProtectedRoute allowedRoles={["training_center"]}><TrainingCenterDashboard /></ProtectedRoute>} />
            {/* <Route path="training-center-management" element={<ProtectedRoute allowedRoles={["superadmin", "admin"]}><TrainingCenterManagement /></ProtectedRoute>} /> */}

            {/* Artisan and Intending Artisan Routes */}
            <Route
              path="trainee/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["artisan_user", "intending_artisan"]}>
                  <ArtisanDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="trainee/job-requests"
              element={
                <ProtectedRoute allowedRoles={["artisan_user"]}>
                  <ArtisanJobRequestDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="trainee/job-portfolio"
              element={
                <ProtectedRoute allowedRoles={["artisan_user"]}>
                  <ArtisanJobPortfolioDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="certification/upload"
              element={
                <ProtectedRoute
                  allowedRoles={["superadmin", "artisan_user"]}>
                  <DocumentUpload />
                </ProtectedRoute>
              }
            />

            {/* Document Management Routes */}
            <Route path="documents" element={<ProtectedRoute allowedRoles={["superadmin"]}><Dashboard /></ProtectedRoute>} />
            <Route path="documents/create" element={<ProtectedRoute allowedRoles={["superadmin"]}><CreateDocument /></ProtectedRoute>} />
            <Route path="documents/edit/:id" element={<ProtectedRoute allowedRoles={["superadmin"]}><EditDocument /></ProtectedRoute>} />
            <Route path="documents/preview/:_id" element={<ProtectedRoute allowedRoles={["superadmin"]}><DocumentPreview /></ProtectedRoute>} />

            {/* Miscellaneous Routes */}
            <Route path="test" element={<TestPage />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
