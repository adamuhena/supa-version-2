// App.jsx
import { useState } from 'react';
import './App.css';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import PageLayout from '@/components/layout/pageLayout';
import {DotPattern} from '@/components/ui/dot-pattern';
import {cn} from '@/lib/utils';

function GalleryPage() {
  // Sample data for images and videos
  const imageData = [
    { 
      id: 1, 
      title: 'Graduation Ceremony',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662300/PHOTO-2024-11-12-16-27-35_5_izm8ql.jpg', alt: 'SUPA 1', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_7_ulukzl.jpg', alt: 'SUPA 2', description: '' },
      ]
    },
    { 
      id: 2, 
      title: 'SUPA Inauguratal Meeting',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740658005/img1_m4xh0r.jpg', alt: 'SUPA 1' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740658005/img4_f8nhmv.jpg', alt: 'SUPA 2', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740658005/img2_abj0rw.jpg', alt: 'SUPA 3', description: '' }
      ]
    },
    { 
      id: 3, 
      title: 'SUPA Trainees',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662300/PHOTO-2024-11-12-16-27-35_2_rsjgdx.jpg', alt: 'Abstract painting 1', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662300/PHOTO-2024-11-12-16-27-34_syunnr.jpg', alt: 'Abstract painting 2', description: '' }
      ]
    },
    { 
      id: 4, 
      title: 'SUPA Trainees',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_9_iwkw0i.jpg', alt: 'Portrait 1', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_3_l5oseo.jpg', alt: 'Portrait 2', description:'' },
      ]
    },
    { 
      id: 5, 
      title: 'SUPA Trainees',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_10_juxcqa.jpg', alt: '', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_10_juxcqa.jpg', alt: '', description: '' }
      ]
    },
    { 
      id: 6, 
      title: 'SUPA Trainees',
      images: [
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662300/PHOTO-2024-11-12-16-27-35_8_auacyq.jpg', alt: 'Lion', description: '' },
        { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662299/PHOTO-2024-11-12-16-27-35_10_juxcqa.jpg', alt: 'Dolphin', description: '' }
      ]
    },
    // { 
    //   id: 6, 
    //   title: 'Supa',
    //   images: [
    //     { src: 'https://res.cloudinary.com/dwelaq1lp/image/upload/v1740662300/PHOTO-2024-11-12-16-27-35_8_auacyq.jpg', alt: 'SUPA', description: 'Women' },
    //   ]
    // },
  ];


  const videoData = [
    { 
      id: 1, 
      thumbnailSrc: 'https://img.youtube.com/vi/aCdnhD10bBg/0.jpg', 
      youtubeId: 'aCdnhD10bBg', 
      title: 'SUPA Video'
    },
    { 
      id: 2, 
      thumbnailSrc: 'https://img.youtube.com/vi/VqWEFBMHnNA/0.jpg', 
      youtubeId: 'VqWEFBMHnNA',  
      title: 'DG ITF on Dr-Fish Radio'
    },
    { 
      id: 3, 
      thumbnailSrc: 'https://img.youtube.com/vi/dVvioB6xSxA/0.jpg', 
      youtubeId: 'dVvioB6xSxA', 
      title: 'Short Film'
    },
    // { 
    //   id: 4, 
    //   thumbnailSrc: 'https://img.youtube.com/vi/dVvioB6xSxA/0.jpg', 
    //   youtubeId: 'dVvioB6xSxA',  
    //   title: 'Documentary Clip'
    // },
  ];

  // Hero video details
  const heroVideo = {
    youtubeId: 'aCdnhD10bBg',
    // 'HXV3zeQKqGY',
    title: 'SUPA Video'
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
        <div className="inline-block rounded-lg bg-muted px-6 md:px-16 lg:px-32 xl:px-40 py-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-emerald-600">
          SUPA Media
        </div>
      </section>

   


      <div className="max-w-7xl mx-auto px- sm:px-0 lg:px-0 pt-0 ">
        <div className="flex flex-col min-h-[100dvh] ">
        
    <div className="app">
      {/* <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Gallery Showcase</h1>
        </div>
      </header> */}

      <main>
        <Hero video={heroVideo} />
        <Gallery images={imageData} videos={videoData} />
      </main>

      {/* <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Gallery Showcase. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
    </div>
    </div>
    </div>
    </PageLayout>
  );
}

export default GalleryPage;
