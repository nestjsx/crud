"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function safeRequire(path, loader) {
    try {
        const pack = loader ? loader() : require(path);
        return pack;
    }
    catch (_) {
        return null;
    }
}
exports.safeRequire = safeRequire;
//# sourceMappingURL=util.js.map