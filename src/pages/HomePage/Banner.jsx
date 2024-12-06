// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import logo1 from "../../assets/itflogo.png";
// import logo2 from "../../assets/coat_of_arms.svg";
// import logo3 from "../../assets/logo.png";
// import logo4 from "../HomePage/image/img10.jpeg";
// import logo5 from "../HomePage/image/img1.jpeg";
// import logo6 from "../HomePage/image/img2.jpeg";
// import logo7 from "../HomePage/image/bimg.png";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from 'react-router-dom';
// import { BlurFade } from "../../components/ui/blur-fade";
// import HeaderThreeImages from "../../components/HeaderThreeImages/HeaderThreeImages";
// import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";


// export default function Banner() {


//   return (
//     <div className="relative h-screen w-full overflow-hidden bg-slate-900">
//       {/* <img
//         alt=""
//         src={logo4}
//         className="absolute inset-0 w-full h-full  object-cover blur-xl"
//       /> */}

//       <div className="relative h-full w-full flex flex-col justify-between">
//         <div className="absolute inset-x-0 -top-20 -z-60 transform-gpu overflow-hidden blur-3xl sm:-top-80">
//           <div
//             style={{
//               clipPath:
//                 "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
//             }}
//             className="relative left-[calc(50%-15rem)] aspect-video w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fb6969] to-[#47d342] opacity-100 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
//           />
//         </div>

//         <div className="relative flex justify-center gap-2 items-center mx-auto max-w-7xl xl:px-0 px-4 pt-10 pb-30 md:py-10 lg:py-20 sm:py-10 xl:py-40 -mt-1 bg-transparent">
//           <div className="w-2/3 px-8 justify-center">
//             <div className="w-full text-center mb-10">
//               <div className="hidden sm:mb-8 sm:flex sm:justify-center">
//                 <div className="relative rounded-full px-3 text-sm/6 xl:text-xl text-white ring-1 ring-gray-200/10 hover:ring-gray-900/20 bg-transparent backdrop-blur-lg">
//                   Announcing our next Phase of SUPA.
//                   <Link to="#" className="font-semibold text-green-500 hover:text-yellow-400">
//                     Read more
//                   </Link>
//                 </div>
//               </div>
//               <HeaderTitle
//                 withSplitType
//                 title_font_size="56px"
//                 title_top="Skill-Up Artisans (SUPA)"
//                 description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors. "
//                 title_color="#fffffff"
//                 description_color="#ffffff"
//                 description_max_width="900px"
//                 centerText
//               />
              

//               <div className="flex gap-[20px] w-full justify-center items-center">
//                 <BlurFade delay={0.25} inView>
//                   <Link to="/register">
//                     <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-emerald-900 hover:bg-emerald-900/80 text-[#fff]">
//                       Register
//                     </button>
//                   </Link>
//                 </BlurFade>
//                 <BlurFade delay={0.25} inView>
//                   <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#fff] border-[1px] text-yellow-600 border-yellow-600">
//                     View Marketplace
//                   </button>
//                 </BlurFade>
//               </div>
//             </div>

//             {/* <div className="mt-3 xl:mt-9 flex items-center justify-center gap-x-6 bg-transparent backdrop-blur-lg rounded-full w-fit mx-auto">
//               <img src={logo1} alt="Logo 1" className="w-10 h-10 xl:w-16 xl:h-16" />
//               <img src={logo2} alt="Logo 2" className="w-10 h-10 xl:w-16 xl:h-16" />
//               <img src={logo3} alt="Logo 3" className="w-10 h-10 xl:w-16 xl:h-16" />
//             </div> */}
//           </div>

//           <div className="w-11/5 bg-transparent text-white md:block hidden text-center xl:py-10 py-6">
//             <img src={logo7} alt="Artisan" className="w-full h-full object-cover hover:resize" />

//           </div>
//         </div>

//       </div>

      
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import logo7 from "../HomePage/image/bimg.png";
import { BlurFade } from "../../components/ui/blur-fade";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";
import { DotPattern } from "../../components/ui/dot-pattern";
import { cn } from "../../lib/utils";

export default function Banner() {
  return (
    //bg-slate-900
    <div className="relative h-screen w-full overflow-hidden bg-slate-900"> 
    <DotPattern
                    width={10}
                    height={10}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn("fill-neutral-400/40 opacity-15")}
                  />
      <div className="relative h-full w-full flex flex-col justify-between">
        {/* Background Gradient */}
        <div className="absolute inset-x-0 -top-20 -z-60 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-15rem)] aspect-video w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fb6969] to-[#47d342] opacity-100 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Content */}
        <div className="relative flex flex-wrap justify-center gap-8 items-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-28 md:pt-34 lg:pt-32 xl:pt-48 pb-10 bg-transparent">
        
          {/* Left Section */}
          <div className="w-full sm:w-2/3 lg:w-1/2 px-4 text-center">
            <div className="mb-10">
              {/* Announcement */}
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm text-white ring-1 ring-gray-200/10 hover:ring-gray-900/20 bg-transparent backdrop-blur-lg">
                  Announcing our next Phase of SUPA.
                  <Link
                    to="/about"
                    className="ml-2 font-semibold text-green-500 hover:text-yellow-400"
                  >
                    Read more
                  </Link>
                </div>
              </div>

              {/* Title & Description */}
              <HeaderTitle
                withSplitType
                title_font_size="36px"
                title_top="Skill-Up Artisans (SUPA)"
                description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors."
                title_color="#ffffff"
                description_color="#ffffff"
                description_max_width="700px"
                centerText
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <BlurFade delay={0.25} inView>
                <Link to="/register">
                  <button className="h-[48px] px-[32px] text-sm sm:text-base rounded-full bg-emerald-900 hover:bg-emerald-900/80 text-white">
                    Register
                  </button>
                </Link>
              </BlurFade>
              <BlurFade delay={0.25} inView>
                <button className="h-[48px] px-[32px] text-sm sm:text-base rounded-full bg-white text-yellow-600 border border-yellow-600">
                  View Marketplace
                </button>
              </BlurFade>
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full sm:w-1/2 lg:w-1/3 md:block hidden text-white">
            <img
              src={logo7}
              alt="Artisan"
              className="w-full max-w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
