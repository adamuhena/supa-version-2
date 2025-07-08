import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

// Example: You can pass this as a prop or fetch from API
const imageUrl = "/disclaim.jpeg"; // Set to "" or null if no image

export function AlertUsersToResetPassword() {
  const [isOpen, setIsOpen] = useState(false);
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(!!imageUrl);

  useEffect(() => {
    const doNotShow = localStorage.getItem("doNotShowResetPasswordDialog");
    if (doNotShow !== "true" && !imageUrl) {
      setIsOpen(true);
    }
  }, []);

  const handleDoNotShowAgainChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDoNotShowAgain(event.target.checked);
  };

  const handleImageDialogClose = () => {
    setShowImageDialog(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem("doNotShowResetPasswordDialog", "true");
    }
    setIsOpen(false);
  };

  // Image dialog
  if (showImageDialog && imageUrl) {
    return (
      <AlertDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <AlertDialogContent className="flex flex-col items-center justify-center">
          <img
            src={imageUrl}
            alt="Notice"
            className="
            w-full h-auto
            rounded-lg mb-4
            max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl
            max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] lg:max-h-[90vh]
            object-contain
          "
          />
          <button
            onClick={handleImageDialogClose}
            className="rounded-full bg-emerald-900 px-6 py-2 text-xs font-medium text-white mt-2"
          >
            Continue
          </button>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Existing dialog
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
                <svg
                  className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
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
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Click on{" "}
                    <span className="font-semibold">Beneficiaries / Artisans</span>{" "}
                    tab
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Select <span className="font-semibold">2025</span> year
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Choose your <span className="font-semibold">State</span>
                  </span>
                </div>
                <div className="flex items-center p-1 sm:p-1.5 md:p-2 bg-white/60 rounded border border-blue-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white rounded-full text-xs font-bold flex-shrink-0">
                    4
                  </span>
                  <span className="ml-1.5 sm:ml-2 text-xs text-blue-800">
                    Select{" "}
                    <span className="font-semibold">Registered Artisans </span> to
                    Preview List
                  </span>
                </div>
              </div>
            </div>

            {/* Existing Password Reset Note */}
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Note:</strong> If you are an existing user, you must reset
              your password using your phone number (e.g., 2348********) if an
              account exists. If not, kindly create a new account.
            </p>

            {/* Warning Section */}
            <div className="mt-2 sm:mt-3 md:mt-4 rounded-lg border-2 border-red-200 bg-red-50 p-2 sm:p-3">
              <h3 className="mb-1 sm:mb-1.5 text-xs sm:text-sm font-bold text-red-700">
                ⚠️ Important Warning
              </h3>
              <p className="text-xs text-red-600 leading-relaxed">
                Do not give money to any person or agent for this registration.
                Anyone collecting money is breaking
                the law and will be in serious trouble.
              </p>
              <p className="mt-1 sm:mt-2 text-xs text-red-600 leading-relaxed">
                If someone asks you for money to register, please report them
                immediately to the nearest ITF office
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
              <span className="text-xs text-gray-600">
                Do not show this again
              </span>
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

