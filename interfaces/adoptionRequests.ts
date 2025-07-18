export interface IAdoptionRequest {
    _id: string;
    interestId: string;
    dogId: string;          // ID of the dog being requested
    breederId: string;      // ID of the breeder
    userId: string;         // ID of the user making the request    
    status: "pending" | "deposit-requested" | "approved" | "rejected" | "deposit-cancelled"; // Status of the request
    depositAmount: number; // Amount of deposit in cents
    paymentIntentId?: string | null; // Stripe payment intent ID if applicable
    paymentMethod?: string | null; // Stripe payment method ID if applicable
    conversationId?: string | null; // ID of the conversation related to this request
    note?: string;          // Optional note from the user
    createdAt: string;     // Timestamp of when the request was created
    expiresAt?: string;    // Optional expiration date for the request
    updatedAt?: string;    // Optional timestamp of when the request was last updated
    cancelledDepositAt?: string | null; // Optional timestamp if the deposit was cancelled
}