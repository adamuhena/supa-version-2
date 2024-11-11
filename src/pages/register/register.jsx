import React from "react";
import NavBar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import "./register.css";
import {Link} from "react-router-dom"
import Image from "../../../public/pottery.png"
function register() {
  return (
    <div>
      <NavBar />
      <div className="mainLayer">
        <div className="writeup">
          <h1>
            Thank you for your interest in joining the SUPA Platform. Choose the
            option that best describes you to kickstart your journey with SUPA
          </h1>
        </div>

        <div className="card">
          <div className="cardOne">
            <div className="cardOneFirstChild">
                <img src="pottery.png" style={{objectFit: "contain", width: "50px"}}/>
              <h2>Artisan</h2>
              <h4>I am an artisan in a trade area.</h4>
            </div>
            <Link to="/login">
              <button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
                Login
              </button>
            </Link>
          </div>
          <div className="cardTwo">
            <div className="cardOneFirstChild">
              <h2>Intending artisan</h2>
              <h4>I am an looking to learn a trade and become artisan.</h4>
            </div>
            <Link to="/login">
              <button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
                Login
              </button>
            </Link>
          </div>
          <div className="cardThree">
            <div className="cardThreeFirstChild">
              <h2>Registration Center</h2>
              <h4>My organization provides vocational skills training.</h4>
            </div>
            <Link to="/login">
              <button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default register;
