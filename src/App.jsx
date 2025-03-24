// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/HomePage";
// import About from "./pages/HomePage/About";
// import LoginForm from "./pages/loginPage/login";
// import SignupForm from "./pages/loginPage/signUp";
// import Register from "./pages/register/register";
// import ArtisanForm from "./pages/forms/artisan/index";
// import IntendingArtisanForm from "./pages/forms/intendinArtisan/index";
// import TrainingCenterForm from "./pages/forms/registrationCenter/index";
// import ArtisanDashboard from "./pages/dashboard/artisan/ArtisanDashboard";
// import PublicRoute from "./components/PublicRoute";
// import DocumentUpload from "./pages/dashboard/artisan/DocumentUpload";
// import Biodata from "./pages/dashboard/BiodataPage";
// import TrainingCenterDashboard from "./pages/dashboard/trainingCenter/TrainingCenterDashboard";
// import AdminDashboard from "./pages/dashboard/Admin/adminDashboard";
// import UserManagement from "./pages/dashboard/Admin/userManagement";
// import AdminDashboardReports from "./pages/dashboard/Admin/adminDashboardReports";
// import TrainingStatus from "./pages/dashboard/trainingCenter/TrainingStatus";
// import TrainingManagement from "./pages/dashboard/Admin/TrainingManagement";
// import TrainingGroupDetails from "./pages/dashboard/Admin/TrainingGroup";
// import AdminDocumentVerification from "./pages/dashboard/Admin/AdminDocumentVerification";
// import TrainingCenterReport from "./pages/dashboard/Admin/AdminTrainingCenterReport";
// import AdminSectors from "./pages/dashboard/Admin/sectors";
// import TrainingCenterBiodata from "./pages/dashboard/trainingCenter/TrainingCenterBiodata";
// import ContactUs from "./pages/contact/Contact";
// import UserCert from "./pages/dashboard/Admin/userMgt/UserManagement";
// import ForgotPassword from "./pages/loginPage/ForgetPassword";
// import TestPage from "./pages/testpage";
// import ProtectedRoute from "./components/ProtectedRoute";
// import NotAuthorized from "./pages/loginPage/NotAuthorized";
// import "./App.css";

// import { AlertUsersToResetPassword } from "./components/AlertUsersToResetPassword";
// import GalleryPage from "./pages/gallery/Gallery";
// import ComingSoon from "./pages/HomePage/Comingsoon";
// import PDFPreviewPage from "./pages/HomePage/PdfPreviewPage";
// import DocPreview from "./pages/dashboard/Admin/page";
// // import AdminDashboard from "./pages/dashboard/Admin/adminDashboard"
// import { DocumentProvider } from "./pages/dashboard/Admin/preview/contexts/DocumentContext";
// import Dashboard from "./pages/dashboard/Admin/preview/pages/Dashboard";
// import CreateDocument from "./pages/dashboard/Admin/preview/pages/CreateDocument";
// import EditDocument from "./pages/dashboard/Admin//preview/pages/EditDocument";
// import DocumentPreview from "./pages/dashboard/Admin//preview/components/DocumentPreview";
// import PDFPreviewPage2 from "./pages/dashboard/Admin/newPreview";
// import TrainingCenterManagement from "./pages/dashboard/Admin/TrainingCenterMgt";

// function App() {
//   return (
//     <>
//       <AlertUsersToResetPassword />
//       <Router
//         future={{
//           v7_relativeSplatPath: true, // Enable the v7 splat path behavior
//           v7_startTransition: true,
//         }}>
//         <Routes>
//           {/* test */}

//           {/* Public Routes */}
//           <Route path="/not-authorized" element={<NotAuthorized />} />
//           <Route path="/" element={<HomePage />} />
//           <Route path="/marketplace" element={<ComingSoon />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/contact" element={<ContactUs />} />
//           <Route path="/gallery" element={<GalleryPage />} />
//           <Route path="/preview" element={<PDFPreviewPage />} />
//           <Route path="/doc" element={<DocPreview />} />
//           <Route path="/beneficiaries" element={<PDFPreviewPage2 />} />
//           {/* <Route path="/biodata2" element={<BiodataPage />} /> */}
//           {/* <Route path="/biodata" element={<Biodata />} />
//         <Route path="/certification/upload" element={<DocumentUpload />} /> */}

//           {/* <DocumentProvider> */}
//           <Route
//             path="/training-center-management"
//             element={
//               <ProtectedRoute>
//                 <TrainingCenterManagement />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/documents"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/documents/create"
//             element={
//               <ProtectedRoute>
//                 <CreateDocument />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/documents/edit/:id"
//             element={
//               <ProtectedRoute>
//                 <EditDocument />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/documents/preview/:_id"
//             element={
//               <ProtectedRoute>
//                 <DocumentPreview />
//               </ProtectedRoute>
//             }
//           />
//           {/* <Route path="/" element={<Navigate to="/documents" replace />} /> */}

//           {/* </DocumentProvider> */}


//           {/* Public route for login */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <LoginForm />
//               </PublicRoute>
//             }
//           />

//           <Route
//             path="/forgot-password"
//             element={
//               <PublicRoute>
//                 <ForgotPassword />
//               </PublicRoute>
//             }
//           />

