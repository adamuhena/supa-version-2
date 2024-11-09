import React from "react";
import Marquee from "react-fast-marquee";
import HeaderThreeImages from "../../components/HeaderThreeImages/HeaderThreeImages";
import HeaderTitle from "../../components/HeaderTitle/HeaderTitle";

import NavBar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";

function HomePage() {
  return (
    <>
      <NavBar />

      <div
        style={{
          padding: "0 2rem",
          paddingTop: 50,
        }}>
        <HeaderTitle
          withSplitType
          title_font_size="56px"
          title_top="Skill-Up Artisans (SUPA)"
          description=" Welcome to the FCT Social Investment Programmes Portal, your one-stop hub for information and resources on our flagship programmes. Learn and engage with us as we work together to empower citizens and build a better future for all. "
          title_color="#1b6f37"
          description_color="#000000"
          description_max_width="900px"
          centerText
        />

        <div className="flex gap-[20px] w-full justify-center items-center">
          <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#00524d] text-[#fff]">
            Register
          </button>
          <button className="h-[48px] px-[40px] text-[14px] rounded-[40px] bg-[#fff] border-[1px] text-yellow-600 border-yellow-600">
            View Marketplace
          </button>
        </div>

        <br />
        <br />
        <br />
        <HeaderThreeImages
          image_1={"/images/workers/5.jpg"}
          image_2={"/images/workers/2.jpg"}
          image_3={"/images/workers/4.jpg"}
        />
        <br />
        <br />
        <br />
        <br />

        <div className="w-full py-[200px]">
          <h1>TITLE TITLE</h1>
          <div className=" row items-center justify-center flex gap-[20px] mt-[30px]">
            <div className="w-[150px] h-[150px] rounded-full bg-gray-400" />
            <div className="w-[150px] h-[150px] rounded-full bg-gray-400" />
            <div className="w-[150px] h-[150px] rounded-full bg-gray-400" />
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <HeaderTitle
          title_color="#16501c"
          title_top="RECENT PROGRAMMES"
          title_font_size="56px"
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
      <Footer />
    </>
  );
}

export default HomePage;
