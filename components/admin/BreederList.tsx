'use client';

import { useState } from "react";
import { IBreeder } from "@/interfaces/breeder";
import { ObjectId } from "mongodb";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
                headers: { "Content-Type": "application/json" }
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


    // Note: This function handles the removal of breeders from the site which will set their status to "pending" currently
    // It sends a POST request to the API endpoint and updates the local state accordingly.
    const handleRemove = async (id: ObjectId) => {
        try {
            const res = await fetch(`/api/breeders/${id}/pending`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                // Update local state
                setBreederList((prev: IBreeder[]) =>
                    prev.map((b: IBreeder) =>
                        b._id === id ? { ...b, status: "pending" } : b
                    )
                );

                toast.success("Breeder status reverted to pending successfully");
            } else {
                const errorData = await res.json();
                toast.error(`Error: ${errorData.error || "Unknown error"}`);
                return;
            }

        } catch (error) {
            console.error("Error adjusting breeder status:", error);
            toast.error("Failed to adjust breeder status");
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold">List of breeders submitted to PurePaws</h1>
                <Table>
                    <TableCaption>List of breeders submitted to PurePaws</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {breederList.map((breeder) => (
                            <TableRow key={breeder._id.toString()}>
                                <TableCell>{breeder.name}</TableCell>
                                <TableCell>{breeder.email}</TableCell>
                                <TableCell className="capitalize">{breeder.status}</TableCell>
                                <TableCell>
                                    {breeder.status === "pending" && (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                            onClick={() => handleApprove(breeder._id)}
                                        >
                                            Approve
                                        </Button>
                                    )}

                                    {/* For removal of breeders */}
                                    {breeder.status === "approved" && (
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="cursor-pointer"
                                            onClick={() => handleRemove(breeder._id)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}