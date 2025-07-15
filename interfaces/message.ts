export interface Message {
    _id?: string;
    conversationId: string;
    senderId: string;
    senderRole: string;
    text?: string;
    fileUrl?: string;
    fileName?: string;
    fileType?: string;
    createdAt: string;
}