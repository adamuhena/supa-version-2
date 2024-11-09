import React, { useEffect } from "react";
import { motion, useIsPresent } from "framer-motion";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const useEscapeKeyPress = (callback) => {
  // Function to handle the key press event
  const handleKeyDown = (event) => {
    if (event?.key === "Escape") {
      callback(); // Call the provided callback function
    }
  };

  // Use useEffect to attach and detach the event listener
  useEffect(() => {
    // Add event listener on component mount
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener on component unmount
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []); // Empty dependency array ensures the effect runs only once
};

function Dropdown({ handleClose = () => null, links = [] }) {
  const isPresent = useIsPresent();

  useEffect(() => {}, [isPresent]);

  const handleEscapePress = () => {
    handleClose();
  };

  useEscapeKeyPress(handleEscapePress);

  if (!isPresent) return null;
  return (
    <div className="widow-main h-full  relative z-[15] ">
      <div className="widow-inner h-full  flex  justify-center lg:justify-between  relative z-[16]">
        <motion.div className="flex flex-col items-center justify-start  gap-y-[20px] relative z-[17] mx-auto">
          {links.map((x, indexd) => {
            if (x?.children?.length) {
              return (
                <>
                  <ParentLink
                    item={x}
                    index={indexd}
                    handleClose={handleClose}
                  />
                </>
              );
            }
            return (
              <a
                onClick={handleClose}
                href={x?.href}
                className="text-[23px] w-full  leading-[38px] text-center text-[#ffffff] hover:text-white hover:underline  max-w-[1000px]">
                <motion.span
                  className="text-[23px] w-full  leading-[38px] text-center text-[#ffffff] hover:text-white hover:underline  "
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * indexd }}>
                  {x?.title}
                </motion.span>
              </a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

const ParentLink = ({ item, index, handleClose }) => {
  const [show, setshow] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setshow((x) => !x)}
        className="text-[23px] w-full  leading-[38px] text-center   hover:underline  max-w-[1000px]">
        <motion.span
          className={`text-[23px] w-full  leading-[38px] text-center ${
            show
              ? "text-green-700 hover:text-green-700"
              : "text-[#ffffff] hover:text-white"
          } hover:underline  flex items-center gap-[5px]`}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.1 * index }}>
          <span>{item.title}</span>
          <ChevronDownIcon
            className={`w-[20px] h-[20px] ${show ? "rotate-180" : ""} `}
          />
        </motion.span>
      </button>

      {show ? (
        <>
          {item.children.map((x) => {
            return (
              <a
                onClick={handleClose}
                href={x?.href}
                className="text-[16px] w-full text-center text-[#ffffff] hover:text-white hover:underline  max-w-[60vw]">
                - {x?.abbr}
              </a>
            );
          })}
        </>
      ) : null}
    </>
  );
};
export default Dropdown;
