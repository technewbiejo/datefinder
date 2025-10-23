"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
                      className,
                      classNames,
                      showOutsideDays = true,
                      ...props
                  }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn("p-3", className)}
            classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-between items-center px-2 pt-1 relative",
                caption_label: "text-sm font-medium hidden",
                caption_dropdowns: "flex justify-start gap-2",
                nav: "space-x-1 flex items-center",
                nav_button: cn(
                    buttonVariants({ variant: "outline" }),
                    "h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100"
                ),
                nav_button_previous: "absolute right-8",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse space-y-1",
                head_row: "flex justify-around",
                head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2 justify-around",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                    buttonVariants({ variant: "ghost" }),
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-blue-700 text-white hover:bg-blue-700/90 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-700/90",
                day_outside:
                    "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
                weeknumber: "text-muted-foreground dark:text-orange-400",
                ...classNames,
            }}
            components={{
                Dropdown: ({ value, onChange, children, 'aria-label': ariaLabel }) => {
                    const options = React.Children.toArray(children) as React.ReactElement<React.HTMLProps<HTMLOptionElement>>[]
                    const selected = options.find((child) => child.props.value === value)
                    const handleChange = (value: string) => {
                        const changeEvent = {
                            target: { value },
                        } as React.ChangeEvent<HTMLSelectElement>
                        onChange?.(changeEvent)
                    }
                    const isMonth = ariaLabel?.includes('month');

                    return (
                        <Select
                            value={value?.toString()}
                            onValueChange={(value) => {
                                handleChange(value)
                            }}
                        >
                            <SelectTrigger
                                className={cn(
                                    "w-auto focus:ring-0 focus:ring-offset-0 font-headline border-none",
                                    "btn-gradient-blue text-white",
                                    "dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80",
                                )}
                            >
                                <SelectValue>{selected?.props?.children}</SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-48 bg-background border-border">
                                {options.map((option, id: number) => (
                                    <SelectItem
                                        key={`${option.props.value}-${id}`}
                                        value={option.props.value?.toString() ?? ""}
                                        className="focus:bg-accent"
                                    >
                                        {option.props.children}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )
                },
                IconLeft: ({ className, ...props }) => (
                    <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
                ),
                IconRight: ({ className, ...props }) => (
                    <ChevronRight className={cn("h-4 w-4", className)} {...props} />
                ),
            }}
            {...props}
        />
    )
}
Calendar.displayName = "Calendar"

export { Calendar }
