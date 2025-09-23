'use client';

import React, { useState } from 'react';
import { format, differenceInDays, addDays, addMonths, addYears } from 'date-fns';
import { CalendarIcon, ArrowRight, Plus, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ShelfLifeCalculator() {
    // State for date difference calculator
    const [startDateDiff, setStartDateDiff] = useState<Date | undefined>();
    const [endDateDiff, setEndDateDiff] = useState<Date | undefined>();
    const [diffResult, setDiffResult] = useState<string | null>(null);

    // State for adding shelf life
    const [startDateAdd, setStartDateAdd] = useState<Date | undefined>(new Date());
    const [shelfLifeValue, setShelfLifeValue] = useState<string>('365');
    const [shelfLifeUnit, setShelfLifeUnit] = useState<'days' | 'months' | 'years'>('days');
    const [addResult, setAddResult] = useState<string | null>(null);

    const calculateDifference = () => {
        if (startDateDiff && endDateDiff) {
            const days = differenceInDays(endDateDiff, startDateDiff);
            if (days < 0) {
                setDiffResult('End date must be after start date.');
            } else {
                const years = Math.floor(days / 365);
                const remainingDays = days % 365;
                let resultString = `The difference is ${days} day(s).`;
                if (years > 0) {
                    resultString += ` (Approximately ${years} year(s) and ${remainingDays} day(s)).`;
                }
                setDiffResult(resultString);
            }
        } else {
            setDiffResult('Please select both a start and end date.');
        }
    };

    const calculateShelfLife = () => {
        if (startDateAdd && shelfLifeValue) {
            const value = parseInt(shelfLifeValue, 10);
            if (isNaN(value)) {
                setAddResult('Please enter a valid number for the shelf life.');
                return;
            }
            let newDate;
            if (shelfLifeUnit === 'days') {
                newDate = addDays(startDateAdd, value);
            } else if (shelfLifeUnit === 'months') {
                newDate = addMonths(startDateAdd, value);
            } else {
                newDate = addYears(startDateAdd, value);
            }
            setAddResult(`The end date is ${format(newDate, 'PPP')}.`);
        } else {
            setAddResult('Please select a start date and enter a shelf life value.');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Shelf Life Calculator</CardTitle>
                <CardDescription>Calculate date differences and project end dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Date Difference Calculator */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Calculate Days Between Dates</h3>
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                        <DatePicker date={startDateDiff} setDate={setStartDateDiff} placeholder="Start Date" />
                        <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground" />
                        <DatePicker date={endDateDiff} setDate={setEndDateDiff} placeholder="End Date" />
                    </div>
                    <Button onClick={calculateDifference} className="w-full">Calculate Difference</Button>
                    {diffResult && (
                        <Alert>
                            <HelpCircle className="h-4 w-4" />
                            <AlertTitle>Result</AlertTitle>
                            <AlertDescription>{diffResult}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <Separator />

                {/* Add Shelf Life Calculator */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Add Shelf Life to Date</h3>
                    <div className="space-y-2">
                        <DatePicker date={startDateAdd} setDate={setStartDateAdd} placeholder="Start Date" />
                        <div className="flex items-center gap-2">
                            <Plus className="h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={shelfLifeValue}
                                onChange={(e) => setShelfLifeValue(e.target.value)}
                                placeholder="e.g., 365"
                                className="w-24"
                            />
                            <Select
                                value={shelfLifeUnit}
                                onValueChange={(value: 'days' | 'months' | 'years') => setShelfLifeUnit(value)}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="days">Days</SelectItem>
                                    <SelectItem value="months">Months</SelectItem>
                                    <SelectItem value="years">Years</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button onClick={calculateShelfLife} className="w-full">Calculate End Date</Button>
                    {addResult && (
                        <Alert variant="default" className="w-full bg-primary/10 border-primary/50">
                            <HelpCircle className="h-4 w-4 stroke-primary" />
                            <AlertTitle className="text-primary">Result</AlertTitle>
                            <AlertDescription className="text-foreground">{addResult}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function DatePicker({ date, setDate, placeholder }: { date: Date | undefined, setDate: (date: Date | undefined) => void, placeholder: string }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    fromYear={2017}
                    toYear={2030}
                    captionLayout="dropdown-buttons"
                />
            </PopoverContent>
        </Popover>
    );
}
