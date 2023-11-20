import { Test, TestingModule } from '@nestjs/testing';
import { AirportService } from './airport.service';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService]
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    airportList = [];
    for(let i = 0; i < 5; i++){
      const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.location.countryCode('alpha-3'),
        country: faker.location.country(),
        city: faker.location.city()
      })
      airportList.push(airport);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportList.length)
  });

  it('findOne should return a airport by id', async () => {
    const storedAirport: AirportEntity = airportList[0];
    const airport:AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('create should return a new airport', async () =>{
    const airport: AirportEntity = {
      id:"",
      name: faker.company.name(),
      code: faker.location.countryCode('alpha-3'),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: []
    }

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({where:{id: newAirport.id}});
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(newAirport.name);

  })

  it('create should throw an exception for a repeated name', async () =>{
    const airport: AirportEntity = {
      id:"",
      name: airportList[0].name,
      code: faker.location.countryCode('alpha-3'),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: []
    }

    await expect(() => service.create(airport)).rejects.toHaveProperty("message", "There is already a airport with that name")

  })

  it('create should throw an exception for size code different of 3 characters', async () =>{
    const airport: AirportEntity = {
      id:"",
      name: faker.company.name(),
      code: faker.location.countryCode('alpha-2'),
      country: faker.location.country(),
      city: faker.location.city(),
      airlines: []
    }

    await expect(() => service.create(airport)).rejects.toHaveProperty("message", "the code must be exactly 3 characters")

  })

  it('update should modify a airport', async () => {
    const airport: AirportEntity = airportList[0];
    airport.name = "New name";
    const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
    const storedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name)
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, name: "New name"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('update should throw an exception for an repeated name', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, name: airportList[1].name
    }
    await expect(() => service.update(airport.id, airport)).rejects.toHaveProperty("message", "There is already a airport with that name")
  });

  it('update should throw an exception for size code different of 3 characters', async () => {
    let airport: AirportEntity = airportList[0];
    airport = {
      ...airport, code: faker.location.countryCode('alpha-2')
    }
    await expect(() => service.update(airport.id, airport)).rejects.toHaveProperty("message", "the code must be exactly 3 characters")
  });

  it('delete should remove a airport', async () => {
    const airport: AirportEntity = airportList[0];
    await service.delete(airport.id);
    const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
});
