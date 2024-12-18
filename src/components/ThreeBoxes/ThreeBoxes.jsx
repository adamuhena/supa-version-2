// import React from "react";
// import "./ThreeBoxes.css";
// import { Link } from "react-router-dom";
// import PageLayout from "../layout/pageLayout";
// import { Card, CardTitle } from "../ui/card";


// function ThreeBoxes() {
//   return (
//     <div>

//         <section className="relative bg-slate-900 pt-40 pb-10 min-h-screen">
//         </section>
//         <div className="flex min-h-screen items-center justify-center absolute top-12 left-0 right-0 bottom-0">
//           <Card className="w-full max-w-4xl overflow-hidden">

//             <div className="cards">
//               {/* <h2 className="header">
             
//             </h2> */}
//             <CardTitle className=" text-4xl text-gray-800 py-4" > Register Today</CardTitle>
//               <div className="services">
//                 <div className="content content-1 h-[350px]">
//                   <div className="fab fa-twitter"></div>
//                   <h2>Skilled Artisan</h2>
//                   <p>I am an artisan in this trade area</p>
//                   <Link to="/signup" state={{ tab: 'artisan_user' }}>Register</Link>
//                 </div>

//                 <div className="content content-2 h-[350px]">
//                   <div className="fab fa-instagram"></div>
//                   <h2>Intending Artisan</h2>
//                   <p>I am looking to learn new skill.</p>
//                   <Link to="/signup" state={{ tab: 'intending_artisan' }}>Register</Link>
//                 </div>
//                 <div className="content content-3 h-[350px] ">
//                   <div className="fab fa-youtube "></div>
//                   <h2>Training Center</h2>
//                   <p>I am a vocational skill training provider.</p>
//                   <Link to="/signup" state={{ tab: 'training_center' }}>Register</Link>
//                 </div>
//               </div>
//             </div>

//           </Card>
//         </div>


//     </div>
//   );
// }

// export default ThreeBoxes;


import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../layout/pageLayout";
import { Card, CardTitle } from "../ui/card";

function ThreeBoxes() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
     <Card className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto mt-20 sm:mt-28 p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl rounded-lg">
        <div className="px-6 py-8 md:px-12 md:py-12">
          <CardTitle className="text-center text-2xl md:text-4xl text-gray-800 mb-8">
            Register Today
          </CardTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Skilled Artisan Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-hammer text-green-800 text-3xl"></i>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-800">Skilled Artisan</h2>
                <p className="text-gray-600 mb-6">I am an artisan in this trade area</p>
                <Link 
                  to="/signup" 
                  state={{ tab: 'artisan_user' }}
                  className="inline-block bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-900 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Intending Artisan Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-red-800 text-3xl"></i>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-800">Intending Artisan</h2>
                <p className="text-gray-600 mb-6">I am looking to learn new skill.</p>
                <Link 
                  to="/signup" 
                  state={{ tab: 'intending_artisan' }}
                  className="inline-block bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-900 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Training Center Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-building text-blue-800 text-3xl"></i>
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-800">Training Center</h2>
                <p className="text-gray-600 mb-6">I am a vocational skill training provider.</p>
                <Link 
                  to="/signup" 
                  state={{ tab: 'training_center' }}
                  className="inline-block bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ThreeBoxes;