import React from "react";
import "./ThreeBoxes.css";
import { Link } from "react-router-dom";
import PageLayout from "../layout/pageLayout";
import { Card, CardTitle } from "../ui/card";


function ThreeBoxes() {
  return (
    

    
    <div>
    
    <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-24">
      <Card className="w-full max-w-4xl overflow-hidden mx-4">
        <div className="cards">
          <CardTitle className="text-2xl md:text-4xl text-gray-800 py-4 text-center">
            Register Today
          </CardTitle>
          <div className="services grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Skilled Artisan */}
            <div className="content content-1 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
              <div className="fab fa-twitter text-3xl text-blue-500 mb-4"></div>
              <h2 className="text-xl font-bold">Skilled Artisan</h2>
              <p className="text-gray-600 my-2">I am an artisan in this trade area.</p>
              <Link
                to="/signup"
                state={{ tab: 'artisan_user' }}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
  
            {/* Intending Artisan */}
            <div className="content content-2 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
              <div className="fab fa-instagram text-3xl text-pink-500 mb-4"></div>
              <h2 className="text-xl font-bold">Intending Artisan</h2>
              <p className="text-gray-600 my-2">I am looking to learn new skill.</p>
              <Link
                to="/signup"
                state={{ tab: 'intending_artisan' }}
                className="inline-block mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                Register
              </Link>
            </div>
  
            {/* Training Center */}
            <div className="content content-3 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
              <div className="fab fa-youtube text-3xl text-red-500 mb-4"></div>
              <h2 className="text-xl font-bold">Training Center</h2>
              <p className="text-gray-600 my-2">I am a vocational skill training provider.</p>
              <Link
                to="/signup"
                state={{ tab: 'training_center' }}
                className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
 
  
  );
}

export default ThreeBoxes;
