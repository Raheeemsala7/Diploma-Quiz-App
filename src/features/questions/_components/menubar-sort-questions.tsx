"use client"
import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, CalendarArrowDown, CalendarArrowUp } from 'lucide-react'
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarTrigger } from '@/src/shared/components/ui/menubar'
import { useRouter, useSearchParams } from 'next/navigation';

const MenubarSortQuestion = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const setSort = (sortBy: string, sortOrder: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("sortBy", sortBy);
        params.set("sortOrder", sortOrder);
        params.set("page", "1");

        router.push(`?${params.toString()}`, {
            scroll: false
        });
    };

    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger className="flex w-fit items-center border-none hover:bg-transparent">
                    Sort
                    <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                </MenubarTrigger>

                <MenubarContent>
                    <MenubarGroup>
                        <MenubarItem
                            onClick={() => setSort("title", "asc")}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <ArrowUpAZ className="h-4 w-4" />
                            Title (ascending)
                        </MenubarItem>

                        <MenubarItem
                            onClick={() => setSort("title", "desc")}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <ArrowDownAZ className="h-4 w-4" />
                            Title (descending)
                        </MenubarItem>

                        <MenubarItem
                            onClick={() => setSort("createdAt", "desc")}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <CalendarArrowDown className="h-4 w-4" />
                            Newest first
                        </MenubarItem>

                        <MenubarItem
                            onClick={() => setSort("createdAt", "asc")}
                            className="flex cursor-pointer items-center gap-2"
                        >
                            <CalendarArrowUp className="h-4 w-4" />
                            Oldest first
                        </MenubarItem>
                    </MenubarGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}

export default MenubarSortQuestion