import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import BreederMessages from "@/components/dashboards/breeder/BreederMessages";
import { getBreederMessages } from "@/lib/db/getBreederMessages";

export default async function MessagesPage({
    searchParams
}: {
    searchParams: {
        conversation?: string;
    };
}) {
    const session = await getServerSession(authOptions);

    const breederMessages = await getBreederMessages();
    const activeConversationId = (await searchParams).conversation || null;

    const currentUserRole = session?.user?.role as "breeder" | "buyer" | undefined;

    if (!currentUserRole) {
        throw new Error("No user role found in session");
    }

    return (
        <main className="w-full">
            {breederMessages.length > 0 ? (
                <BreederMessages
                    conversations={breederMessages}
                    activeConversationId={activeConversationId}
                    currentUserRole={currentUserRole}
                />
            ) : (
                <div className="p-4 text-gray-500">
                    You haven't started any conversations yet.
                </div>
            )}
        </main>
    );
}