import React from "react";
import { motion } from "framer-motion";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function HeaderTitle({
  withSplitType = false,
  captionText = "",
  title_top = "",
  title_bottom = "",
  title_small = "",
  title_font_size = "100px",
  title_color = "#ffffff",
  description = "",
  description_color = "#4E4E4E",
  description_max_width = "700px",
  centerText = false,
}) {
  const titleStyle = {
    fontSize: `clamp(2rem, calc(${parseInt(title_font_size)} / 1420 * 100vw), ${title_font_size})`,
    color: title_color,
    textAlign: centerText ? "center" : undefined,
  };

  const descriptionStyle = {
    color: description_color,
    paddingTop: title_font_size === "100px" ? "2rem" : "1rem",
    maxWidth: `clamp(300px, calc(${parseInt(description_max_width)} / 1420 * 100vw), 1300px)`,
    textAlign: centerText ? "center" : undefined,
    margin: centerText ? "auto" : undefined,
  };

  useGSAP(() => {
    if (withSplitType) {
      const splitTop = SplitType.create("#header_text_1", {
        charClass: "char",
      });
      const splitBottom = SplitType.create("#header_text_2", {
        charClass: "char",
      });
      const splitSmall = SplitType.create("#header_text_3", {
        charClass: "char",
      });

      const chars = document.querySelectorAll(".char");
      gsap.set(chars, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(chars, {
        opacity: 1,
        x: 0,
        duration: 0.05,
        stagger: 0.05,
        ease: "power2.out",
      });

      return () => {
        tl.kill();
        splitTop.revert();
        splitBottom.revert();
        splitSmall.revert();
      };
    }
  }, []);

  return (
    <div
      className={`flex flex-col ${
        centerText ? "items-center text-center" : "items-start text-left"
      } w-full px-4 sm:px-6 md:px-8`}
    >
      {captionText && (
        <p className="text-xs sm:text-sm font-medium uppercase text-gray-500 mb-2 sm:mb-4">
          {captionText}
        </p>
      )}

      {title_top && (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          id="header_text_1"
          style={titleStyle}
        //   className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
        //   font-bold leading-tight text-white overflow-hidden whitespace-nowrap"
        // >
          className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
          font-bold leading-tight text-white overflow-hidden text-center break-words"
          >

          {title_top}
        </motion.h1>
      )}

      {title_bottom && (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          id="header_text_2"
          style={titleStyle}
          className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 
          font-bold text-white leading-tight overflow-hidden whitespace-nowrap"
        >
          {title_bottom}
        </motion.h1>
      )}

      {title_small && (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          id="header_text_3"
          style={titleStyle}
          className="w-full text-sm sm:text-base md:text-lg font-semibold mt-3 sm:mt-5 
          overflow-hidden whitespace-nowrap"
        >
          {title_small}
        </motion.h1>
      )}

      {description && (
        <motion.p
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          style={descriptionStyle}
          className="w-full text-sm sm:text-base md:text-l lg:text-l xxl:text-xl text-gray-600 mt-4 sm:mt-6 text-center break-words"

          // className="w-full text-sm sm:text-base md:text-lg text-gray-600 mt-4 sm:mt-6"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

export default HeaderTitle;