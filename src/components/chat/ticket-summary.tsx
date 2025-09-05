import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface TicketSummaryProps {
  order: TicketOrder;
  lang: 'en' | 'hi';
}

const translations = {
  en: {
    title: 'Order Summary',
    event: 'Event',
    venue: 'Venue',
    date: 'Date',
    time: 'Time',
    regularTickets: 'Regular Tickets',
    premiumTickets: 'Premium Tickets',
    total: 'Total',
    state: 'State',
    city: 'City',
  },
  hi: {
    title: 'आदेश सारांश',
    event: 'इवेंट',
    venue: 'स्थान',
    date: 'तारीख',
    time: 'समय',
    regularTickets: 'नियमित टिकट',
    premiumTickets: 'प्रीमियम टिकट',
    total: 'कुल',
    state: 'राज्य',
    city: 'शहर',
  },
};

export function TicketSummary({ order, lang }: TicketSummaryProps) {
  const t = translations[lang];

  return (
    <Card className="my-2 rounded-xl bg-card border">
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t.state}:</span>
          <span className="font-medium text-right">{order.state}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.city}:</span>
          <span className="font-medium text-right">{order.city}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.event}:</span>
          <span className="font-medium text-right">{order.event?.name}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.venue}:</span>
          <span className="font-medium text-right">{order.event?.venue}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.date}:</span>
          <span className="font-medium">{order.date?.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.time}:</span>
          <span className="font-medium">{order.time}</span>
        </div>
        <Separator className="my-2 bg-border" />
        {order.tickets.regular > 0 && (
          <div className="flex justify-between">
            <span>{t.regularTickets}:</span>
            <span className="font-medium">{order.tickets.regular} tickets</span>
          </div>
        )}
        {order.tickets.premium > 0 && (
          <div className="flex justify-between">
            <span>{t.premiumTickets}:</span>
            <span className="font-medium">{order.tickets.premium} tickets</span>
          </div>
        )}
        <Separator className="my-2 bg-border" />
        <div className="flex justify-between font-bold text-base">
          <span>{t.total}:</span>
          <span>₹{order.totalAmount?.toLocaleString('en-IN') || 0}</span>
        </div>
      </CardContent>
    </Card>
  );
}
