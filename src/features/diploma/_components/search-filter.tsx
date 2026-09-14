'use client';

import { useState } from 'react';

import { ChevronsDownUp, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';



export function SearchFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');


    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        } else {
            params.delete("search");
        }

        // reset page
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };


    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("search");
        params.set("page", "1");

        setSearchQuery("");

        router.push(`?${params.toString()}`);
    };


    return (
        <div className="rounded-lg border border-border bg-card mb-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className='size-4.5 text-muted-foreground' />
                    <span className="font-medium text-sm">Search & Filters</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronsDownUp
                        size={14}
                        className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                    />
                    <span>{isCollapsed ? 'Show' : 'Hide'}</span>
                </button>
            </div>

            {!isCollapsed && (
                <div className="px-4 py-4 space-y-4">
                    <Input
                        type="text"
                        placeholder="Search by title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11"
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleApplyFilters}
                            disabled={!searchQuery}
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
