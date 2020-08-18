import * as Knex from 'knex';
import { Model } from 'objection';
import { Project } from '../projects';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await Project.query().insert([
    { name: 'Project1', description: 'description1', isActive: true, companyId: 1 },
    { name: 'Project2', description: 'description2', isActive: true, companyId: 1 },
    { name: 'Project3', description: 'description3', isActive: true, companyId: 2 },
    { name: 'Project4', description: 'description4', isActive: true, companyId: 2 },
    { name: 'Project5', description: 'description5', isActive: true, companyId: 3 },
    { name: 'Project6', description: 'description6', isActive: true, companyId: 3 },
    { name: 'Project7', description: 'description7', isActive: true, companyId: 4 },
    { name: 'Project8', description: 'description8', isActive: true, companyId: 4 },
    { name: 'Project9', description: 'description9', isActive: true, companyId: 5 },
    { name: 'Project10', description: 'description10', isActive: true, companyId: 5 },
    { name: 'Project11', description: 'description11', isActive: false, companyId: 6 },
    { name: 'Project12', description: 'description12', isActive: false, companyId: 6 },
    { name: 'Project13', description: 'description13', isActive: false, companyId: 7 },
    { name: 'Project14', description: 'description14', isActive: false, companyId: 7 },
    { name: 'Project15', description: 'description15', isActive: false, companyId: 8 },
    { name: 'Project16', description: 'description16', isActive: false, companyId: 8 },
    { name: 'Project17', description: 'description17', isActive: false, companyId: 9 },
    { name: 'Project18', description: 'description18', isActive: false, companyId: 9 },
    { name: 'Project19', description: 'description19', isActive: false, companyId: 10 },
    { name: 'Project20', description: 'description20', isActive: false, companyId: 10 },
  ]);
}
