'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon, PaperclipIcon } from "lucide-react";
import { toast } from "sonner";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { Message } from "@/interfaces/message";

interface ChatWidgetProps {
    conversationId: string;
    initialMessages?: Message[];
    onSendMessage?: (text: string) => void; // optional callback
    onClose?: () => void;
}

export default function ChatWidget({
    conversationId,
    initialMessages = [],
    onSendMessage,
    onClose
}: ChatWidgetProps) {
    const [newMessage, setNewMessage] = useState("");

    const { messages: fetchedMessages, mutate } = useConversationMessages(conversationId);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUploadClick = () => {
        fileInputRef.current?.click();
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        try {
            toast.info("Uploading file...");

            // Upload to the file to cloudinary
            const formData = new FormData();
            formData.append("file", file);

            // POST to signed api route
            const cloudinaryRes = await fetch("/api/cloudinary", {
                method: "POST",
                body: formData,
            })

            if (!cloudinaryRes.ok) {
                throw new Error("Cloudinary upload failed");
            }

            // formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

            // const cloudinaryRes = await fetch(
            //     `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`, {
            //     method: "POST",
            //     body: formData
            // });

            const cloudinaryData = await cloudinaryRes.json();

            console.log('cloudinaryData:', cloudinaryData);
            console.log('file type', file.type)

            const fileUrl = cloudinaryData.secure_url;

            // Post new message with the file URL to the api
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: "",
                    fileUrl,
                    fileName: file.name,
                    fileType: file.type
                }),
            });

            const data = await res.json();

            const newMessage = {
                _id: data.message._id,
                senderRole: data.message.senderRole,
                text: data.message.text,
                fileUrl: data.message.fileUrl,
                fileName: data.message.fileName,
                fileType: data.message.fileType,
                createdAt: data.message.createdAt,
            };

            if (res.ok) {
                await mutate(
                    (currentMessages: Message[] | undefined) => {
                        const safeMessages = Array.isArray(currentMessages)
                            ? currentMessages
                            : [];
                        return [...safeMessages, newMessage];
                    },
                    false
                );

                await mutate();

                toast.success("File uploaded successfully!");
            } else {
                toast.error(data.error || "Failed to send file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("Failed to upload file");
        } finally {
            e.target.value = ""; // Reset file input
        }
    }

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const text = newMessage.trim();
        setNewMessage("");

        try {
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
            });

            const data = await res.json();

            if (res.ok) {
                await mutate(
                    async (currentMessages: Message[]) => {
                        const safeMessages = Array.isArray(currentMessages) ? currentMessages : [];

                        return [
                            ...safeMessages,
                            {
                                _id: data.message._id,
                                senderRole: data.message.senderRole,
                                text: data.message.text,
                                createdAt: data.message.createdAt
                            }
                        ];
                    },
                    false // prevents automatic revalidation, keeps optimistic update in place
                );

                // Then force a real revalidation to ensure it matches server state:
                await mutate();

                if (onSendMessage) {
                    onSendMessage(data.message.text);
                }
            } else {
                toast.error(data.error || "Failed to send message");
                console.error("Failed to send message:", data.error);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between items-start">
                <div>
                    <h1>Conversation</h1>
                    <p className="text-xs text-gray-500">ID: {conversationId}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <XIcon className="cursor-pointer w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-col h-[300px]">
                <ScrollArea className="flex-1 mb-4 p-2 border rounded bg-gray-50 overflow-y-auto">
                    {fetchedMessages.length > 0 ? (
                        fetchedMessages.map((msg: Message) => (
                            <div
                                key={msg._id}
                                className={`p-2 mb-1 rounded ${msg.senderRole === "breeder"
                                    ? "bg-green-100 text-right"
                                    : "bg-blue-100 text-left"
                                    }`}
                            >
                                <p className="text-sm">{msg.text}</p>

                                {/* File display */}
                                {msg.fileUrl && (
                                    <a
                                        href={msg.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-xs"
                                    >
                                        📎 {msg.fileName || "View File"}
                                    </a>
                                )}
                                <span className="block text-[10px] text-gray-500">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No messages yet.</p>
                    )}
                </ScrollArea>

                <div className="flex flex-row justify-evenly gap-2">
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                    />
                    {/* File upload */}
                    <div onClick={handleFileUploadClick} className="cursor-pointer mt-1">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <PaperclipIcon />
                    </div>
                    <Button className="cursor-pointer" onClick={handleSend}>Send</Button>
                </div>
            </div>
        </div>
    );
}
