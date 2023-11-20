import { IsDateString, IsNotEmpty, IsString, IsUrl } from "class-validator";

export class AirlineDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @IsDateString()
    dateFoundation: Date;

    @IsUrl()
    @IsNotEmpty()
    url: string;
}