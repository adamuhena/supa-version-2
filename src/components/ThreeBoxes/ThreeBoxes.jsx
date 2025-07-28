// import React from "react";
// import "./ThreeBoxes.css";
// import { Link } from "react-router-dom";
// import PageLayout from "../layout/pageLayout";
// import { Card, CardTitle } from "../ui/card";


// function ThreeBoxes() {
//   return (
    

    
//     <div>
    
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-24">
//       <Card className="w-full max-w-4xl overflow-hidden mx-4">
//         <div className="cards">
//           <CardTitle className="text-2xl md:text-4xl text-gray-800 py-4 text-center">
//             Register Today
//           </CardTitle>
//           <div className="services grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//             {/* Skilled Artisan */}
//             <div className="content content-1 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
//               <div className="fab fa-twitter text-3xl text-blue-500 mb-4"></div>
//               <h2 className="text-xl font-bold">Skilled Artisan</h2>
//               <p className="text-gray-600 my-2">I am an artisan in this trade area.</p>
//               <Link
//                 to="/signup"
//                 state={{ tab: 'artisan_user' }}
//                 className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Register
//               </Link>
//             </div>
  
//             {/* Intending Artisan */}
//             <div className="content content-2 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
//               <div className="fab fa-instagram text-3xl text-pink-500 mb-4"></div>
//               <h2 className="text-xl font-bold">Intending Artisan</h2>
//               <p className="text-gray-600 my-2">I am looking to learn new skill.</p>
//               <Link
//                 to="/signup"
//                 state={{ tab: 'intending_artisan' }}
//                 className="inline-block mt-4 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
//               >
//                 Register
//               </Link>
//             </div>
  
//             {/* Training Center */}
//             <div className="content content-3 h-auto p-6 bg-gray-100 shadow rounded-lg text-center">
//               <div className="fab fa-youtube text-3xl text-red-500 mb-4"></div>
//               <h2 className="text-xl font-bold">Training Center</h2>
//               <p className="text-gray-600 my-2">I am a vocational skill training provider.</p>
//               <Link
//                 to="/signup"
//                 state={{ tab: 'training_center' }}
//                 className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//               >
//                 Register
//               </Link>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   </div>
 
  
//   );
// }

// export default ThreeBoxes;


import React from "react";
import { Link } from "react-router-dom";
import { Card, CardTitle } from "../ui/card";

function ThreeBoxes() {
  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center pt-24 px-4">
    <div className="min-h-screen bg-slate-900 flex items-center justify-center pt-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-6xl overflow-hidden mx-4 bg-white/10 backdrop-blur-lg border-white/5 shadow-2xl">
        <div className="cards p-8">
          <CardTitle className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent py-6 text-center mb-12">
            Register Today
          </CardTitle>
          
          <div className="services grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
            {/* Skilled Artisan */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative content content-1 h-full p-8 bg-green-900/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-800 to-green-700 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-white-200 transition-colors">
                  Skilled Artisan
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Already mastered your craft? Connect with experts in your trade area & get Up-Skilled.
                </p>
                <Link
                  to="/signup"
                  state={{ tab: 'artisan_user' }}
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-green-800 to-green-700 text-white font-semibold rounded-xl hover:from-green-400 hover:to-green-600 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Join as Artisan
                </Link>
              </div>
            </div>

            {/* Intending Artisan */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative content content-2 h-full p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-200 transition-colors">
                  Intending Artisan
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Ready to learn? Discover new skills and connect with expert trainers to kickstart your journey.
                </p>
                <Link
                  to="/signup"
                  state={{ tab: 'intending_artisan' }}
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Learning
                </Link>
              </div>
            </div>

            {/* Training Center */}
            <div className="group relative md:col-span-2 xl:col-span-1">
              <div className="absolute -inset-1 bg-gradient-to-r  from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative content content-3 h-full p-8 bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-red-200 transition-colors">
                  Training Center
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Empower the next generation. Offer your Skills and connect with eager learners.
                </p>
                <Link
                  to="/signup"
                  state={{ tab: 'training_center' }}
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Register Center
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