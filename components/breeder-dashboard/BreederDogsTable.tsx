'use client';

import { IDog } from "@/interfaces/dog";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { Badge, Check, CircleDashed, MoreVertical, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BreederDogTableProps {
    breederName: string;
    dogs: IDog[];
}

export default function BreederDogsTable({ breederName, dogs }: BreederDogTableProps) {
    return (
        <Table>
                    <TableCaption>{breederName} Dogs</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Dog ID</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dogs.map((dog: IDog, index) => (
                            <TableRow key={index}>
                                <TableCell>{dog.name}</TableCell>
                                <TableCell>{dog.dob}</TableCell>
                                <TableCell>
                                    <Link className="text-blue-500 hover:text-blue-600" href={`/dogs/${dog._id.toString()}`}>{dog._id.toString().slice(0, 12)}...</Link>
                                </TableCell>
                                <TableCell> {dog.createdAt
                                    ? new Date(dog.createdAt).toLocaleString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })
                                    : "N/A"}</TableCell>
                                    <TableCell>
                                    ${dog.price.toLocaleString()}
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
                                                    {/* <DropdownMenuSubContent>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "approved")}>
                                                            <Check /> Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "pending")}>
                                                            <CircleDashed />  Pending
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleStatusChange(breeder._id, "rejected")}>
                                                            <XCircle />  Reject
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent> */}
                                                </DropdownMenuPortal>
                                                {/* <DropdownMenuItem>
                                                    <Link href={`/breeders/${breeder._id.toString()}`}>View profile</Link>
                                                </DropdownMenuItem> */}
                                            </DropdownMenuSub>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
    )
}