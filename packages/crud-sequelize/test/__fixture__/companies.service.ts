import { Inject, Injectable } from "@nestjs/common";

import Company from "../../../../integration/crud-sequelize/companies/company.model";
import { SequelizeCrudService } from "../../src";

@Injectable()
export class CompaniesService extends SequelizeCrudService<Company> {
  constructor(
    @Inject("CompaniesRepository")
    private readonly repo: Company & typeof Company
  ) {
    super(repo);
  }
}
