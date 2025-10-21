import { useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface ImageLightboxProps {
  image: string;
  currentIndex: number;
  allImages: string[];
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export default function ImageLightbox({
  image,
  currentIndex,
  allImages,
  onClose,
  onPrevious,
  onNext,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && currentIndex < allImages.length - 1) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allImages.length, onClose, onPrevious, onNext]);

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors z-10"
        onClick={onClose}
      >
        <Icon name="X" size={24} />
      </button>

      {allImages.length > 1 && currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <Icon name="ChevronLeft" size={32} />
        </button>
      )}

      {allImages.length > 1 && currentIndex < allImages.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-colors z-10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <Icon name="ChevronRight" size={32} />
        </button>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
        {currentIndex + 1} / {allImages.length}
      </div>

      <img
        src={image}
        alt="Полноэкранное изображение"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}