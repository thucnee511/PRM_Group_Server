import { HttpStatus } from "@nestjs/common";

export interface ItemBaseResponse<T>{
    status: HttpStatus;
    data: T;
    message?: string;
}

export interface ListBaseResponse<T>{
    status: HttpStatus;
    size: number;
    page: number;
    totalSize: number;
    totalPage: number;
    data: T[];
    message?: string;
}

export interface CustomErrorResponse {
    status: HttpStatus;
    message: string | object;
}