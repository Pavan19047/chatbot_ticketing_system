import { useRef } from 'react';
import Image from 'next/image';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Download, Ticket, Star } from 'lucide-react';
import { Button } from '../ui/button';

interface DigitalTicketProps {
  order: TicketOrder;
  lang: 'en' | 'hi';
}

const translations = {
    en: {
        title: "Your TicketBharat Ticket",
        event: "Event",
        venue: "Venue", 
        date: "Date",
        time: "Time",
        tickets: "Tickets",
        downloadJpg: "Download JPG",
        downloadPdf: "Download PDF",
        ticketId: "Ticket ID"
    },
    hi: {
        title: "आपका TicketBharat टिकट",
        event: "इवेंट",
        venue: "स्थान",
        date: "तारीख", 
        time: "समय",
        tickets: "टिकट",
        downloadJpg: "जेपीजी डाउनलोड करें",
        downloadPdf: "पीडीएफ डाउनलोड करें",
        ticketId: "टिकट आईडी"
    }
}

export function DigitalTicket({ order, lang }: DigitalTicketProps) {
  const t = translations[lang];
  const ticketRef = useRef<HTMLDivElement>(null);
  const totalTickets = order.tickets.regular + order.tickets.premium;
  const ticketId = `TB${Date.now().toString().slice(-8)}`;

  const qrData = JSON.stringify({
    id: ticketId,
    event: order.event?.name,
    venue: order.event?.venue,
    date: order.date?.toISOString().split('T')[0],
    time: order.time,
    regular: order.tickets.regular,
    premium: order.tickets.premium,
    total: order.totalAmount,
  });
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  const generateImage = async <T,>(generator: (node: HTMLElement, options?: T) => Promise<string>, options?: T) => {
    if (ticketRef.current === null) {
      throw new Error('Ticket element not found');
    }
    return generator(ticketRef.current, options);
  };
  
  const handleDownloadJpg = async () => {
    try {
      const dataUrl = await generateImage(toJpeg, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = 'ticketbharat-ticket.jpeg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (ticketRef.current === null) return;
    try {
      const dataUrl = await generateImage(toPng);
      const pdf = new jsPDF('p', 'px', [ticketRef.current.offsetWidth, ticketRef.current.offsetHeight]);
      pdf.addImage(dataUrl, 'PNG', 0, 0, ticketRef.current.offsetWidth, ticketRef.current.offsetHeight);
      pdf.save('ticketbharat-ticket.pdf');
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <Card className="my-2 rounded-xl bg-background overflow-hidden border-2 border-orange-200">
      <div ref={ticketRef} className="bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="text-yellow-300" /> 
              <span>{t.title}</span>
              <Star className="text-yellow-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2 text-sm">
              <p className="font-bold text-lg text-orange-600">{order.event?.name}</p>
              <p className="text-gray-600">{order.event?.venue}</p>
              <p className="text-xs text-gray-500">📍 {order.city}, {order.state}</p>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500 text-xs">{t.date}</p>
                  <p className="font-medium">{order.date?.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">{t.time}</p>
                  <p className="font-medium">{order.time}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-xs">{t.tickets}</p>
                <p className="font-medium">{totalTickets} tickets • ₹{order.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">{t.ticketId}</p>
                <p className="font-mono font-medium text-sm">{ticketId}</p>
              </div>
            </div>
            <div className="col-span-1 flex flex-col items-center justify-center">
                <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={120}
                    height={120}
                    className="rounded-lg border"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">Scan at venue</p>
            </div>
          </CardContent>
          <div className="bg-orange-50 p-2 text-center">
            <p className="text-xs text-orange-600 font-medium">🎉 Thank you for choosing TicketBharat! 🎉</p>
          </div>
      </div>
      <CardFooter className="p-2 bg-gray-50 border-t">
          <div className="flex w-full gap-2">
            <Button onClick={handleDownloadJpg} variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> {t.downloadJpg}
            </Button>
            <Button onClick={handleDownloadPdf} variant="secondary" className="w-full">
                <Download className="mr-2 h-4 w-4" /> {t.downloadPdf}
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
