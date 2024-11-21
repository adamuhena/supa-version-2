import React from "react";
import "./ThreeBoxes.css";
import { Link } from "react-router-dom";
import PageLayout from "../layout/pageLayout";
import { Card, CardTitle } from "../ui/card";


function ThreeBoxes() {
  return (
    <div>

        <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
        </section>
        <div className="flex min-h-screen items-center justify-center absolute top-12 left-0 right-0 bottom-0">
          <Card className="w-full max-w-4xl overflow-hidden">

            <div className="cards">
              {/* <h2 className="header">
             
            </h2> */}
            <CardTitle className=" text-4xl text-gray-800 py-4" > Register Today</CardTitle>
              <div className="services">
                <div className="content content-1 h-[350px]">
                  <div className="fab fa-twitter"></div>
                  <h2>Skilled Artisan</h2>
                  <p>I am an artisan in this trade area</p>
                  <Link to="/signup" state={{ tab: 'artisan_user' }}>Register</Link>
                </div>

                <div className="content content-2 h-[350px]">
                  <div className="fab fa-instagram"></div>
                  <h2>Intending Artisan</h2>
                  <p>I am looking to learn new skill.</p>
                  <Link to="/signup" state={{ tab: 'intending_artisan' }}>Register</Link>
                </div>
                <div className="content content-3 h-[350px] ">
                  <div className="fab fa-youtube "></div>
                  <h2>Training Center</h2>
                  <p>I am a vocational skill training provider.</p>
                  <Link to="/signup" state={{ tab: 'training_center' }}>Register</Link>
                </div>
              </div>
            </div>

          </Card>
        </div>


    </div>
  );
}

export default ThreeBoxes;
