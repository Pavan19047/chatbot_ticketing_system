// Event and venue data for TicketBharat

export interface Event {
  id: string;
  name: string;
  type: 'movie' | 'concert' | 'sports' | 'theater' | 'comedy';
  venue: string;
  city: string;
  state: string;
  dates: string[];
  times: string[];
  prices: {
    regular: number;
    premium: number;
  };
  image?: string;
  description?: string;
}

export const states = {
  'Delhi': ['New Delhi', 'Gurgaon', 'Noida'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Telangana': ['Hyderabad', 'Warangal'],
  'West Bengal': ['Kolkata', 'Durgapur'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar'],
};

export const events: Event[] = [
  // Movies
  {
    id: 'movie-1',
    name: 'Pushpa 2: The Rule',
    type: 'movie',
    venue: 'PVR Cinemas',
    city: 'Mumbai',
    state: 'Maharashtra',
    dates: ['2025-09-06', '2025-09-07', '2025-09-08'],
    times: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '10:00 PM'],
    prices: { regular: 200, premium: 350 },
    description: 'The much-awaited sequel to the blockbuster Pushpa'
  },
  {
    id: 'movie-2',
    name: 'Kalki 2898 AD',
    type: 'movie',
    venue: 'INOX',
    city: 'Bangalore',
    state: 'Karnataka',
    dates: ['2025-09-06', '2025-09-07', '2025-09-08'],
    times: ['11:00 AM', '2:00 PM', '5:00 PM', '8:00 PM'],
    prices: { regular: 180, premium: 300 },
    description: 'Futuristic sci-fi epic starring Prabhas'
  },
  
  // Concerts
  {
    id: 'concert-1',
    name: 'A.R. Rahman Live',
    type: 'concert',
    venue: 'Jawaharlal Nehru Stadium',
    city: 'New Delhi',
    state: 'Delhi',
    dates: ['2025-09-15', '2025-09-16'],
    times: ['7:00 PM'],
    prices: { regular: 2500, premium: 5000 },
    description: 'Oscar-winning composer performs his greatest hits'
  },
  {
    id: 'concert-2',
    name: 'Arijit Singh Live Concert',
    type: 'concert',
    venue: 'MMRDA Grounds',
    city: 'Mumbai',
    state: 'Maharashtra',
    dates: ['2025-09-20'],
    times: ['8:00 PM'],
    prices: { regular: 1500, premium: 3500 },
    description: 'Bollywood\'s melody king live in concert'
  },
  
  // Sports
  {
    id: 'sports-1',
    name: 'India vs Australia Cricket',
    type: 'sports',
    venue: 'M. Chinnaswamy Stadium',
    city: 'Bangalore',
    state: 'Karnataka',
    dates: ['2025-09-25'],
    times: ['2:00 PM'],
    prices: { regular: 800, premium: 2000 },
    description: 'T20 International match'
  },
  {
    id: 'sports-2',
    name: 'Bengaluru FC vs Mumbai City FC',
    type: 'sports',
    venue: 'Sree Kanteerava Stadium',
    city: 'Bangalore',
    state: 'Karnataka',
    dates: ['2025-09-12'],
    times: ['7:30 PM'],
    prices: { regular: 300, premium: 800 },
    description: 'ISL Football League match'
  },
  
  // Theater
  {
    id: 'theater-1',
    name: 'Mughal-E-Azam (The Musical)',
    type: 'theater',
    venue: 'National Centre for Performing Arts',
    city: 'Mumbai',
    state: 'Maharashtra',
    dates: ['2025-09-10', '2025-09-11', '2025-09-12'],
    times: ['8:00 PM'],
    prices: { regular: 1200, premium: 2500 },
    description: 'Grand musical adaptation of the classic film'
  },
  {
    id: 'theater-2',
    name: 'Andha Yug',
    type: 'theater',
    venue: 'India Habitat Centre',
    city: 'New Delhi',
    state: 'Delhi',
    dates: ['2025-09-14', '2025-09-15'],
    times: ['7:00 PM'],
    prices: { regular: 500, premium: 1000 },
    description: 'Classic Hindi drama by Dharamvir Bharati'
  },
  
  // Comedy
  {
    id: 'comedy-1',
    name: 'Zakir Khan Live',
    type: 'comedy',
    venue: 'Phoenix MarketCity',
    city: 'Chennai',
    state: 'Tamil Nadu',
    dates: ['2025-09-18'],
    times: ['8:00 PM'],
    prices: { regular: 800, premium: 1500 },
    description: 'Stand-up comedy by Zakir Khan'
  },
];

export const getEventsByStateAndCity = (state: string, city?: string): Event[] => {
  return events.filter(event => {
    if (city) {
      return event.state === state && event.city === city;
    }
    return event.state === state;
  });
};

export const getEventsByType = (type: Event['type']): Event[] => {
  return events.filter(event => event.type === type);
};

export const getCitiesByState = (state: string): string[] => {
  return states[state as keyof typeof states] || [];
};
