export interface IDog {
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
    gender?: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}