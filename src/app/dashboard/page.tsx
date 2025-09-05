import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketsSoldChart } from '@/components/dashboard/tickets-sold-chart';
import { PopularShows } from '@/components/dashboard/popular-shows';
import { DollarSign, Ticket, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-extrabold">Dashboard</h1>
        <p className="text-muted-foreground">
          Analytics for Museum Buddy ticket sales.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl card-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2:00 PM</div>
            <p className="text-xs text-muted-foreground">
              Most active booking time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <Card className="col-span-1 lg:col-span-3 rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Tickets Sold Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketsSoldChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-2 rounded-xl card-shadow">
          <CardHeader>
            <CardTitle>Most Popular Shows</CardTitle>
          </CardHeader>
          <CardContent>
            <PopularShows />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
