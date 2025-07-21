import { SegmentEmitter } from './segment.emitter';
import { XrayTraceDataSegmentDocument } from '../xray.document';
export declare class ConsoleEmitter implements SegmentEmitter {
    constructor();
    shutdown(): void;
    emit(trace: XrayTraceDataSegmentDocument[]): Promise<void>;
}
