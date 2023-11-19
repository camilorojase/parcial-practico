import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

@Module({
  providers: [AirportService],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  controllers: []
})
export class AirportModule {}