//           <Route path="/signUp" element={<SignupForm />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected Routes */}
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/certification"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <UserCert />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/training-status"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <TrainingManagement />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/biodata"
//             element={
//               <ProtectedRoute
//                 allowedRoles={[
//                   "admin",
//                   "superadmin",
//                   "artisan_user",
//                   "intending_artisan",
//                 ]}>
//                 <Biodata />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/certification/upload"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["admin", "superadmin", "artisan_user"]}>
//                 <DocumentUpload />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/register/artisan"
//             element={
//               <ProtectedRoute allowedRoles={["artisan_user"]}>
//                 <ArtisanForm />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/register/intendingArtisan"
//             element={
//               <ProtectedRoute allowedRoles={["intending_artisan"]}>
//                 <IntendingArtisanForm />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/register/trainingcenter"
//             element={
//               <ProtectedRoute allowedRoles={["training_center"]}>
//                 <TrainingCenterForm />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/training-center/biodata"
//             element={
//               <ProtectedRoute allowedRoles={["training_center"]}>
//                 <TrainingCenterBiodata />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/trainee/dashboard"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["artisan_user", "intending_artisan"]}>
//                 <ArtisanDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* <Route
//           path="/intendingArtisan/dashboard"
//           element={<ArtisanDashboard />}
//           allowedRoles={["intending_artisan", "admin", "superadmin"]}
//         /> */}

//           <Route
//             path="/trainingcenter/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["training_center"]}>
//                 <TrainingCenterDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/training-center"
//             element={
//               <ProtectedRoute allowedRoles={["training_center"]}>
//                 <TrainingCenterDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/dashboard"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <ArtisanDashboard />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/usermanagement"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <UserManagement />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/dashboard/reports"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <AdminDashboardReports />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/trainingcenter/reports"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <TrainingCenterReport />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/training-center/status"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <TrainingManagement />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/training/groups"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <TrainingGroupDetails />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/document/verification"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <AdminDocumentVerification />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/admin/sectors"
//             element={
//               <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
//                 <AdminSectors />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/training-center/groups"
//             element={
//               <ProtectedRoute
//                 allowedRoles={["admin", "superadmin", "training_center"]}>
//                 <TrainingStatus />
//               </ProtectedRoute>
//             }
//           />

//           <Route path="/test" element={<TestPage />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// export default App;


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
          <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/signUp" element={<SignupForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            {/* Admin and Superadmin Routes */}
            <Route path="admin/dashboard" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="admin/usermanagement" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="admin/sectors" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><AdminSectors /></ProtectedRoute>} />
            <Route path="admin/certification" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><UserCert /></ProtectedRoute>} />
            <Route path="admin/training-status" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><TrainingManagement /></ProtectedRoute>} />
            <Route path="admin/dashboard/reports" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><AdminDashboardReports /></ProtectedRoute>} />
            <Route path="admin/trainingcenter/reports" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><TrainingCenterReport /></ProtectedRoute>} />
            <Route path="document/verification" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><AdminDocumentVerification /></ProtectedRoute>} />
            <Route path="training/groups" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><TrainingGroupDetails /></ProtectedRoute>} />
            <Route path="training-center/status" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><TrainingManagement /></ProtectedRoute>} />

            {/* Training Center Routes */}
            <Route path="training-center/groups" element={<ProtectedRoute allowedRoles={["admin", "superadmin", "training_center"]}><TrainingStatus /></ProtectedRoute>} />
            <Route path="training-center/biodata" element={<ProtectedRoute allowedRoles={["training_center"]}><TrainingCenterBiodata /></ProtectedRoute>} />
            <Route path="trainingcenter/dashboard" element={<ProtectedRoute allowedRoles={["training_center"]}><TrainingCenterDashboard /></ProtectedRoute>} />
            <Route path="training-center" element={<ProtectedRoute allowedRoles={["training_center"]}><TrainingCenterDashboard /></ProtectedRoute>} />
            <Route path="training-center-management" element={<ProtectedRoute allowedRoles={["admin", "superadmin", "training_center"]}><TrainingCenterManagement /></ProtectedRoute>} />

            {/* Artisan and Intending Artisan Routes */}
            <Route path="trainee/dashboard" element={<ProtectedRoute allowedRoles={["artisan_user", "intending_artisan"]}><ArtisanDashboard /></ProtectedRoute>} />
            <Route path="register/artisan" element={<ProtectedRoute allowedRoles={["artisan_user"]}><ArtisanForm /></ProtectedRoute>} />
            <Route path="register/intendingArtisan" element={<ProtectedRoute allowedRoles={["intending_artisan"]}><IntendingArtisanForm /></ProtectedRoute>} />
            <Route path="register/trainingcenter" element={<ProtectedRoute allowedRoles={["training_center"]}><TrainingCenterForm /></ProtectedRoute>} />
            <Route path="biodata" element={<ProtectedRoute allowedRoles={["admin", "superadmin", "artisan_user", "intending_artisan"]}><Biodata /></ProtectedRoute>} />
            <Route path="certification/upload" element={<ProtectedRoute allowedRoles={["admin", "superadmin", "artisan_user"]}><DocumentUpload /></ProtectedRoute>} />

            {/* Document Management Routes */}
            <Route path="documents" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="documents/create" element={<ProtectedRoute><CreateDocument /></ProtectedRoute>} />
            <Route path="documents/edit/:id" element={<ProtectedRoute><EditDocument /></ProtectedRoute>} />
            <Route path="documents/preview/:_id" element={<ProtectedRoute><DocumentPreview /></ProtectedRoute>} />

            {/* Miscellaneous Routes */}
            <Route path="test" element={<TestPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;