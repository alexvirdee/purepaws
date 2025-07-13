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
        <main className="max-w-5xl mx-auto p-8">
            <BreederMessages
                conversations={breederMessages}
                activeConversationId={activeConversationId}
            />
        </main>
    );
}