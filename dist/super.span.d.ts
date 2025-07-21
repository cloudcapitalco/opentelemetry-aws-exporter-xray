import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { CauseParser } from './cause.parser';
import { HttpParser } from './http.parser';
import { IdParser } from './id.parser';
import { NameParser } from './name.parser';
import { OriginParser } from './origin.parser';
import { AWS, Cause, HTTP, Link, Service, SQL } from './xray.document';
export declare class EnhancedReadableSpan {
    private readonly span;
    private readonly DBS;
    constructor(span: ReadableSpan);
    /**
     * Determines the namespace of the span.
     *
     * The namespace can only be "aws" or "remote" based on the following logic:
     * - If the span is identified as an AWS SDK span, the namespace is "aws".
     * - If the span contains the AWS service attribute, the namespace is "aws".
     * - If the span kind is CLIENT, the namespace is "remote".
     *
     * @returns {string | undefined} The determined namespace, or undefined if no
     * namespace is set.
     * @see {@link https://docs.aws.amazon.com/xray/latest/devguide/
     * aws-xray-interface-api.html}
     */
    getNamespace(): 'aws' | 'remote' | undefined;
    /**
     * Determines if the span is throttled based on the HTTP status code.
     *
     * @returns {boolean} True if the span is throttled, otherwise false.
     */
    isThrottled(): true | undefined;
    /**
     * Determines if the span represents a fault based on the status code and HTTP
     * status code.
     *
     * @returns {boolean} True if the span represents a fault, otherwise false.
     */
    isFault(): true | undefined;
    /**
     * Determines if the span represents an error based on the status code and
     * HTTP status code.
     *
     * @returns {boolean} True if the span represents an error, otherwise false.
     */
    isError(): true | undefined;
    /**
     * Determines the service data for the span.
     *
     * The service data is derived from the resource attributes. The method looks
     * for the service version or container image tag to set the service version.
     *
     * @returns {Service} The service data
     * if no relevant attributes are found.
     */
    getService(): Service;
    /**
     * Determines the origin of the span based on resource attributes.
     *
     * @returns {string | undefined} The determined origin, or undefined if no
     * relevant attributes are found.
     */
    getOrigin(originParser: OriginParser): string | undefined;
    /**
     * Retrieves the end time of the span in floating point seconds
     * since the Unix epoch.
     *
     * This is the time when the segment was closed,
     * represented as a floating-point number in seconds since the
     * Unix epoch. For example, 1480615200.090 or 1.480615200090E9.
     *
     * @returns {number} The end time in floating point seconds.
     * @see {@link https://docs.aws.amazon.com/xray/latest/devguide/aws-xray-interface-api.html#xray-api-segmentdocuments.html}
     */
    getEndTime(): number;
    /**
     * Retrieves the start time of the span in floating point seconds
     * since the Unix epoch.
     *
     * This is the time when the segment was created,
     * represented as a floating-point number in seconds since the
     * Unix epoch. For example, 1480615200.010 or 1.480615200010E9.
     *
     * @returns {number} The start time in floating point seconds.
     * @see {@link https://docs.aws.amazon.com/xray/latest/devguide/aws-xray-interface-api.html#xray-api-segmentdocuments.html}
     */
    getStartTime(): number;
    getCause(causeParser: CauseParser): Cause | undefined;
    getName(nameParser: NameParser): string;
    getSpanId(): string;
    getParentId(): string | undefined;
    getType(): "subsegment" | undefined;
    /**
     * Unsure what this function does as this has been blindly ported over.
     * {@link https://github.com/open-telemetry/opentelemetry-collector-contrib/pull/20313#issuecomment-2201988954}
     *
     * @param idParser
     */
    getLinks(idParser: IdParser): Link[] | undefined;
    getUser(): string | undefined;
    getHttp(httpParser: HttpParser): HTTP | undefined;
    /**
     * 	Despite what the X-Ray documents say, having the DB connection string
     * 	set as the URL value of the segment is not useful. So let's use the
     * 	current span name instead
     */
    getSql(): SQL | undefined;
    getAWS(): AWS;
    getTraceId(idParser: IdParser): string;
    getAnnotations(indexedAttributes: string[]): {
        [key: string]: string | number | boolean;
    } | undefined;
    getMetadata(): {
        [key: string]: {
            [key: string]: unknown;
        };
    } | undefined;
}
