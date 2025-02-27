import { HttpStatusCode } from "./type.base";

export interface ItemBaseResponse<T>{
    status: HttpStatusCode;
    data: T;
    message?: string;
}

export interface ListBaseResponse<T>{
    status: HttpStatusCode;
    size: number;
    page: number;
    totalSize: number;
    totalPage: number;
    data: T[];
    message?: string;
}

export interface CustomErrorResponse {
    status: HttpStatusCode;
    message: string;
}