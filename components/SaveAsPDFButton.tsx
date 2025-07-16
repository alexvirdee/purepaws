'use client';


import { Button } from "@/components/ui/button";

export default function SaveAsPDFButton({ 
    onClick, 
    title = 'Save as PDF' 
}: {
    onClick: () => void;
    title?: string;
}) {

    return (
        <Button size="sm" onClick={onClick} className="text-sm cursor-pointer">
            {title}
        </Button>
    )
}