import { getOneAuditLogApi } from '@/src/features/audit-log/apis/audit-log.api'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {

    const { id } = await params

    const data = await getOneAuditLogApi(id)

    if (!data.status) {
        return <p>Error</p>
    }

    const auditLog = data.payload.auditLog

    const handleLink = () => {
        switch (auditLog.entityType) {
            case "diploma":
                return `/${auditLog.entityId}`;

            case "exam":
                return `/exams/${auditLog.entityId}`;

            default:
                return "";
        }
    };

    function formatDateTime(isoString: string) {
        const date = new Date(isoString);

        const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });

        const fullDate = date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        return `${time} | ${fullDate}`;
    }

    const detailRows = [
        { label: "Action", value: auditLog.action },
        { label: "Method", value: auditLog.httpMethod },
        { label: "Date", value: formatDateTime(auditLog.createdAt) },
    ];

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-5">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {auditLog.category} {auditLog.httpMethod} By {auditLog.actorUsername}
                </h1>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Entity :</span>
                    <Link
                        className="flex items-center gap-1 text-primary underline underline-offset-4"
                        href={handleLink()}
                    >
                        {auditLog.entityType} [{auditLog.entityId}]
                        <ExternalLink className='text-muted-foreground' />
                    </Link>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
                <div className="border-b border-border px-5 py-4">
                    <p className="font-medium">Audit Log Details</p>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                    {detailRows.map((row) => (
                        <div key={row.label}>
                            <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>{row.label}</p>
                            <p className='text-sm text-foreground'>{row.value}</p>
                        </div>
                    ))}

                    <div>
                        <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>User</p>
                        <div className="space-y-0.5 text-sm text-foreground">
                            <p className="font-medium">{auditLog.actorUsername}</p>
                            <p className="text-muted-foreground">Email : {auditLog.actorEmail}</p>
                            <p className="text-muted-foreground">IP Address : {auditLog.ipAddress}</p>
                            <p className="text-muted-foreground">Role : {auditLog.actorRole}</p>
                        </div>
                    </div>

                    <div>
                        <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Entity</p>
                        <Link className='text-sm text-primary underline underline-offset-4' href={handleLink()}>
                            {auditLog.entityType} [{auditLog.entityId}]
                        </Link>
                    </div>

                    {auditLog.metadata.keys && (
                        <div className="sm:col-span-2">
                            <p className='mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>Updated Fields</p>
                            <div className="flex flex-wrap gap-2">
                                {auditLog.metadata.keys.map((key: string) => (
                                    <span key={key} className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm text-foreground">
                                        {key}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page