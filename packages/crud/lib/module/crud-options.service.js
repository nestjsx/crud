"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CrudOptionsService {
    constructor(_options) {
        this._options = _options;
    }
    static setOptions(options) {
        CrudOptionsService.options = options;
    }
    static getOptions() {
        return CrudOptionsService.options;
    }
}
exports.CrudOptionsService = CrudOptionsService;
//# sourceMappingURL=crud-options.service.js.map