import Image from 'next/image';
import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Ticket } from 'lucide-react';

interface DigitalTicketProps {
  order: TicketOrder;
  lang: 'en' | 'es';
}

const translations = {
    en: {
        title: "Your Digital Ticket",
        validFor: "Valid for",
        date: "Date",
        time: "Time",
        tickets: "Tickets"
    },
    es: {
        title: "Tu Entrada Digital",
        validFor: "Válido para",
        date: "Fecha",
        time: "Hora",
        tickets: "Entradas"
    }
}

export function DigitalTicket({ order, lang }: DigitalTicketProps) {
  const t = translations[lang];
  const totalTickets = order.tickets.adult + order.tickets.child;

  const qrData = JSON.stringify({
    type: order.type,
    date: order.date?.toISOString().split('T')[0],
    time: order.time,
    adults: order.tickets.adult,
    children: order.tickets.child,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrData
  )}`;

  return (
    <Card className="my-2 neubrutalist-border neubrutalist-shadow bg-white overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground p-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Ticket /> {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-2 text-sm">
          <p className="font-semibold text-base">{order.type}</p>
          <Separator />
          <div>
            <p className="text-muted-foreground">{t.date}</p>
            <p className="font-medium">{order.date?.toLocaleDateString(lang)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.time}</p>
            <p className="font-medium">{order.time}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t.tickets}</p>
            <p className="font-medium">{totalTickets}</p>
          </div>
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center">
            <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={150}
                height={150}
                className="neubrutalist-border"
                data-ai-hint="qr code"
            />
        </div>
      </CardContent>
    </Card>
  );
}
