import React from "react";
import "./ThreeBoxes.css";
import { Link } from "react-router-dom";
function ThreeBoxes() {
  return (
    <div>
      <header className="cd__intro">
        {/* <h1>
     
            Thank you for your interest in joining the SUPA Platform. Choose the
            option that best describes you to kickstart your journey with SUPA
          </h1> */}
        {/* <p> RESPONSIVE CARDS CSS TWITTER + INSTAGRAM + YOUTUBE </p> */}
        {/* <div className="cd__action">
            <a
              href="https://www.codehim.com/html5-css3/simple-css-card-with-hover-effects"
              title="Back to download and tutorial page"
              className="cd__btn back"
            >
              Back to Tutorial
            </a>
          </div> */}
      </header>
      <main className="cd__main">
        <div className="cards">
          {/* <h2 className="header">
             
            </h2> */}
          <div className="services">
            <div className="content content-1">
              <div className="fab fa-twitter"></div>
              <h2>Skilled Artisan</h2>
              <p>I am an artisan in this trade area</p>
              <Link to="/register/artisan">Register</Link>
            </div>
            <div className="content content-2">
              <div className="fab fa-instagram"></div>
              <h2>Intending Artisan</h2>
              <p>I am looking to learn a trade and become an artisan.</p>
              <Link to="/register/intendingartisan">Register</Link>
            </div>
            <div className="content content-3">
              <div className="fab fa-youtube"></div>
              <h2>Training Center</h2>
              <p>My organisation provides a vocational skill training.</p>
              <Link to="/register/artisan">Register</Link>
            </div>
          </div>
        </div>
      </main>
      {/* <footer className="cd__credit">
          Author: Mohamed Yousef - Distributed By:{" "}
          <a
            title="Free web design code & scripts"
            href="https://www.codehim.com?source=demo-page"
            target="_blank"
          >
            CodeHim
          </a>
        </footer> */}
    </div>
  );
}

export default ThreeBoxes;
