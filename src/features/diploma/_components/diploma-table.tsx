"use client";

import Image from "next/image";
import {
  ArrowUpAZ,
  ArrowDownAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  ArrowDownWideNarrow,
  Ellipsis,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/src/shared/components/ui/menubar";
import { IDiploma } from "../types/diploma";
import { useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";

const DiplomaTable = ({ diplomas }: { diplomas: IDiploma[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1");

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  };

  if (diplomas?.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">
          No diplomas found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="flex w-fit items-center gap-1.5 border-none hover:bg-transparent">
                      Sort
                      <ArrowDownWideNarrow className="size-4" />
                    </MenubarTrigger>

                    <MenubarContent>
                      <MenubarGroup>
                        <MenubarItem
                          onClick={() => setSort("title", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowUpAZ className="size-4" />
                          Title (ascending)
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => setSort("title", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowDownAZ className="size-4" />
                          Title (descending)
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem
                          onClick={() => setSort("createdAt", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarArrowDown className="size-4" />
                          Newest first
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => setSort("createdAt", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarArrowUp className="size-4" />
                          Oldest first
                        </MenubarItem>
                      </MenubarGroup>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {diplomas?.map((diploma) => (
              <tr key={diploma.id} className="transition-colors hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="relative size-10 overflow-hidden rounded-md">
                    <Image
                      src={diploma.image}
                      alt={diploma.title}
                      fill
                      className="object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="truncate text-sm font-medium text-foreground">
                    {diploma.title}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {diploma.description}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center">
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger
                          aria-label="Diploma actions"
                          className="grid size-8 place-items-center rounded-md border border-border bg-muted/60 p-0 hover:bg-muted"
                        >
                          <Ellipsis />
                        </MenubarTrigger>
                        <MenubarContent>
                          <MenubarGroup>
                            <MenubarItem
                              className="flex items-center gap-2"
                              onClick={() =>
                                router.push(
                                  `/${diploma.id}/${slugify(diploma.title, { lower: false })}`
                                )
                              }
                            >
                              <Eye className="size-4 text-success" />
                              View
                            </MenubarItem>
                            <MenubarItem className="flex items-center gap-2">
                              <Pencil className="size-4 text-info" />
                              Edit
                            </MenubarItem>
                            <MenubarItem
                              variant="destructive"
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </MenubarItem>
                          </MenubarGroup>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiplomaTable;