import { Skeleton } from "@/src/shared/components/ui/skeleton";

export function DiplomaCardSkeleton() {
    return (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">
            <div className="relative aspect-[4/3] w-full">
                <Skeleton className="absolute inset-0 bg-muted" />

                <div className="absolute inset-x-0 bottom-0 mx-3 mb-3 space-y-2 rounded-md bg-sidebar/90 p-4">
                    <Skeleton className="h-5 w-3/4 bg-sidebar-foreground/40" />
                    <Skeleton className="h-4 w-full bg-sidebar-foreground/40" />
                    <Skeleton className="h-4 w-5/6 bg-sidebar-foreground/40" />
                </div>
            </div>
        </div>
    );
}