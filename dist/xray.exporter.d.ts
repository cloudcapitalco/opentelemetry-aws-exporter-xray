import { ExportResult } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { CauseParser } from './cause.parser';
import { SegmentEmitter } from './emitter/segment.emitter';
import { HttpParser } from './http.parser';
import { IdParser } from './id.parser';
import { NameParser } from './name.parser';
import { OriginParser } from './origin.parser';
import { TraceFilter } from './trace.filter';
/**
 * Creates an instance of XraySpanExporter.
 * @param {SegmentEmitter[]} [segmentEmitters] - The emitters used to send
 * segments to AWS X-Ray.
 * @param {IdParser} [idParser] - The parser used for converting OpenTelemetry
 * trace IDs to AWS X-Ray trace IDs.
 * @param {CauseParser} [causeParser] - The parser used for extracting error
 * causes from spans.
 * @param {HttpParser} [httpParser] - The parser used for extracting HTTP
 * details from spans.
 * @param {NameParser} [nameParser] - The parser used for determining the name
 * of the segment.
 * @param {OriginParser} [originParser] - The parser used for determining the
 * origin of the segment.
 * @param {TraceFilter} [traceFilter] - The filter used to determine if a trace
 * should be sent to X-Ray.
 * @param {string[]} [indexedAttributes] - The attributes to index in the X-Ray
 * console as annotations.
 */
export default class XraySpanExporter implements SpanExporter {
    private readonly segmentEmitters;
    private readonly idParser;
    private readonly causeParser;
    private readonly httpParser;
    private readonly nameParser;
    private readonly originParser;
    private readonly traceFilter;
    private readonly indexedAttributes;
    constructor(segmentEmitters?: SegmentEmitter[], idParser?: IdParser, causeParser?: CauseParser, httpParser?: HttpParser, nameParser?: NameParser, originParser?: OriginParser, traceFilter?: TraceFilter, indexedAttributes?: string[]);
    export(spans: ReadableSpan[], cb: (result: ExportResult) => void): void;
    /**
     * Shuts down the exporter.
     * This method currently destroys the X-Ray client instance.
     * @returns A promise that resolves immediately.
     */
    shutdown(): Promise<void>;
    /**
     * Forces the exporter to flush any pending exports.
     * This method is currently a no-op.
     * @returns A promise that resolves immediately.
     */
    forceFlush?(): Promise<void>;
}
