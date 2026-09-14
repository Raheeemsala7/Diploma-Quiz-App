"use client"

import { useMutation } from "@tanstack/react-query"
import { IPayloadSubmissions, IResponseSubmissions } from "../types/questions"
import { IErrorResponse } from "@/src/shared/lib/types/api"
import { HEADERS } from "@/src/shared/constant/api.constant"


export const useSubmissions = () => {


    return useMutation<IResponseSubmissions, Error & IErrorResponse, IPayloadSubmissions>({
        mutationFn: async (data: IPayloadSubmissions): Promise<IResponseSubmissions> => {
            const response = await fetch("/api/submissions", {
                method: "POST",
                headers: {
                    ...HEADERS.JsonBody,
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (!response.ok) {
                const validationErrors = (
                    Array.isArray(result?.errors) ? result.errors : []
                ) as Array<{ path: string; message: string }>;
                const details = validationErrors
                    .map((e) => e.message)
                    .filter(Boolean)
                    .join(", ");

                const message = details
                    ? `${result?.message || "Request failed"}: ${details}`
                    : result?.message || `Request failed (${response.status})`;

                const error: IErrorResponse = {
                    status: false,
                    code: result?.code || response.status,
                    message,
                    errors: validationErrors,
                };

                const err = new Error(message) as Error & IErrorResponse;
                Object.assign(err, error);

                throw err;
            }

            return result as IResponseSubmissions;
        },
    })
}