'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const GraGrbSchema = z.object({
    value: z.string().min(1, { message: 'GRA/GRB value is required.' }),
    remark: z.string().optional(),
});

type GraGrbItem = {
    id: string;
    value: string;
    remark?: string;
    timestamp: string;
};

export default function GraGrbTab() {
    const [list, setList] = useState<GraGrbItem[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const storedList = localStorage.getItem('graGrbList');
        if (storedList) {
            setList(JSON.parse(storedList));
        }
    }, []);

    const updateList = (newItem: GraGrbItem) => {
        const newList = [...list, newItem];
        setList(newList);
        localStorage.setItem('graGrbList', JSON.stringify(newList));
    };

    const clearList = () => {
        setList([]);
        localStorage.removeItem('graGrbList');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast({
                title: 'Copied!',
                description: `"${text}" has been copied to your clipboard.`,
            });
        });
    };

    const form = useForm<z.infer<typeof GraGrbSchema>>({
        resolver: zodResolver(GraGrbSchema),
        defaultValues: {
            value: '',
            remark: '',
        },
    });

    function onSubmit(data: z.infer<typeof GraGrbSchema>) {
        const newItem: GraGrbItem = {
            id: new Date().toISOString(),
            timestamp: new Date().toISOString(),
            ...data,
            value: data.value.toUpperCase(),
        };
        updateList(newItem);
        form.reset();
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Add New GRA / GRB</CardTitle>
                    <CardDescription>Enter a value and an optional remark to add it to your list.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>GRA / GRB Value</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g., GRA 12345"
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="remark"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Remark (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Clarion" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" variant="gradientBlue" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Add to List
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
                    <CardTitle className="font-headline text-2xl">Saved List</CardTitle>
                    {list.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={clearList}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Clear List</span>
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        {list.length > 0 ? (
                            <div className="space-y-4">
                                {list.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <div className="grid gap-1 text-sm">
                                            <div className="flex justify-between items-start">
                                                <p className="font-semibold text-foreground text-lg">{item.value}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground text-right">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </p>
                                                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.value)} className="h-6 w-6">
                                                        <Copy className="h-4 w-4" />
                                                        <span className="sr-only">Copy</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            {item.remark && <p className="text-muted-foreground">Remark: {item.remark}</p>}
                                        </div>
                                        {index < list.length - 1 && <Separator />}
                                    </React.Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Your saved items will appear here.
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
