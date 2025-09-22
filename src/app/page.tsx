import DateFinder from '@/components/date-finder';

export default function Home() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg mx-auto space-y-6">
                <header className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-headline font-bold text-foreground">
                        Week Date Finder
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                        A simple tool to find dates from week numbers.
                    </p>
                </header>
                <DateFinder />
            </div>
        </main>
    );
}
