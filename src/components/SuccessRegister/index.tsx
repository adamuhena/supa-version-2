import React from "react";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";

import { BlurFade } from "../ui/blur-fade";
export default function RegisterSuccess({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [show, setshow] = React.useState(false);

  const open = () => setshow(true);
  const close = () => setshow(false);
  return (
    <AlertDialog open={show}>
      {children ? (
        <>
          {React.Children.map(children, (child?: any) => {
            return React.cloneElement(child, {
              onClick: () => open(),
            });
          })}
        </>
      ) : null}

      <AlertDialogContent className="max-w-[657px]">
        <div className="mx-auto flex w-full max-w-[450px] flex-col items-center justify-center gap-[8px] py-[30px]">
          <button onClick={() => (window.location = "/")}>
            <CrossCircledIcon className="absolute right-[20px] top-[20px] h-[24] w-[24] text-[#1D2849]" />
          </button>
          <BlurFade delay={0} inView>
            <img
              src="/images/check.webp"
              className="w-[156.77px] mb-6"
              alt="logo"
            />
          </BlurFade>

          <div>
            <BlurFade delay={0.05} inView>
              <AlertDialogTitle className="text-[30px]  font-[600] font-onest settle-text-50 text-center text-settle-green">
                Registration Successful!
              </AlertDialogTitle>
            </BlurFade>
          </div>

          <BlurFade delay={0.1} inView>
            <p className="settle-text-18 max-w-[370px] text-center text-settle-green font-onest">
              Congratulations! Your account has been successfully created. You
              can now log in to access our services.
            </p>
          </BlurFade>

          <BlurFade
            delay={0.1}
            inView
            className="flex w-full flex-col gap-[4px]">
            <button className="h-[42px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
              Proceed to dashboard
            </button>
          </BlurFade>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
