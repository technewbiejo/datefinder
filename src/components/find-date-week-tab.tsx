'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarCheck, AlertCircle, Loader } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { findDateAction, findDateFromMonthAlphabetAction } from '@/app/actions';

const FormSchema = z.object({
    yearWeek: z.string().length(4, "Must be a 4-digit number").regex(/^\d{4}$/, "Must be a 4-digit number"),
});

const MonthAlphabetSchema = z.object({
    yearMonthDay: z.string().regex(/^(?:\d{2}\s[A-La-l]\s\d{2})?$/, "Format must be YY M DD (e.g., 25 B 11)"),
});

type HistoryItem = {
    input: string;
    output: string;
};

export default function FindDateWeekTab() {
    const [isPending, startTransition] = useTransition();
    const [isPendingMonth, startTransitionMonth] = useTransition();

    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [resultMonth, setResultMonth] = useState<string | null>(null);
    const [errorMonth, setErrorMonth] = useState<string | null>(null);

    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('dateFinderHistory');
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    }, []);

    const updateHistory = (newItem: HistoryItem) => {
        const newHistory = [newItem, ...history];
        setHistory(newHistory);
        localStorage.setItem('dateFinderHistory', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('dateFinderHistory');
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            yearWeek: '',
        },
    });

    const formMonth = useForm<z.infer<typeof MonthAlphabetSchema>>({
        resolver: zodResolver(MonthAlphabetSchema),
        defaultValues: {
            yearMonthDay: '',
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        startTransition(async () => {
            setError(null);
            setResult(null);
            const { fullDate, error } = await findDateAction(data);
            if (error) {
                setError(error);
            } else if (fullDate) {
                setResult(fullDate);
                updateHistory({ input: data.yearWeek, output: fullDate });
            }
        });
    }

    function onMonthSubmit(data: z.infer<typeof MonthAlphabetSchema>) {
        if (!data.yearMonthDay) {
            setErrorMonth("Input cannot be empty.");
            return;
        }
        startTransitionMonth(async () => {
            setErrorMonth(null);
            setResultMonth(null);
            const { fullDate, error } = await findDateFromMonthAlphabetAction(data);
            if (error) {
                setErrorMonth(error);
            } else if (fullDate) {
                setResultMonth(fullDate);
                // Not adding to history for now, can be added if requested
            }
        });
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-6">
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

                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Find Date from Week</CardTitle>
                        <CardDescription>Enter YYWW to find the date. E.g., <span className="font-mono bg-muted p-1 rounded-md">2445</span> for week 45 of 2024.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="yearWeek"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year & Week (YYWW)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="2545" {...field} className="font-mono text-base" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" variant="gradientBlue" disabled={isPending} className="w-full">
                                    {isPending ? <Loader className="animate-spin" /> : 'Find Date'}
                                    {isPending && <span className="ml-2">Calculating...</span>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <AnimatePresence>
                        {(result || error) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CardFooter className="flex flex-col pt-0">
                                    {result && (
                                        <Alert className="w-full bg-primary/10 border-primary/50 text-primary-foreground">
                                            <CalendarCheck className="h-4 w-4 stroke-primary" />
                                            <AlertTitle className="font-headline text-primary">Calculated Date</AlertTitle>
                                            <AlertDescription className="font-bold font-headline text-lg text-foreground">{result}</AlertDescription>
                                        </Alert>
                                    )}
                                    {error && (
                                        <Alert variant="destructive" className="w-full">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle className="font-headline">Error</AlertTitle>
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}
                                </CardFooter>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="font-headline text-2xl">Based on Month Alphabet</CardTitle>
                            <CardDescription>Enter YY M DD to find the date. E.g., <span className="font-mono bg-muted p-1 rounded-md">25 B 11</span> for Feb 11, 2025.</CardDescription>
                        </div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[150px] text-wrap">
                                    <p>Locate at Lot Code : D25 B H11 means D25 is year , B is month and H11 is date .</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <Form {...formMonth}>
                            <form onSubmit={formMonth.handleSubmit(onMonthSubmit)} className="space-y-6">
                                <FormField
                                    control={formMonth.control}
                                    name="yearMonthDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year, Month, Day (YY M DD)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="25 B 11" {...field} className="font-mono text-base" onChange={e => field.onChange(e.target.value.toUpperCase())} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" variant="gradientBlue" disabled={isPendingMonth} className="w-full">
                                    {isPendingMonth ? <Loader className="animate-spin" /> : 'Find Date'}
                                    {isPendingMonth && <span className="ml-2">Calculating...</span>}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <AnimatePresence>
                        {(resultMonth || errorMonth) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CardFooter className="flex flex-col pt-0">
                                    {resultMonth && (
                                        <Alert className="w-full bg-primary/10 border-primary/50 text-primary-foreground">
                                            <CalendarCheck className="h-4 w-4 stroke-primary" />
                                            <AlertTitle className="font-headline text-primary">Calculated Date</AlertTitle>
                                            <AlertDescription className="font-bold font-headline text-lg text-foreground">{resultMonth}</AlertDescription>
                                        </Alert>
                                    )}
                                    {errorMonth && (
                                        <Alert variant="destructive" className="w-full">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle className="font-headline">Error</AlertTitle>
                                            <AlertDescription>{errorMonth}</AlertDescription>
                                        </Alert>
                                    )}
                                </CardFooter>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
                <div className="sticky top-6 flex flex-col space-y-6">
                    <Card className="flex flex-col h-[42rem]">
                        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                            <CardTitle className="font-headline text-2xl">History</CardTitle>
                            {history.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={clearHistory}>
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Clear History</span>
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow overflow-hidden">
                            <ScrollArea className="h-full pr-4">
                                {history.length > 0 ? (
                                    <div className="space-y-4">
                                        {history.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <div className="grid gap-1 text-sm">
                                                    <p className="font-mono text-muted-foreground">Input: {item.input}</p>
                                                    <p className="font-semibold text-foreground">{item.output}</p>
                                                </div>
                                                {index < history.length - 1 && <Separator />}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            Your recent lookups will appear here.
                                        </p>
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
