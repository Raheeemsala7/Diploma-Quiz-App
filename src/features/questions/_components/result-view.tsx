"use client";

import { Card } from "@/src/shared/components/ui/card";
import { Button, buttonVariants } from "@/src/shared/components/ui/button";
import { CheckCircle2, FolderSearch, RotateCcw, XCircle, CheckCheck } from "lucide-react";
import { IQuestionAnalytics, ISubmission } from "../types/questions";
import { Label } from "@/src/shared/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/shared/components/ui/chart";
import { Pie, PieChart } from "recharts";
import Link from "next/link";
import { cn } from "@/src/shared/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
    submission: ISubmission;
    analytics: IQuestionAnalytics[];
}
const chartConfig = {
    visitors: {
        label: "Answers",
    },
    Correct: {
        label: "Correct",
        color: "var(--success)",
    },
    Wrong: {
        label: "Wrong",
        color: "var(--destructive)",
    },
};

export default function ResultView({ submission, analytics }: Props) {
    const router = useRouter()

    const chartData = [
        {
            browser: "Correct",
            visitors: submission?.correctAnswers || 0,
            fill: "var(--success)",
        },
        {
            browser: "Wrong",
            visitors: submission?.wrongAnswers || 0,
            fill: "var(--destructive)",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">

                {/* Score summary */}
                <Card className="flex flex-col items-center justify-center gap-2 border-border bg-muted/30 p-6">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square h-full max-h-[203px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />

                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={60}
                                outerRadius={100}
                            />
                        </PieChart>
                    </ChartContainer>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <span className="size-4 rounded-full bg-success"></span>
                            <span className="text-sm font-medium text-foreground">
                                Correct: {submission?.correctAnswers || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="size-4 rounded-full bg-destructive"></span>
                            <span className="text-sm font-medium text-foreground">
                                Wrong: {submission?.wrongAnswers || 0}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Question-by-question breakdown */}
                <div className="max-h-[400px] space-y-4 overflow-y-auto rounded-lg border border-border bg-card p-4 lg:max-h-[300px]">
                    {analytics.map((q) => (
                        <div key={q.questionId} className="space-y-3 border-b border-border pb-4 last:border-none last:pb-0">
                            <h3 className="flex items-start gap-2 text-base font-semibold text-foreground">
                                {q.isCorrect ? (
                                    <CheckCircle2 className="mt-1 size-5 shrink-0 text-success" />
                                ) : (
                                    <XCircle className="mt-1 size-5 shrink-0 text-destructive" />
                                )}
                                {q.questionText}
                            </h3>

                            <div className="space-y-2 pl-7">
                                <div
                                    className={cn(
                                        "flex items-center justify-between gap-2.5 rounded-md border px-3 py-2",
                                        q.isCorrect
                                            ? "border-success/30 bg-success/5"
                                            : "border-destructive/30 bg-destructive/5"
                                    )}
                                >
                                    <Label className="text-sm text-foreground">
                                        {q.selectedAnswer.text}
                                    </Label>
                                    {!q.isCorrect && (
                                        <CheckCheck className="size-4 shrink-0 text-success" />
                                    )}
                                </div>

                                {!q.isCorrect && (
                                    <div className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-success" />
                                        <Label className="text-sm font-medium text-success">
                                            {q.correctAnswer.text}
                                        </Label>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <Button variant="secondary" className="flex-1" onClick={() => router.refresh()}>
                    <RotateCcw />
                    <span>Restart</span>
                </Button>
                <Link href={"/"} className={cn(buttonVariants(), "flex-1")}>
                    <FolderSearch />
                    <span>Explore</span>
                </Link>
            </div>
        </div>
    );
}