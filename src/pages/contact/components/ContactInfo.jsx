import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
      <p className="text-gray-600 max-w-md">
        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="text-gray-600">Industrial Training Fund – Along Miango Road, P.M.B 2199 Jos, Plateau State, Nigeria. 930272</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-blue-600" />
          <span className="text-gray-600">(555) 123-4567</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="text-gray-600">itfhq@itf.gov.ng</span>
        </div>
      </div>
    </div>
  );
}