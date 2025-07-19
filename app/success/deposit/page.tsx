import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import DepositSuccessClient from '@/components/DepositSuccessClient';

export default async function DepositSuccessPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Redirect to sign-in page or homepage
        redirect('/auth/signin'); // or '/'
    }

    return (
        <DepositSuccessClient />
    );
}