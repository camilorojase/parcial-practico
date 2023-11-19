/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

@Module({
  providers: [AirlineService],
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  controllers: []
})
export class AirlineModule {}
