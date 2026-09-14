'use client';

import { useEffect, useState } from 'react';

import { ChevronsDownUp, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/src/shared/components/ui/input';
import { Checkbox } from 'radix-ui';
import { Button } from '@/src/shared/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/src/shared/components/ui/select';
import { UsersCombobox } from './users-combobox';

const categroyList = [
    "DIPLOMA", "EXAM", "QUESTION", "USER", "SYSTEM"
]
const actionList = [
    "CREATE", "UPDATE", "DELETE", "SET_IMMUTABLE", "SEED_DATA"
]


export function SearchFilters() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedAction, setSelectedAction] = useState('');


      useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    setSelectedAction(searchParams.get("action") || "");
  }, [searchParams]);

 const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // category
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    // action
    if (selectedAction) {
      params.set("action", selectedAction);
    } else {
      params.delete("action");
    }

    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("action");
    params.set("page", "1");

    setSelectedCategory("");
    setSelectedAction("");

    router.push(`?${params.toString()}`, { scroll: false });
  };


    return (
        <div className="rounded-lg border border-border bg-card mb-4">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className='size-5 text-muted-foreground' />
                    <span className="font-semibold text-base text-foreground">Search & Filters</span>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                >
                    <ChevronsDownUp
                        size={14}
                        className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                    />
                    <span className="text-xs">Hide</span>
                </button>
            </div>

            {!isCollapsed && (
                <div className="px-4 py-4 space-y-4 border-t">
                    <div className="flex gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full flex-1">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {categroyList?.map((category) => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <Select value={selectedAction} onValueChange={setSelectedAction}>
                        <SelectTrigger className="w-full flex-1">
                            <SelectValue placeholder="Action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {actionList?.map((action) => (
                                    <SelectItem key={action} value={action}>{action}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <UsersCombobox />
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-3">Immutability</label>
                        {/* <div className="flex items-center gap-2">
                            <Checkbox
                                id="immutability"
                            // checked={immutabilityFilter}
                            // onCheckedChange={onImmutabilityChange}
                            />
                            <label htmlFor="immutability" className="text-sm text-gray-600 cursor-pointer">
                                Show immutable courses
                            </label>
                        </div> */}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className='h-9 w-25 px-3'
                        >
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleApplyFilters}
                            disabled={!selectedCategory && !selectedAction}
                            className="h-9 w-25 px-3"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
