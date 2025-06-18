import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  AlertCircleIcon,
  BellElectric,
  BellElectricIcon,
  NotebookIcon,
} from "lucide-react";

export function AlertUsersToResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  useEffect(() => {
    const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
    if (!doNotShow) {
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
    // <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    //   <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
    //     <AlertDialogHeader>
    //       <div className="flex flex-col items-center justify-center w-full">
    //         <AlertCircle className="size-[70px] text-green-900" />
    //       </div>

    //       {/* <AlertDialogTitle className="text-center text-[25px]">
    //         Password reset required for existing users
    //       </AlertDialogTitle>
    //       <br />
    //       <AlertDialogDescription className="text-center">
    //         Existing users should reset their password using phone number (eg.
    //         2348********) if an account exists, if not, kindly create a new
    //         account.
    //       </AlertDialogDescription> */}

    //       <AlertDialogTitle className="text-center text-[25px]">
    //         Steps to Register
    //       </AlertDialogTitle>
    //       <br />
    //       <AlertDialogDescription className="text-left">
    //         1. Click on "Register". <br />
    //         <br />
    //         2. Select a user type ("skilled artisan", "intending artisan" or
    //         "training center"). <br />
    //         <br />
    //         3. Fill in all the required information (marked with red asterisks).{" "}
    //         <br />
    //         <br />
    //         4. Add your new password. <br />
    //         <br />
    //         5. Click on "Sign Up". <br />
    //         <br />
    //         6. After signing up, you will be redirected to the login page. Log
    //         in with your new credentials (email and password). <br />
    //         <br />
    //         7. You will be redirected to complete your KYC form. <br />
    //         <br />
    //         8. After completing the KYC, proceed by submitting your application.
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <div className="flex flex-col items-center justify-center w-full">
    //         <div className="flex items-center justify-center mb-4 ">
    //           <input
    //             type="checkbox"
    //             id="doNotShowAgain"
    //             checked={doNotShowAgain}
    //             onChange={handleDoNotShowAgainChange}
    //           />
    //           <label htmlFor="doNotShowAgain" className="ml-2">
    //             Do not show this again
    //           </label>
    //         </div>
    //         <button
    //           onClick={handleClose}
    //           className="h-[42px] w-full px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
    //           Okay, Continue
    //         </button>
    //       </div>
    //     </AlertDialogFooter>
    //   </AlertDialogContent>
    // </AlertDialog>

    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
  <AlertDialogContent className="max-h-[90vh] overflow-y-auto p-5">
    <AlertDialogHeader className="space-y-4">
      <div className="flex flex-row items-center justify-center space-x-4 mb-4">
        <AlertCircle className="h-10 w-10 text-green-900" />
        <AlertDialogTitle className="text-xl font-bold m-0">
          Disclaimer
        </AlertDialogTitle>
      </div>

      

      <AlertDialogDescription className="space-y-3 text-sm"> {/* Reduced from text-base */}
        <h3 className="text-sm font-semibold">Steps to Register</h3>
        <p className="text-xs text-gray-600">
          Please follow these steps to register on the ITF SUPA Registration Portal:
      </p>
        <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
        <strong>Note:</strong> If you are an existing user, you must reset your password using your phone number (e.g., 2348********) if an account exists. If not, kindly create a new account.
        </p>    
        <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
        <strong>Steps:</strong>
        </p>
        <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
        <strong>1.</strong> Click on "Register".<br />
        <strong>2.</strong> Select a user type ("skilled artisan", "intending artisan" or "training center").<br />
        <strong>3.</strong> Fill in all the required information (marked with red asterisks).<br />
        <strong>4.</strong> Add your new password.<br />
        <strong>5.</strong> Click on "Sign Up".<br />
        <strong>6.</strong> After signing up, you will be redirected to the login page. Log in with your new credentials (email and password).<br />
        <strong>7.</strong> You will be redirected to complete your KYC form.<br />          
        <strong>8.</strong> After completing the KYC, proceed by submitting your application.
        </p>
        <p className="text-xs text-gray-600"> {/* Reduced from text-base */}
          If you have any issues, please contact the ITF support team.
        </p>

        <div className="mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-3"> {/* Reduced padding */}
          <h3 className="mb-1.5 text-sm font-bold text-red-700">⚠️ Important Warning</h3>
          <p className="text-xs text-red-600"> {/* Reduced from text-base */}
            Do not give money to any person or agent for this registration. Anyone collecting money is breaking 
            the law and will be in serious trouble.
          </p>
          <p className="mt-2 text-xs text-red-600">
            If someone asks you for money to register, please report them immediately to the nearest ITF office 
            or to the police.
          </p>
        </div>
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter className="mt-3"> {/* Reduced margin */}
      <div className="flex w-full flex-col items-center space-y-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="doNotShowAgain"
            checked={doNotShowAgain}
            onChange={handleDoNotShowAgainChange}
            className="rounded border-gray-300"
          />
          <span className="text-xs text-gray-600">Do not show this again</span> {/* Reduced from text-sm */}
        </label>

        <button
          onClick={handleClose}
          className="w-full rounded-full bg-emerald-900 px-8 py-2 text-xs font-medium text-white 
                   transition-colors hover:bg-emerald-800 focus:outline-none focus:ring-2 
                   focus:ring-emerald-900 focus:ring-offset-2">
          Okay, Continue
        </button>
      </div>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  );
}
