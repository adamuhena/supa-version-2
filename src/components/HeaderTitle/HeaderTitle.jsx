// "use client";
// import React from "react";
// import styles from "./styles.module.css";
// import { motion } from "framer-motion";
// import SplitType from "split-type";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import "./style.css";

// function HeaderTitle({
//   withSplitType = false,
//   captionText = "",
//   title_top = "",
//   title_bottom = "",
//   title_small = "",
//   title_font_size = "100px",
//   title_color = "#fffff",
//   description = "",
//   description_color = "#4E4E4E",
//   description_max_width = "700px",
//   centerText = false,
// }) {
//   let titleClassName = styles.h1_100px;
//   if (title_font_size === "100px") titleClassName = styles.h1_100px;
//   if (title_font_size === "56px") titleClassName = styles.h1_56px;

//   const titleStyle = {
//     color: title_color,
//     textAlign: centerText ? "center" : undefined,
//   };

//   const titleSmallStyle = {
//     color: title_color,
//     textAlign: centerText ? "center" : undefined,
//     marginTop: 20,
//   };

//   const descriptionStyle = {
//     color: description_color,
//     paddingTop: title_font_size === "100px" ? "36px" : "16px",
//     maxWidth: `clamp(500px, calc(${parseInt(
//       description_max_width
//     )} / 1420 * 100vw), 1300px)`,
//     textAlign: centerText ? "center" : undefined,
//     margin: centerText ? "auto" : undefined,
//   };

//   useGSAP(() => {
//     if (withSplitType) {
//       SplitType.create("#header_text_1", { charClass: "charle" });
//       SplitType.create("#header_text_2", { charClass: "charle" });
//       SplitType.create("#header_text_3", { charClass: "charle" });

//       const tl = gsap.timeline({});

//       tl.to("#header_text_1", {
//         opacity: 1,
//         duration: 0.2,
//       }).to(".charle", {
//         opacity: 1,
//         stagger: 0.1,
//         duration: 1,
//       });

//       return () => {
//         if (withSplitType) tl.reverse();
//       };
//     }
//   }, {});

//   return (
//     <div className={styles.main}>
//       {captionText ? (
//         <p className={styles.titleCaptionText}>{captionText}</p>
//       ) : null}
//       {title_top ? (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           transition={{ delay: withSplitType ? 0 : 0.2 }}
//           variants={{
//             visible: { opacity: 1, y: 0 },
//             hidden: { opacity: 0, y: 150 },
//           }}
//           className={titleClassName}
//           id="header_text_1"
//           style={titleStyle}>
//           {title_top}
//         </motion.h1>
//       ) : null}
//       {title_bottom ? (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           transition={{ delay: withSplitType ? 0 : 0.3 }}
//           variants={{
//             visible: { opacity: 1, y: 0 },
//             hidden: { opacity: 0, y: 150 },
//           }}
//           className={titleClassName}
//           id="header_text_2"
//           style={titleStyle}>
//           {title_bottom}
//         </motion.h1>
//       ) : null}

//       {title_small ? (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           transition={{ delay: withSplitType ? 0 : 0.3 }}
//           variants={{
//             visible: { opacity: 1, y: 0 },
//             hidden: { opacity: 0, y: 150 },
//           }}
//           className={styles.h1_small}
//           id="header_text_3"
//           style={titleSmallStyle}>
//           {title_small}
//         </motion.h1>
//       ) : null}

//       {description ? (
//         <motion.p
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           transition={{ delay: 0.3 }}
//           variants={{
//             visible: { opacity: 1, y: 0 },
//             hidden: { opacity: 0, y: 150 },
//           }}
//           style={descriptionStyle}
//           className={styles.description}>
//           {description}
//         </motion.p>
//       ) : null}
//     </div>
//   );
// }

// export default HeaderTitle;

