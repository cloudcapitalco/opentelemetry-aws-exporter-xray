import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
export interface OriginParser {
    getOrigin(span: ReadableSpan): string | undefined;
}
export declare class DefaultOriginParser implements OriginParser {
    /**
     * Determines the origin of the span based on resource attributes.
     *
     * @returns {string | undefined} The determined origin, or undefined if no
     * relevant attributes are found.
     */
    getOrigin(span: ReadableSpan): string | undefined;
}
