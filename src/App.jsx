import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/loginPage/login";
import Register from "./pages/register/register";
import ArtisanForm from "./pages/forms/artisan";
import IntendingArtisan from "./pages/forms/intendinArtisan";
import RegistrationCenter from "./pages/forms/registrationCenter";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/artisan" element={<ArtisanForm />} />
          <Route
            path="/register/intendingartisan"
            element={<IntendingArtisan />}
          />
          <Route
            path="/register/registrationcenter"
            element={<RegistrationCenter />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