"use client";
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
    fontSize: title_font_size,
    color: title_color,
    textAlign: centerText ? "center" : undefined,
  };

  const descriptionStyle = {
    color: description_color,
    paddingTop: title_font_size === "100px" ? "36px" : "16px",
    maxWidth: `clamp(500px, calc(${parseInt(
      description_max_width
    )} / 1420 * 100vw), 1300px)`,
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
        stagger: 0.05, // Stagger characters for the typing effect
        ease: "power2.out",
      });

      return () => {
        // Cleanup GSAP animation
        tl.kill();
        splitTop.revert();
        splitBottom.revert();
        splitSmall.revert();
      };
    }
  }, []);

  return (
    <div
      className={`flex flex-col items-center pb-12 ${
        centerText ? "text-center" : "text-left"
      }`}>
      {captionText && (
        <p className="text-sm font-medium uppercase text-gray-500 mb-4">
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
          className="font-bold leading-tight text-white overflow-hidden whitespace-nowrap">
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
          className="font-bold text-white leading-tight overflow-hidden whitespace-nowrap">
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
          className="font-semibold text-sm mt-5 overflow-hidden whitespace-nowrap">
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
          className="text-gray-600 mt-6">
          {description}
        </motion.p>
      )}
    </div>
  );
}

export default HeaderTitle;

// "use client";
// import React from "react";
// import { motion } from "framer-motion";
// import SplitType from "split-type";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";

// function HeaderTitle({
//   withSplitType = false,
//   captionText = "",
//   title_top = "",
//   title_bottom = "",
//   title_small = "",
//   title_font_size = "100px",
//   title_color = "#ffffff",
//   description = "",
//   description_color = "#4E4E4E",
//   description_max_width = "700px",
//   centerText = false,
// }) {
//   const titleStyle = {
//     fontSize: title_font_size,
//     color: title_color,
//     textAlign: centerText ? "center" : undefined,
//   };

//   const descriptionStyle = {
//     color: description_color,
//     paddingTop: title_font_size === "100px" ? "36px" : "16px",
//     maxWidth: `clamp(500px, calc(${parseInt(
//       description_max_width
//     )} / 1420 * 100vw), 1300px)`,
//     textAlign: centerText ? "center" : undefined,
//     margin: centerText ? "auto" : undefined,
//   };

//   useGSAP(() => {
//     if (withSplitType) {
//       const splitTop = SplitType.create("#header_text_1", { charClass: "char" });
//       const splitBottom = SplitType.create("#header_text_2", { charClass: "char" });
//       const splitSmall = SplitType.create("#header_text_3", { charClass: "char" });
//       const splitDescription = SplitType.create("#description_text", { charClass: "char" });

//       const chars = document.querySelectorAll(".char");
//       gsap.set(chars, { opacity: 0 });

//       const tl = gsap.timeline();
//       tl.to(chars, {
//         opacity: 1,
//         x: 0,
//         duration: 0.05,
//         stagger: 0.05, // Typing effect for title characters
//         ease: "power2.out",
//       });

//       // Add animation for description text
//       const descChars = document.querySelectorAll("#description_text .char");
//       tl.to(descChars, {
//         opacity: 1,
//         x: 0,
//         duration: 0.05,
//         stagger: 0.03, // Typing effect for description characters
//         ease: "power2.out",
//       });

//       return () => {
//         // Cleanup GSAP animation
//         tl.kill();
//         splitTop.revert();
//         splitBottom.revert();
//         splitSmall.revert();
//         splitDescription.revert();
//       };
//     }
//   }, []);

//   return (
//     <div className={`flex flex-col items-center pb-12 ${centerText ? "text-center" : "text-left"}`}>
//       {captionText && (
//         <p className="text-sm font-medium uppercase text-gray-500 mb-4">{captionText}</p>
//       )}
//       {title_top && (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           id="header_text_1"
//           style={titleStyle}
//           className="font-bold leading-tight overflow-hidden whitespace-nowrap">
//           {title_top}
//         </motion.h1>
//       )}
//       {title_bottom && (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           id="header_text_2"
//           style={titleStyle}
//           className="font-bold leading-tight overflow-hidden whitespace-nowrap">
//           {title_bottom}
//         </motion.h1>
//       )}
//       {title_small && (
//         <motion.h1
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           id="header_text_3"
//           style={titleStyle}
//           className="font-semibold text-sm mt-5 overflow-hidden whitespace-nowrap">
//           {title_small}
//         </motion.h1>
//       )}
//       {description && (
//         <motion.p
//           whileInView="visible"
//           initial="hidden"
//           viewport={{ once: true }}
//           id="description_text"
//           style={descriptionStyle}
//           className="text-gray-600 mt-6 overflow-hidden whitespace-nowrap">
//           {description}
//         </motion.p>
//       )}
//     </div>
//   );
// }

// export default HeaderTitle;
