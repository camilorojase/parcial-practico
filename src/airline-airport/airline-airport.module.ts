import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';

@Module({
  providers: [AirlineAirportService],
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  controllers: []
})
export class AirlineAirportModule {}