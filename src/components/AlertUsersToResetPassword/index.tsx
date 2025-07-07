// import React, { useState, useEffect } from "react";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   AlertCircle,
//   AlertCircleIcon,
//   BellElectric,
//   BellElectricIcon,
//   NotebookIcon,
// } from "lucide-react";

// export function AlertUsersToResetPassword() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [doNotShowAgain, setDoNotShowAgain] = useState(false);

//   useEffect(() => {
//     const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
//     if (!doNotShow) {
//       setIsOpen(true);
//     }
//   }, []);

//   const handleDoNotShowAgainChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setDoNotShowAgain(event.target.checked);
//   };

//   const handleClose = () => {
//     if (doNotShowAgain) {
//       localStorage.setItem("doNotShowResetPasswordDialog", "true");
//     }
//     setIsOpen(false);
//   };

//   return (
//     // <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//     //   <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
//     //     <AlertDialogHeader>
//     //       <div className="flex flex-col items-center justify-center w-full">
//     //         <AlertCircle className="size-[70px] text-green-900" />
//     //       </div>

//     //       {/* <AlertDialogTitle className="text-center text-[25px]">
//     //         Password reset required for existing users
//     //       </AlertDialogTitle>
//     //       <br />
//     //       <AlertDialogDescription className="text-center">
//     //         Existing users should reset their password using phone number (eg.
//     //         2348********) if an account exists, if not, kindly create a new
//     //         account.
//     //       </AlertDialogDescription> */}

//     //       <AlertDialogTitle className="text-center text-[25px]">
//     //         Steps to Register
//     //       </AlertDialogTitle>
//     //       <br />
//     //       <AlertDialogDescription className="text-left">
//     //         1. Click on "Register". <br />
//     //         <br />
//     //         2. Select a user type ("skilled artisan", "intending artisan" or
//     //         "training center"). <br />
//     //         <br />
//     //         3. Fill in all the required information (marked with red asterisks).{" "}
//     //         <br />
//     //         <br />
//     //         4. Add your new password. <br />
//     //         <br />
//     //         5. Click on "Sign Up". <br />
//     //         <br />
//     //         6. After signing up, you will be redirected to the login page. Log
//     //         in with your new credentials (email and password). <br />
//     //         <br />
//     //         7. You will be redirected to complete your KYC form. <br />
//     //         <br />
//     //         8. After completing the KYC, proceed by submitting your application.
//     //       </AlertDialogDescription>
//     //     </AlertDialogHeader>
//     //     <AlertDialogFooter>
//     //       <div className="flex flex-col items-center justify-center w-full">
//     //         <div className="flex items-center justify-center mb-4 ">
//     //           <input
//     //             type="checkbox"
//     //             id="doNotShowAgain"
//     //             checked={doNotShowAgain}
//     //             onChange={handleDoNotShowAgainChange}
//     //           />
//     //           <label htmlFor="doNotShowAgain" className="ml-2">
//     //             Do not show this again
//     //           </label>
//     //         </div>
//     //         <button
//     //           onClick={handleClose}
//     //           className="h-[42px] w-full px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
//     //           Okay, Continue
//     //         </button>
//     //       </div>
//     //     </AlertDialogFooter>
//     //   </AlertDialogContent>
//     // </AlertDialog>

//     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//   <AlertDialogContent className="max-h-[90vh] overflow-y-auto p-5">
//     <AlertDialogHeader className="space-y-4">
//       <div className="flex flex-row items-center justify-center space-x-4 mb-4">
//         <AlertCircle className="h-10 w-10 text-green-900" />
//         <AlertDialogTitle className="text-xl font-bold m-0">
//           Disclaimer
//         </AlertDialogTitle>
//       </div>

      

