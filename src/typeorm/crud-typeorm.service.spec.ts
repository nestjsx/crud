import { Test } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MockRepository } from '../../test/mocks-typyorm/mock-repository';
import { MockEntity } from '../../test/mocks-typyorm/mock-entity';
import { MockService } from '../../test/mocks-typyorm/mock-service';
import { CrudTypeOrmService } from './crud-typeorm.service';

describe('CrudTypeOrmService', () => {
  const testEntity = { id: 1, name: 'test' };
  const testEntity2 = { id: 1, name: 'test2' };

  let mockService: MockService;

  beforeAll(async () => {
    const fixture = await Test.createTestingModule({
      providers: [
        MockService,
        {
          provide: getRepositoryToken(MockEntity),
          useValue: new MockRepository(),
        },
      ],
    }).compile();

    mockService = fixture.get<MockService>(MockService);
  });

  describe('getAll (0)', () => {
    it('should return an empty array', async () => {
      expect(await mockService.getAll()).toMatchObject([]);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException', () => {
      const entity = new MockEntity();
      expect(mockService.create(entity)).rejects.toThrowError(
        BadRequestException,
      );
      expect(mockService.create(false)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should return entity object with id', async () => {
      const entity = new MockEntity();
      entity.name = 'test';
      expect(await mockService.create(entity)).toMatchObject(testEntity);
    });
  });

  describe('getOne', () => {
    it('should throw BadRequestException', () => {
      expect(mockService.getOne(false)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw NotFoundException', () => {
      expect(mockService.getOne(343)).rejects.toThrowError(NotFoundException);
    });

    it('should return entity object', async () => {
      expect(await mockService.getOne(1)).toMatchObject(testEntity);
    });
  });

  describe('getAll (1)', () => {
    it('should return an array with entiry', async () => {
      expect(await mockService.getAll()).toMatchObject([testEntity]);
    });
  });

  describe('update', () => {
    it('should throw BadRequestException', () => {
      expect(mockService.update(false, {})).rejects.toThrowError(
        BadRequestException,
      );
      expect(mockService.update(1, null)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw NotFoundException', () => {
      expect(mockService.update(343, {})).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should return updated entity object', async () => {
      expect(await mockService.update(1, testEntity2)).toMatchObject(
        testEntity2,
      );
      expect(await mockService.getOne(1)).toMatchObject(testEntity2);
    });
  });

  describe('delete', () => {
    it('should throw BadRequestException', () => {
      expect(mockService.delete(false)).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw NotFoundException', () => {
      expect(mockService.delete(343)).rejects.toThrowError(NotFoundException);
    });

    it('should delete entity', async () => {
      expect(await mockService.delete(1)).toBeUndefined();
      expect(await mockService.getAll()).toMatchObject([]);
    });
  });
});
