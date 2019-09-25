import Project from './project.model';

export const projectsProviders = [{ provide: 'ProjectsRepository', useValue: Project }];