//       <AlertDialogDescription className="space-y-3 text-sm"> {/* Reduced from text-base */}
//         <h3 className="text-sm font-semibold">Steps to Register</h3>
//         <p className="text-xs text-gray-600">
//           Please follow these steps to register on the ITF SUPA Registration Portal:
//       </p>
//         <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
//         <strong>Note:</strong> If you are an existing user, you must reset your password using your phone number (e.g., 2348********) if an account exists. If not, kindly create a new account.
//         </p>    
//         <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
//         <strong>Steps:</strong>
//         </p>
//         <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
//         <strong>1.</strong> Click on "Register".<br />
//         <strong>2.</strong> Select a user type ("skilled artisan", "intending artisan" or "training center").<br />
//         <strong>3.</strong> Fill in all the required information (marked with red asterisks).<br />
//         <strong>4.</strong> Add your new password.<br />
//         <strong>5.</strong> Click on "Sign Up".<br />
//         <strong>6.</strong> After signing up, you will be redirected to the login page. Log in with your new credentials (email and password).<br />
//         <strong>7.</strong> You will be redirected to complete your KYC form.<br />          
//         <strong>8.</strong> After completing the KYC, proceed by submitting your application.
//         </p>
//         <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
//           If you have any issues, please contact the ITF support team.
//         </p>

//         <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-3"> {/* Reduced padding */}
//           <h3 className="mb-1.5 text-sm font-bold text-red-700">⚠️ Important Warning</h3>
//           <p className="text-xs text-red-600"> {/* Reduced from text-base */}
//             Do not give money to any person or agent for this registration. Anyone collecting money is breaking 
//             the law and will be in serious trouble.
//           </p>
//           <p className="mt-2 text-xs text-red-600">
//             If someone asks you for money to register, please report them immediately to the nearest ITF office 
//             or to the police.
//           </p>
//         </div>
//       </AlertDialogDescription>
//     </AlertDialogHeader>

//     <AlertDialogFooter className="mt-3"> {/* Reduced margin */}
//       <div className="flex w-full flex-col items-center space-y-3">
//         <label className="flex items-center space-x-2">
//           <input
//             type="checkbox"
//             id="doNotShowAgain"
//             checked={doNotShowAgain}
//             onChange={handleDoNotShowAgainChange}
//             className="rounded border-gray-300"
//           />
//           <span className="text-xs text-gray-600">Do not show this again</span> {/* Reduced from text-sm */}
//         </label>

//         <button
//           onClick={handleClose}
//           className="w-full rounded-full bg-emerald-900 px-8 py-2 text-xs font-medium text-white 
//                    transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 
//                    focus:ring-emerald-900 focus:ring-offset-2">
//           Okay, Continue
//         </button>
//       </div>
//     </AlertDialogFooter>
//   </AlertDialogContent>
// </AlertDialog>
//   );
// }



// import React, { useState, useEffect } from "react";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   AlertCircle,
// } from "lucide-react";

// export function AlertUsersToResetPassword() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [doNotShowAgain, setDoNotShowAgain] = useState(false);

//   useEffect(() => {
//     // Note: localStorage is not available in Claude artifacts, using state instead
//     // const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
//     // if (!doNotShow) {
//     //   setIsOpen(true);
//     // }
//   }, []);

//   const handleDoNotShowAgainChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setDoNotShowAgain(event.target.checked);
//   };

//   const handleClose = () => {
//     // Note: localStorage is not available in Claude artifacts
//     // if (doNotShowAgain) {
//     //   localStorage.setItem("doNotShowResetPasswordDialog", "true");
//     // }
//     setIsOpen(false);
//   };

//   return (
//     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//       <AlertDialogContent className="max-h-[90vh] overflow-y-auto p-2">
//         <AlertDialogHeader className="space-y-2">
//           <div className="flex flex-row items-center justify-center space-x-2 ">
//             <AlertCircle className="h-10 w-10 text-green-900" />
//             <AlertDialogTitle className="text-xl font-bold m-0">
//               Disclaimer
//             </AlertDialogTitle>
//           </div>
//         </AlertDialogHeader>
//         <AlertDialogDescription className="space-y-2 text-sm ite" >

