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

export function PaginationDiplomas({ currentPage, totalItems, totalPages, limit }: IProps) {

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
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-start gap-4 ">
                <div className="text-sm text-foreground">
                    <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> of{' '}
                    <span className="font-semibold">{totalItems}</span>
                </div>



                <div className="flex gap-3 items-center">
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="text-sm whitespace-nowrap text-muted-foreground">
                        Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
                        <span className="font-medium text-foreground">{totalPages}</span>
                    </div>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
