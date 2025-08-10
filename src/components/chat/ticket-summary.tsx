import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface TicketSummaryProps {
  order: TicketOrder;
  lang: 'en' | 'es';
}

const translations = {
  en: {
    title: 'Order Summary',
    experience: 'Experience',
    date: 'Date',
    time: 'Time',
    adultTickets: 'Adult Tickets',
    childTickets: 'Child Tickets',
    total: 'Total',
  },
  es: {
    title: 'Resumen del Pedido',
    experience: 'Experiencia',
    date: 'Fecha',
    time: 'Hora',
    adultTickets: 'Entradas de Adulto',
    childTickets: 'Entradas de Niño',
    total: 'Total',
  },
};

export function TicketSummary({ order, lang }: TicketSummaryProps) {
  const t = translations[lang];
  const adultPrice = 25;
  const childPrice = 15;
  const totalCost = order.tickets.adult * adultPrice + order.tickets.child * childPrice;

  return (
    <Card className="my-2 neubrutalist-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t.experience}:</span>
          <span className="font-medium">{order.type}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.date}:</span>
          <span className="font-medium">{order.date?.toLocaleDateString(lang)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.time}:</span>
          <span className="font-medium">{order.time}</span>
        </div>
        <Separator className="my-2 bg-border" />
        {order.tickets.adult > 0 && (
          <div className="flex justify-between">
            <span>{t.adultTickets}:</span>
            <span className="font-medium">{order.tickets.adult} x ${adultPrice}</span>
          </div>
        )}
        {order.tickets.child > 0 && (
          <div className="flex justify-between">
            <span>{t.childTickets}:</span>
            <span className="font-medium">{order.tickets.child} x ${childPrice}</span>
          </div>
        )}
        <Separator className="my-2 bg-border" />
        <div className="flex justify-between font-bold text-base">
          <span>{t.total}:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