//           <div className="space-y-1 text-sm">
//             {/* Nominees Check Section */}
//             <div className="bg-blue-50 border-l-4 border-blue-500 p-2 sm:p-3 lg:p-4 rounded-r-lg">
//               <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 lg:gap-4 items-start lg:items-center">
//                 {/* Header Section */}
//                 <div className="flex items-start sm:items-center w-full lg:w-auto lg:min-w-0 lg:flex-shrink-0">
//                   <svg className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                   </svg>
//                   <div className="ml-2 sm:ml-3 min-w-0 flex-1">
//                     <h3 className="text-xs sm:text-sm lg:text-base font-semibold text-blue-800 leading-tight">
//                       To Check Succesfull 2025 SUPA Shortlisted Artisans
//                     </h3>
//                     {/* <p className="text-xs sm:text-xs text-blue-700 mt-0.5 leading-relaxed">
//                       To check shortlisted SUPA artisans and assigned training centers:
//                     </p> */}
//                     <p className="text-xs sm:text-xs text-blue-600 mt-1 italic font-medium">
//                       Note: Only official nominees are listed.
//                     </p>
//                   </div>
//                 </div>
                
//                 {/* Steps Section */}
//                 <div className="w-full lg:flex-1 min-w-0">
//                   {/* Mobile & Tablet: Vertical Stack */}
//                   <div className="block lg:hidden space-y-1.5 sm:space-y-2">
//                     <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
//                       <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
//                       <span className="ml-2 text-xs text-blue-800">
//                         Click on <span className="font-semibold">Beneficiaries / Nominees</span> tab
//                       </span>
//                     </div>
//                     <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
//                       <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
//                       <span className="ml-2 text-xs text-blue-800">
//                         Select <span className="font-semibold">2025</span> year
//                       </span>
//                     </div>
//                     <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
//                       <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
//                       <span className="ml-2 text-xs text-blue-800">
//                         Choose your <span className="font-semibold">State</span>
//                       </span>
//                     </div>
//                     <div className="flex items-center p-1.5 sm:p-2 bg-white/60 rounded border border-blue-200">
//                       <span className="inline-flex items-center justify-center w-5 h-5 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
//                       <span className="ml-2 text-xs text-blue-800">
//                         View <span className="font-semibold">Shortlisted 2025 SUPA Artisans</span>
//                       </span>
//                     </div>
//                   </div>

//                   {/* Desktop: Horizontal Flow */}
//                   <div className="hidden lg:block">
//                     <div className="flex items-center justify-between gap-1 xl:gap-2 text-sm text-blue-700">
//                       <div className="flex items-center gap-1 min-w-0 flex-1">
//                         <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
//                         <span className="text-xs truncate">
//                           Click <span className="font-semibold">Beneficiaries / Nominees</span>
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center gap-1 min-w-0 flex-1">
//                         <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
//                         <span className="text-xs truncate">
//                           Select <span className="font-semibold">2025</span>
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center gap-1 min-w-0 flex-1">
//                         <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
//                         <span className="text-xs truncate">
//                           Choose <span className="font-semibold">State</span>
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center gap-1 min-w-0 flex-1">
//                         <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
//                         <span className="text-xs truncate">
//                           View <span className="font-semibold">Results</span>
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Existing Password Reset Note */}
//             <p className="text-xs text-gray-600">
//               <strong>Note:</strong> If you are an existing user, you must reset your password using your phone number (e.g., 2348********) if an account exists. If not, kindly create a new account.
//             </p>
            
//             {/* <p className="text-xs text-gray-600">
//               If you have any issues, please contact the ITF support team.
//             </p> */}
            
//             {/* Warning Section */}
//             <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-3">
//               <h3 className="mb-1.5 text-sm font-bold text-red-700">⚠️ Important Warning</h3>
//               <p className="text-xs text-red-600">
//                 Do not give money to any person or agent for this registration. Anyone collecting money is breaking 
//                 the law and will be in serious trouble.
//               </p>
//               <p className="mt-2 text-xs text-red-600">
//                 If someone asks you for money to register, please report them immediately to the nearest ITF office 
//                 or to the police.
//               </p>
//             </div>
//           </div>
//         </AlertDialogDescription>

//         <AlertDialogFooter className="mt-0">
//           <div className="flex w-full flex-col items-center space-y-2">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="doNotShowAgain"
//                 checked={doNotShowAgain}
//                 onChange={handleDoNotShowAgainChange}
//                 className="rounded border-gray-300"
//               />
//               <span className="text-xs text-gray-600">Do not show this again</span>
//             </label>

