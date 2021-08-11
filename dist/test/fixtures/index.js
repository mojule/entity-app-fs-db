"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityKeys = exports.withDb = void 0;
const entity_app_1 = require("@mojule/entity-app");
const util_1 = require("@mojule/util");
const __1 = require("../..");
const withDb = async (cb, formatJson) => {
    const name = 'test-fs-db-' + util_1.randId();
    const db = await __1.createFsDb(name, exports.entityKeys, entity_app_1.createDefaultDbItem, { dataPath: './data', formatJson });
    await cb(db);
    // does nothing but coverage
    await db.close();
    await db.drop();
};
exports.withDb = withDb;
exports.entityKeys = {
    foo: 'foo',
    bar: 'bar'
};
//# sourceMappingURL=index.js.map