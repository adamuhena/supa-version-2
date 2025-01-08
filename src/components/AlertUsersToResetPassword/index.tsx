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
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex flex-col items-center justify-center w-full">
            <AlertCircle className="size-[70px] text-green-900" />
          </div>

          <AlertDialogTitle className="text-center text-[25px]">
            Password reset required for existing users
          </AlertDialogTitle>
          <br />
          <AlertDialogDescription className="text-center">
            Existing users should reset their password using phone number (eg.
            2348********) if an account exists, if not, kindly create a new
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center mb-4 ">
              <input
                type="checkbox"
                id="doNotShowAgain"
                checked={doNotShowAgain}
                onChange={handleDoNotShowAgainChange}
              />
              <label htmlFor="doNotShowAgain" className="ml-2">
                Do not show this again
              </label>
            </div>
            <button
              onClick={handleClose}
              className="h-[42px] w-full px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-white">
              Okay, Continue
            </button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
