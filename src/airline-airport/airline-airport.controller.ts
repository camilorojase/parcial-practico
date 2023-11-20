import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from 'src/airport/airport.dto';
import { AirportEntity } from 'src/airport/airport.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
    constructor(private readonly airlineAirportService: AirlineAirportService){}

    @Post(':airlineId/airports/:airportId')
    async addAirportAirline(@Param('airlineId') airlineId:string, @Param('airportId') airportId:string){
        return this.airlineAirportService.addAirportToAirline(airlineId, airportId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAirportByAirlineIdAirportId(@Param('airlineId') airlineId:string, @Param('airportId') airportId:string){
        return this.airlineAirportService.findAirportFromAirline(airlineId, airportId);
    }

    @Get(':airlineId/airports')
    async findAirportesByAirlineId(@Param('airlineId') airlineId:string){
        return this.airlineAirportService.findAirportsFromAirline(airlineId);
    }

    @Put(':airlineId/airports')
    async associateAirportAirline(@Body() airportesDto: AirportDto[], @Param('airlineId') airlineId:string){
        const airportes = plainToInstance(AirportEntity, airportesDto)
        return await this.airlineAirportService.updateAirportsFromAirline(airlineId, airportes)
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirlineAirport(@Param('airlineId') airlineId:string, @Param('airportId') airportId:string){
        return await this.airlineAirportService.deleteAirportFromAirline(airlineId, airportId);
    }
}
