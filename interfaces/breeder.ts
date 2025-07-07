import { ObjectId } from "mongodb";

export interface IBreeder {
  _id: ObjectId;            // MongoDB document ID
  name: string;
  email: string;
  breeds: string[];         // or a more specific Breed type if you have one
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number;
  longitude: number;
  about: string;
  status: "pending" | "approved" | "rejected"; // If you have fixed statuses
  submittedAt: string;      // Or Date if you parse it as Date
}