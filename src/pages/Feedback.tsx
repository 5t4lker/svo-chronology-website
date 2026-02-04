import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваше сообщение",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Здесь будет логика отправки данных на сервер
    setTimeout(() => {
      toast({
        title: "Спасибо за отзыв!",
        description: "Ваше сообщение успешно отправлено",
      });
      setName('');
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 py-0">
        <div className="container mx-auto py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <Icon name="ArrowLeft" size={20} />
            Вернуться на главную
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Обратная связь
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Ваше мнение важно для нас. Поделитесь своими предложениями и комментариями
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя (необязательно)</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (необязательно)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Ваше сообщение *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Расскажите о ваших предложениях, замечаниях или идеях..."
                  className="w-full min-h-[200px]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                <Icon name="Send" size={18} />
                {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
              </Button>
            </form>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Ваше мнение важно</h3>
                  <p className="text-sm text-muted-foreground">
                    Мы внимательно читаем все отзывы и стремимся сделать портал лучше
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Icon name="Shield" size={24} className="text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Конфиденциальность</h3>
                  <p className="text-sm text-muted-foreground">
                    Ваши данные используются только для обратной связи и не передаются третьим лицам
                  </p>
                </div>
              </div>
            </div>
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
