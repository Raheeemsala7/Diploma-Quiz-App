"use client";

import { useDeferredValue, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/src/shared/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/shared/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/src/shared/components/ui/command";

import { cn } from "@/src/shared/lib/utils";
import { useUsersSelect } from "../hooks/audit.hook";
import { useRouter, useSearchParams } from "next/navigation";

export function UsersCombobox() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState({
        id: "",
        username: "",
        email: "",
    });
    const [search, setSearch] = useState("");
    const deferredSearch = useDeferredValue(search);
    const [inputValue, setInputValue] = useState("");


    const searchParams = useSearchParams()
    const router = useRouter();

    const { data, isLoading } = useUsersSelect(deferredSearch);

    const handleInputChange = (val: string) => {
        setInputValue(val);
        setSearch(val);
    };
    
    // useEffect(() => {
        //     const initial = searchParams.get("search") || "";
        //     // setValue(initial);
        //     setSearch(initial);
        // }, [searchParams]);
        
        
        if (!data?.status) {
            return null;
        }
        
        const users = data?.payload.data ?? [];
        const actorUserId = searchParams.get("actorUserId") || "";
        const selectedUser = users.find((u) => u.id === actorUserId) ;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="flex-1 justify-between"
                >
                      {selectedUser ? selectedUser.email : "Select user..."}


                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
                <Command shouldFilter={false} key="users-combobox"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && search) {
                            e.preventDefault();
                        }
                    }}
                >
                    <CommandInput
                        placeholder="Search users..."
                        value={inputValue}
                        onValueChange={handleInputChange}
                    />

                    <CommandEmpty>
                        {isLoading ? "Loading..." : "No users found"}
                    </CommandEmpty>

                    <CommandGroup>
                        {users.map((user) => (
                            <CommandItem
                                key={user.id}
                                value={user.username}
                                onSelect={() => {
                                    setValue({
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                    });
                                    setOpen(false);

                                    console.log(user.id)

                                    const params = new URLSearchParams(searchParams.toString());

                                    params.set("actorUserId", user.id); 
                                    params.set("page", "1");

                                    router.push(`?${params.toString()}`, {
                                        scroll: false,
                                    });
                                }}
                            >
                                {user.username} ({user.email})

                                <Check
                                    className={cn(
                                        "ml-auto",
                                        value.id === user.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}