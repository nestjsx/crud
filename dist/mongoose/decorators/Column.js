"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
function Column() {
    return (object, propertyName) => {
        let columns = object.constructor.columns;
        const relationType = Reflect.getMetadata('design:type', object, propertyName).name;
        if (!columns) {
            columns = [];
        }
        columns.push({
            propertyName,
            relationType,
        });
        Object.assign(object.constructor, { columns });
    };
}
exports.Column = Column;
//# sourceMappingURL=Column.js.map