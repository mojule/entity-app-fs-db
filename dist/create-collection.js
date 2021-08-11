"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCollection = void 0;
const fs_1 = require("fs");
const entity_app_1 = require("@mojule/entity-app");
const retry_1 = require("./retry");
const { readFile, writeFile, readdir, unlink } = fs_1.promises;
const createCollection = (path, createDbItem, formatJson) => {
    const stringify = (formatJson ?
        (value) => JSON.stringify(value, null, 2) :
        (value) => JSON.stringify(value));
    const filePath = (id) => `${path}/${id}.json`;
    const ids = async () => {
        const fileIds = (await readdir(path))
            .filter(s => s.endsWith('.json'))
            .map(s => s.replace(/\.json$/, ''));
        return fileIds;
    };
    const create = async (entity) => {
        const dbItem = createDbItem();
        const dbEntity = Object.assign(entity, dbItem);
        const json = stringify(dbEntity);
        await retry_1.retry(async () => writeFile(filePath(dbItem._id), json, 'utf8'));
        return dbItem._id;
    };
    const createMany = entity_app_1.defaultCreateMany(create);
    const load = async (id) => {
        const json = await retry_1.retry(() => readFile(filePath(id), 'utf8'));
        const dbEntity = JSON.parse(json);
        return dbEntity;
    };
    const loadMany = entity_app_1.defaultLoadMany(load);
    const save = async (document) => {
        const { _id } = document;
        if (typeof _id !== 'string')
            throw Error('Expected document to have _id:string');
        const saveEntity = await applyPartial(document);
        const json = stringify(saveEntity);
        await retry_1.retry(() => writeFile(filePath(_id), json, 'utf8'));
    };
    const saveMany = entity_app_1.defaultSaveMany(save);
    const remove = async (id) => retry_1.retry(() => unlink(filePath(id)));
    const removeMany = entity_app_1.defaultRemoveMany(remove);
    const find = entity_app_1.defaultFind(ids, loadMany);
    const findOne = entity_app_1.defaultFindOne(ids, loadMany);
    const loadPaged = entity_app_1.defaultLoadPaged(ids, loadMany);
    const entityCollection = {
        ids, create, createMany, load, loadMany, save, saveMany, remove, removeMany,
        find, findOne, loadPaged
    };
    const applyPartial = entity_app_1.createApplyPartial(entityCollection);
    return entityCollection;
};
exports.createCollection = createCollection;
//# sourceMappingURL=create-collection.js.map