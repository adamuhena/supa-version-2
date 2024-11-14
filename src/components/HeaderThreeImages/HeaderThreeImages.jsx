"use client";
import React from "react";
import styles from "./styles.module.css";
import { BlurFade } from "../ui/blur-fade";

function HeaderThreeImages({ image_1, image_2, image_3, hide = false }) {
  return (
    <div>
      <div className={styles.main}>
        <BlurFade delay={0.3} inView className={styles.main_left}>
          <img
            whileHover={{ scale: 0.9, rotate: 2 }}
            width={1000}
            height={1000}
            alt="image_1"
            src={image_1}
            className="object-cover w-full h-full cursor-zoom-in"
            style={{
              transition: "opacity 6s ease-in-out",
              opacity: hide ? 0 : 1,
            }}
          />
        </BlurFade>

        <BlurFade delay={0.3} inView className={styles.main_middle}>
          <img
            whileHover={{ scale: 0.9, rotate: 2 }}
            width={1000}
            height={1000}
            alt="image_2"
            src={image_2}
            className="object-cover w-full h-full cursor-zoom-in"
            style={{
              transition: "opacity 6s ease-in-out",
              opacity: hide ? 0 : 1,
            }}
          />
        </BlurFade>

        <BlurFade delay={0.3} inView className={styles.main_right}>
          <img
            whileHover={{ scale: 0.9, rotate: 2 }}
            width={1000}
            height={1000}
            alt="image_3"
            src={image_3}
            className="object-cover w-full h-full cursor-zoom-in"
            style={{
              transition: "opacity 6s ease-in-out",
              opacity: hide ? 0 : 1,
            }}
          />
        </BlurFade>
      </div>
    </div>
  );
}

export default HeaderThreeImages;
