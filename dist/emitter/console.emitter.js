"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleEmitter = void 0;
// noinspection JSUnusedGlobalSymbols
class ConsoleEmitter {
    constructor() {
        //
    }
    shutdown() {
        //
    }
    async emit(trace) {
        console.log(JSON.stringify(trace, null, 2));
    }
}
exports.ConsoleEmitter = ConsoleEmitter;
//# sourceMappingURL=console.emitter.js.map