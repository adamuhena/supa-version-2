import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/HomePage/About";
import LoginForm from "./pages/loginPage/Login";
import SignupForm from "./pages/loginPage/signUp";
import Register from "./pages/register/register";
import ArtisanForm from "./pages/forms/artisan/index";
import IntendingArtisanForm from "./pages/forms/intendinArtisan/index";
import TrainingCenterForm from "./pages/forms/registrationCenter/index";
import PrivateRoute from "./components/ProtectedRoute"; // Import PrivateRoute component
import "./App.css";
import ArtisanDashboard from "./pages/dashboard/artisan/ArtisanDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import UserManagement from "./pages/dashboard/artisan/userManagement";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />

        {/* <Route path="/login" element={<LoginForm />} /> */}
        {/* Login */}
      {/* <Route
        path="/login"
        element={
          <ProtectedRoute>
            <LoginForm />
          </ProtectedRoute>
        }
      /> */}
      {/* Public route for login */}
      <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />

        <Route path="/signUp" element={<SignupForm />} />
        <Route path="/register" element={<Register />} />
        {/* <Route
          path="/register/artisan"
          element={
            <ArtisanForm/>
         
          }
        />
        <Route
          path="/register/intendingArtisan"
          element={
              <IntendingArtisanForm/>
          }
        />
        <Route
          path="/register/registrationcenter"
        
              element={<RegistrationCenter/>}
              
            />
          
        <Route
          path="/register/trainingcenter"
         
              element={<TrainingCenterForm/>}
             
          
        /> */}
        {/* Protected Routes */}
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
          path="/artisan/dashboard"
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
            < ArtisanDashboard/>
          }
          allowedRoles={["training_center", "admin", "superadmin"]}
        />
        <Route
          path="/admin/dashboard"
          element={
            < ArtisanDashboard/>
          }
          allowedRoles={[ "admin", "superadmin"]}
        />

        <Route path="/admin/usermanagement"
          element={<UserManagement/>}
          allowedRoles={[ "admin", "superadmin"]}
          />
        
      </Routes>
    </Router>
  );
}

export default App;
