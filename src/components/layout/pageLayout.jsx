// import React, { useState, useEffect } from "react";
// import { motion } from 'framer-motion';
// import { Link, useNavigate } from "react-router-dom"; // Import useLocation hook
// import { Menu, X } from 'lucide-react'; // Ensure Menu is imported from lucide-react
// import logo1 from "../../assets/itflogo.png";
// import logo2 from "../../assets/coat_of_arms.svg";
// import logo3 from "../../assets/logo.png";
// import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'
// import Footer from "./footer";

// // import RegisterDialog from './RegisterDialog'; // Import your RegisterDialog

// export default function PageLayout({ title, children, toggleDialog }) {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [dialogType, setDialogType] = useState(null); // State to determine which dialog to open

//   const navigate = useNavigate(); // Initialize useNavigate hook

//   // Listen to scroll event for styling the navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
    

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const navItems = [
//     { name: 'Home', path: '/' },
//     { name: 'About', path: '/About' },
//     { name: 'Market Place', path: '/' },
//     { name: 'Contact', path: '/' }
//   ];

//   // Function to open the Login dialog
//   // const openLoginDialog = () => setDialogType('login');
// // Function to navigate to /login page
// const openLoginDialog = () => {
//   navigate("/login"); // Navigate to /login
// };
//   // Function to open the Register dialog
//   const openRegisterDialog = () => navigate('/register');

//   // Function to close any dialog
//   const closeDialog = () => setDialogType(null);
//   const currentYear = new Date().getFullYear()

//   return (
//     <div className="flex flex-col min-h-screen">
//       <motion.nav
//         className={`fixed top-4 inset-x-0 mx-auto w-11/12 max-w-7xl rounded-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
//           }`}
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//       >
//         <div className="px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <Link to="/" className={`text-4xl font-bold ${isScrolled ? "text-gray-50" : "text-gray"} flex items-center space-x-6`}>
//                 <div className="flex space-x-2">
//                   <img src={logo1} alt="Logo 1" className="w-12 h-12" />
//                   <img src={logo2} alt="Logo 2" className="w-12 h-12" />
//                   <img src={logo3} alt="Logo 3" className="w-12 h-12" />
//                 </div>
//               </Link>
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`px-3 py-2 rounded-md text-sm font-medium ${isScrolled ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20'
//                     }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               <button
//                 onClick={ () => navigate("/login")}// Open Login dialog
//                 className={`px-3 py-2 rounded-[40px] text-sm bg-transparent/5 font-medium ${isScrolled ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20 '
//                   }`}
//               >
//                 Login
//               </button>
//               <button 
//                 onClick={ () => navigate("/register")} 
//                 className={`h-[48px] px-[40px] text-[14px] rounded-[40px] bg-emerald-900 hover:bg-emerald-900/80 text-[#fff] ${isScrolled ? 'text-white hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20'
//               }`}
//               >
//                       Register
//                     </button>
//             </div>
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className={`rounded-full p-2 ${isScrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}
//               >
//                 {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </button>
//             </div>
//           </div>
//         </div>
//         {isMenuOpen && (
//           <motion.div
//             className="md:hidden"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.2 }}
//           >
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className={`block px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20'
//                     }`}
//                 >
//                   {item.name}
//                 </Link>
//               ))}
//             </div>
//             <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
//               <div className="mt-3 px-2 space-y-1">
//                 <button
//                   onClick={ () => navigate("/login")}// Open Login dialog on mobile view
//                   className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20'
//                     }`}
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={ () => navigate("/register")}// Open Register dialog on mobile view
//                   className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${isScrolled ? 'text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white' : 'text-white hover:bg-white/20'
//                     }`}
//                 >
//                   Register
//                 </button>
                
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </motion.nav>

//       <main className="w-full m-0 p-0">
//         {children}
        
//       </main>
      
//       <Footer/>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo1 from "../../assets/itflogo.png";
import logo2 from "../../assets/coat_of_arms.svg";
import logo3 from "../../assets/logo.png";
import Footer from "./footer";

export default function PageLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();

  // Listen to scroll events for styling the navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Market Place", path: "/marketplace" },
    { name: "Beneficiaries / Artisans", path: "/beneficiaries" },
    { name: "Contact", path: "/contact" },
    { name: "Media", path: "/gallery" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <motion.nav
        className={`fixed top-4 left-0 right-0 mx-auto w-full max-w-7xl rounded-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo1} alt="Logo 1" className="w-12 h-12 sm:w-16 sm:h-16" />
              <img src={logo2} alt="Logo 2" className="w-12 h-12 sm:w-16 sm:h-16" />
              <img src={logo3} alt="Logo 3" className="w-12 h-12 sm:w-16 sm:h-16" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isScrolled
                      ? "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isScrolled
                    ? "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
                    : "text-white hover:bg-white/20"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2 rounded-full bg-emerald-900 hover:bg-emerald-900/80 text-white text-sm"
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-full ${
                  isScrolled ? "text-gray-700 dark:text-gray-300" : "text-white"
                }`}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden px-4 py-3 bg-white dark:bg-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {item.name}
                </Link>
              ))}
              <button
                onClick={() => navigate("/login")}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium bg-emerald-900 text-white hover:bg-emerald-900/80"
              >
                Register
              </button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 w-full px-0 sm:px-0 md:px-0 lg:px-0 xl:px-0 py-0 max-w-full overflow-x-hidden">
        {children}
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
