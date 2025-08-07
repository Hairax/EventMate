import { Timestamp } from "firebase/firestore";

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date: Timestamp;
  imageUrl?: string;
  ownerId: string;
  guests: string[];
};
