'use client';

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XIcon, PaperclipIcon } from "lucide-react";
import { toast } from "sonner";
import { useConversationMessages } from "@/hooks/useConversationMessages";
import { Message } from "@/interfaces/message";

interface ChatWidgetProps {
    conversationId: string;
    currentUserRole: "breeder" | "buyer";
    onSendMessage?: (text: string) => void; // optional callback
    onClose?: () => void;
}

export default function ChatWidget({
    conversationId,
    currentUserRole,
    onSendMessage,
    onClose
}: ChatWidgetProps) {
    const [newMessage, setNewMessage] = useState("");

    const { messages: fetchedMessages, mutate } = useConversationMessages(conversationId);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ 
                behavior: "smooth",
                block: "end",
            });
        }
    }, [fetchedMessages])

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

            const cloudinaryData = await cloudinaryRes.json();

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
                    filePublicId: cloudinaryData.public_id || null,
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
                filePublicId: data.message.filePublicId,
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
                <ScrollArea className="flex-1 mb-4 px-4 py-2 border rounded space-y-2 overflow-y-auto">
                    {fetchedMessages.length > 0 ? (
                        fetchedMessages.map((msg: Message) => {
                            const isSender = msg.senderRole === currentUserRole;

                            return (
                                <div
                                    key={msg._id}
                                    className={`mb-2 relative p-3 rounded-lg max-w-[80%] md:max-w-[70%] text-sm
                                           ${isSender
                                            ? "bg-blue-600 text-white ml-auto rounded-br-none shadow-md"
                                            : "bg-gray-100 text-gray-900 mr-auto rounded-bl-none shadow-sm"
                                        }
  `}
                                >
                                    <p className="whitespace-pre-line">{msg.text}</p>

                                    {/* File display */}
                                    {msg.fileUrl && (
                                        <a
                                            href={msg.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`block mt-2 text-xs underline ${isSender ? "text-white" : "text-blue-600 hover:text-blue-800"}`}
                                        >
                                            📎 {msg.fileName || "View File"}
                                        </a>
                                    )}
                                    <div className="mt-2">
                                        <span className={`absolute bottom-1 text-[10px] ${isSender ? "text-white right-2" : "text-gray-500 left-1 pl-2"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-gray-500 text-sm">No messages yet.</p>
                    )}
                    {/* Ref for latest messages */}
                    <div ref={bottomRef} />
                </ScrollArea>

                <div className="flex items-center gap-2 p-2 border-t">
                    {/* File upload icon button */}
                    <button
                        type="button"
                        onClick={handleFileUploadClick}
                        className="text-gray-500 hover:text-blue-600 cursor-pointer p-2 rounded transition"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <PaperclipIcon className="w-5 h-5" />
                    </button>

                    {/* Message input */}
                    <Input
                        placeholder="Type a new message"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    {/* Send button */}
                    <Button type="button" onClick={handleSend}>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
}
