import { CrudOptions } from '../interfaces';

export class CrudOptionsService {
  private static options: CrudOptions;

  constructor(private _options: CrudOptions) {}

  static setOptions(options: CrudOptions) {
    CrudOptionsService.options = options;
  }

  static getOptions(): CrudOptions {
    return CrudOptionsService.options;
  }
}
