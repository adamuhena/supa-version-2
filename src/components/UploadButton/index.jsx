import React from "react";

import { useFileUpload } from "./useUploadFIle";

import Spinner from "../Spinner";
import { UploadIcon, TrashIcon, CheckCircledIcon } from "@radix-ui/react-icons";

function UploadButton({
  fileUrl,
  title,
  handleFileChange = () => null,
  accept = ".jpg, .png, .jpeg, .pdf, .doc, .docx, .csv, .txt",
  removeFile = () => null,
}) {
  const { loading: uploading, handleImageUpload } = useFileUpload();

  const uploadFileToAWS = async (event) => {
    const files = event.target.files;
    try {
      if (files && files?.length > 0) {
        const _selectedFile = files[0];
        const fileSizeInMB = _selectedFile.size / (1024 * 1024);
        if (fileSizeInMB > 2) {
          alert("File size should be 2MB or less.");
        }

        const formData = new FormData();
        formData.append("file", _selectedFile);
        const req = await handleImageUpload(formData);

        if (req?.status === 200 && req?.error === false) {
          const newFileUrl = req?.data?.data?.Location;
          handleFileChange(newFileUrl);
        } else {
        }
      }
    } catch (error) {
    } finally {
    }
  };

  const [openPreviewFile, setOpenPreviewFile] = React.useState(false);
  const removeUpload = () => {
    handleFileChange({ returnedUri: "" });
  };
  return (
    <div className="border-gray-300 rounded-lg border-[1px] flex items-center pl-2 text-[14px] py-1 w-full cursor-pointer">
      <label className="flex items-center  cursor-pointer">
        {uploading ? (
          <Spinner className={"text-black"} />
        ) : fileUrl ? (
          <CheckCircledIcon className="text-green-500" />
        ) : (
          <UploadIcon className={"text-black"} />
        )}
        {fileUrl ? (
          <>
            <span className="mr-1">File uploaded</span>{" "}
            <UploadIcon className={"text-black"} />
          </>
        ) : (
          <span>{title || "Upload"}</span>
        )}

        <input
          type="file"
          onChange={(e) => {
            uploadFileToAWS(e);
            e.target.value = null;
          }}
          accept={accept}
          id={title}
          className="hidden"
        />
      </label>

      {!fileUrl ? null : (
        <button onClick={removeFile} className="ml-auto mr-2">
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default UploadButton;
