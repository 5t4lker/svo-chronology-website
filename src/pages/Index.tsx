import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import InteractiveMap from '@/components/InteractiveMap';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  category: 'campaign' | 'battle' | 'unit' | 'politics' | 'weapons';
  subcategory?: string;
  description: string;
  details: string;
  images: string[];
  videos?: string[];
}

const events: TimelineEvent[] = [
  {
    id: '1',
    date: '24 февраля 2022',
    title: 'Начало специальной военной операции',
    category: 'politics',
    description: 'Российские вооруженные силы начали проведение специальной военной операции на территории Украины.',
    details: 'Операция была начата в ответ на обращение руководителей ДНР и ЛНР с просьбой о помощи. Целями операции были заявлены демилитаризация и денацификация Украины, защита населения Донбасса.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/9760d6cf-6275-4dea-80f8-24ba848153ad.jpg'],
  },
  {
    id: '2',
    date: 'Февраль-Март 2022',
    title: 'Весенняя кампания ВС РФ 2022 года',
    category: 'campaign',
    description: 'Комплексная операция российских войск на нескольких направлениях.',
    details: 'Весенняя кампания включала наступательные операции на киевском, черниговском, сумском и харьковском направлениях с целью деблокирования Донбасса и вывода Украины из конфликта.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/b4330eff-a0d8-4f72-8a8f-228db83d73ce.jpg'],
  },
  {
    id: '2a',
    date: 'Февраль-Март 2022',
    title: 'Киевское направление',
    category: 'campaign',
    subcategory: 'Весенняя кампания ВС РФ 2022 года',
    description: 'Наступление на Киев с северного и северо-восточного направлений.',
    details: 'Российские войска продвигались со стороны Беларуси через Чернобыль и Гостомель, а также с востока. Целью было окружение киевской группировки ВСУ и вывод Украины из конфликта.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/b4330eff-a0d8-4f72-8a8f-228db83d73ce.jpg'],
  },
  {
    id: '2b',
    date: 'Февраль-Март 2022',
    title: 'Черниговско-Сумское направление',
    category: 'campaign',
    subcategory: 'Весенняя кампания ВС РФ 2022 года',
    description: 'Операции в северо-восточных областях Украины.',
    details: 'Наступление велось с целью блокирования крупных городов и обеспечения флангов главной группировки. Были блокированы Чернигов, Сумы и Конотоп.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/9760d6cf-6275-4dea-80f8-24ba848153ad.jpg'],
  },
  {
    id: '2c',
    date: 'Февраль-Март 2022',
    title: 'Харьковское направление',
    category: 'campaign',
    subcategory: 'Весенняя кампания ВС РФ 2022 года',
    description: 'Наступление на второй по величине город Украины.',
    details: 'Операция проводилась с целью блокирования Харькова и создания угрозы окружения донбасской группировки ВСУ. Велись интенсивные бои в северных пригородах города.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/dcdb17f0-ee1b-4f06-b739-bb80ed52eca4.jpg'],
  },
  {
    id: '2d',
    date: 'Март 2022',
    title: 'Перегруппировка войск',
    category: 'campaign',
    subcategory: 'Весенняя кампания ВС РФ 2022 года',
    description: 'Завершение первого этапа операции и вывод войск.',
    details: 'После достижения ряда целей было принято решение о перегруппировке сил для концентрации усилий на донбасском направлении. Войска были выведены с киевского, черниговского и сумского направлений.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/b4330eff-a0d8-4f72-8a8f-228db83d73ce.jpg'],
  },
  {
    id: '3',
    date: 'Май 2022',
    title: 'Битва за Мариуполь',
    category: 'battle',
    description: 'Одно из крупнейших сражений операции, закончившееся взятием города и завода "Азовсталь".',
    details: 'Штурм Мариуполя длился более двух месяцев. В операции принимали участие подразделения ДНР и российские войска. Город имел стратегическое значение для установления контроля над побережьем Азовского моря.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/9760d6cf-6275-4dea-80f8-24ba848153ad.jpg'],
  },
  {
    id: '4',
    date: 'Сентябрь 2022',
    title: 'Референдумы о вхождении в РФ',
    category: 'politics',
    description: 'Проведение референдумов в ДНР, ЛНР, Запорожской и Херсонской областях.',
    details: 'По результатам референдумов абсолютное большинство граждан проголосовало за вхождение в состав Российской Федерации. 30 сентября 2022 года были подписаны договоры о принятии новых субъектов.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/dcdb17f0-ee1b-4f06-b739-bb80ed52eca4.jpg'],
  },
  {
    id: '5',
    date: 'Декабрь 2022 - н.в.',
    title: 'Группа "Вагнер" и добровольческие формирования',
    category: 'unit',
    description: 'Активное участие ЧВК "Вагнер", батальонов "Ахмат" и добровольческих корпусов в боевых действиях.',
    details: 'Добровольческие формирования и частные военные компании сыграли значительную роль в проведении операции. Особенно отмечается их участие в боях за Артёмовск (Бахмут) и другие стратегические объекты.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/dcdb17f0-ee1b-4f06-b739-bb80ed52eca4.jpg'],
  },
  {
    id: '6',
    date: 'Май 2023',
    title: 'Взятие Артёмовска',
    category: 'battle',
    description: 'Завершение многомесячной битвы за Артёмовск (Бахмут), один из ключевых укрепрайонов ВСУ.',
    details: 'Артёмовск был хорошо укреплён и имел важное стратегическое значение. Бои за город продолжались более 10 месяцев. Взятие города стало важным тактическим успехом.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/b4330eff-a0d8-4f72-8a8f-228db83d73ce.jpg'],
  },
  {
    id: '7',
    date: 'Март 2022',
    title: 'Применение ракетных комплексов «Калибр»',
    category: 'weapons',
    description: 'Высокоточные удары крылатыми ракетами по военной инфраструктуре противника.',
    details: 'Крылатые ракеты «Калибр» применялись для поражения командных пунктов, складов вооружения и топлива, систем ПВО и других стратегических объектов на всей территории Украины.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/9760d6cf-6275-4dea-80f8-24ba848153ad.jpg'],
  },
  {
    id: '8',
    date: 'Июнь 2022',
    title: 'Использование БПЛА «Орлан» и «Ланцет»',
    category: 'weapons',
    description: 'Широкое применение беспилотных летательных аппаратов для разведки и поражения целей.',
    details: 'БПЛА «Орлан-10» обеспечивали воздушную разведку и корректировку огня артиллерии. «Ланцет» — барражирующие боеприпасы-камикадзе для точечных ударов по бронетехнике и артиллерии противника.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/b4330eff-a0d8-4f72-8a8f-228db83d73ce.jpg'],
  },
  {
    id: '9',
    date: 'Октябрь 2022',
    title: 'Применение гиперзвуковых ракет «Кинжал»',
    category: 'weapons',
    description: 'Использование гиперзвукового оружия для поражения особо важных объектов.',
    details: 'Ракетный комплекс «Кинжал» способен поражать цели на дальности до 2000 км со скоростью более 10М. Применялся для уничтожения подземных бункеров и защищённых командных пунктов.',
    images: ['https://cdn.poehali.dev/projects/43268c76-63e5-42b2-a2b6-42db7f46e265/files/dcdb17f0-ee1b-4f06-b739-bb80ed52eca4.jpg'],
  },
];

