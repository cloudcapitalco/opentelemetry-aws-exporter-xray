"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const empty_deep_1 = require("empty-deep");
const cause_parser_1 = require("./cause.parser");
const sdk_emitter_1 = require("./emitter/sdk.emitter");
const udp_emitter_1 = require("./emitter/udp.emitter");
const http_parser_1 = require("./http.parser");
const id_parser_1 = require("./id.parser");
const name_parser_1 = require("./name.parser");
const origin_parser_1 = require("./origin.parser");
const super_span_1 = require("./super.span");
const trace_filter_1 = require("./trace.filter");
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
class XraySpanExporter {
    segmentEmitters;
    idParser;
    causeParser;
    httpParser;
    nameParser;
    originParser;
    traceFilter;
    indexedAttributes;
    constructor(segmentEmitters = [
        process.env.AWS_LAMBDA_FUNCTION_NAME
            ? new udp_emitter_1.UDPDaemonSegmentEmitter()
            : new sdk_emitter_1.SDKBasedSegmentEmitter(),
    ], idParser = new id_parser_1.DefaultIdParser(), causeParser = new cause_parser_1.DefaultCauseParser(), httpParser = new http_parser_1.DefaultHttpParser(), nameParser = new name_parser_1.DefaultNameParser(), originParser = new origin_parser_1.DefaultOriginParser(), traceFilter = new trace_filter_1.DefaultTraceFilter(), indexedAttributes = []) {
        this.segmentEmitters = segmentEmitters;
        this.idParser = idParser;
        this.causeParser = causeParser;
        this.httpParser = httpParser;
        this.nameParser = nameParser;
        this.originParser = originParser;
        this.traceFilter = traceFilter;
        this.indexedAttributes = indexedAttributes;
        //
    }
    export(spans, cb) {
        const trace = spans
            .map((span) => new super_span_1.EnhancedReadableSpan(span))
            .map((span) => ({
            id: span.getSpanId(),
            trace_id: span.getTraceId(this.idParser),
            name: span.getName(this.nameParser),
            start_time: span.getStartTime(),
            end_time: span.getEndTime(),
            parent_id: span.getParentId(),
            fault: span.isFault(),
            error: span.isError(),
            throttle: span.isThrottled(),
            cause: span.getCause(this.causeParser),
            origin: span.getOrigin(this.originParser),
            namespace: span.getNamespace(),
            user: span.getUser(),
            http: span.getHttp(this.httpParser),
            aws: span.getAWS(),
            service: span.getService(),
            sql: span.getSql(),
            annotations: span.getAnnotations(this.indexedAttributes),
            metadata: span.getMetadata(),
            type: span.getType(),
            links: span.getLinks(this.idParser),
        }))
            .filter((trace) => {
            return this.traceFilter.doFilter(trace);
        })
            .map((trace) => {
            return (0, empty_deep_1.emptyDeep)(trace);
        });
        this.segmentEmitters.forEach((segmentEmitter) => segmentEmitter
            .emit(trace)
            .then(() => {
            // eslint-disable-next-line testing-library/no-debugging-utils
            api_1.diag.debug(`Sent ${spans.length} spans to X-Ray.`);
            cb({ code: core_1.ExportResultCode.SUCCESS });
        })
            .catch((err) => {
            api_1.diag.warn(`Encountered an error when sending the spans to X-Ray.`);
            cb({ code: core_1.ExportResultCode.FAILED, error: err });
        }));
    }
    /**
     * Shuts down the exporter.
     * This method currently destroys the X-Ray client instance.
     * @returns A promise that resolves immediately.
     */
    shutdown() {
        // No implementation for shutdown logic since there's no cleanup needed.
        this.segmentEmitters.forEach((segmentEmitter) => segmentEmitter.shutdown());
        return Promise.resolve();
    }
    /**
     * Forces the exporter to flush any pending exports.
     * This method is currently a no-op.
     * @returns A promise that resolves immediately.
     */
    forceFlush() {
        // No implementation for forceFlush since it's not needed for X-Ray export.
        return Promise.resolve();
    }
}
exports.default = XraySpanExporter;
//# sourceMappingURL=xray.exporter.js.map