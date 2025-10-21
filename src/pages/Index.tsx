import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import InteractiveMap from '@/components/InteractiveMap';
import EventCard from '@/components/EventCard';
import ImageLightbox from '@/components/ImageLightbox';
import CategoryFilter from '@/components/CategoryFilter';
import { events } from '@/components/TimelineData';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentEventImages, setCurrentEventImages] = useState<string[]>([]);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredEvents = selectedCategory
    ? events.filter(e => e.category === selectedCategory)
    : events.filter(e => e.category !== 'weapons');

  const handleMarkerClick = (eventId: string) => {
    setHighlightedEventId(eventId);
    eventRefs.current[eventId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => setHighlightedEventId(null), 3000);
  };

  const handleImageClick = (image: string, index: number, allImages: string[]) => {
    setFullscreenImage(image);
    setCurrentImageIndex(index);
    setCurrentEventImages(allImages);
  };

  const handlePreviousImage = () => {
    const newIndex = currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setFullscreenImage(currentEventImages[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setFullscreenImage(currentEventImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Хронология СВО
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Информационная база ключевых событий специальной военной операции
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Map" size={32} className="text-primary" />
            <h2 className="text-3xl font-bold">Интерактивная карта</h2>
          </div>
          <InteractiveMap onMarkerClick={handleMarkerClick} selectedEventId={selectedEvent} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Calendar" size={32} className="text-primary" />
            <h2 className="text-3xl font-bold">Хронология событий</h2>
          </div>

          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                ref={(el) => (eventRefs.current[event.id] = el)}
              >
                <EventCard
                  event={event}
                  isHighlighted={highlightedEventId === event.id}
                  onImageClick={handleImageClick}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Информационный портал о ходе специальной военной операции
          </p>
        </div>
      </footer>

      {fullscreenImage && (
        <ImageLightbox
          image={fullscreenImage}
          currentIndex={currentImageIndex}
          allImages={currentEventImages}
          onClose={() => setFullscreenImage(null)}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </div>
  );
}
