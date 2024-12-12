import React from 'react';
import PageLayout from "../../components/layout/pageLayout";
import { DotPattern } from "../../components/ui/dot-pattern";
import { cn } from "../../lib/utils";
import { ContactForm } from './components/ContactForm';
import { ContactInfo } from './components/ContactInfo';
import NigerianMap from '../../components/NigerianMap';

function ContactUs() {
  return (

    <PageLayout>

    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="h-56 bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80")'
        }}
      >

        <div className="h-full w-full bg-slate-900 bg-opacity-100 flex items-center justify-center pt-16 pl-80">
        <DotPattern
                    width={10}
                    height={10}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn("fill-neutral-400/40 opacity-15")}
                  />
          <h1 className="text-4xl font-bold text-emerald-700 text-center">Contact Us</h1>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ContactInfo />
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <ContactForm />
          </div>
        </div>
      </div>

      <NigerianMap/>
    </div>
    </PageLayout>
  );
}

export default ContactUs;