"use client"

import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "@/src/shared/constant";
import { cn } from "@/src/shared/lib/utils";

interface CountryPhoneSelectorProps {
    selectedCountryCode: string;
    onCountryChange: (countryCode: string) => void;
    phoneValue: string;
    onPhoneChange: (value: string) => void;
    phoneError?: { message?: string } | null;
    countryError?: { message?: string } | null;
    phoneRef?: React.Ref<HTMLInputElement>;
}

function CountryPhoneSelector({
    selectedCountryCode,
    onCountryChange,
    phoneValue,
    onPhoneChange,
    phoneError,
    countryError,
    phoneRef,
}: CountryPhoneSelectorProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedCountry =
        COUNTRIES.find((c) => c.code === selectedCountryCode) ?? COUNTRIES[0];

    const filtered = COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dialCode.includes(search)
    );

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 50);
    }, [open]);

    const hasError = !!phoneError || !!countryError;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Input row */}
            <div
                className={cn(
                    "flex items-center rounded-md border transition-colors focus-within:ring-3 focus-within:ring-ring/50",
                    hasError
                        ? "border-destructive focus-within:border-destructive"
                        : "border-input"
                )}
            >
                {/* Country trigger */}
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    className="flex shrink-0 items-center gap-1.5 border-r border-input px-3 py-3 text-sm transition-colors hover:bg-muted focus:outline-none"
                >
                    <span className="hidden sm:inline">
                        <ReactCountryFlag
                            countryCode={selectedCountry.code}
                            svg
                            style={{ width: "20px", height: "20px" }}
                        />
                    </span>
                    <span className="font-semibold">
                        {selectedCountry.code}({selectedCountry.dialCode})
                    </span>
                    <ChevronDown
                        className={cn(
                            "size-3.5 text-muted-foreground transition-transform duration-200",
                            open ? "rotate-180" : ""
                        )}
                    />
                </button>

                {/* Phone input */}
                <input
                    ref={phoneRef}
                    type="tel"
                    inputMode="numeric"
                    placeholder="1012345678"
                    value={phoneValue}
                    onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ""))}
                    className="h-11 min-w-0 flex-1 bg-transparent px-3.5 text-sm outline-none placeholder:text-muted-foreground"
                />
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 w-72 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-lg">
                    {/* Search bar */}
                    <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                        <Search className="size-3.5 shrink-0 text-muted-foreground" />
                        <input
                            ref={searchRef}
                            type="text"
                            placeholder="Search country..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>

                    {/* Country list */}
                    <ul className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-3 text-sm text-muted-foreground">
                                No countries found
                            </li>
                        ) : (
                            filtered.map((country) => (
                                <li key={country.code}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onCountryChange(country.code);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className={cn(
                                            "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                            selectedCountryCode === country.code &&
                                                "bg-accent font-semibold text-accent-foreground"
                                        )}
                                    >
                                        <ReactCountryFlag
                                            className="emojiFlag"
                                            countryCode={country.code}
                                            svg
                                            style={{ width: "20px", height: "20px" }}
                                        />

                                        <span className="min-w-0 flex-1 truncate">
                                            {country.name}
                                        </span>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {country.dialCode}
                                        </span>
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CountryPhoneSelector;