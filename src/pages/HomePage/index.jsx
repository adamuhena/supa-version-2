import React from "react";
import Marquee from "react-fast-marquee";

import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";

import FAQs from "./FAQs";
import PageLayout from "../../components/layout/pageLayout";
import Banner from "./Banner";

function HomePage() {
  return (
    <>
      {/* <NavBar /> */}
      <PageLayout>
        {/* <div
        style={{
          padding: "0 2rem",
          paddingTop: 50,
        }}> */}
        <div>
          <Banner />
          {/* <HeaderTitle
          withSplitType
          title_font_size="56px"
          title_top="Skill-Up Artisans (SUPA)"
          description="Empowering artisans with tech-driven training, official licensing, access to essential toolkits, and promoting industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors. "
          title_color="#1b6f37"
          description_color="#000000"
          description_max_width="900px"
          centerText
        />

        <div className="flex gap-[20px] w-full justify-center items-center">
          <BlurFade delay={0.25} inView>
            <Link to="/register">
              <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
                Register
              </button>
            </Link>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#fff] border-[1px] text-yellow-600 border-yellow-600">
              View Marketplace
            </button>
          </BlurFade>
        </div> */}

          <br />
          <br />
          <br />
          <HeaderTitle
            title_color="#064A3B"
            title_top="RECENT PROGRAMMES"
            title_font_size="40px"
            description="Recent programmes reflecting our commitment to high-quality craftsmanship and exceptional results."
            description_color="#000000"
            centerText
          />

          <Marquee className={"mb-[20px] relative overflow-x-hidden"}>
            {[
              "/images/workers/1.jpg",
              "/images/workers/2.jpg",
              "/images/workers/3.jpg",
              "/images/workers/4.jpg",
              "/images/workers/5.jpg",
            ].map((item, index) => {
              return (
                <div key={index.toString()} className={"translate-x-[-50%]"}>
                  <img
                    src={item}
                    className="w-[425px] h-[280px] mr-[20px] rounded-[16px] object-cover"
                  />
                </div>
              );
            })}
          </Marquee>

          <Marquee
            className={"mb-[20px] relative overflow-x-hidden"}
            direction="right">
            {[
              "/images/workers/1.jpg",
              "/images/workers/2.jpg",
              "/images/workers/3.jpg",
              "/images/workers/4.jpg",
              "/images/workers/5.jpg",
            ].map((item, index) => {
              return (
                <div key={index.toString()} className={"translate-x-[-20%]"}>
                  <img
                    src={item}
                    className="w-[425px] h-[280px] mr-[20px] rounded-[16px] object-cover"
                  />
                </div>
              );
            })}
          </Marquee>
        </div>
        {/* <HeaderThreeImages
          image_1={"/images/workers/5.jpg"}
          image_2={"/images/workers/2.jpg"}
          image_3={"/images/workers/4.jpg"}
        /> */}
        <FAQs />
        {/* <Footer /> */}
      </PageLayout>
    </>
  );
}

export default HomePage;
