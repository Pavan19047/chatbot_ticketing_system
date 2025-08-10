import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const shows = [
  { name: 'Special Exhibition: "Cosmos"', tickets: 1250, type: 'Special' },
  { name: 'General Admission', tickets: 850, type: 'General' },
  { name: 'Ancient Worlds', tickets: 450, type: 'Permanent' },
  { name: 'Modern Art Insights', tickets: 300, type: 'Permanent' },
  { name: 'Renaissance Masters', tickets: 150, type: 'Permanent' },
];

export function PopularShows() {
  return (
    <div className="neubrutalist-border rounded-lg overflow-hidden">
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
                <Badge variant="outline" className="mt-1 neubrutalist-border">{show.type}</Badge>
              </TableCell>
              <TableCell className="text-right font-mono">{show.tickets}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
