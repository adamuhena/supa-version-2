import PageLayout from "@/components/layout/pageLayout";
import { SVGProps } from "react";
import { Link } from "react-router-dom";
import HeaderThreeImages from "../../components/HeaderThreeImages/HeaderThreeImages";
import React, { useState } from "react";
export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = `Nigeria has a fast-growing population of over 220 million people, and the burden of unemployment has been prevalent over time. The country’s labour force was predicted to increase to over 67 million in 2022 and there is a need to ensure that employment is readily available as more citizens enter the job market. President Bola Ahmed Tinubu, GCFR as part of the Renewed Hope Agenda of his administration, is committed to creating gainful employment for the teeming youth. President Tinubu’s vision for economic development and poverty reduction in Nigeria includes supporting artisans and promoting industrial development through a strong workforce of skilled individuals. Many employment initiatives target the white-collar industry but the former Honourable Minister of Industry, Trade and Investment, Dr. Doris Uzoka-Anite, launched a massive campaign that targets the blue-collar industry to ensure inclusiveness in job creation drive of the Federal Government. This programme, which is known as the Skill-UP Artisans (SUPA), will impact on 10 million artisans over a 2 year period. The programme is a joint initiative of the Federal Government and the Industrial Training Fund (ITF) and will be coordinated by the later. SUPA is in line with global employment trends, which have shifted as a result of the way technology has changed the face of many industries. The preference for white-collar jobs has resulted in a scarcity of qualified Nigerian artisans. SUPA seeks to reverse this trend.`;

  const previewText = fullText.slice(0, 500);

  return (
    <PageLayout>
      <div className="bg-gradient-to-t from-stone-100 to-current-black">
        <section className="bg-slate-900/25 pt-[100px] pb-[40px]">
          <div className="  text-5xl font-bold text-emerald-700">
            About SUPA
          </div>
        </section>
        <div>
          <div className="">
            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem] pt-10">
              Skill-<span className="text-emerald-900">Up</span> Artisans (SUPA)
            </h1>
            <div className="space-y-4">
              <p className="w-full text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed p-[30px]">
                {isExpanded ? fullText : previewText}
              </p>

              <button
                className="text-blue-500 mt-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[1200px] mt-[40px] mx-auto">
          <HeaderThreeImages
            image_1={"/images/workers/5.jpg"}
            image_2={"/images/workers/2.jpg"}
            image_3={"/images/workers/4.jpg"}
          />
        </div>
        <div className="max-w-7xl mx-auto px- sm:px-0 lg:px-0 pt-0 ">
          <div className="flex flex-col min-h-[100dvh] ">
            <section className="w-full py-5 md:py-10 lg:py-15 bg-muted">
              <div className="container px-4 md:px-6">
                <div className="grid gap-10 sm:px-10 md:gap-16 lg:grid-cols-2 lg:gap-20">
                  <div>
                    <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Our Mission
                    </div>

                    <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      To be a prime catalyst for the up-skilling, licensing and
                      empowerment of artisans to enhance job creation, economic
                      growth and quality service delivery.
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                      Our Vision
                    </div>

                    <p className="max-w-[600px]  text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Empowering artisans through tech-enabled skills training,
                      licensing, access to essential toolkits, and promoting
                      industry-standard excellence.
                    </p>
                  </div>
                  <div>
                    <div className="inline-block rounded-lg bg-muted px-3 py-3 text-3xl">
                      <span className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Objectives
                      </span>
                    </div>

                    <ul className="grid gap-4 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <p>
                          To identify, register and categorize artisans across
                          the different sectors of the economy.
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <p>
                          To provide comprehensive Industry 4.0 compliant and
                          certified training programs, including health and
                          safety programmes for various trades such as
                          carpentry, masonry, plumbing, electrical work, and
                          many more.
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <p>
                          To enable artisans access essential tools, equipment
                          and funds to expand their trades.
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <p>
                          To ensure Nigerian artisans are certified, licensed
                          and operate using standardized methods and practices.
                        </p>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-primary" />
                        <p>
                          To enhance employment opportunities for artisans in
                          local and international markets.
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex w-1/2 flex-wrap">
                      <div className="w-1/2 p-1 md:p-2">
                        <img
                          alt="Acme Inc. Logo"
                          className="block h-full w-full rounded-lg object-cover object-center"
                          src="/carpenter copy.jpeg"
                        />
                      </div>
                      <div className="w-1/2 p-1 md:p-2">
                        <img
                          alt="Acme Inc. Logo"
                          className="block h-full w-full rounded-lg object-cover object-center"
                          src="/hairdresser copy.jpeg"
                        />
                      </div>
                      <div className="w-full p-1 md:p-2">
                        <img
                          alt="gallery"
                          className="block h-full w-full rounded-lg object-cover object-center"
                          src="/plumber copy.jpeg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="w-full py-12 md:py-15 lg:py-22">
              <div className="container grid items-center gap-6 px-6 md:px-6 lg:grid-cols-2 lg:gap-10">
                <div className="flex col-span-2">
                  <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-8">
                    <div className="-m-1 flex flex-wrap md:-m-2">
                      <div className="flex w-1/2 flex-wrap">
                        <div className="w-1/2 p-1 md:p-2">
                          <img
                            alt="Acme Inc. Logo"
                            className="block h-full w-full rounded-lg object-cover object-center"
                            src="/carpenter copy.jpeg"
                          />
                        </div>
                        <div className="w-1/2 p-1 md:p-2">
                          <img
                            alt="Acme Inc. Logo"
                            className="block h-full w-full rounded-lg object-cover object-center"
                            src="/hairdresser copy.jpeg"
                          />
                        </div>
                        <div className="w-full p-1 md:p-2">
                          <img
                            alt="gallery"
                            className="block h-full w-full rounded-lg object-cover object-center"
                            src="/plumber copy.jpeg"
                          />
                        </div>
                      </div>
                      <div className="flex w-1/2 flex-wrap">
                        <div className="w-full p-1 md:p-2">
                          <img
                            alt="gallery"
                            className="block h-full w-full rounded-lg object-cover object-center"
                            src="/welder copy.jpeg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const About = () => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Full text for the first paragraph
