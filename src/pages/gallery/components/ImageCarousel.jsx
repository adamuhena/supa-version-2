// components/ImageCarousel.jsx
import { useState, useEffect } from 'react';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Auto-rotate through images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  // Handle manual navigation
  const navigate = (e, index) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p>No images available</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Images */}
      {images.map((image, index) => (
        <div 
          key={index}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        >
          <img 
            src={image.src} 
            alt={image.alt || `Image ${index + 1}`} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <div className="bg-black bg-opacity-50 rounded-full px-2 py-1 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                onClick={(e) => navigate(e, index)}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Image count indicator */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs rounded px-2 py-1">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
