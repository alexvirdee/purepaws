'use client';

import { useState } from "react";
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
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge, Check, CircleDashed, MoreVertical, XCircle } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import AddEditDogDialog from "../AddEditDogDialog";
import DeleteDogDialog from "../DeleteDogDialog";

interface BreederDogTableProps {
    breederName: string;
    dogs: IDog[];
}

export default function BreederDogsTable({ breederName, dogs }: BreederDogTableProps) {
    const [editDog, setEditDog] = useState<IDog | null>(null);
    const [deleteDog, setDeleteDog] = useState<IDog | null>(null);


    return (
        <>
            <Table>
                <TableCaption>{breederName} Dogs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Litter</TableHead>
                        <TableHead>DOB</TableHead>
                        <TableHead>Dog ID</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dogs.map((dog: IDog, index) => (
                        <TableRow key={index}>
                            <TableCell>{dog.name}</TableCell>
                            <TableCell>{dog.litter}</TableCell>
                            <TableCell>{dog.dob}</TableCell>
                            <TableCell>
                                <Link className="text-blue-500 hover:text-blue-600" href={`/dogs/${dog._id.toString()}`}>{dog._id.toString().slice(0, 12)}...</Link>
                            </TableCell>
                            <TableCell>
                                ${dog.price.toLocaleString()}
                            </TableCell>
                            <TableCell> {dog.createdAt
                                ? new Date(dog.createdAt).toLocaleString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric',
                                })
                                : "N/A"}</TableCell>

                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" /> {/* lucide-react icon */}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel>{dog.name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setEditDog(dog)}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setDeleteDog(dog)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* Dialogs to render outside of the table */}
            {editDog && (
                <AddEditDogDialog
                    mode="edit"
                    initialData={editDog}
                    open={!!editDog}
                    onOpenChange={(v) => { if (!v) setEditDog(null) }}
                    onSubmitSuccess={() => setEditDog(null)}
                />
            )}
            {deleteDog && (
                <DeleteDogDialog
                    dogId={deleteDog._id}
                    dogName={deleteDog.name}
                    open={!!deleteDog}
                    onOpenChange={(v: any) => { if (!v) setDeleteDog(null) }}
                    onSubmitSuccess={() => setDeleteDog(null)}
                />
            )}
        </>


    )
}