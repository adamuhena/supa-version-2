import React, { useState } from "react";
import PageLayout from "@/components/layout/pageLayout"
import { SVGProps } from "react"
import { Link } from "react-router-dom"
import HeaderThreeImages from "../../components/HeaderThreeImages/HeaderThreeImages"
import { DotPattern } from "../../components/ui/dot-pattern";
import { cn } from "../../lib/utils";

export default function About() {
    
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded((prev) => !prev);
  };

  
    return (
      <PageLayout>
        <div className="bg-gradient-to-t from-stone-100 to-current-black">
        <DotPattern
                    width={10}
                    height={10}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn("fill-neutral-400/40 opacity-15")}
                  />
        <section className="bg-slate-900 pt-32 pb-10">
        
      
        <div className="inline-block rounded-lg bg-muted pl-80 pr-5 py-5 text-5xl font-bold text-emerald-600">About SUPA</div>
    </section>
        <div className="max-w-7xl mx-auto px- sm:px-0 lg:px-0 pt-0 ">
        <div className="flex flex-col min-h-[100dvh] ">
        <div className="flex flex-row  justify-center ">
                  <div className="flex flex-col gap-4 justify-center items-center p-4 pt-10">
                    <h1 className="lg:leading-tightertext-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem]">
                      Skill-<span className="text-emerald-500">Up</span> Artisans
                      (SUPA)
                    </h1>
                    <p className="max-w-[1000px] text-justify text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                      Nigeria has a fast-growing population of over 220 million
                      people, and the burden of unemployment has been prevalent
                      over time. The country’s labour force was predicted to
                      increase to over 67 million in 2022, and there is a need
                      to ensure that employment is readily available as more
                      citizens enter the job market.
                    </p>
                    {!isExpanded && (
                      <Link
                        to="#"
                        onClick={toggleText}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                      >
                        Learn More
                      </Link>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="flex flex-col gap-4 p-4 pt-16 items-center justify-center">
                    <p className="max-w-[700px] text-justify text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                      President Bola Ahmed Tinubu, GCFR as part of the Renewed Hope Agenda of his administration, is committed to creating gainful employment for the teeming youth. President Tinubu’s vision for economic development and poverty reduction in Nigeria includes supporting artisans and promoting industrial development through a strong workforce of skilled individuals.
                    </p>
                    <Link
                      to="#"
                      onClick={toggleText}
                      className="inline-flex items-center justify-center rounded-md bg-primary w-32 px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
                    >
                      Show Less
                    </Link>
                  </div>
                  
                  )}
                </div>
            <section className="w-full py-12 md:py-15 lg:py-22">
                <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
                

          
          

                    <div className="flex col-span-2">

                        <div className="container mx-auto px-5 py-2 lg:px-32 lg:pt-8">
                            <div className="-m-1 flex flex-wrap md:-m-2">
                                <div className="flex w-1/2 flex-wrap">
                                    <div className="w-1/2 p-1 md:p-2">
                                        <img
                                            alt="Acme Inc. Logo"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/carpenter copy.jpeg" />
                                    </div>
                                    <div className="w-1/2 p-1 md:p-2">
                                        <img
                                            alt="Acme Inc. Logo"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/hairdresser copy.jpeg" />
                                    </div>
                                    <div className="w-full p-1 md:p-2">
                                        <img
                                            alt="gallery"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/plumber copy.jpeg" />
                                    </div>
                                </div>
                                <div className="flex w-1/2 flex-wrap">
                                    <div className="w-full p-1 md:p-2">
                                        <img
                                            alt="gallery"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/welder copy.jpeg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            
        
            <section className="w-full py-5 md:py-10 lg:py-15 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-10 sm:px-10 md:gap-16 lg:grid-cols-2 lg:gap-20">
                        <div>
                            <div className="inline-block rounded-lg bg-muted px-3 py-3 text-3xl">Our Mission</div>
                            <h2 className="text-2 font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Greater opportunities towards Capacity Development
                            </h2>
                            <p className="max-w-[600px]  pt-4 text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            To be a prime catalyst for the up-skilling, licensing and
                            empowerment of artisans to enhance job creation, economic
                            growth and quality service delivery.
                            </p>
                        </div>
                        <div>
                            <div className="inline-block rounded-lg bg-muted px-3 py-3 text-3xl">Our Vision</div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Integrity, Innovation, and Impact
                            </h2>
                            <p className="max-w-[600px]  pt-4 text-justify text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Empowering artisans through tech-enabled skills training,
                            licensing, access to essential toolkits, and promoting
                            industry-standard excellence.
                            </p>
                        </div>
                        <div>
                            <div className="inline-block rounded-lg bg-muted px-3 py-3 text-3xl">Objectives</div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Driving Success for Our Clients
                            </h2>
                            <ul className="grid gap-4 pt-4 text-justify text-muted-foreground">
                                <li className="flex  items-center gap-2">
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                    <p >To identify, register and categorise artisans across the different sectors of the economy.</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                    <p>To provide comprehensive Industry 4.0 compliant and
                                        certified training programs, including health and
                                        safety programmes for various trades such as
                                        carpentry, masonry, plumbing, electrical work, and
                                        many more.</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                    <p>To enable artisans access essential tools, equipment and funds to expand their trades.</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                    <p>To ensure Nigerian artisans are certified, licensed and operate using standardised methods and practices.</p>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon className="h-5 w-5 text-primary" />
                                    <p>To enhance employment opportunities for artisans in local and international markets.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="flex justify-center">
                        <div className="flex w-1/2 flex-wrap">
                                    <div className="w-1/2 p-1 md:p-2">
                                        <img
                                            alt="Acme Inc. Logo"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/carpenter copy.jpeg" />
                                    </div>
                                    <div className="w-1/2 p-1 md:p-2">
                                        <img
                                            alt="Acme Inc. Logo"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/hairdresser copy.jpeg" />
                                    </div>
                                    <div className="w-full p-1 md:p-2">
                                        <img
                                            alt="gallery"
                                            className="block h-full w-full rounded-lg object-cover object-center"
                                            src="/plumber copy.jpeg" />
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
        
        </div>
        <HeaderThreeImages
          image_1={"/images/workers/5.jpg"}
          image_2={"/images/workers/2.jpg"}
          image_3={"/images/workers/4.jpg"}
        />
        </div>
        </PageLayout>
    )
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
    )
}