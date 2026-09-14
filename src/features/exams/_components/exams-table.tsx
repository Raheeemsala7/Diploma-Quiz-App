"use client";

import Image from "next/image";
import {
  ArrowUpAZ,
  ArrowDownAZ,
  ArrowDown10,
  ArrowUp10,
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
import { useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import { IExam } from "../types/exam";
import SkeletonTable from "@/src/shared/components/shared/skeleton-tabel";

interface IProps {
  exams: IExam[];
  isPending: boolean;
  isFetching: boolean;
  isLoading: boolean;
}

const ExamsTable = ({ exams, isFetching, isLoading, isPending }: IProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSort = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

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
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase whitespace-nowrap">
                No. of Questions
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
                          onClick={() => setSort("questions", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowDown10 className="size-4" />
                          Questions (most)
                        </MenubarItem>
                        <MenubarItem
                          onClick={() => setSort("questions", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowUp10 className="size-4" />
                          Questions (least)
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
            {isFetching && isLoading && isPending && <SkeletonTable />}

            {exams.length
              ? exams?.map((exam) => (
                  <tr key={exam.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3">
                      <div className="relative size-10 overflow-hidden rounded-md">
                        <Image
                          src={exam.image}
                          alt={exam.title}
                          fill
                          className="object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-40 truncate text-sm font-medium text-foreground">
                        {exam.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-60 line-clamp-2 text-sm text-muted-foreground">
                        {exam.description}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        {exam.questionsCount}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <Menubar>
                          <MenubarMenu>
                            <MenubarTrigger
                              aria-label="Exam actions"
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
                                      `/exams/${exam.id}/${slugify(exam.title, { lower: false })}`
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
                ))
              : null}
          </tbody>
        </table>

        {exams.length === 0 && !isFetching && (
          <div className="rounded-none border-t border-border p-10 text-center">
            <p className="text-muted-foreground">
              No exams found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsTable;