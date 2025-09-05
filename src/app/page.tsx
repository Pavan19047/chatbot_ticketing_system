import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Star, Heart, Calendar, Music, Trophy, Theater, Mic } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: Calendar, title: 'Movies', description: 'Latest Bollywood & Regional' },
    { icon: Music, title: 'Concerts', description: 'Live Music & Artists' },
    { icon: Trophy, title: 'Sports', description: 'Cricket, Football & More' },
    { icon: Theater, title: 'Theater', description: 'Drama & Musicals' },
    { icon: Mic, title: 'Comedy', description: 'Stand-up & Shows' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Card className="w-full max-w-lg rounded-xl bg-white/80 backdrop-blur-sm border-orange-200 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
              <Ticket className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="font-bold text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              TicketBharat
            </CardTitle>
            <p className="text-gray-600 text-lg mt-2">
              India's Premier Entertainment Hub
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                <Star className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Heart className="w-3 h-3 mr-1" />
                Made in India
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Book Tickets for Entertainment
              </h3>
              <p className="text-sm text-gray-600">
                मनोरंजन के लिए टिकट बुक करें
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-orange-50 border border-orange-100">
                  <feature.icon className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <p className="text-sm font-medium text-gray-800">{feature.title}</p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/chat">
                  🎬 Start Booking - English
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-orange-200 text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/chat">
                  🎭 बुकिंग शुरू करें - हिंदी
                </Link>
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                🔐 Secure payments • 📱 Instant tickets • 🎫 QR codes
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TicketBharat. Entertaining India with AI.</p>
        </footer>
      </div>
    </div>
  );
}
