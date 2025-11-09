import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  coverImage: string;
}

export default function ImageGallery({ images, coverImage }: ImageGalleryProps) {
  const allImages = [coverImage, ...images];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <div className="relative">
        <img
          src={allImages[selectedIndex]}
          alt="Tour"
          className="w-full h-96 object-cover rounded-lg cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          {allImages.slice(0, 4).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full h-20 object-cover rounded cursor-pointer border-2 transition-colors ${
                index === selectedIndex ? 'border-accent' : 'border-transparent'
              }`}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-accent transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={allImages[selectedIndex]}
            alt="Tour"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

