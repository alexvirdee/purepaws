'use client';

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar"

export default function BreederCalendar() {
    const [date, setDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        setDate(new Date());
    }, [])

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