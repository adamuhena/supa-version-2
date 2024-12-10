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
    <section className="w-full py-8 md:py-12 lg:py-[100px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-10 lg:gap-[64px]">
          {/* Text Section */}
          <div className="w-full max-w-full lg:max-w-[380px] xl:max-w-[500px] text-center  lg:text-center mb-6 lg:mb-0">
            <BlurFade delay={0.25} inView>
              <h1 className="text-2xl sm:text-3xl md:text-[36px] font-medium leading-tight text-[#1D2849] mb-4">
                FAQ
              </h1>
            </BlurFade>
            
            <BlurFade delay={0.25} inView>
              <p className="text-base sm:text-lg md:text-xl text-[#040404] mb-2">
                Some of the things you may have questions about
              </p>
              <p className="text-sm sm:text-base text-[#808DB3]">
                We have answered them so you don't have to ask
              </p>
            </BlurFade>
          </div>

          {/* Accordion Section */}
          <div className="w-full lg:flex-1">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {questions.map((item, index) => (
                <BlurFade key={`faq-${index}`} delay={0.25} inView>
                  <AccordionItem
                    value={`item-${index + 1}`}
                    className="rounded-lg border border-[#D5D9E7] overflow-hidden"
                  >
                    <AccordionTrigger
                      rightIcon={
                        <>
                          <PlusCircledIcon className="closedactfaq h-6 w-6 text-[#1D2849] group-data-[state=open]:hidden" />
                          <MinusCircledIcon className="openactfaq h-6 w-6 text-[#1D2849] hidden group-data-[state=open]:block" />
                        </>
                      }
                      className="px-4 sm:px-6 py-4 text-left text-sm sm:text-base md:text-lg font-semibold text-[#1D2849] hover:bg-gray-50 transition-colors"
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 py-4 text-sm sm:text-base text-[#808DB3]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                </BlurFade>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQs;