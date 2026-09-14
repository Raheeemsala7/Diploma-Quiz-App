import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SkeletonTable = () => {
    return (

        Array.from({ length: 5 }).map((_, index) => (
            <tr
                key={index}
                className={`border-t ${index % 2 === 0 ? "bg-card" : "bg-muted/40"}`}
            >
                {/* Image */}
                <td className="px-4 py-3">
                    <Skeleton className="w-10 h-10 rounded-md" />
                </td>

                {/* Title */}
                <td className="px-4 py-3">
                    <Skeleton className="h-4 w-32" />
                </td>

                {/* Description */}
                <td className="px-4 py-3 space-y-2">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-40" />
                </td>

                {/* Questions Count */}
                <td className="px-4 py-3">
                    <Skeleton className="h-4 w-12" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3 flex justify-center">
                    <Skeleton className="h-7 w-7 rounded-md" />
                </td>
            </tr>
        ))

    )
}

export default SkeletonTable