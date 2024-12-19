import React from "react";
import "./ThreeBoxes.css";
import { Link } from "react-router-dom";
import PageLayout from "../layout/pageLayout";
import { Card, CardTitle } from "../ui/card";


function ThreeBoxes() {
  return (
    <PageLayout>

    
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
  </PageLayout>
  
  );
}

export default ThreeBoxes;


// import React from "react";
// import { Link } from "react-router-dom";
// import PageLayout from "../layout/pageLayout";
// import { Card, CardTitle } from "../ui/card";

// function ThreeBoxes() {
//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//      <Card className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto mt-20 sm:mt-28 p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl rounded-lg">
//         <div className="px-6 py-8 md:px-12 md:py-12">
//           <CardTitle className="text-center text-2xl md:text-4xl text-gray-800 mb-8">
//             Register Today
//           </CardTitle>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Skilled Artisan Card */}
//             <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               <div className="p-6 text-center">
//                 <div className="mb-4 flex justify-center">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
//                     <i className="fas fa-hammer text-green-800 text-3xl"></i>
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold mb-3 text-gray-800">Skilled Artisan</h2>
//                 <p className="text-gray-600 mb-6">I am an artisan in this trade area</p>
//                 <Link 
//                   to="/signup" 
//                   state={{ tab: 'artisan_user' }}
//                   className="inline-block bg-green-800 text-white px-6 py-2 rounded-full hover:bg-green-900 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>

//             {/* Intending Artisan Card */}
//             <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               <div className="p-6 text-center">
//                 <div className="mb-4 flex justify-center">
//                   <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//                     <i className="fas fa-graduation-cap text-red-800 text-3xl"></i>
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold mb-3 text-gray-800">Intending Artisan</h2>
//                 <p className="text-gray-600 mb-6">I am looking to learn new skill.</p>
//                 <Link 
//                   to="/signup" 
//                   state={{ tab: 'intending_artisan' }}
//                   className="inline-block bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-900 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>

//             {/* Training Center Card */}
//             <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               <div className="p-6 text-center">
//                 <div className="mb-4 flex justify-center">
//                   <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
//                     <i className="fas fa-building text-blue-800 text-3xl"></i>
//                   </div>
//                 </div>
//                 <h2 className="text-xl font-bold mb-3 text-gray-800">Training Center</h2>
//                 <p className="text-gray-600 mb-6">I am a vocational skill training provider.</p>
//                 <Link 
//                   to="/signup" 
//                   state={{ tab: 'training_center' }}
//                   className="inline-block bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors"
//                 >
//                   Register
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default ThreeBoxes;