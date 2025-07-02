import { ObjectId } from "mongodb";

export interface Dog {
    _id: string;
    name: string;
    photo: string;
    breed: string;
    location: string;
    status: string;
    price: number;
    description: string;
    breederId?: string;
    dob?: string;
}