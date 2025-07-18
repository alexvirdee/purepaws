'use client';

import { useState } from "react";
import  { IAdoptionRequest } from "@/interfaces/adoptionRequests";
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

interface AdoptionRequestListProps {
    requests: IAdoptionRequest[];
}

export default function AdoptionRequestList({ requests }: AdoptionRequestListProps) {
    const [adoptionRequestList, setAdoptionRequestList] = useState(requests);

    return (
        <>
            <div className="overflow-x-auto">
                <h1 className="text-2xl font-semibold">Adoption Requests</h1>
                <Table>
                    <TableCaption>List of adoption requests submitted to PurePaws</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Dog ID</TableHead>
                            <TableHead>Breeder ID</TableHead>
                            <TableHead>userId</TableHead>
                            <TableHead>Deposit Amount</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adoptionRequestList.map((request) => (
                            <TableRow key={request._id.toString()}>
                                <TableCell>{request._id.toString()}</TableCell>
                                <TableCell>{request.dogId.toString()}</TableCell>
                                <TableCell>{request.breederId.toString()}</TableCell>
                                <TableCell>{request.userId.toString()}</TableCell>
                                <TableCell>{request.depositAmount}</TableCell>
                                <TableCell>{request.note}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" /> {/* lucide-react icon */}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end">
                                            add content here 
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