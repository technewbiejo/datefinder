'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function CalendarTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Calendar View</CardTitle>
                <CardDescription>Browse years 2017-2026 with week numbers. Weeks start on Monday.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-2 sm:p-6">
                <Calendar
                    mode="single"
                    className="rounded-md border w-full sm:w-auto"
                    classNames={{
                        caption: 'flex justify-between items-center px-2 pt-1 relative',
                        caption_label: "font-headline font-semibold text-base sm:text-lg hidden",
                        head_cell: "font-headline w-full justify-center text-xs sm:text-sm md:text-base",
                        cell: "h-8 w-8 sm:h-9 sm:w-9 md:h-12 md:w-20",
                        day: "h-8 w-8 sm:h-9 sm:w-9 md:h-12 md:w-20",
                        nav: 'space-x-1 flex items-center',
                        caption_dropdowns: "flex justify-start gap-2",
                        nav_button_previous: 'absolute right-8',
                        nav_button_next: 'absolute right-0',
                    }}
                    showWeekNumber
                    weekStartsOn={1}
                    fromYear={2017}
                    toYear={2026}
                    captionLayout="dropdown-buttons"
                />
            </CardContent>
        </Card>
    );
}
