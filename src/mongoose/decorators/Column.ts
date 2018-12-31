import 'reflect-metadata';
export function Column() {
    return (object: any, propertyName: string) => {
        let columns = object.constructor.columns;
        const relationType = Reflect.getMetadata('design:type', object, propertyName).name;
        if (!columns) {
            columns = [];
        }
        columns.push({
            propertyName,
            relationType,
        });
        Object.assign(object.constructor, {columns});
    };
}