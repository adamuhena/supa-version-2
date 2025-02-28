// components/Gallery.jsx
import { useState } from 'react';
import ImageCarousel from './ImageCarousel.jsx';

const Gallery = ({ images, videos }) => {
  const [activeTab, setActiveTab] = useState('images');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openLightbox = (media, index = 0) => {
    setSelectedMedia(media);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setCurrentImageIndex(0);
  };

  const navigateImage = (direction) => {
    if (selectedMedia?.type !== 'image' || !selectedMedia.images) return;
    
    const imagesCount = selectedMedia.images.length;
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Media Gallery</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Browse through our collection of high-quality images and videos</p>
        
        <div className="flex justify-center mt-6">
          <button 
            className={`px-6 py-2 mx-2 rounded-lg font-medium ${activeTab === 'images' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('images')}
          >
            Images
          </button>
          <button 
            className={`px-6 py-2 mx-2 rounded-lg font-medium ${activeTab === 'videos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleTabChange('videos')}
          >
            Videos
          </button>
        </div>
      </div>

      {activeTab === 'images' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((imageGroup) => (
            <div 
              key={imageGroup.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => openLightbox({...imageGroup, type: 'image'})}
            >
              <div className="h-64 relative">
                <ImageCarousel images={imageGroup.images} />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{imageGroup.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{imageGroup.images.length} images</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-105"
              onClick={() => openLightbox({...video, type: 'video'})}
            >
              <div className="relative">
                <img src={video.thumbnailSrc} alt={video.title} className="w-full h-64 object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-600 text-white rounded-full p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeLightbox}>
          <div className="relative max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white text-2xl"
              onClick={closeLightbox}
            >
              ✕
            </button>
            
            {selectedMedia.type === 'image' ? (
              <div className="relative">
                <img 
                  src={selectedMedia.images[currentImageIndex].src} 
                  alt={selectedMedia.images[currentImageIndex].alt} 
                  className="w-full h-auto max-h-screen object-contain" 
                />
                
                {selectedMedia.images.length > 1 && (
                  <>
                    <button 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                      <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full">
                        <p className="text-white text-sm">
                          {currentImageIndex + 1} / {selectedMedia.images.length}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedMedia.youtubeId}?autoplay=1`}
                  title={selectedMedia.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
            
            <div className="bg-white p-4 mt-4 rounded">
              <h3 className="text-xl font-bold">{selectedMedia.title}</h3>
              {selectedMedia.type === 'image' && selectedMedia.images[currentImageIndex].description && (
                <p className="text-gray-700 mt-2">{selectedMedia.images[currentImageIndex].description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;