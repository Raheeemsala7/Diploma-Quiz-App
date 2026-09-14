'use client';

import { useState } from 'react';

import { ChevronsDownUp, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/src/shared/components/ui/input';
import { Button } from '@/src/shared/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select';
import { useDiplomasFilter } from '../../diploma/hooks/hooks';
import { cn } from '@/src/shared/lib/utils';


export function SearchFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
    const [selectedDiploma, setSelectedDiploma] = useState(() => searchParams.get("diplomaId") || "");

    const { data: diplomas } = useDiplomasFilter()

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // search
        if (searchQuery.trim()) {
            params.set("search", searchQuery.trim());
        } else {
            params.delete("search");
        }

        // diploma filter
        if (selectedDiploma) {
            params.set("diplomaId", selectedDiploma);
        } else {
            params.delete("diplomaId");
        }

        // reset page
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("search");
        params.delete("diplomaId");
        params.set("page", "1");

        setSearchQuery("");
        setSelectedDiploma("");

        router.push(`?${params.toString()}`);
    };

    const hasActiveFilters = Boolean(searchQuery || selectedDiploma);

    return (
        <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className='size-5 text-primary' />
                    <span className="text-base font-semibold">Search & Filters</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center gap-1 text-sm text-muted-foreground transition-opacity hover:opacity-80"
                >
                    <ChevronsDownUp
                        size={14}
                        className={cn("transition-transform", isCollapsed && "rotate-180")}
                    />
                    <span className="text-xs">{isCollapsed ? "Show" : "Hide"}</span>
                </button>
            </div>

            {!isCollapsed && (
                <div className="space-y-4 border-t border-border px-4 py-4">
                    <Input
                        type="text"
                        placeholder="Search by title"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                        className="h-11"
                    />

                    <Select value={selectedDiploma} onValueChange={setSelectedDiploma}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Diploma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {diplomas?.map((diploma) => (
                                    <SelectItem key={diploma.id} value={diploma.id}>
                                        {diploma.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-muted-foreground"
                            >
                                <X className="size-4" />
                                Clear
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleApplyFilters}
                            >
                                Apply
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}