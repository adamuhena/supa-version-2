import PageLayout from "@/components/layout/pageLayout";
import React from "react";
import { DotPattern } from "../../components/ui/dot-pattern";
import { cn } from "../../lib/utils";

export default function ComingSoon() {
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
          <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
            Coming Soon
          </div>
        </section>
        <div className="max-w-7xl mx-auto px- sm:px-0 lg:px-0 pt-0">
          <div className="flex flex-col min-h-[100dvh] items-center">
            <div className="flex flex-col gap-4 justify-center items-center p-4 pt-10">
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem]">
                Stay Tuned!
              </h1>
              <p className="max-w-[1000px] text-center text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                We are working hard to bring you new and exciting content. Please check back soon for updates.
              </p>
              <div className="mt-8 w-full max-w-3xl rounded-lg shadow-lg">
                <iframe
                  width="100%"
                  height="315"
                  src="https://www.youtube.com/embed/aCdnhD10bBg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}