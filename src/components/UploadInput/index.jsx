import { ImageIcon } from "@radix-ui/react-icons";
import React, { useRef } from "react";

function UploadInput() {
  const fileInput = useRef(null);
  return (
    <>
      <input ref={fileInput} type="file" className="hidden" accept="image/*" />
      <button
        className="w-full cursor-pointer"
        onClick={(e) => {
          e?.preventDefault();
          fileInput?.current?.click();
        }}>
        <div className=" gap-[24px] border-dotted border-[1px] border-gray-300 bg-gray-100 w-full rounded-lg flex items-center p-[30px]">
          <ImageIcon className="size-[100px] text-gray-500" />
          <div className="w-full">
            <h2 className="text-[16px] text-center font-[500]">
              Drag files here or click to select files
            </h2>
            <p className="text-[12px] text-center font-[400]">
              Attach as many files as you can. And should not exceed 5mb
            </p>
          </div>
        </div>
      </button>
    </>
  );
}

export default UploadInput;
