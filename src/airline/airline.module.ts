/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';

@Module({
  providers: [],
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  controllers: []
})
export class AirlineModule {}
