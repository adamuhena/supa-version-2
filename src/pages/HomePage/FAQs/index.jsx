import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { BlurFade } from "../../../components/ui/blur-fade";

const questions = [
  {
    question: "What is Skill-Up Artisans (SUPA)?",
    answer:
      "Skill-Up Artisans (SUPA) is an initiative that empowers artisans with tech-driven training, official licensing, access to essential toolkits, and promotes industry standards to elevate skills, enhance craftsmanship, and drive professional excellence across sectors.",
  },
  {
    question: "What kind of training does SUPA offer?",
    answer:
      "SUPA offers tech-driven training that is designed to enhance the skills and craftsmanship of artisans. The training is tailored to meet the needs of different sectors and industries.",
  },
  {
    question: "How do I become a licensed artisan through SUPA?",
    answer:
      "To become a licensed artisan through SUPA, you will need to complete our training program and meet the required standards. You will then be issued with an official license that recognizes your skills and expertise.",
  },
  {
    question: "What kind of toolkits does SUPA provide access to?",
    answer:
      "SUPA provides access to essential toolkits that are relevant to different sectors and industries. These toolkits are designed to help artisans enhance their productivity and efficiency.",
  },
  {
    question: "How does SUPA promote industry standards?",
    answer:
      "SUPA promotes industry standards by providing training and licensing programs that are aligned with industry requirements. We also work with industry partners to ensure that our programs meet the needs of different sectors and industries.",
  },
];

function FAQs() {
  return (
    <section className="w-full py-[100px]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-[64px] lg:flex-row">
        {/* Text Section */}
        <div className="flex w-full max-w-[380px] flex-col gap-[20px] px-4 sm:px-6 lg:max-w-[500px]">
          <BlurFade delay={0.25} inView>
            <h1 className="text-[36px] font-[500] leading-[44px] text-[#1D2849] text-left sm:text-[32px] sm:leading-[40px]">
              Some of the things you may have questions about
            </h1>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <p className="text-[18px] leading-[27px] text-[#808DB3] sm:text-[16px] sm:leading-[24px]">
              We have answered them so you don’t have to ask
            </p>
          </BlurFade>
        </div>

        {/* Accordion Section */}
        <div className="w-full flex-1 px-4 sm:px-6 lg:px-0">
          <Accordion type="single" collapsible className="w-full">
            {questions.map((item, index) => {
              return (
                <BlurFade delay={0.25} inView key={`${index}`}>
                  <AccordionItem
                    value={`item-${index + 1}`}
                    className="mb-[20px] rounded-lg border border-[#D5D9E7] px-[24px] font-onest"
                  >
                    <AccordionTrigger
                      rightIcon={
                        <>
                          <PlusCircledIcon className="closedactfaq h-[24px] w-[24px] shrink-0 text-[#1D2849] transition-transform duration-200 dark:text-neutral-400" />
                          <MinusCircledIcon className="openactfaq hidden h-[24px] w-[24px] shrink-0 text-[#1D2849] transition-transform duration-200 dark:text-neutral-400" />
                        </>
                      }
                      className="text-left font-onest text-[18px] font-[600] text-[#1D2849] max-sm:text-left [&[data-state=open]>.closedactfaq]:hidden [&[data-state=open] >.openactfaq]:flex"
                    >
                      {item?.question}
                    </AccordionTrigger>
                    <AccordionContent className="cht-text-16 font-onest text-[#808DB3] text-left">
                      {item?.answer}
                    </AccordionContent>
                  </AccordionItem>
                </BlurFade>
              );
            })}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQs;
