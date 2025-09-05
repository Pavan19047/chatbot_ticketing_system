export type Message = {
  id: string;
  sender: 'user' | 'bot';
  content: React.ReactNode;
};

export type TicketOrder = {
  state: string | null;
  city: string | null;
  event: {
    id: string;
    name: string;
    type: 'movie' | 'concert' | 'sports' | 'theater' | 'comedy';
    venue: string;
  } | null;
  date: Date | null;
  time: string | null;
  tickets: {
    regular: number;
    premium: number;
  };
  totalAmount?: number;
};
