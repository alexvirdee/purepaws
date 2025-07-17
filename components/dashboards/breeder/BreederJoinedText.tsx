'use client';


import { useEffect, useState } from "react";

export default function BreederJoinedText({ approvedAt }: { approvedAt?: string }) {
    const [joinedText, setJoinedText] = useState("Pending Approval");

    useEffect(() => {
        if (approvedAt) {
            const approvedDate = new Date(approvedAt);
            const diffInDays = Math.floor((Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
            setJoinedText(`Joined ${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`);
        }
    }, [approvedAt]);

    return <span>{joinedText}</span>;
}
