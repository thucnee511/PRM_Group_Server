import { HttpStatus } from "@nestjs/common";

export class ItemBaseResponse<T>{
    status: HttpStatus;
    data: T;
    message?: string;
}

export class ListBaseResponse<T>{
    status: HttpStatus;
    size: number;
    page: number;
    totalSize: number;
    totalPage: number;
    data: T[];
    message?: string;
}

export class CustomErrorResponse {
    status: HttpStatus;
    message: string | object;
}