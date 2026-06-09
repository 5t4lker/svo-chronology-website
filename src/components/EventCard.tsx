import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { TimelineEvent, categoryConfig } from './TimelineData';

interface EventCardProps {
  event: TimelineEvent;
  isHighlighted: boolean;
  onImageClick: (image: string, index: number, allImages: string[]) => void;
}

export default function EventCard({ event, isHighlighted, onImageClick }: EventCardProps) {
  return (
    <div className={`transition-all duration-300 hover:scale-[1.02] hover:z-10 relative ${isHighlighted ? 'ring-4 ring-primary rounded-lg' : ''}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-2xl hover:ring-2 hover:ring-primary">
        {event.preview && (
          <div className="aspect-video">
            <img
              src={event.preview}
              alt={event.title}
              className="w-full h-full cursor-pointer object-cover"
              onClick={() => {
                const previewIndex = event.images.indexOf(event.preview!);
                onImageClick(event.preview!, previewIndex >= 0 ? previewIndex : 0, event.images);
              }}
            />
          </div>
        )}
        <CardHeader className="pb-2 px-4 pt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`${categoryConfig[event.category].color} text-white shrink-0 text-xs`}>
              <Icon name={categoryConfig[event.category].icon as string} size={12} className="mr-1" />
              {categoryConfig[event.category].label}
            </Badge>
            <CardDescription className="text-xs">{event.date}</CardDescription>
          </div>
          <CardTitle className="text-xl font-bold leading-snug mt-1">{event.title}</CardTitle>
          {event.subcategory && (
            <CardDescription className="text-xs italic">{event.subcategory}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed text-justify">{event.description}</p>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex-1 h-10 text-sm">
                  <Icon name="Book" size={16} className="mr-2" />
                  Подробнее
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl leading-snug pr-10">{event.title}</DialogTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="secondary" className={`${categoryConfig[event.category].color} text-white w-fit`}>
                      {categoryConfig[event.category].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">Описание</h3>
                    <div className="text-muted-foreground leading-relaxed space-y-4 text-sm sm:text-base">
                      {(() => {
                        let imgIdx = 0;
                        return event.details.split('\n\n').map((paragraph, pIdx) => {
                          const img = event.images && event.images[imgIdx];
                          const currentImgIdx = imgIdx;
                          if (img) imgIdx++;
                          return (
                            <div key={pIdx}>
                              <p className="whitespace-pre-line leading-7 text-justify">{paragraph}</p>
                              {img && (
                                <img
                                  src={img}
                                  alt={`${event.title} - изображение ${currentImgIdx + 1}`}
                                  className="rounded-lg w-full mt-4 cursor-pointer hover:opacity-80 transition-opacity block h-40 sm:h-auto object-cover"
                                  onClick={() => onImageClick(img, currentImgIdx, event.images)}
                                />
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  <Tabs defaultValue="images" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="images" className="flex-1 gap-2">
                        <Icon name="Image" size={16} />
                        Фотографии
                      </TabsTrigger>
                      <TabsTrigger value="videos" className="flex-1 gap-2">
                        <Icon name="Video" size={16} />
                        Видео
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="images" className="space-y-4 mt-4">
                      {event.images && event.images.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {event.images.map((img, idx) => (
                            <div key={idx} className="aspect-video">
                              <img
                                src={img}
                                alt={`${event.title} - изображение ${idx + 1}`}
                                className="rounded-lg w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                  onImageClick(img, idx, event.images);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Icon name="Image" size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Фотографии будут добавлены позже</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="videos" className="mt-4">
                      {event.videos && event.videos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {event.videos.map((video, idx) => (
                            <div key={idx} className="aspect-video rounded-lg overflow-hidden">
                              <iframe
                                src={video}
                                title={`${event.title} - видео ${idx + 1}`}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Icon name="Video" size={48} className="mx-auto mb-4 opacity-50" />
                          <p>Видеоматериалы будут добавлены позже</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogClose asChild>
                  <Button variant="outline" className="w-full sm:hidden mt-2">
                    <Icon name="X" size={16} className="mr-2" />
                    Закрыть
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}