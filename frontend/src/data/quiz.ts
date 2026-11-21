import { CATCHER_MAX } from "@/data/catcher";

export type QuizCategory =
  | "History"
  | "Landmarks"
  | "Culture"
  | "Heritage"
  | "Embroidery"
  | "Geography"
  | "Food";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  correctAnswer: string;
  /** Present only for the food picture rounds. */
  imageUrl?: string;
}

export const triviaQuestions: QuizQuestion[] = [
  {
    id: "history",
    category: "History",
    question: 'In which year did the official English name change from "Calcutta" to "Kolkata"?',
    options: ["2001", "1999", "2011"],
    correctAnswer: "2001",
  },
  {
    id: "landmarks",
    category: "Landmarks",
    question: "Which famous Kolkata bridge is built without pillars?",
    options: ["Howrah Bridge (Rabindra Setu)", "Vidyasagar Setu", "Bally Bridge"],
    correctAnswer: "Howrah Bridge (Rabindra Setu)",
  },
  {
    id: "culture",
    category: "Culture",
    question: "Which ancestral house in Kolkata was home to Rabindranath Tagore?",
    options: ["Jorasanko Thakur Bari", "Marble Palace", "Shobhabazar Rajbari"],
    correctAnswer: "Jorasanko Thakur Bari",
  },
  {
    id: "heritage",
    category: "Heritage",
    question: "Which grand festival in Kolkata is recognized by UNESCO for its importance to world heritage?",
    options: ["Durga Puja", "Rath Yatra", "Poila Boishakh"],
    correctAnswer: "Durga Puja",
  },
  {
    id: "embroidery",
    category: "Embroidery",
    question: "What traditional embroidery style is Bengal famous for?",
    options: ["Kantha", "Chikankari", "Phulkari"],
    correctAnswer: "Kantha",
  },
  {
    id: "geography",
    category: "Geography",
    question: "Along which river is Kolkata situated?",
    options: ["Hooghly River (Hugli)", "Damodar River", "Teesta River"],
    correctAnswer: "Hooghly River (Hugli)",
  },
];

export const foodQuestions: QuizQuestion[] = [
  {
    id: "phuchka",
    category: "Food",
    question: "What food is this?",
    imageUrl: "/food/phuchka.jpg",
    options: ["Phuchka", "Aloo Tikki", "Ghugni"],
    correctAnswer: "Phuchka",
  },
  {
    id: "jhalmuri",
    category: "Food",
    question: "What food is this?",
    imageUrl: "/food/jhalmuri.jpg",
    options: ["Jhalmuri", "Chanachur", "Bhelpuri"],
    correctAnswer: "Jhalmuri",
  },
  {
    id: "mishti-doi",
    category: "Food",
    question: "What food is this?",
    imageUrl: "/food/mishti-doi.jpg",
    options: ["Mishti Doi", "Payesh", "Rasmalai"],
    correctAnswer: "Mishti Doi",
  },
  {
    id: "kulfi",
    category: "Food",
    question: "What food is this?",
    imageUrl: "/food/kulfi.jpg",
    options: ["Kulfi", "Sandesh", "Rabri"],
    correctAnswer: "Kulfi",
  },
];

/** 6 trivia questions followed by 4 food pictures = 10 questions, 100 Rasogollas. */
export const quizQuestions: QuizQuestion[] = [...triviaQuestions, ...foodQuestions];

export const GEO_MAX = 100;
export const QUIZ_MAX = quizQuestions.length * 10;
export { CATCHER_MAX };
export const GRAND_MAX = GEO_MAX + QUIZ_MAX + CATCHER_MAX;
