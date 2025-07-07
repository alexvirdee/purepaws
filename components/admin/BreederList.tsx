'use client';

import { useState } from "react";
import { IBreeder } from "@/interfaces/breeder";
import { ObjectId } from "mongodb";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface BreederListProps {
    breeders: IBreeder[];
}

export default function BreederList({ breeders }: BreederListProps) {
    const [breederList, setBreederList] = useState(breeders);

    const handleApprove = async (id: ObjectId) => {
        try {
            const res = await fetch(`/api/breeders/${id}/approve`, {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to approve breeder");
            }

            if (res.ok) {
                // Update local state
                setBreederList((prev: IBreeder[]) =>
                    prev.map((b: IBreeder) =>
                        b._id === id ? { ...b, status: "approved" } : b
                    )
                );

                toast.success("Breeder approved successfully");
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error approving breeder:", error);
        }
    }

    return (
        <>
            <h1 className="text-2xl font-semibold">Breeders on PurePaws</h1>
            {breederList.map((breeder: IBreeder, index: number) => (
                <div key={index} className="border p-4 mb-4 rounded">
                    <p>
                        <strong>Name:</strong> {breeder.name}
                    </p>
                    <p>
                        <strong>Email:</strong> {breeder.email}
                    </p>
                    <p>
                        <strong>Status:</strong> {breeder.status}
                    </p>
                    {breeder.status === "pending" && (
                        <Button
                            onClick={() => handleApprove(breeder._id)}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700 transition-colors"
                        >
                            Approve
                        </Button>
                    )}
                </div>
            ))}
        </>
    );
}