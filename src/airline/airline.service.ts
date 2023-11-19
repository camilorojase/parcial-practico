import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {
    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>
    ){}

    async findAll(): Promise<AirlineEntity[]>{
        return await this.airlineRepository.find({
            relations: [
                "airports"
            ]
        });
    }

    async findOne(id: string): Promise<AirlineEntity>{
        const airline: AirlineEntity = await this.airlineRepository.findOne({
            where: {id},
            relations: [
                "airports"
            ]
        });
        if(!airline){
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        }            
        return airline
    }

    async create(airline:AirlineEntity): Promise<AirlineEntity>{
        const currentDate = new Date();
        const airlines: AirlineEntity[] = await this.airlineRepository.find({
            where: {name: airline.name}
        })
        if (airlines.length > 0){
            throw new BusinessLogicException("There is already a airline with that name", BusinessError.PRECONDITION_FAILED);
        }        
        if (currentDate < airline.dateFoundation){
            throw new BusinessLogicException("Date foundation must be less than current date", BusinessError.BAD_REQUEST);
        }
        return await this.airlineRepository.save(airline)
    }

    async update(id:string, airline:AirlineEntity): Promise<AirlineEntity>{
        const currentDate = new Date();
        const persistedairline: AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if(!persistedairline){
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        }
        if(airline.name && (airline.name != persistedairline.name)){
            const airlines: AirlineEntity[] = await this.airlineRepository.find({
                where: {name: airline.name}
            })
            if (airlines.length > 0){
                throw new BusinessLogicException("There is already a airline with that name", BusinessError.PRECONDITION_FAILED);
            }
        }
        if (currentDate < airline.dateFoundation){
            throw new BusinessLogicException("Date foundation must be less than current date", BusinessError.BAD_REQUEST);
        }
        return await this.airlineRepository.save({...persistedairline, ...airline});
    }

    async delete(id:string){
        const airline:AirlineEntity = await this.airlineRepository.findOne({where:{id}});
        if(!airline){
            throw new BusinessLogicException("The airline with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.airlineRepository.remove(airline);
    }
}
