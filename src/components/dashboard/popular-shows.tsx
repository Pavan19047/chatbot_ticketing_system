'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const initialShows = [
  { name: 'Special Exhibition: "Cosmos"', tickets: 1250, type: 'Special' },
  { name: 'General Admission', tickets: 850, type: 'General' },
  { name: 'Ancient Worlds', tickets: 450, type: 'Permanent' },
  { name: 'Modern Art Insights', tickets: 300, type: 'Permanent' },
  { name: 'Renaissance Masters', tickets: 150, type: 'Permanent' },
];

export function PopularShows() {
  const [shows, setShows] = useState(initialShows);

  useEffect(() => {
    const interval = setInterval(() => {
      setShows(prevShows =>
        prevShows
          .map(show => ({
            ...show,
            tickets: show.tickets + Math.floor(Math.random() * 3),
          }))
          .sort((a, b) => b.tickets - a.tickets)
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="font-semibold">Show</TableHead>
            <TableHead className="text-right font-semibold">Tickets Sold</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shows.map((show) => (
            <TableRow key={show.name}>
              <TableCell>
                <div className="font-medium">{show.name}</div>
                <Badge variant="outline" className="mt-1">{show.type}</Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{show.tickets}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
