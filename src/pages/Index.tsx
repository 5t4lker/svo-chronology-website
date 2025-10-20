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
    details: `Киевская область:

Утром 24 февраля российская артиллерия и ракеты поразили основные цели в Киевской области, включая главный аэропорт Киева — международный аэропорт Борисполь. Тем же утром российские войска успешно пересекли границу с Украиной из Белоруссии на север страны. В битве за Чернобыль они заняли Чернобыльскую АЭС, расположенную недалеко от границы.

Утром 25 февраля Военно-воздушные силы России продолжили бомбардировку столицы, при этом бомбя центр Киева. Чуть позже над Киевом был сбит украинский истребитель Су-27; самолет врезался в девятиэтажный жилой комплекс, в результате чего здание загорелось. В 06:47 (GMT+2), подразделение украинской армии взорвало мост через реку Тетерев под Иванковом, остановив наступающую из Чернобыля колонну российских танков.

Генштаб ВСУ позже сообщил, что украинские десантники вступили в бой с русскими под Иванковом и Дымером. Утром, в середине того же дня, российские диверсанты, переодетые украинскими солдатами, вошли в Оболонский район. Район расположен примерно за 10 км от Верховной Рады. В течение дня во время битвы за Киев в нескольких районах города была слышна стрельба; Украинские официальные лица заявили, что стрельба возникла в результате столкновений с российскими войсками.

Отдельным российским солдатам удалось прорвать украинскую оборону под Иванковом, но этот бой продолжался в течение всего дня. По данным Министерства обороны России, эти российские силы смогли продвинуться и занять аэропорт Гостомель после наземного штурма, создав ключевую зону высадки для российских войск всего в 10 километров из Киева.

Ранним утром 26 февраля российские десантники начали высадку в городе Васильков, к югу от Киева, чтобы занять очередную точку. В последовавшей битве за контроль над городом, начались тяжелые бои. Официальные лица Украины утверждают, что в 01:30 по местному времени, украинский истребитель Су-27 сбил над Васильковом российский самолёт Ил-76 с десантниками.

Группировка российских войск, действующая в Киевской области с 25-28 февраля 2022 года, не сумела небольшими силами из нескольких БТГр пробиться к окраинам Киева, для ее усиления перебрасываются основные подразделения с территории Республики Беларусь.

Первоначальная протяженность колонн составила 15,5 км, они шли через село Белая Сорока, путь их пролегал через такие населенные пункты: Чернобыль – Дитятки – Иванков – Фаневичи – Новое Залесье, здесь колонны разделилась, одна часть пошла в район Здвижевка – аэродром Гостомель, другая пошла по маршруту Бородянка – Макаров. К вечеру 28 февраля колонны увеличились за счет прибытия новых частей, это были 4 БТГр (40 танков, 160 БМП/БМД) колонна составляла к этому времени около 24 км, 1 марта к колоннам примкнули еще 6 БТГр (60 танков, 240 БМП/БМД) и они уже были 64 км, это и была знаменитая многокилометровая колонна которая попала на спутниковые снимки SENTINEL. С прибытие новых частей из 35 и 36 Армий на Киевском направлении действовало в сумме 19 БТГр и насчитывавших около 20 тысяч бойцов.

Командование группировки войск "V" к 3 марта решает провести масштабное наступление силами 35 и 36 Армий в районах Бородянка – Макаров, вдоль трассы Житомир – Киев и вдоль течения реки Ирпень. Для проведения операции привлекали мотострелковые, танковые и десантные БТГр которые должны быть поддержаны авиацией и вертолетами с территории РБ. В районе трассы Житомир – Киев действовали мотострелковые БТГр, а вдоль реки Ирпень десантные БТГр. Наступательные действия российской группировки "V" были объединены единой целью выйти к западным и северо-западным окраинам Киева.

Противостояли российской группировке под Киевом сводные силы состоящие из разнообразных частей и соединений ВСУ, занявшие оборону вдоль реки Ирпень. Кроме частей ВСУ на этом направлении действовали многочисленные добровольческие соединения состоящие из бывших военнослужащих ВСУ, граждан СНГ и Европы. Также усиление войск ВСУ осуществилось за счет добровольцев из местных жителей, проведенная мобилизации в пригородах Киева, и в других областях Украины смогла значительно усилить местные отряды самообороны и действующих частей ВСУ.

Перед рекой Ирпень находился одноименный город, в котором проживало около 70 тысяч жителей. К 1 марта 2022 года они в основном оставались в городе, лишь небольшое количество местных покинуло его с начала СВО. Командование ВСУ не планировало оборонять Ирпень большими силами, а использовало город как предполье, где можно задержать российскую группировку.

До прибытия основной группировки под Киев российские силы располагали несколькими БТГр в районах Буча, пгт Гостомель, аэропорт Гостомель и Демидов. Российские силы состояли из десантных войск, морской пехоты и сил Росгвардии.

Задумка российского командования предусматривала: отведение из Бучи частей 104 Гв.ДШП, которые создадут видимость отступления из города, выманить основные силы ВСУ из Ирпеня, после чего нанести два сходящихся удара двумя БТГр, которые окружают и уничтожают части ВСУ в Буче, впоследствии БТГр должны войти в Ирпень с северного и западного направлений. Предварительно по позициям ВСУ в Ирпене должны были отработать штурмовики СУ-25.

К 6 марта форма борьбы противоборствующих сторон приобрела позиционный характер, наличие большого количества солдат давало преимущество ВСУ в длительном противостоянии с небольшими российскими силами. Бой в Ирпене продолжались около месяца за каждый дом и улицу. За март месяц российские силы расширили зону контроля вокруг города, а также вдоль реки Ирпень, контролируя такие населённые пункты: Ворзель, Михайловка-Рубежевка, Забучье, пгт Гостомель и Дмитровка. Российская группировка существенно улучшила положение на фронте и вышла к западным окраинам Киева со стороны трассы Житомир - Киев.

29 марта замминистра обороны России, член делегации на переговорах в Стамбуле генерал-полковник Александр Фомин заявил, что принято решение «кардинально сократить военную активность на киевском и черниговском направлениях». Он пояснил, что решение принято «в связи с тем, что переговоры с Украиной переходят в практическую плоскость».

В тот же день, 29 марта, министр обороны РФ Сергей Шойгу на селекторном совещании заявил, что отвод осуществляется в связи с выполнением первого этапа спецоперации и необходимости сосредоточить силы на освобождении Донбасса. В конце марта и начале апреля российские войска оставили населённые пункты в Киевской области, в том числе Ирпень, Бучу и Гостомель.`,
    images: [
      'https://cdn.poehali.dev/files/1ecb88fb-8add-4519-bde3-e3eec24fe955.jpg',
      'https://cdn.poehali.dev/files/71c69d1a-52b5-4905-b679-85a23425de9f.jpg',
      'https://cdn.poehali.dev/files/f123028a-423a-4066-a311-1b10f4267e02.jpg',
      'https://cdn.poehali.dev/files/30122cc4-0eca-45f9-b7cf-33b71f88f9d3.jpg',
      'https://cdn.poehali.dev/files/38ffee8d-b364-4731-9358-b936b4b673d2.png',
      'https://cdn.poehali.dev/files/ce0753d1-0c55-46e9-9e9b-058a16dd5ea4.png',
      'https://cdn.poehali.dev/files/3bf460e4-3f84-4626-8768-c10926c5f768.png',
      'https://cdn.poehali.dev/files/e9cd3204-00b4-4093-9e0c-a4fb6a5348ac.jpg',
      'https://cdn.poehali.dev/files/0e4f2d49-6d16-4926-85d1-a522d5693aee.jpg',
      'https://cdn.poehali.dev/files/1ff3dd50-44d1-4c40-aff4-95690b43cc9c.jpg',
      'https://cdn.poehali.dev/files/63f39fd9-4e8c-4987-b751-84474e3b12cb.jpg',
      'https://cdn.poehali.dev/files/239e5d55-d3f9-4015-bfcb-97608b041157.jpg',
      'https://cdn.poehali.dev/files/4329aedc-2a5c-4195-b2a2-d28a59695db5.jpg',
      'https://cdn.poehali.dev/files/f5836209-5554-480e-abb6-bce635477ab3.jpg'
    ],
    videos: [
      'https://www.youtube.com/embed/Ik75KCZPD_4',
      'https://www.youtube.com/embed/yRSYhcYF6s8'
    ],
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
                        <CardDescription className="text-lg leading-relaxed">{event.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
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
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.details}</p>
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