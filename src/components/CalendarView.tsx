import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { calendarEntries, CalendarEntry } from '@/data/CalendarData';

const months = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export default function CalendarView() {
  const [selectedYear, setSelectedYear] = useState<number>(2022);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const years = Array.from(new Set(calendarEntries.map(e => e.year))).sort((a, b) => b - a);
  
  const filteredByYear = calendarEntries.filter(e => e.year === selectedYear);
  
  const entriesByMonth = selectedMonth 
    ? filteredByYear.filter(e => e.month === selectedMonth)
    : filteredByYear;

  const monthsWithEvents = Array.from(new Set(filteredByYear.map(e => e.month))).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2 items-center">
          <Icon name="Calendar" size={24} className="text-primary" />
          <span className="font-semibold">Год:</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {years.map(year => (
            <Button
              key={year}
              variant={selectedYear === year ? 'default' : 'outline'}
              onClick={() => {
                setSelectedYear(year);
                setSelectedMonth(null);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {monthsWithEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Месяц:</span>
            <Button
              variant={selectedMonth === null ? 'default' : 'outline'}
              onClick={() => setSelectedMonth(null)}
              size="sm"
            >
              Все
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {monthsWithEvents.map(monthNum => (
              <Button
                key={monthNum}
                variant={selectedMonth === monthNum ? 'default' : 'outline'}
                onClick={() => setSelectedMonth(monthNum)}
                className="h-auto py-3"
              >
                {months[monthNum - 1]}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {entriesByMonth.length > 0 ? (
          entriesByMonth.map((entry) => (
            <Card key={entry.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{entry.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Icon name="CalendarDays" size={16} />
                  {entry.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
                {entry.images && entry.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {entry.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${entry.title} ${idx + 1}`}
                        className="rounded-md object-cover w-full h-32 cursor-pointer hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Icon name="Calendar" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Нет событий за выбранный период</p>
          </div>
        )}
      </div>
    </div>
  );
}
