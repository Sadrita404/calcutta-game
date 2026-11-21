export const RASOGOLLA_ICON = "/landmarks/rasogolla.png";

export interface LandmarkRound {
  id: number;
  location: string;
  description: string;
  imageUrl: string;
  options: string[];
  correctAnswer: string;
}

export const landmarks: LandmarkRound[] = [
  {
    id: 1,
    location: "Victoria Memorial",
    description: "Marble museum and landmark set in wide gardens.",
    imageUrl: "/landmarks/victoria-memorial.jpg",
    options: ["Victoria Memorial", "Marble Palace", "St. Paul's Cathedral"],
    correctAnswer: "Victoria Memorial",
  },
  {
    id: 2,
    location: "Howrah Bridge",
    description: "Iconic cantilever bridge spanning the Hooghly River.",
    imageUrl: "/landmarks/howrah-bridge.jpg",
    options: ["Howrah Bridge", "Vidyasagar Setu", "Nivedita Setu"],
    correctAnswer: "Howrah Bridge",
  },
  {
    id: 3,
    location: "Dakshineswar Kali Temple",
    description: "Historic riverside temple dedicated to Goddess Kali.",
    imageUrl: "/landmarks/dakshineswar.jpg",
    options: ["Dakshineswar Kali Temple", "Kalighat Kali Temple", "Belur Math"],
    correctAnswer: "Dakshineswar Kali Temple",
  },
  {
    id: 4,
    location: "Kalighat Kali Temple",
    description: "Major Hindu pilgrimage site in south Kolkata.",
    imageUrl: "/landmarks/kalighat.jpg",
    options: ["Kalighat Kali Temple", "Dakshineswar Kali Temple", "Tarapith Temple"],
    correctAnswer: "Kalighat Kali Temple",
  },
  {
    id: 5,
    location: "Indian Museum",
    description: "India's oldest and largest museum for art, history, and natural history.",
    imageUrl: "/landmarks/indian-museum.jpg",
    options: ["Indian Museum", "State Archaeological Museum", "Science City"],
    correctAnswer: "Indian Museum",
  },
  {
    id: 6,
    location: "Prinsep Ghat",
    description: "Scenic riverfront promenade beside the Hooghly.",
    imageUrl: "/landmarks/prinsep-ghat.jpg",
    options: ["Prinsep Ghat", "Outram Ghat", "Babughat"],
    correctAnswer: "Prinsep Ghat",
  },
  {
    id: 7,
    location: "Park Street",
    description: "Famous avenue lined with historic restaurants, cafes, and nightlife.",
    imageUrl: "/landmarks/park-street.jpg",
    options: ["Park Street", "College Street", "Camac Street"],
    correctAnswer: "Park Street",
  },
  {
    id: 8,
    location: "New Market",
    description: "Bustling historic market for shopping, street food, and local goods.",
    imageUrl: "/landmarks/new-market.jpg",
    options: ["New Market", "Gariahat Market", "Burrabazar"],
    correctAnswer: "New Market",
  },
  {
    id: 9,
    location: "Jorasanko Thakur Bari",
    description: "Ancestral home of Rabindranath Tagore and cultural museum.",
    imageUrl: "/landmarks/jorasanko.jpg",
    options: ["Jorasanko Thakur Bari", "Swami Vivekananda's Ancestral House", "Netaji Bhawan"],
    correctAnswer: "Jorasanko Thakur Bari",
  },
  {
    id: 10,
    location: "Science City",
    description: "Interactive science centre and exhibition complex.",
    imageUrl: "/landmarks/science-city.jpg",
    options: ["Science City", "Nicco Park", "Eco Park"],
    correctAnswer: "Science City",
  },
];