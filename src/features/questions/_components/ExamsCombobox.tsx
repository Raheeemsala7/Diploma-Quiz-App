"use client";

import { memo, useState } from "react";

import { useExamsSelect } from "../../exams/hooks/hooks";
import { IExam } from "../../exams/types/exam";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select";

interface Props {
    selectedId?: string;
    diplomaId: string;
    onChange: (val: string) => void
}

 function ExamsComboboxComponent({ selectedId, diplomaId, onChange }: Props ) {
    const [open, setOpen] = useState(false);

    const { data, isLoading } = useExamsSelect({
        diplomaId,
    });

    if (isLoading) {
        return (
            <Select open={false}>
                <SelectTrigger className="w-full" disabled>
                    <SelectValue placeholder="Loading exams..." />
                </SelectTrigger>
            </Select>
        );
    }

    if (!data?.status) {
        return null;
    }

    const exams = data.payload.data || [];

    const selectedExam = exams.find((e: IExam) => e.id === selectedId);

    return (
        <Select
            value={selectedId}
            onValueChange={(val) => {
                onChange(val);
            }}
            open={open}
            onOpenChange={setOpen}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={selectedExam?.title || "Select exam"} />
            </SelectTrigger>

            <SelectContent className="p-0">
                <SelectGroup>
                    {exams.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                            {e.title}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}


export const ExamsCombobox =
    memo(ExamsComboboxComponent);