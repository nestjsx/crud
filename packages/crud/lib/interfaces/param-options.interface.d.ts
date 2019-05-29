export interface ParamOptions {
    [key: string]: {
        field?: string;
        type: 'number' | 'string' | 'uuid';
    };
}
