'use client';

import { useState } from "react";
import { IBreeder } from "@/interfaces/breeder";
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
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Check, XCircle, CircleDashed } from "lucide-react";

interface BreederListProps {
    breeders: IBreeder[];
}

export default function BreederList({ breeders }: BreederListProps) {
    const [breederList, setBreederList] = useState(breeders);


    const handleStatusChange = async (id: string, status: "approved" | "pending" | "rejected") => {
        const res = await fetch(`/api/admin/breeders/update-status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ breederId: id, status }),
        });

        if (res.ok) {
            toast.success(`Breeder status updated to ${status}`);

            // Update local state
            setBreederList((prev: IBreeder[]) =>
                prev.map((b: IBreeder) =>
                    b._id === id ? { ...b, status: status } : b
                )
            );

            // Send approval email if status is approved
            if (status === "approved") {
                const breeder = breederList.find(b => b._id === id);

                if (!breeder) {
                    toast.error("Breeder not found in the list");
                    return;
                }

                const emailRes = await fetch(`/api/email/send-approval`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: breeder.email,
                        breederName: breeder.name
                    })
                })

                if (emailRes.ok) {
                    const emailData = await emailRes.json();
                    console.log("Email sent successfully:", emailData);
                } else {
                    const emailErrorData = await emailRes.json();
                    console.error("Failed to send email:", emailErrorData);
                    toast.error(`Failed to send approval email: ${emailErrorData.error || "Unknown error"}`);
                }
            }
        } else {
            toast.error("Failed to update status");
        }
    }

    return (
        <>
            <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold">Breeders</h1>
                <Table>
                    <TableCaption>List of breeders submitted to PurePaws</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Breeder ID</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {breederList.map((breeder) => (
                            <TableRow key={breeder._id.toString()}>
                                <TableCell>{breeder.name}</TableCell>
                                <TableCell>{breeder.email}</TableCell>
                                <TableCell>
                                    <Link className="text-blue-500 hover:text-blue-600" href={`/breeders/${breeder._id.toString()}`}>{breeder._id.toString()}</Link>
                                </TableCell>
                                <TableCell> {breeder.submittedAt
                                    ? new Date(breeder.submittedAt).toLocaleString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })
                                    : "N/A"}</TableCell>
                                <TableCell className="capitalize">
                                    {breeder.status === "approved" && (
                                        <Badge className="bg-green-600" variant="default">Approved</Badge>
                                    )}
                                    {breeder.status === "pending" && (
                                        <Badge className="bg-blue-500 text-white" variant="secondary">Pending</Badge>
                                    )}
                                    {breeder.status === "rejected" && (
                                        <Badge variant="destructive">Rejected</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" /> {/* lucide-react icon */}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>Update status</DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "approved")}>
                                                            <Check /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "pending")}>
                                                            <CircleDashed />  Pending
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "rejected")}>
                                                            <XCircle />  Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                                <DropdownMenuItem>
                                                    <Link href={`/breeders/${breeder._id.toString()}`}>View profile</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuSub>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}