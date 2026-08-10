
"use server"

import { IRegisterType } from "@/src/shared/lib/interface";
import { IApiResponse } from "@/src/shared/lib/types/api";
import { IAuthResponse } from "../types/auth";

export const sendEmailVerificationApi = async (email: string) => {

    const res = await fetch(`${process.env.API_URL}/auth/send-email-verification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
    }

    return res.json();
}

export const verifyCodeEmailApi = async ({ email, code }: { email: string, code: string }) => {

    const res = await fetch(`${process.env.API_URL}/auth/confirm-email-verification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
    });

    const data: IApiResponse<void> = await res.json();
    console.log(data)
    if (!data.status) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}


export const registerApi = async (payload: IRegisterType) => {
    console.log(`${process.env.API_URL}/auth/register`)
    const res = await fetch(`${process.env.API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });


    const data: IApiResponse<IAuthResponse> = await res.json();
    console.log(data)
    if (!data.status) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}