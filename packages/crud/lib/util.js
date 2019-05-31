"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function safeRequire(path) {
    try {
        const pack = require(path);
        return pack;
    }
    catch (_) {
        return null;
    }
}
exports.safeRequire = safeRequire;
//# sourceMappingURL=util.js.map