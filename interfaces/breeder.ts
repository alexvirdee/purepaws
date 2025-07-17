export interface IBreeder {
  _id: string;            // MongoDB document ID
  name: string;
  email: string;
  breeds: string[];         // or a more specific Breed type if you have one
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  latitude: number;
  longitude: number;
  website?: string;
  about: string;
  status: "pending" | "approved" | "rejected"; // If you have fixed statuses
  submittedAt: string;    
  payoutsEnabled?: boolean;
  stripeAccountId?: string; // Stripe account ID if applicable
}