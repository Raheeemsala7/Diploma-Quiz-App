import { IApiResponse, IErrorResponse } from "@/src/shared/lib/types/api"
import { ExamQuestion, IPayloadSubmissions, IQueItem, IQuestionBulk, IQuestionInfo, IQuestionUpdate, IResponseSubmissions } from "../types/questions"
import { HEADERS } from "@/src/shared/constant/api.constant"
import { getNextAuthToken } from "../../auth/util/auth.util"
import { getToken } from "next-auth/jwt"
import { RESPONSES } from "@/src/shared/constant/api.responses"
import { NextRequest } from "next/server"



export const getQuestionsApi = async (
    examId: string,
    options?: {
        search?: string;
        sortBy?: "title" | "createdAt";
        sortOrder?: "asc" | "desc";
    }
): Promise<IQueItem[]> => {

    const token = await getNextAuthToken();
    
    if (!token)  throw new Error("Unauthorized");


    const query = new URLSearchParams();

    if (options?.search?.trim()) {
        query.append("search", options.search.trim());
    }

    if (options?.sortBy) {
        query.append("sortBy", options.sortBy);
    }

    if (options?.sortOrder) {
        query.append("sortOrder", options.sortOrder);
    }

    const res = await fetch(
        `${process.env.API_URL}/questions/exam/${examId}?${query.toString()}`,
        {
            headers: {
                ...HEADERS.authorize(token.token),
            },
            cache: "no-store",
        }
    );

    const data: IApiResponse<{questions : IQueItem[]}> = await res.json();

    if (!data.status) {
        throw new Error(data.message || "Something went wrong");
    }

    return data.payload.questions as IQueItem[];
};
export const getSingleQuestionApi = async (questionId: string) => {

    const token = await getNextAuthToken();

    if (!token) throw new Error("No token provided.")

    const res = await fetch(`${process.env.API_URL}/questions/${questionId}`, {
        headers: {
            ...HEADERS.authorize(token.token)
        }
    })

    const data: IApiResponse<IQuestionInfo> = await res.json()

    if (!data.status) {
        throw new Error(data.message || "Something went wrong");
    }
    return data.payload as IQuestionInfo
}

export const getMultiQuestionApi = async ({ req, id}: { req: NextRequest; id: string;}) => {

    const token = await getToken({ req });

    if (!token) return RESPONSES.unauthorized 

    const res = await fetch(`${process.env.API_URL}/questions/exam/${id}`, {
        headers: {
            ...HEADERS.authorize(token.token)
        }
    })

    const data: IApiResponse<{questions : IQueItem[]}> = await res.json()

    
    if (!data.status) {
        throw new Error(data.message || "Something went wrong");
    }
    return data as IApiResponse<{questions : IQueItem[]}>
}


export const postSingleQuestionAction = async ({ req, body, id }: { req: NextRequest; body: ExamQuestion; id: string }) => {
    const token = await getToken({ req });

    if (!token) return RESPONSES.unauthorized

    const res = await fetch(`${process.env.API_URL}/questions/exam/${id}`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            ...HEADERS.authorize(token.token),
            ...HEADERS.JsonBody
        }
    })

    const data: IApiResponse<IQuestionInfo> = await res.json()

    if (!data.status) {
        return data as IErrorResponse
    }
    return data as IApiResponse<IQuestionInfo>
}
export const postMultiBulkQuestionAction = async ({ req, body, id }: { req: NextRequest; body: IQuestionBulk; id: string }) => {
    const token = await getToken({ req });

    if (!token) return RESPONSES.unauthorized

    const res = await fetch(`${process.env.API_URL}/questions/exam/${id}/bulk`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            ...HEADERS.authorize(token.token),
            ...HEADERS.JsonBody
        }
    })

    const data: IApiResponse<IQuestionInfo> = await res.json()

    if (!data.status) {
        return data as IErrorResponse
    }
    return data as IApiResponse<IQuestionInfo>
}



export const postSubmissions = async ({ req, body }: { req: NextRequest; body: IPayloadSubmissions; }) => {

    const token = await getToken({ req });

    if (!token) return RESPONSES.unauthorized as IErrorResponse

    const res = await fetch(`${process.env.API_URL}/submissions`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            ...HEADERS.authorize(token.token),
            ...HEADERS.JsonBody,
        }
    })


    const data = await res.json()

    if (!res.ok) {
        throw {
            status: false,
            code: data.code || res.status,
            message: data.message || "Something went wrong",
            errors: data.errors || [],
        } as IErrorResponse;
    }
    return data.payload as IResponseSubmissions
}


export const putSingleQuestionAction = async ({ req, body, id }: { req: NextRequest; body: IQuestionUpdate; id: string }) => {
    const token = await getToken({ req });

    if (!token) return RESPONSES.unauthorized

    const res = await fetch(`${process.env.API_URL}/questions/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            ...HEADERS.authorize(token.token),
            ...HEADERS.JsonBody
        }
    })

    const data: IApiResponse<IQuestionInfo> = await res.json()

    if (!data.status) {
        return data as IErrorResponse
    }
    return data as IApiResponse<IQuestionInfo>
}