//             <button
//               onClick={handleClose}
//               className="w-full rounded-full bg-emerald-900 px-8 py-2 text-xs font-medium text-white 
//                        transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 
//                        focus:ring-emerald-900 focus:ring-offset-2"
//             >
//               Okay, Continue
//             </button>
//           </div>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export function AlertUsersToResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    // Check localStorage when component mounts
    const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
    if (doNotShow !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleDoNotShowAgainChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDoNotShowAgain(event.target.checked);
  };

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem("doNotShowResetPasswordDialog", "true");
    }
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6 w-[95vw] max-w-2xl mx-auto">
        <AlertDialogHeader className="space-y-2">
          <div className="flex flex-row items-center justify-center space-x-2">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-900 flex-shrink-0" />
            <AlertDialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold m-0">
              Disclaimer
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription asChild>
          <div className="space-y-2 text-xs sm:text-sm items-center">
          
            {/* Nominees Check Section */}
            <div className="flex flex-col p-4 space-y-3 sm:space-y-4 md:space-y-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg border-1">
              {/* Header Section */}
              <div className="flex items-start sm:items-center w-full">
                <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <div className="ml-1.5 sm:ml-2 md:ml-3 min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-blue-800 leading-tight">
                    To Check Successful List of Artisan for Screening
                  </h3>
                  <p className="text-xs text-blue-600 mt-0.5 sm:mt-1 italic font-medium">
                    Note: Succesful Artian will undergo screening.
                  </p>
                </div>
              </div>

              {/* Steps Section - Vertically Stacked */}
              <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Click on <span className="font-semibold">Beneficiaries / Artisans</span> tab
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Select <span className="font-semibold">2025</span> year
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Choose your <span className="font-semibold">State</span>
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Select <span className="font-semibold">Registered Artisans </span> to Preview List
                  </span>
                </div>
              </div>
            </div>

            {/* Existing Password Reset Note */}
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Note:</strong> If you are an existing user, you must reset your password using your phone number (e.g., 2348********) if an account exists. If not, kindly create a new account.
            </p>
            
            {/* Warning Section */}
            <div className="mt-2 sm:mt-3 md:mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-2 sm:p-3">
              <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-bold text-red-700">⚠️ Important Warning</h3>
              <p className="text-xs text-red-600 leading-relaxed">
                Do not give money to any person or agent for this registration. Anyone collecting money is breaking 
                the law and will be in serious trouble.
              </p>
              <p className="mt-1 sm:mt-2 text-xs text-red-600 leading-relaxed">
                If someone asks you for money to register, please report them immediately to the nearest ITF office 
                or to the police.
              </p>
            </div>
          </div>
        </AlertDialogDescription>

        <AlertDialogFooter className="mt-2 sm:mt-4">
          <div className="flex w-full flex-col items-center space-y-2 sm:space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="doNotShowAgain"
                checked={doNotShowAgain}
                onChange={handleDoNotShowAgainChange}
                className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
              />
              <span className="text-xs text-gray-600">Do not show this again</span>
            </label>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto min-w-[120px] rounded-full bg-emerald-900 px-6 sm:px-8 py-2 sm:py-2.5 text-xs font-medium text-white 
                       transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 
                       focus:ring-emerald-900 focus:ring-offset-2"
            >
              Okay, Continue
            </button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertUsersToResetPassword;


// import React, { useState, useEffect } from "react";
// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   AlertCircle,
// } from "lucide-react";

// export function AlertUsersToResetPassword() {
//   const [isOpen, setIsOpen] = useState(true);
//   const [doNotShowAgain, setDoNotShowAgain] = useState(false);

//   useEffect(() => {
//     // Note: localStorage is not available in Claude artifacts, using state instead
//     // const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
//     // if (!doNotShow) {
//     //   setIsOpen(true);
//     // }
//   }, []);

//   const handleDoNotShowAgainChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setDoNotShowAgain(event.target.checked);
//   };

