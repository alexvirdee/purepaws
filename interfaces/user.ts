import { ObjectId } from "mongodb";

export interface IUser {
    _id: ObjectId | string;
    name?: string;
    email: string;
    password: string;
    role: "viewer" | "breeder" | "admin";
    breederId?: ObjectId | string | null;
    favorites?: string[]; // Or ObjectId[] if you prefer
    about?: string;
    createdAt?: Date;
}