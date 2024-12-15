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
import "./App.css";
import ArtisanDashboard from "./pages/dashboard/artisan/ArtisanDashboard";
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

// import AdminDashboard from "./pages/dashboard/Admin/adminDashboard"

function App() {
  return (
    <Router
      future={{
        v7_relativeSplatPath: true, // Enable the v7 splat path behavior
        v7_startTransition: true,
      }}
    >
      <Routes>
        {/* test */}
        <Route path="/training-center" element={<TrainingCenterDashboard />} />

        


        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        {/* <Route path="/biodata2" element={<BiodataPage />} /> */}
        <Route path="/biodata" element={<Biodata />} />
        <Route path="/certification/upload" element={<DocumentUpload/>}/>
        <Route path="/training-center/biodata" element={<TrainingCenterBiodata />} />
        

        
       
      {/* Public route for login */}
      <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

<Route
          path="/forget-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route path="/signUp" element={<SignupForm />} />
        <Route path="/register" element={<Register />} />
       
        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard/>
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />
        <Route
          path="/admin/certification"
          element={
            <UserCert/>
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />
        
        <Route
          path="/intending-artisan/dashboard"
          element={
            <ArtisanDashboard/>
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />
        <Route
          path="/admin/training-status"
          element={
            <TrainingManagement/>
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />
        <Route
          path="/register/artisan"
          element={
            <ArtisanForm/>
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />
        <Route
          path="/register/intendingArtisan"
          element={
            <IntendingArtisanForm/>
          }
          allowedRoles={["intending_artisan", "admin", "superadmin"]}
        />
        <Route
          path="/register/trainingcenter"
          element={
            <TrainingCenterForm />
          }
          allowedRoles={["training_center", "admin", "superadmin"]}
        />

        <Route
          path="/trainee/dashboard"
          element={
            < ArtisanDashboard />
          }
          allowedRoles={["artisan_user", "admin", "superadmin"]}
        />

        <Route
          path="/intendingArtisan/dashboard"
          element={
            <ArtisanDashboard />
          }
          allowedRoles={["intending_artisan", "admin", "superadmin"]}
        />
        <Route
          path="/trainingcenter/dashboard"
          element={
            <TrainingCenterDashboard />
          }
          allowedRoles={["training_center", "admin", "superadmin"]}
        />
        <Route
          path="/admin/dashboard"
          element={
            < ArtisanDashboard />
          }
          allowedRoles={[ "admin", "superadmin"]}
        />

        <Route path="/admin/usermanagement"
          element={<UserManagement/>}
          allowedRoles={[ "admin", "superadmin"]}
          />

        <Route path="/admin/dashboard/reports"
          element={<AdminDashboardReports/>}
          allowedRoles={[ "admin", "superadmin"]}
          />
        <Route path="/admin/trainingcenter/reports"
          element={<TrainingCenterReport/>}
          allowedRoles={[ "admin", "superadmin"]}
          />
          

        <Route path="/training-center/status"
          element={<TrainingManagement/>}
          allowedRoles={[ "admin", "superadmin"]}
          />

          <Route path="/training/groups"
          element={<TrainingGroupDetails/>}
          allowedRoles={[ "admin", "superadmin"]}
          />

          <Route path="/document/verification"
           element={<AdminDocumentVerification/>}
           allowedRoles = {["admin", "superadmin"]}
           />

          <Route path="/admin/sectors"
           element={<AdminSectors/>}
           allowedRoles = {["admin", "superadmin"]}
           />

        <Route path="/training-center/groups"
          element={<TrainingStatus/>}
          allowedRoles={[ "admin", "superadmin", "training_center"]}
          />
        
      </Routes>
    </Router>
  );
}

export default App;
