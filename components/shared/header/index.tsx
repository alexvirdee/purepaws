// Note - keep this as a server rendered component
import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME, DB_NAME } from '@/lib/constants';
import Menu from './menu';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import clientPromise from '@/lib/mongodb';


const Header = async () => {
    const session = await getServerSession(authOptions);

    // Connect to the database
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    let puppyApplication = null;
    // For notifications currently just checking on number of incoming requests breeders have regarding their puppy applications 
    // TODO: Add notificaitons for other things like new messages, etc.
    let notificationCount = 0;

    // Check if logged in user has a puppy application
    if (session?.user?.email) {
        puppyApplication = await db.collection("puppyApplications").findOne({
            email: session.user.email
        })

        const breederUser = await db.collection('users').findOne({ email: session.user.email });
        const breederId = breederUser?.breederId;

        if (breederId) {
            const puppyRequests = await db.collection('puppyInterests').find({
                breederId: breederId,
                status: "pending"
            }).toArray();

            notificationCount += puppyRequests.length;
        }

        // Serialize puppyApplication if user has one
        if (puppyApplication) {
            puppyApplication = {
                ...puppyApplication,
                _id: puppyApplication._id.toString(),
                userId: puppyApplication.userId?.toString() || null,
                createdAt: puppyApplication.createdAt?.toISOString() || null,
                updatedAt: puppyApplication.updatedAt?.toISOString() || null
            }
        }
    }


        return (
            <header className="w-full border-b border-b-gray-200 shadow-sm">
                <div className="wrapper flex justify-between items-center py-2">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image height={48} width={45} priority={true} alt="" src="/images/paw-filled.svg" />
                            <span className="hidden lg:block font-bold text-2xl ml-2">
                                {APP_NAME}
                            </span>
                        </Link>
                    </div>
                    <Menu notificationCount={notificationCount} puppyApplication={puppyApplication} />
                </div>
            </header>);
    }

    export default Header;