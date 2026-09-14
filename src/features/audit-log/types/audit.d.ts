
export interface IAuditLogItem {
    id: string;
    createdAt: string;
    actorUserId: string;
    actorUsername: string;
    actorEmail: string;
    actorRole: string;
    category: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata: {
        keys?: string[];
        [key: string]: unknown;
    };
    ipAddress: string;
    userAgent: string;
    httpMethod: string;
    path: string;
}

export interface IAdminLog {
    data: IAuditLogItem[];
}