//   const handleClose = () => {
//     // Note: localStorage is not available in Claude artifacts
//     // if (doNotShowAgain) {
//     //   localStorage.setItem("doNotShowResetPasswordDialog", "true");
//     // }
//     setIsOpen(false);
//   };

//   return (
//     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//       <AlertDialogContent className="max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6 w-[95vw] max-w-2xl mx-auto">
//         <AlertDialogHeader className="space-y-2">
//           <div className="flex flex-row items-center justify-center space-x-2">
//             <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-green-900 flex-shrink-0" />
//             <AlertDialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold m-0">
//               Disclaimer
//             </AlertDialogTitle>
//           </div>
//         </AlertDialogHeader>
//         <AlertDialogDescription asChild>
//           <div className="space-y-2 text-xs sm:text-sm items-center">
          
//             {/* Nominees Check Section */}

//            <div className="flex flex-col p-4 space-y-3 sm:space-y-4 md:space-y-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg border-1 ">
//               {/* Header Section */}
//               <div className="flex items-start sm:items-center w-full">
//                 <svg className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
//                 </svg>
//                 <div className="ml-1.5 sm:ml-2 md:ml-3 min-w-0 flex-1">
//                   <h3 className="text-xs sm:text-sm md:text-base font-semibold text-blue-800 leading-tight">
//                     To Check Successful List of Artisan for Screening
//                   </h3>
//                   <p className="text-xs text-blue-600 mt-0.5 sm:mt-1 italic font-medium">
//                     Note: Succesful Artian will undergo screening.
//                   </p>
//                 </div>
//               </div>

//               {/* Steps Section - Vertically Stacked */}
//               <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
//                 <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
//                   <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">1</span>
//                   <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
//                     Click on <span className="font-semibold">Beneficiaries / Artisans</span> tab
//                   </span>
//                 </div>
//                 <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
//                   <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">2</span>
//                   <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
//                     Select <span className="font-semibold">2025</span> year
//                   </span>
//                 </div>
//                 <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
//                   <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">3</span>
//                   <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
//                     Choose your <span className="font-semibold">State</span>
//                   </span>
//                 </div>
//                 <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
//                   <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">4</span>
//                   <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
//                     Select <span className="font-semibold">Registered Artisans </span> to Preview List
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Existing Password Reset Note */}
//             <p className="text-xs text-gray-600 leading-relaxed">
//               <strong>Note:</strong> If you are an existing user, you must reset your password using your phone number (e.g., 2348********) if an account exists. If not, kindly create a new account.
//             </p>
            
//             {/* Warning Section */}
//             <div className="mt-2 sm:mt-3 md:mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-2 sm:p-3">
//               <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-bold text-red-700">⚠️ Important Warning</h3>
//               <p className="text-xs text-red-600 leading-relaxed">
//                 Do not give money to any person or agent for this registration. Anyone collecting money is breaking 
//                 the law and will be in serious trouble.
//               </p>
//               <p className="mt-1 sm:mt-2 text-xs text-red-600 leading-relaxed">
//                 If someone asks you for money to register, please report them immediately to the nearest ITF office 
//                 or to the police.
//               </p>
//             </div>
//           </div>
//         </AlertDialogDescription>

//         <AlertDialogFooter className="mt-2 sm:mt-4">
//           <div className="flex w-full flex-col items-center space-y-2 sm:space-y-3">
//             <label className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="doNotShowAgain"
//                 checked={doNotShowAgain}
//                 onChange={handleDoNotShowAgainChange}
//                 className="rounded border-gray-300 w-3 h-3 sm:w-4 sm:h-4"
//               />
//               <span className="text-xs text-gray-600">Do not show this again</span>
//             </label>

//             <button
//               onClick={handleClose}
//               className="w-full sm:w-auto min-w-[120px] rounded-full bg-emerald-900 px-6 sm:px-8 py-2 sm:py-2.5 text-xs font-medium text-white 
//                        transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 
//                        focus:ring-emerald-900 focus:ring-offset-2"
//             >
//               Okay, Continue
//             </button>
//           </div>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }

// export default AlertUsersToResetPassword;