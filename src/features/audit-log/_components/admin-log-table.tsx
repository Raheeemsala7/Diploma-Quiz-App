"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  ArrowDownWideNarrow,
  Ellipsis,
  Eye,
  Trash2
} from "lucide-react";
import { Menubar, MenubarContent, MenubarGroup, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/src/shared/components/ui/menubar';
import { useRouter, useSearchParams } from "next/navigation";
import slugify from "slugify";
import { IAdminLog, IAuditLogItem } from '../types/audit';



const AdminLogsTable = ({ logs }: { logs: IAuditLogItem[] }) => {

  const router = useRouter();
  const searchParams = useSearchParams();


  function formatDateTime(isoString: string) {
    const date = new Date(isoString);

    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),

      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),

      iso: isoString,

      timestamp: date.getTime()
    };
  }

  function textToAction(action: string) {
    switch (action) {
      case "CREATE":
        return "text-emerald-600";
      case "UPDATE":
        return "text-yellow-600";
      case "DELETE":
        return "text-destructive";
      default:
        return "text-primary";
    }
  }
  function textToRole(action: string) {
    switch (action) {
      case "SUPER_ADMIN":
        return "text-destructive";
      default:
        return "text-primary";
    }
  }



  const setSort = (sortBy: string, sortOrder: string) => {
  const params = new URLSearchParams(searchParams.toString());

  params.set("sortBy", sortBy);
  params.set("sortOrder", sortOrder);
  params.set("page", "1");

  router.push(`?${params.toString()}`, {
    scroll: false,
  });
};


  if (logs?.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No diplomas found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Entity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Time</th>
              <th className="px-4 py-3 text-center text-sm font-semibold flex justify-center">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger className="flex items-center border-none w-fit hover:bg-transparent">
                      Sort
                      <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                    </MenubarTrigger>

                    <MenubarContent>
                      <MenubarGroup>

                        {/* TITLE */}
                        <MenubarItem
                          onClick={() => setSort("title", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowUpAZ className="h-4 w-4" />
                          Title (A → Z)
                        </MenubarItem>

                        <MenubarItem
                          onClick={() => setSort("title", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <ArrowDownAZ className="h-4 w-4" />
                          Title (Z → A)
                        </MenubarItem>

                        {/* USER */}
                        <MenubarItem
                          onClick={() => setSort("user", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          User (A → Z)
                        </MenubarItem>

                        <MenubarItem
                          onClick={() => setSort("user", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          User (Z → A)
                        </MenubarItem>

                        {/* ENTITY */}
                        <MenubarItem
                          onClick={() => setSort("entity", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          Entity (A → Z)
                        </MenubarItem>

                        <MenubarItem
                          onClick={() => setSort("entity", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          Entity (Z → A)
                        </MenubarItem>

                        {/* ACTION */}
                        <MenubarItem
                          onClick={() => setSort("action", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          Action (A → Z)
                        </MenubarItem>

                        <MenubarItem
                          onClick={() => setSort("action", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          
                          Action (Z → A)
                        </MenubarItem>

                        {/* CREATED AT */}
                        <MenubarItem
                          onClick={() => setSort("createdAt", "desc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarArrowDown className="h-4 w-4" />
                          Newest first
                        </MenubarItem>

                        <MenubarItem
                          onClick={() => setSort("createdAt", "asc")}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <CalendarArrowUp className="h-4 w-4" />
                          Oldest first
                        </MenubarItem>

                      </MenubarGroup>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log, index) => (
              <tr
                key={log.id}
                className={`border-t ${index % 2 === 0 ? '' : 'bg-muted/40'
                  } hover:bg-muted/60 transition-colors`}
              >
                <td className="px-4 py-3">
                  <div className='space-y-1'>
                    <p className={`text-sm ${textToAction(log.action)} font-bold`}>{log.action}</p>
                    <p className='text-sm whitespace-nowrap text-muted-foreground'>Method: {log.httpMethod}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground truncate">
                    <p className='text-foreground'>{log.actorUsername}</p>
                    <p className='text-muted-foreground'>{log.actorEmail}</p>
                    <p className={textToRole(log.actorRole)}>{log.actorRole}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground truncate">
                    <p>{log.entityType}</p>
                    <p className='text-muted-foreground'>{log.entityId}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-foreground truncate">
                    <p>{formatDateTime(log.createdAt).time}</p>
                    <p>{formatDateTime(log.createdAt).date}</p>

                  </div>
                </td>

                <td className="px-4 py-3 flex justify-center items-center">
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className='h-7.5 w-7.5 flex justify-center items-center px-0 border-none'>
                        <Ellipsis />
                      </MenubarTrigger>
                      <MenubarContent>

                        <MenubarGroup>
                          <MenubarItem className="flex items-center gap-2" onClick={() => router.push(`/audit-log/${log.id}`)}>
                            <Eye className="h-4 w-4 text-green-500" />
                            View
                          </MenubarItem>

                          <MenubarItem className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            Delete
                          </MenubarItem>
                        </MenubarGroup>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLogsTable