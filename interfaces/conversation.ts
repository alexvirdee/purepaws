import { ObjectId } from "mongodb";

export interface IConversation {
  _id: ObjectId | string;
  breederId: ObjectId | string;
  buyerId: ObjectId | string;
  puppyInterestIds: (ObjectId | string)[];
  dogId?: ObjectId | string; // only present in some documents
  buyerEmail?: string;
  buyerName?: string;
  breederName?: string;
  dogName?: string;
  dogs?: { _id: ObjectId | string; name: string }[]; // array of dogs related to the conversation
  newlyCreated?: boolean;
  createdAt: string; // ISO string, you can convert to Date if needed
  updatedAt?: string;
  lastMessageAt?: string;
  closed?: boolean;
  closedAt?: string;
}
