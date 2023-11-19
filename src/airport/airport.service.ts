import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {
    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ){}

    async findAll(): Promise<AirportEntity[]>{
        return await this.airportRepository.find({
            relations: [
                "airlines"
            ]
        });
    }

    async findOne(id: string): Promise<AirportEntity>{
        const airport: AirportEntity = await this.airportRepository.findOne({
            where: {id},
            relations: [
                "airlines"
            ]
        });
        if(!airport){
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        }            
        return airport
    }

    async create(airport:AirportEntity): Promise<AirportEntity>{
        const airportes: AirportEntity[] = await this.airportRepository.find({
            where: {name: airport.name}
        })
        if (airportes.length > 0){
            throw new BusinessLogicException("There is already a airport with that name", BusinessError.PRECONDITION_FAILED);
        }
        if (airport.code.length !== 3 ){
            throw new BusinessLogicException("the code must be exactly 3 characters", BusinessError.BAD_REQUEST);
        }
        return await this.airportRepository.save(airport)
    }

    async update(id:string, airport:AirportEntity): Promise<AirportEntity>{
        const persistedairport: AirportEntity = await this.airportRepository.findOne({where:{id}});
        if(!persistedairport){
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        if(airport.name && (airport.name != persistedairport.name)){
            const airportes: AirportEntity[] = await this.airportRepository.find({
                where: {name: airport.name}
            })
            if (airportes.length > 0){
                throw new BusinessLogicException("There is already a airport with that name", BusinessError.PRECONDITION_FAILED);
            }
        }       
        if (airport.code.length !== 3 ){
            throw new BusinessLogicException("the code must be exactly 3 characters", BusinessError.BAD_REQUEST);
        }
        return await this.airportRepository.save({...persistedairport, ...airport});
    }

    async delete(id:string){
        const airport:AirportEntity = await this.airportRepository.findOne({where:{id}});
        if(!airport){
            throw new BusinessLogicException("The airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.airportRepository.remove(airport);
    }
}