//   const fullText = `Nigeria has a fast-growing population of over 220 million people, and the burden of unemployment has been prevalent over time. The country’s labour force was predicted to increase to over 67 million in 2022 and there is a need to ensure that employment is readily available as more citizens enter the job market. President Bola Ahmed Tinubu, GCFR as part of the Renewed Hope Agenda of his administration, is committed to creating gainful employment for the teeming youth. President Tinubu’s vision for economic development and poverty reduction in Nigeria includes supporting artisans and promoting industrial development through a strong workforce of skilled individuals. Many employment initiatives target the white-collar industry but the former Honourable Minister of Industry, Trade and Investment, Dr. Doris Uzoka-Anite, launched a massive campaign that targets the blue-collar industry to ensure inclusiveness in job creation drive of the Federal Government. This programme, which is known as the Skill-UP Artisans (SUPA), will impact on 10 million artisans over a 2 year period. The programme is a joint initiative of the Federal Government and the Industrial Training Fund (ITF) and will be coordinated by the later. SUPA is in line with global employment trends, which have shifted as a result of the way technology has changed the face of many industries. The preference for white-collar jobs has resulted in a scarcity of qualified Nigerian artisans. SUPA seeks to reverse this trend.`;

//   // Shortened text preview for the "Show More" state
//   const previewText = fullText.slice(0, 300); // Display the first 300 characters initially

//   return (
//     <section className="w-full py-12 md:py-15 lg:py-22">
//       <div className="container grid items-center gap-6 px-6 md:px-6 lg:grid-cols-2 lg:gap-10">
//         <div className="space-y-4">
//           <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
//             Skill-<span className="text-emerald-900">Up</span> Artisans (SUPA)
//           </h1>

//           <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-justify">
//             {isExpanded ? fullText : previewText}
//           </p>

//           <button
//             className="text-blue-500 mt-2"
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             {isExpanded ? 'Show Less' : 'Show More'}
//           </button>

//           {/* <Link
//             to="#"
//             className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//           >
//             Learn More
//           </Link> */}
//         </div>

//         <div className="flex justify-center">
//           <p className="text-justify max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
//             SUPA is in line with global employment trends, which have shifted as a result of the way technology has changed the face of many industries. The preference for white-collar jobs has resulted in a scarcity of qualified Nigerian artisans. SUPA seeks to reverse this trend. The absence of a coordinated effort to certify and license artisans has further deepened the skills gap and also brought to light the need to upscale unlicensed and uncertified artisans. The Federal Government is committed to promoting skills development for artisans and fostering a society based on shared prosperity, tolerance, compassion, and equal treatment of all citizens. The Federal Government is also determined to tackle the skills deficiency among artisans and standardize artisanal practice in the country. SUPA is a comprehensive initiative aimed at aiding quality service delivery through the certification and licensing of artisans to promote the growth of small and medium-sized enterprises. The programme ensures the availability of a skilled workforce for domestic industries, thereby reducing labour import dependency. This programme is targeted at empowering 10 million hard-working Nigerians in two years. This initiative reflects the government’s commitment towards promoting economic development and improving the standard of living for its citizens across all industries.
//           </p>
//         </div>

//         <div className="flex col-span-2">
//           <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-8">
//             <div className="-m-1 flex flex-wrap md:-m-2">
//               <div className="flex w-1/2 flex-wrap">
//                 <div className="w-1/2 p-1 md:p-2">
//                   <img
//                     alt="Carpenter"
//                     className="block h-full w-full rounded-lg object-cover object-center"
//                     src="/carpenter copy.jpeg"
//                   />
//                 </div>
//                 <div className="w-1/2 p-1 md:p-2">
//                   <img
//                     alt="Hairdresser"
//                     className="block h-full w-full rounded-lg object-cover object-center"
//                     src="/hairdresser copy.jpeg"
//                   />
//                 </div>
//                 <div className="w-full p-1 md:p-2">
//                   <img
//                     alt="Plumber"
//                     className="block h-full w-full rounded-lg object-cover object-center"
//                     src="/plumber copy.jpeg"
//                   />
//                 </div>
//               </div>
//               <div className="flex w-1/2 flex-wrap">
//                 <div className="w-full p-1 md:p-2">
//                   <img
//                     alt="Welder"
//                     className="block h-full w-full rounded-lg object-cover object-center"
//                     src="/welder copy.jpeg"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>

//   );
// };

// export default About;
