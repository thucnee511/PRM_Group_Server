import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseDatePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Date {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date format');
        }
        return date;
    }
}