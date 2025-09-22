'use server';

import { z } from 'zod';

const FormSchema = z.object({
    yearWeek: z.string().length(4, "Must be a 4-digit number").regex(/^\d{4}$/, "Must be a 4-digit number"),
});

type State = {
    fullDate?: string | null;
    error?: string | null;
};

function getMondayOfWeek(year: number, week: number): Date {
    // January 4th is always in week 1
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay(); // Sunday is 0, Monday is 1
    const isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Make Monday 1, Sunday 7
    simple.setDate(simple.getDate() - isoDayOfWeek + 1);
    return simple;
}

function getOrdinal(day: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = day % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

export async function findDateAction(
    data: z.infer<typeof FormSchema>
): Promise<State> {
    const validatedFields = FormSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: 'Invalid input. Please enter a 4-digit number (YYWW).' };
    }

    const { yearWeek } = validatedFields.data;
    const yearDigits = parseInt(yearWeek.substring(0, 2), 10);
    const week = parseInt(yearWeek.substring(2, 4), 10);

    if (yearDigits < 17 || yearDigits > 26) {
        return { error: 'Invalid year. Year (YY) must be between 17 and 26.' };
    }

    if (week < 1 || week > 53) {
        return { error: 'Invalid week number. Week (WW) must be between 01 and 53.' };
    }

    const year = 2000 + yearDigits;

    try {
        const monday = getMondayOfWeek(year, week);

        // Validate that the calculated Monday is still in the requested year for edge cases
        if (monday.getFullYear() !== year && week > 50) {
            // This handles cases where week 53 of year X is actually in year X+1
            const correctedMonday = getMondayOfWeek(year - 1, week);
            if (correctedMonday.getFullYear() === year) {
                monday.setDate(correctedMonday.getDate());
                monday.setMonth(correctedMonday.getMonth());
                monday.setFullYear(correctedMonday.getFullYear());
            }
        }

        const day = monday.getDate();
        const month = monday.toLocaleString('en-US', { month: 'long' });
        const resultYear = monday.getFullYear();
        const fullDate = `${day}${getOrdinal(day)} ${month} ${resultYear}`;

        return { fullDate: fullDate };
    } catch (e) {
        console.error(e);
        return { error: 'An unexpected error occurred while calculating the date. Please try again.' };
    }
}
