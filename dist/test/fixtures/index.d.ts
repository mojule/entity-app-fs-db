import { DbRefFor, EntityDb, EntityKeys } from '@mojule/entity-app';
export declare const withDb: (cb: (db: EntityDb<TypeMap>) => Promise<void>, formatJson?: boolean | undefined) => Promise<void>;
export declare type Foo = {
    name: string;
    value: number;
};
export declare type Bar = {
    name: string;
    value: number;
    foo: DbRefFor<TypeMap, 'foo'>;
};
export declare type TypeMap = {
    foo: Foo;
    bar: Bar;
};
export declare const entityKeys: EntityKeys<TypeMap>;
