import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo7 from "../HomePage/image/bimg.png";
import { BlurFade } from "../../components/ui/blur-fade";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
export default function Banner() {
  return (
    <div className="bg-[whitesmoke] pb-[10px]">
      <div className="flex w-full max-w-[1300px] mx-auto pt-[100px] items-center">
        <div className="basis-[65%]   min-h-[50px] px-[20px]">
          <div className="relative rounded-[6px] px-3 text-sm/6 xl:text-xl text-black ring-1 ring-gray-200/10 hover:underline bg-transparent backdrop-blur-lg">
            Announcing our next Phase of SUPA.
            <Link
              to="#"
              className="ml-[5px] font-bold text-emerald-900 hover:text-yellow-400"
            >
              Read more...
            </Link>
          </div>

          <HeaderTitle
            withSplitType
            title_font_size="56px"
            title_top="Skill-Up Artisans (SUPA)"
            description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors. "
            title_color="black"
            description_color="#000"
            description_max_width="900px"
            centerText
          />

          <div className="flex gap-[20px] w-full justify-center items-center">
            <BlurFade delay={0.25} inView>
              <Link to="/register">
                <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-emerald-900 hover:bg-emerald-900/80 text-[#fff]">
                  Register
                </button>
              </Link>
            </BlurFade>
            <BlurFade delay={0.25} inView>
              <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-yellow border-[1px] text-yellow-600 border-yellow-600">
                View Programmes
              </button>
            </BlurFade>
          </div>
        </div>
        <div className="basis-[35%] w-full  ] flex justify-center items-center">
          <img
            src={logo7}
            alt="Artisan"
            className="w-[90%] h-full object-cover hover:resize"
          />
        </div>
      </div>
    </div>
  );
}
