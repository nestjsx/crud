import Company from './company.model';

export const companiesProviders = [{ provide: 'CompaniesRepository', useValue: Company }];
