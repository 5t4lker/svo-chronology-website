import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    <div className={`transition-all ${isHighlighted ? 'ring-4 ring-primary rounded-lg' : ''}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
              <CardDescription className="text-sm">{event.date}</CardDescription>
              {event.subcategory && (
                <CardDescription className="text-xs mt-1 italic">
                  {event.subcategory}
                </CardDescription>
              )}
            </div>
            <Badge variant="secondary" className={`${categoryConfig[event.category].color} text-white shrink-0`}>
              <Icon name={categoryConfig[event.category].icon as any} size={14} className="mr-1" />
              {categoryConfig[event.category].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {event.preview && (
            <div className="mb-4">
              <img
                src={event.preview}
                alt={event.title}
                className="w-full h-70 cursor-pointer hover:opacity-70 transition-opacity rounded-lg px-0 mx-0 my-0 object-cover py-0"
                onClick={() => {
                  const previewIndex = event.images.indexOf(event.preview!);
                  onImageClick(event.preview!, previewIndex >= 0 ? previewIndex : 0, event.images);
                }}
              />
            </div>
          )}
          <p className="text-muted-foreground mb-4">{event.description}</p>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="flex-1">
                  <Icon name="Book" size={16} className="mr-2" />
                  Подробнее
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                  <Badge variant="secondary" className={`${categoryConfig[event.category].color} text-white w-fit`}>
                    {categoryConfig[event.category].label}
                  </Badge>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Дата</h3>
                    <p className="text-muted-foreground">{event.date}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Описание</h3>
                    <div className="text-muted-foreground leading-relaxed space-y-4">
                      {event.details.split('\n\n').map((paragraph, pIdx) => (
                        <div key={pIdx}>
                          <p className="whitespace-pre-line">{paragraph}</p>
                          {event.images[pIdx] && (
                            <img
                              src={event.images[pIdx]}
                              alt={`${event.title} - изображение ${pIdx + 1}`}
                              className="rounded-lg w-full max-w-2xl mx-auto h-auto object-cover mt-4 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                onImageClick(event.images[pIdx], pIdx, event.images);
                              }}
                            />
                          )}
                        </div>
                      ))}
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {event.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${event.title} - изображение ${idx + 1}`}
                            className="rounded-lg w-full h-32 md:h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              onImageClick(img, idx, event.images);
                            }}
                          />
                        ))}
                      </div>
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
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}