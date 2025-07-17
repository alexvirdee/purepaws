'use client';

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"

export default function BreederCalendar() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setDate(new Date());
        setMounted(true);
    }, [])

    if (!mounted) {
        return null; // Prevents hydration mismatch
    }

    return (
        <div className="flex flex-col">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border border-gray-200 w-full"
            />
        </div>
    );
}