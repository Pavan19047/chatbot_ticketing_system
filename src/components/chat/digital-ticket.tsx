import { useRef } from 'react';
import Image from 'next/image';
import { toPng, toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Download, Ticket } from 'lucide-react';
import { Button } from '../ui/button';

interface DigitalTicketProps {
  order: TicketOrder;
  lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn';
}

const translations = {
    en: {
        title: "Your Digital Ticket",
        museum: "Museum",
        validFor: "Valid for",
        date: "Date",
        time: "Time",
        tickets: "Tickets",
        downloadJpg: "Download JPG",
        downloadPdf: "Download PDF"
    },
    hi: {
        title: "आपका डिजिटल टिकट",
        museum: "संग्रहालय",
        validFor: "के लिए वैध",
        date: "तारीख",
        time: "समय",
        tickets: "टिकट",
        downloadJpg: "जेपीजी डाउनलोड करें",
        downloadPdf: "पीडीएफ डाउनलोड करें"
    },
    bn: {
        title: "আপনার ডিজিটাল টিকিট",
        museum: "জাদুঘর",
        validFor: "এর জন্য বৈধ",
        date: "তারিখ",
        time: "সময়",
        tickets: "টিকিট",
        downloadJpg: "JPG ডাউনলোড করুন",
        downloadPdf: "PDF ডাউনলোড করুন"
    },
    ta: {
        title: "உங்கள் டிஜிட்டல் டிக்கெட்",
        museum: "அருங்காட்சியகம்",
        validFor: "செல்லுபடியாகும்",
        date: "தேதி",
        time: "நேரம்",
        tickets: "டிக்கெட்டுகள்",
        downloadJpg: "JPG பதிவிறக்கவும்",
        downloadPdf: "PDF பதிவிறக்கவும்"
    },
    te: {
        title: "మీ డిజిటల్ టికెట్",
        museum: "మ్యూజియం",
        validFor: "చెల్లుబాటు అయ్యేది",
        date: "తేదీ",
        time: "సమయం",
        tickets: "టిక్కెట్లు",
        downloadJpg: "JPG డౌన్‌లోడ్ చేయండి",
        downloadPdf: "PDF డౌన్‌లోడ్ చేయండి"
    },
    kn: {
        title: "ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಟಿಕೆಟ್",
        museum: "ವಸ್ತುಸಂಗ್ರಹಾಲಯ",
        validFor: "ಇದಕ್ಕಾಗಿ ಮಾನ್ಯವಾಗಿದೆ",
        date: "ದಿನಾಂಕ",
        time: "ಸಮಯ",
        tickets: "ಟಿಕೆಟ್‌ಗಳು",
        downloadJpg: "JPG ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
        downloadPdf: "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
    }
}

export function DigitalTicket({ order, lang }: DigitalTicketProps) {
  const t = translations[lang];
  const ticketRef = useRef<HTMLDivElement>(null);
  const totalTickets = order.tickets.adult + order.tickets.child;

  const qrData = JSON.stringify({
    museum: order.museum,
    type: order.type,
    date: order.date?.toISOString().split('T')[0],
    time: order.time,
    adults: order.tickets.adult,
    children: order.tickets.child,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    qrData
  )}`;
  
  const handleDownloadJpg = async () => {
    if (ticketRef.current === null) return;
    try {
      const dataUrl = await toJpeg(ticketRef.current, { quality: 0.95, cacheBust: true });
      const link = document.createElement('a');
      link.download = 'museum-ticket.jpeg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (ticketRef.current === null) return;
    try {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true });
      const pdf = new jsPDF('p', 'px', [ticketRef.current.offsetWidth, ticketRef.current.offsetHeight]);
      pdf.addImage(dataUrl, 'PNG', 0, 0, ticketRef.current.offsetWidth, ticketRef.current.offsetHeight);
      pdf.save('museum-ticket.pdf');
    } catch (err) {
      console.error('oops, something went wrong!', err);
    }
  };

  return (
    <Card className="my-2 neubrutalist-border neubrutalist-shadow bg-background overflow-hidden">
      <div ref={ticketRef} className="bg-white">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket /> {t.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2 text-sm">
              <p className="font-semibold text-base">{order.museum}</p>
              <p className="text-sm">{order.type}</p>
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
      </div>
      <CardFooter className="p-2 bg-slate-50 border-t-2 border-black">
          <div className="flex w-full gap-2">
            <Button onClick={handleDownloadJpg} variant="secondary" className="w-full neubrutalist-border neubrutalist-shadow-sm">
                <Download className="mr-2" /> {t.downloadJpg}
            </Button>
            <Button onClick={handleDownloadPdf} variant="secondary" className="w-full neubrutalist-border neubrutalist-shadow-sm">
                <Download className="mr-2" /> {t.downloadPdf}
            </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
