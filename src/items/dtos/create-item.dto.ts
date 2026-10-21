import { IsNumber, IsString, Min, Max } from "class-validator";

export class CreateItemDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(0, { message: 'Price must be positive' })
    @Max(1000, { message: 'Price must be less than 1000' })
    price: number;

    @IsString()
    location: string;

    @IsString()
    category: string;
}