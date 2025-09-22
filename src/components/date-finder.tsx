'use client';

import React, { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarCheck, AlertCircle, Loader } from 'lucide-react';

import { findDateAction } from '@/app/actions';

const FormSchema = z.object({
  yearWeek: z.string().length(4, "Must be a 4-digit number").regex(/^\d{4}$/, "Must be a 4-digit number"),
});

export default function DateFinder() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      yearWeek: '',
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
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Calendar View</CardTitle>
          <CardDescription>Browse years 2017-2026 with week numbers. Weeks start on Monday.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-2 sm:p-6">
          <Calendar
            mode="single"
            className="rounded-md border"
            classNames={{
              caption_label: "font-headline font-semibold text-base sm:text-sm",
              nav_button: "h-8 w-8",
              head_cell: "font-headline w-8 sm:w-9 justify-center text-xs sm:text-sm",
              cell: "h-8 w-8 sm:h-9 sm:w-9",
              day: "h-8 w-8 sm:h-9 sm:w-9",
              weeknumber: "text-blue-600 text-xs",
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
              <Button type="submit" disabled={isPending} className="w-full">
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
    </div>
  );
}
