import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import InteractiveMap from '@/components/InteractiveMap';
import EventCard from '@/components/EventCard';
import ImageLightbox from '@/components/ImageLightbox';
import CategoryFilter from '@/components/CategoryFilter';
import CalendarView from '@/components/CalendarView';
import { events } from '@/components/TimelineData';
import { Button } from '@/components/ui/button';

export default function Index() {
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentEventImages, setCurrentEventImages] = useState<string[]>([]);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredEvents = selectedCategory
    ? selectedSubcategory
      ? events.filter(e => e.category === selectedCategory && e.subcategory === selectedSubcategory)
      : events.filter(e => e.category === selectedCategory)
    : events.filter(e => e.category !== 'weapons');

  const handleMarkerClick = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setViewMode('timeline');
      setSelectedCategory('battle');
      setSelectedSubcategory(null);
      
      setTimeout(() => {
        setHighlightedEventId(eventId);
        eventRefs.current[eventId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => setHighlightedEventId(null), 3000);
      }, 100);
    }
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
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-0">
        <div className="container mx-auto text-center py-0 my-[34px]">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary text-center">Хроники СВО</h1>
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
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Icon name={viewMode === 'timeline' ? 'Calendar' : 'CalendarDays'} size={32} className="text-primary" />
              <h2 className="text-3xl font-bold">
                {viewMode === 'timeline' ? 'Хронология событий' : 'События по месяцам'}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'outline'}
                onClick={() => setViewMode('timeline')}
                className="gap-2"
              >
                <Icon name="List" size={18} />
                Хронология
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className="gap-2"
              >
                <Icon name="CalendarDays" size={18} />
                Календарь
              </Button>
            </div>
          </div>

          {viewMode === 'timeline' ? (
            <>
              <CategoryFilter 
                selectedCategory={selectedCategory}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setSelectedSubcategory(null);
                }}
                onSubcategoryChange={setSelectedSubcategory}
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
            </>
          ) : (
            <CalendarView />
          )}
        </section>
      </div>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="outline"
              asChild
              className="gap-2"
            >
              <a href="/feedback">
                <Icon name="MessageCircle" size={18} />
                Оставить отзыв
              </a>
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Информационный портал о ходе специальной военной операции
            </p>
          </div>
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