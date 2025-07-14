import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json());

// TODO: Currently polling for new messages every second.
// This could be optimized with WebSockets or Server-Sent Events for real-time updates.
// For now, this is a simple implementation to ensure messages are updated frequently.

export function useConversationMessages(conversationId: string) {
    const { data, mutate, isLoading } = useSWR(
        conversationId ? `/api/conversations/${conversationId}/messages` : null,
        fetcher, // your fetcher function
        { refreshInterval: 3000, // poll every 3 seconds
          revalidateOnFocus: true,
          revalidateOnReconnect: true
        } 
    );

    return { messages: data?.messages || [], mutate, isLoading };
}