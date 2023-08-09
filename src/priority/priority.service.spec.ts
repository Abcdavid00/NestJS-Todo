import { Test, TestingModule } from '@nestjs/testing';
import { PriorityService } from './priority.service';
import { Priority } from './priority.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chance }  from 'chance';

describe('PriorityService', () => {
  let service: PriorityService;
  let prorityRepository: Repository<Priority>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriorityService,
        {
            provide: getRepositoryToken(Priority),
            useClass: Repository,
        }
      ],
    }).compile();

    service = module.get<PriorityService>(PriorityService);
    prorityRepository = module.get<Repository<Priority>>(getRepositoryToken(Priority));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("Method getAll", () => {
    it("should return an array of priorities", async () => {
        jest.spyOn(prorityRepository, "find").mockImplementation(() => Promise.resolve(ITEMS));
        const result = await service.getAll();
        console.log("Testing method getAll: ");
        console.table(result);
        expect(result).toBe(ITEMS);
    });
  });

  describe("Method getPriority", () => {
    it("should return a priority", async () => {
        const id = ITEMS.map(item => item.id)[Chance().integer({ min: 0, max: ITEMS.length - 1 })];
        jest.spyOn(prorityRepository, "findOne").mockImplementation(() => Promise.resolve(ITEMS[id]));
        const result = await service.getPriority(id);
        console.log("Testing method getPriority: ");
        console.table(result);
        expect(result).toBe(ITEMS[id]);
    });
  });

  describe("Method create", () => {
    it("should return a priority", async () => {
        const name = Chance().word();
        const priority = new Priority();
        priority.name = name;
        jest.spyOn(prorityRepository, "create").mockImplementation(() => priority);
        jest.spyOn(prorityRepository, "save").mockImplementation(() => Promise.resolve(priority));
        const result = await service.create(name);
        console.log("Testing method create: ");
        console.table(result);
        expect(result).toBe(priority);
    });
  });

});

const ITEMS: Priority[] = [
    {
        id: "1",
        name: 'LOW',
    },
    {
        id: "2",
        name: 'MEDIUM',
    },
    {
        id: "3",
        name: 'HIGH',
    }
];