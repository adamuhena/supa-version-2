"use client";
import React from "react";
import styles from "./styles.module.css";
import { motion } from "framer-motion";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "./style.css";

function HeaderTitle({
  withSplitType = false,
  captionText = "",
  title_top = "",
  title_bottom = "",
  title_small = "",
  title_font_size = "100px",
  title_color = "#100E10",
  description = "",
  description_color = "#4E4E4E",
  description_max_width = "700px",
  centerText = false,
}) {
  let titleClassName = styles.h1_100px;
  if (title_font_size === "100px") titleClassName = styles.h1_100px;
  if (title_font_size === "56px") titleClassName = styles.h1_56px;

  const titleStyle = {
    color: title_color,
    textAlign: centerText ? "center" : undefined,
  };

  const titleSmallStyle = {
    color: title_color,
    textAlign: centerText ? "center" : undefined,
    marginTop: 20,
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
      SplitType.create("#header_text_1", { charClass: "charle" });
      SplitType.create("#header_text_2", { charClass: "charle" });
      SplitType.create("#header_text_3", { charClass: "charle" });

      const tl = gsap.timeline({});

      tl.to("#header_text_1", {
        opacity: 1,
        duration: 0.2,
      }).to(".charle", {
        opacity: 1,
        stagger: 0.1,
        duration: 1,
      });

      return () => {
        if (withSplitType) tl.reverse();
      };
    }
  }, {});

  return (
    <div className={styles.main}>
      {captionText ? (
        <p className={styles.titleCaptionText}>{captionText}</p>
      ) : null}
      {title_top ? (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          transition={{ delay: withSplitType ? 0 : 0.2 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 150 },
          }}
          className={titleClassName}
          id="header_text_1"
          style={titleStyle}>
          {title_top}
        </motion.h1>
      ) : null}
      {title_bottom ? (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          transition={{ delay: withSplitType ? 0 : 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 150 },
          }}
          className={titleClassName}
          id="header_text_2"
          style={titleStyle}>
          {title_bottom}
        </motion.h1>
      ) : null}

      {title_small ? (
        <motion.h1
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          transition={{ delay: withSplitType ? 0 : 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 150 },
          }}
          className={styles.h1_small}
          id="header_text_3"
          style={titleSmallStyle}>
          {title_small}
        </motion.h1>
      ) : null}

      {description ? (
        <motion.p
          whileInView="visible"
          initial="hidden"
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 150 },
          }}
          style={descriptionStyle}
          className={styles.description}>
          {description}
        </motion.p>
      ) : null}
    </div>
  );
}

export default HeaderTitle;
