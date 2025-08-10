export type Message = {
  id: string;
  sender: 'user' | 'bot';
  content: React.ReactNode;
};

export type TicketOrder = {
  type: string | null;
  date: Date | null;
  time: string | null;
  tickets: {
    adult: number;
    child: number;
  };
};
