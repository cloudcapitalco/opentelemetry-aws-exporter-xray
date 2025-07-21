"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDKBasedSegmentEmitter = void 0;
const client_xray_1 = require("@aws-sdk/client-xray");
const api_1 = require("@opentelemetry/api");
class SDKBasedSegmentEmitter {
    xRayClient;
    constructor(xRayClient = new client_xray_1.XRayClient()) {
        this.xRayClient = xRayClient;
        //
    }
    shutdown() {
        this.xRayClient.destroy();
    }
    async emit(trace) {
        const result = await this.xRayClient.send(new client_xray_1.PutTraceSegmentsCommand({
            TraceSegmentDocuments: trace.map((document) => JSON.stringify(document)),
        }));
        if (result.UnprocessedTraceSegments?.length) {
            const upCnt = result.UnprocessedTraceSegments.length || 0;
            api_1.diag.warn(`${upCnt} couldn't be processed.`);
        }
    }
}
exports.SDKBasedSegmentEmitter = SDKBasedSegmentEmitter;
//# sourceMappingURL=sdk.emitter.js.map