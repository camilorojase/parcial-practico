import { Test, TestingModule } from '@nestjs/testing';
import { AirlineService } from './airline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineEntity } from './airline.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlineList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService]
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase()
  });

  const seedDatabase = async () => {
    repository.clear();
    airlineList = [];
    for(let i = 0; i < 5; i++){
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.paragraphs(5).substring(0, 100),
        dateFoundation: faker.date.anytime(),
        url: faker.image.url()
      })
      airlineList.push(airline);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlineList.length)
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline: AirlineEntity = airlineList[0];
    const airline:AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('create should return a new airline', async () =>{
    const airline: AirlineEntity = {
      id:"",
      name: faker.company.name(),
      description: faker.lorem.paragraphs(5).substring(0, 100),
      dateFoundation: faker.date.past(),
      url: faker.image.url(),     
      airports:[]
    }

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedAirline: AirlineEntity = await repository.findOne({where:{id: newAirline.id}});
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(newAirline.name);

  })

  it('create should throw an exception for a repeated nombre', async () =>{
    const airline: AirlineEntity = {
      id:"",
      name: airlineList[0].name,
      description: faker.lorem.paragraphs(5).substring(0, 100),
      dateFoundation: faker.date.past(),
      url: faker.image.url(),      
      airports:[]
    }

    await expect(() => service.create(airline)).rejects.toHaveProperty("message", "There is already a airline with that name")

  })

  it('create should throw an exception for a date foundation less than current date', async () =>{
    const airline: AirlineEntity = {
      id:"",
      name: faker.company.name(),
      description: faker.lorem.paragraphs(5).substring(0, 101),
      dateFoundation: faker.date.future(),
      url: faker.image.url(),      
      airports:[]
    }

    await expect(() => service.create(airline)).rejects.toHaveProperty("message", "Date foundation must be less than current date")
  })

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    airline.name = "New name";
    airline.dateFoundation = faker.date.past();
    const updatedAirline: AirlineEntity = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();
    const storedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(storedAirline).not.toBeNull();
    expect(storedAirline.name).toEqual(airline.name)
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlineList[0];
    airline = {
      ...airline, name: "New name"
    }
    await expect(() => service.update("0", airline)).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

  it('update should throw an exception for an repeated name', async () => {
    let airline: AirlineEntity = airlineList[0];
    airline = {
      ...airline, name: airlineList[1].name
    }
    await expect(() => service.update(airline.id, airline)).rejects.toHaveProperty("message", "There is already a airline with that name")
  });

  it('update should throw an exception for a date foundation less than current date', async () => {
    let airline: AirlineEntity = airlineList[0];
    airline = {
      ...airline, dateFoundation: faker.date.future()
    }
    await expect(() => service.update(airline.id, airline)).rejects.toHaveProperty("message", "Date foundation must be less than current date")
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlineList[0];
    await service.delete(airline.id);
    const deletedAirline: AirlineEntity = await repository.findOne({ where: { id: airline.id } })
    expect(deletedAirline).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airline with the given id was not found")
  });

});
