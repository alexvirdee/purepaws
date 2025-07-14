import BreederMessages from "@/components/breeder-dashboard/BreederMessages";
import { getBreederMessages } from "@/lib/db/getBreederMessages";

export default async function MessagesPage({
    searchParams
}: {
    searchParams: {
        conversation?: string;
    };
}) {
    const breederMessages = await getBreederMessages();
    const activeConversationId = (await searchParams).conversation || null;

    return (
        <main className="w-full">
            {breederMessages.length > 0 ? (
                <BreederMessages
                    conversations={breederMessages}
                    activeConversationId={activeConversationId}
                />
            ) : (
                <div className="p-4 text-gray-500">
                    You haven't started any conversations yet.
                </div>
            )}
        </main>
    );
}