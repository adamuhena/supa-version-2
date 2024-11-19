import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register/register";
import ArtisanForm from "./pages/forms/artisan/index"; 
import IntendingArtisanForm from "./pages/forms/intendinArtisan/index";
import RegistrationCenter from "./pages/forms/registrationCenter";
import "./App.css";
import About from "./pages/HomePage/About";
import LoginForm from "./pages/loginPage/Login";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<About/>} />
          <Route path="/login" element={<LoginForm/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/register/artisan" element={<ArtisanForm />} />
          <Route path="/register/intendingArtisan" element={<IntendingArtisanForm/>} />
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
