'use client';

import PuppyAppPDFDownload from "@/components/PuppyAppPDFDownload";
import EditPuppyApplicationDialog from "@/components/dialogs/EditPuppyApplicationDialog";
import DeletePuppyApplicationDialog from "@/components/dialogs/DeletePuppyApplicationDialog";
import { User as UserIcon, Dog as DogIcon, MailIcon, MapIcon, Contact, BabyIcon, DumbbellIcon, Users, Heart, NotebookPenIcon } from "lucide-react";

export default function PuppyApplicationDetails({ data }: { data: any }) {
    if (!data) return null;

    return (
        <div className="bg-white rounded-lg shadow p-6 relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Puppy Application</h2>
                    <p className="text-sm text-gray-500">Here’s what you’ve submitted.</p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:absolute md:top-4 md:right-4">
                        <PuppyAppPDFDownload data={data} />
                        <EditPuppyApplicationDialog puppyApplication={data} />
                        <DeletePuppyApplicationDialog applicationId={data?._id || ""} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                    <p className="flex items-center gap-2 text-gray-500">
                        <UserIcon />
                        <span className="pt-1">{data.name}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                        <MailIcon />
                        <span className="pt-1">{data.email}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-500">
                        <MapIcon />
                        <span className="pt-1">{data.city}, {data.state} {data.zip}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <Contact />
                        <span className="pt-1">{data.age}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <DogIcon />
                        <span className="pt-1">{data.petsOwned}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <BabyIcon />
                        <span className="pt-1">{data.hasChildren ? 'Yes' : 'No'}</span>
                    </p>

                </div>
                <div>
                    <p className="flex items-center gap-2 text-gray-500">
                        <DogIcon />
                        <span className="pt-1">{data.puppyPreference}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <Users />
                        <span className="pt-1">{data.genderPreference}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <DumbbellIcon />
                        <span className="pt-1">{data.trainingPlanned ? 'Yes' : 'No'}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <Heart />
                        <span className="pt-1">{data.desiredTraits}</span>
                    </p>

                    <p className="flex items-center gap-2 text-gray-500">
                        <NotebookPenIcon />
                        <span className="pt-1">{data.additionalComments}</span>
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-4 text-sm text-gray-500">
                Need to make changes? You can edit your application anytime before you start sending it to breeders.
            </div>

        </div>
    )
}