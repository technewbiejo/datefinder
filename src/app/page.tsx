import DateFinder from '@/components/date-finder';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center p-4">
            <div className="w-full max-w-6xl mx-auto space-y-6">
                <header className="relative text-center">
                    <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
                        Week Date Finder
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        A simple tool to find dates from week numbers.
                    </p>
                    <div className="absolute top-0 right-0">
                        <ThemeToggle />
                    </div>
                </header>
                <DateFinder />
            </div>
        </main>
    );
}
