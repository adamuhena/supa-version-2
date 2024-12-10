

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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-900">
    {/* Dot Pattern Background */}
    <DotPattern
      width={10}
      height={10}
      cx={1}
      cy={1}
      cr={1}
      className={cn("fill-neutral-400/40 opacity-15")}
    />

    {/* Gradient Background */}
    <div 
      className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl 
      sm:-top-80 md:-top-96 lg:-top-110"
    >
      <div
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
        className="relative left-[calc(50%-15rem)] aspect-video w-[36.125rem] 
        -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fb6969] to-[#47d342] 
        opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
      />
    </div>

    {/* Main Content Container */}
    <div className="relative min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {/* Left Section */}
          <div className="w-full max-w-xl text-center">
            {/* Announcement */}
            <div className="hidden sm:flex justify-center mb-6">
              <div className="rounded-full px-3 py-1 text-sm text-white 
              ring-1 ring-gray-200/10 hover:ring-gray-900/20 
              bg-transparent backdrop-blur-lg inline-block">
                Announcing our next Phase of SUPA.
                <Link
                  to="/about"
                  className="ml-2 font-semibold text-green-500 hover:text-yellow-400"
                >
                  Read more
                </Link>
              </div>
            </div>

            {/* Header Title */}
            <HeaderTitle
              withSplitType
              title_font_size="40px"
              title_top="Skill-Up Artisans (SUPA)"
              description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors."
              title_color="#ffffff"
              description_color="#ffffff"
              description_max_width="900px"
              centerText={true}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <BlurFade delay={0.25} inView>
                <Link to="/register">
                  <button className="h-12 px-8 text-sm rounded-full 
                  bg-emerald-900 hover:bg-emerald-900/80 text-white 
                  transition-colors duration-300">
                    Register
                  </button>
                </Link>
              </BlurFade>
              <BlurFade delay={0.25} inView>
                <button className="h-12 px-8 text-sm rounded-full 
                bg-white text-yellow-600 border border-yellow-600 
                hover:bg-yellow-50 transition-colors duration-300">
                  View Marketplace
                </button>
              </BlurFade>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="w-full max-w-xl hidden md:flex justify-center text-white">
            <img
              src={logo7}
              alt="Artisan"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
