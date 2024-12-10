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
       
        <div>
          <Banner />

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
      
        <FAQs />
      </PageLayout>
    </>
  );
}

export default HomePage;
