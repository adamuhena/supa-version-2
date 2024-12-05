import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo7 from "../HomePage/image/bimg.png";
import { BlurFade } from "../../components/ui/blur-fade";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
export default function Banner() {
  return (
    <div className="bg-[whitesmoke] pb-[10px] min-h-[100vh] flex">
      <div className="flex w-full max-w-[1300px] mx-auto pt-[100px] items-center">
        <div className="basis-[65%]   min-h-[50px] px-[20px]">
          <div className="relative rounded-[6px] px-3 text-sm/6 xl:text-xl text-black ring-1 ring-gray-200/10 hover:underline bg-transparent backdrop-blur-lg">
            Announcing our next Phase of SUPA.
            <Link
              to="#"
              className="ml-[5px] font-bold text-emerald-900 hover:text-yellow-400">
              Read more...
            </Link>
          </div>

          <HeaderTitle
            withSplitType
            title_font_size="45px"
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

        <div className="relative flex justify-center gap-2 items-center mx-auto max-w-7xl xl:px-0 px-4  pb-30 md:py-0 lg:py-10 sm:py-0 xl:py-20 -mt-1 bg-transparent">
          <div className="w-2/3 px-8 justify-center">
            <div className="w-full text-center mb-10">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 text-sm/6 xl:text-xl text-white ring-1 ring-gray-200/10 hover:ring-gray-900/20 bg-transparent backdrop-blur-lg">
                  Announcing our next Phase of SUPA.
                  <Link to="#" className="font-semibold text-green-500 hover:text-yellow-400">
                    Read more
                  </Link>
                </div>
              </div>
              <HeaderTitle
                withSplitType
                title_font_size="56px"
                title_top="Skill-Up Artisans (SUPA)"
                description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors. "
                title_color="#fffffff"
                description_color="#ffffff"
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
                  <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#fff] border-[1px] text-yellow-600 border-yellow-600">
                    View Marketplace
                  </button>
                </BlurFade>
              </div>
            </div>

            {/* <div className="mt-3 xl:mt-9 flex items-center justify-center gap-x-6 bg-transparent backdrop-blur-lg rounded-full w-fit mx-auto">
              <img src={logo1} alt="Logo 1" className="w-10 h-10 xl:w-16 xl:h-16" />
              <img src={logo2} alt="Logo 2" className="w-10 h-10 xl:w-16 xl:h-16" />
              <img src={logo3} alt="Logo 3" className="w-10 h-10 xl:w-16 xl:h-16" />
            </div> */}
          </div>

          <div className="w-11/5 bg-transparent text-white md:block hidden text-center xl:py-10 py-6">
            <img src={logo7} alt="Artisan" className="w-full h-full object-cover hover:resize" />

          </div>
        </div>

      </div>
    </div>
  );
}
