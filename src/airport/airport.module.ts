import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';
import { AirportController } from './airport.controller';

@Module({
  providers: [AirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  controllers: [AirportController]
})
export class AirportModule {}