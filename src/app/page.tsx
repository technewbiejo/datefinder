'use client';

import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

import CalendarTab from '@/components/calendar-tab';
import FindDateWeekTab from '@/components/find-date-week-tab';
import ShelfLifeCalculatorTab from '@/components/shelf-life-calculator-tab';
import GraGrbTab from '@/components/gra-grb-tab';

type Tab = 'calendar' | 'find-date' | 'shelf-life' | 'gra-grb';

const tabContent: { [key in Tab]: { component: React.ReactNode; label: string } } = {
    'calendar': { component: <CalendarTab />, label: 'Calendar' },
    'find-date': { component: <FindDateWeekTab />, label: 'Find Date Week' },
    'shelf-life': { component: <ShelfLifeCalculatorTab />, label: 'Shelf Life Calculator' },
    'gra-grb': { component: <GraGrbTab />, label: 'GRA / GRB' },
};

export default function Home() {
    const [activeTab, setActiveTab] = useState<Tab>('find-date');

    return (
        <main className="min-h-screen flex flex-col items-center p-4">
            <div className="w-full max-w-7xl mx-auto space-y-6">
                <header className="relative flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
                            Week Date Finder
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                            A simple tool to find dates from week numbers. Supported on Website and mobile phones. Developed by Jo L
                        </p>
                    </div>
                    <div className="absolute top-0 right-0">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-col gap-6">
                    <div className="w-full md:w-48">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {tabContent[activeTab].label}
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full md:w-48">
                                <DropdownMenuItem onClick={() => setActiveTab('calendar')}>
                                    Calendar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab('find-date')}>
                                    Find Date Week
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab('shelf-life')}>
                                    Shelf Life Calculator
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab('gra-grb')}>
                                    GRA / GRB
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-1">
                        {tabContent[activeTab].component}
                    </div>
                </div>
            </div>
        </main>
    );
}
