'use client';

import { Button, buttonVariants } from '@/src/shared/components/ui/button';
import { cn } from '@/src/shared/lib/utils';
import { ChevronLeft, ChevronRight, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

type IProps = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;

};

export function PaginationExams({ currentPage, totalItems, totalPages, limit }: IProps) {

    const searchParams = useSearchParams()
    const router = useRouter()
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;

    const endItem = Math.min(currentPage * limit, totalItems);

    const onPageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("page", String(page));

        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-4">
                <div className="text-sm tabular-nums text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">{startItem}</span> -{" "}
                    <span className="font-semibold text-foreground">{endItem}</span> of{" "}
                    <span className="font-semibold text-foreground">{totalItems}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="size-9 px-0"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="px-2 text-sm tabular-nums text-muted-foreground">
                        Page <span className="text-foreground">{currentPage}</span> of{" "}
                        <span className="text-foreground">{totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="size-9 px-0"
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>

            <Link href={"/exams/new"} className={cn(buttonVariants(), "self-start md:self-auto")}>
                <PlusIcon className='size-4' />
                Create New Exam
            </Link>
        </div>
    );
}