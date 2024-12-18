import React from 'react';
import PageLayout from "../../components/layout/pageLayout";
import { DotPattern } from "../../components/ui/dot-pattern";
import { cn } from "../../lib/utils";
import { ContactForm } from './components/ContactForm';
import { ContactInfo } from './components/ContactInfo';
import { NewContact } from "./components/newContact"

function ContactUs() {
  return (

    <PageLayout>

      <div>
        <section className="bg-slate-900 pt-32 pb-10">
          <DotPattern
            width={10}
            height={10}
            cx={1}
            cy={1}
            cr={1}
            className={cn("fill-neutral-400/40 opacity-15")}
          />
          <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
            Contact Us
          </div>
        </section>


        {/* Contact Section */}
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <NewContact />
        </div>



      </div>
    </PageLayout>
  );
}

export default ContactUs;