import useSWR from "swr";

const fetcher = (...args: [RequestInfo, RequestInit?]) => fetch(...args).then(res => res.json());

export function useConversationMessages(conversationId: string) {
    const { data, mutate, isLoading } = useSWR(
        conversationId ? `/api/conversations/${conversationId}/messages` : null,
        fetcher, // your fetcher function
        { refreshInterval: 1000 } // every 3 sec
    );

    return { messages: data?.messages || [], mutate, isLoading };
}