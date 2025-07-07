export interface IPuppyApplication {
    _id: string;
    name: string;
    email: string;
    city: string;
    state: string;
    zip: string;
    age: number;
    petsOwned: number;
    hasChildren: boolean;
    puppyPreference: '8-week' | '16-week'; // limit to options you expect
    genderPreference: 'male' | 'female';
    trainingPlanned: boolean;
    desiredTraits?: string;
    additionalComments?: string;
    approvals?: string[]; // or whatever you use to track breeder approvals
    userId?: string; // the user _id if you store it
    createdAt?: string | null;
    updatedAt?: string | null;
}