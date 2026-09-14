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
                const error: IErrorResponse = {
                    status: false,
                    code: result.code || response.status,
                    message: result.message || "Request failed",
                    errors: result.errors || [],
                };

                const err = new Error(error.message) as Error & IErrorResponse;
                Object.assign(err, error);

                throw err;
            }

            return result as IResponseSubmissions;
        },
    })
}