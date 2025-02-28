// components/Hero.jsx
import { useState } from 'react';

const Hero = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative h-96 bg-black flex items-center justify-center overflow-hidden">
      {!isPlaying ? (
        <div className="relative w-full h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{ backgroundImage: `url(https://img.youtube.com/vi/${video.youtubeId}/0.jpg)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-4">
            <h2 className="text-4xl font-bold mb-6">{video.title}</h2>
            <p className="text-xl mb-8 max-w-2xl">Explore our curated collection of stunning images and videos</p>
            <button 
              onClick={handlePlayVideo}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Watch SUPA Video
            </button>
          </div>
        </div>
      ) : (
        <iframe 
          className="absolute w-full h-full top-0 left-0"
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=0`}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </section>
  );
};

export default Hero;