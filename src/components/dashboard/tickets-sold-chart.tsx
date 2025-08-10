'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
  { day: 'Monday', tickets: 186 },
  { day: 'Tuesday', tickets: 305 },
  { day: 'Wednesday', tickets: 237 },
  { day: 'Thursday', tickets: 273 },
  { day: 'Friday', tickets: 209 },
  { day: 'Saturday', tickets: 440 },
  { day: 'Sunday', tickets: 380 },
];

const chartConfig = {
  tickets: {
    label: 'Tickets',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function TicketsSoldChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
