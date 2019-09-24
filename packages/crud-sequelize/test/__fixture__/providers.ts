import Company from "../../../../integration/crud-sequelize/companies/company.model";
import Project from "../../../../integration/crud-sequelize/projects/project.model";
import User from "../../../../integration/crud-sequelize/users/user.model";

export const usersProviders = [{ provide: "UsersRepository", useValue: User }];
export const companiesProviders = [
  { provide: "CompaniesRepository", useValue: Company }
];
export const projectsProviders = [
  { provide: "ProjectsRepository", useValue: Project }
];
