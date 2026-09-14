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

export function PaginationLogs({ currentPage, totalItems, totalPages, limit }: IProps) {

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
        <div className="flex justify-between px-4 py-3 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-start gap-4 ">
                <div className="text-sm text-foreground">
                    <span className="font-semibold text-foreground">{startItem}</span> - <span className="font-semibold text-foreground">{endItem}</span> of {' '}
                    <span className="font-semibold text-foreground">{totalItems}</span>
                </div>



                <div className="flex gap-3 items-center border border-border">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="size-9 px-0"
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="text-sm text-muted-foreground">
                        Page <span>{currentPage}</span> of{' '}
                        <span>{totalPages}</span>
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

            <Link href={"/create-new-diploma"} className={cn(buttonVariants())} >
                <PlusIcon className='size-4' />
                Create New Diploma
            </Link>

        </div>
    );
}
