import { XrayTraceDataSegmentDocument } from './xray.document';
export interface TraceFilter {
    doFilter(span: XrayTraceDataSegmentDocument): boolean;
}
export declare class DefaultTraceFilter implements TraceFilter {
    doFilter(trace: XrayTraceDataSegmentDocument): boolean;
}
