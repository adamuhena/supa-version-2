import React from "react";
import NavBar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import "./register.css";
import { Link } from "react-router-dom";
import ThreeBoxes from "../../components/ThreeBoxes/ThreeBoxes";

function register() {
  return (
    <div>
      <NavBar sticky={false} />
      <ThreeBoxes />
      <Footer />
    </div>
  );
}

export default register;
