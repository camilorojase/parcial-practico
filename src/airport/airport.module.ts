/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirportEntity } from './airport.entity';

@Module({
  providers: [],
  imports: [TypeOrmModule.forFeature([AirportEntity])],
  controllers: []
})
export class AirportModule {}