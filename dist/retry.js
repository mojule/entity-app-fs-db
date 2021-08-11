"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const promiseRetry = require("async-await-retry");
const retry = (fn) => promiseRetry(fn, null, { retriesMax: 3, interval: 50, exponential: true, factor: 2 });
exports.retry = retry;
//# sourceMappingURL=retry.js.map