const categoryConfig = {
  campaign: { label: 'Кампания', icon: 'Target', color: 'bg-primary' },
  battle: { label: 'Сражение', icon: 'Swords', color: 'bg-secondary' },
  unit: { label: 'Подразделение', icon: 'Shield', color: 'bg-accent' },
  politics: { label: 'Политика', icon: 'Landmark', color: 'bg-muted' },
  weapons: { label: 'Вооружение', icon: 'Crosshair', color: 'bg-destructive' },
};

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);
  const eventRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredEvents = selectedCategory
    ? events.filter(e => e.category === selectedCategory)
    : events.filter(e => e.category !== 'weapons');

  const handleMapMarkerClick = (eventId: string) => {
    if (!eventId) {
      setHighlightedEventId(null);
      return;
    }
    setHighlightedEventId(eventId);
    const element = eventRefs.current[eventId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Хронология СВО
          </h1>
          <p className="text-muted-foreground text-lg">
            Информационная база ключевых событий специальной военной операции
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Icon name="Map" size={28} />
            Интерактивная карта событий
          </h2>
          <InteractiveMap 
            onMarkerClick={handleMapMarkerClick}
            selectedEventId={highlightedEventId}
          />
        </div>
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(null)}
            className="gap-2"
          >
            <Icon name="Calendar" size={18} />
            Все события
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(key)}
              className="gap-2"
            >
              <Icon name={config.icon as any} size={18} />
              {config.label}
            </Button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block" />

          <div className="space-y-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                ref={(el) => (eventRefs.current[event.id] = el)}
                className={`relative animate-fade-in transition-all duration-300 ${
                  highlightedEventId === event.id ? 'ring-4 ring-primary rounded-lg' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="hidden md:flex absolute left-0 top-8 w-16 h-16 rounded-full bg-card border-4 border-primary items-center justify-center">
                  <Icon name={categoryConfig[event.category].icon as any} size={24} className="text-primary" />
                </div>

                <Card className={`md:ml-24 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${event.subcategory ? 'md:ml-32 border-l-4 border-l-primary/50' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="outline" className="text-sm">
                            {event.date}
                          </Badge>
                          <Badge className={categoryConfig[event.category].color}>
                            {categoryConfig[event.category].label}
                          </Badge>
                          {event.subcategory && (
                            <Badge variant="secondary" className="text-xs">
                              {event.subcategory}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-3xl mb-3">{event.title}</CardTitle>
                        <CardDescription className="text-lg">{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {event.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {event.images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`${event.title} - изображение ${idx + 1}`}
                              className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setSelectedEvent(event)}
                            />
                          ))}
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full gap-2">
                            <Icon name="Info" size={18} />
                            Подробнее
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl">{event.title}</DialogTitle>
                            <Badge className={`${categoryConfig[event.category].color} w-fit mt-2`}>
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
                              <p className="text-muted-foreground leading-relaxed">{event.details}</p>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {event.images.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt={`${event.title} - изображение ${idx + 1}`}
                                      className="rounded-lg w-full h-64 object-cover"
                                    />
                                  ))}
                                </div>
                              </TabsContent>
                              <TabsContent value="videos" className="mt-4">
                                <div className="text-center py-8 text-muted-foreground">
                                  <Icon name="Video" size={48} className="mx-auto mb-4 opacity-50" />
                                  <p>Видеоматериалы будут добавлены позже</p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Информационный портал о ходе специальной военной операции
          </p>
        </div>
      </footer>
    </div>
  );
}