import { TicketOrder } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface TicketSummaryProps {
  order: TicketOrder;
  lang: 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'kn';
}

const translations = {
  en: {
    title: 'Order Summary',
    museum: 'Museum',
    experience: 'Experience',
    date: 'Date',
    time: 'Time',
    adultTickets: 'Adult Tickets',
    childTickets: 'Child Tickets',
    total: 'Total',
  },
  hi: {
    title: 'आदेश सारांश',
    museum: 'संग्रहालय',
    experience: 'अनुभव',
    date: 'तारीख',
    time: 'समय',
    adultTickets: 'वयस्क टिकट',
    childTickets: 'बच्चे का टिकट',
    total: 'कुल',
  },
  bn: {
      title: 'অর্ডার সারাংশ',
      museum: 'জাদুঘর',
      experience: 'অভিজ্ঞতা',
      date: 'তারিখ',
      time: 'সময়',
      adultTickets: 'প্রাপ্তবয়স্কদের টিকিট',
      childTickets: 'শিশুদের টিকিট',
      total: 'মোট',
  },
  ta: {
      title: 'ஆர்டர் சுருக்கம்',
      museum: 'அருங்காட்சியகம்',
      experience: 'அனுபவம்',
      date: 'தேதி',
      time: 'நேரம்',
      adultTickets: 'பெரியவர் டிக்கெட்டுகள்',
      childTickets: 'குழந்தை டிக்கெட்டுகள்',
      total: 'மொத்தம்',
  },
  te: {
      title: 'ఆర్డర్ సారాంశం',
      museum: 'మ్యూజియం',
      experience: 'అనుభవం',
      date: 'తేదీ',
      time: 'సమయం',
      adultTickets: 'పెద్దల టిక్కెట్లు',
      childTickets: 'పిల్లల టిక్కెట్లు',
      total: 'మొత్తం',
  },
  kn: {
      title: 'ಆದೇಶದ ಸಾರಾಂಶ',
      museum: 'ವಸ್ತುಸಂಗ್ರಹಾಲಯ',
      experience: 'ಅನುಭವ',
      date: 'ದಿನಾಂಕ',
      time: 'ಸಮಯ',
      adultTickets: 'ವಯಸ್ಕರ ಟಿಕೆಟ್‌ಗಳು',
      childTickets: 'ಮಕ್ಕಳ ಟಿಕೆಟ್‌ಗಳು',
      total: 'ಒಟ್ಟು',
  }
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
          <span>{t.museum}:</span>
          <span className="font-medium text-right">{order.museum}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.experience}:</span>
          <span className="font-medium text-right">{order.type}</span>
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
