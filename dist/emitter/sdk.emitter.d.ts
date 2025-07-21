import { SegmentEmitter } from './segment.emitter';
import { XRayClient } from '@aws-sdk/client-xray';
import { XrayTraceDataSegmentDocument } from '../xray.document';
export declare class SDKBasedSegmentEmitter implements SegmentEmitter {
    private readonly xRayClient;
    constructor(xRayClient?: XRayClient);
    shutdown(): void;
    emit(trace: XrayTraceDataSegmentDocument[]): Promise<void>;
}
