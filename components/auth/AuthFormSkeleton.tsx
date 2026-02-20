import { Skeleton } from "@/components/ui/skeleton"

export function AuthFormSkeleton({ showName = false }: { showName?: boolean }) {
    return (
        <div className="w-full max-w-md rounded-lg border border-border p-6">
            <div className="mb-6 space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-4 w-64" />
            </div>

            <div className="space-y-4">
                {showName ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-14" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : null}

                <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>

                {showName ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : null}

                <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="mt-4 h-4 w-48" />
        </div>
    )
}
