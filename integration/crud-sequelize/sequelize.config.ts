import { Op } from 'sequelize';
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { Project } from './projects/project.model';
import { Company } from './companies/company.model';
import { Device } from './devices/device.model';
import { UserLicense } from './users-licenses/userlicense.model';
import { UserProfile } from './users-profiles/userprofile.model';
import { UserProject } from './projects/userproject.model';
import { License } from './users-licenses/license.model';

export const config: SequelizeModuleOptions = {
  dialect: 'postgres',
  host: '127.0.0.1',
  port: 5456,
  username: 'root',
  password: 'root',
  database: 'nestjsx_crud_sequelize',
  logging: !!process.env.SQL_LOG ? console.log : false,
  models: [Company, UserProfile, User, Project, UserProject, Device, License, UserLicense],
  define: {
    underscored: true,
    paranoid: false,
    timestamps: true,
    freezeTableName: false
  }
};
