import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { HTTP } from './xray.document';
export interface HttpParser {
    parseHttp(span: ReadableSpan): HTTP | undefined;
}
/**
 * TODO: also parse the content length from the events
 *
 * {@link https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/6dd3baea75a38706ff2611659d3ae8ad92720df1/exporter/awsxrayexporter/internal/translator/http.go}
 */
export declare class DefaultHttpParser implements HttpParser {
    toURL(url: {
        scheme: string;
        host: string;
        port?: string;
        path: string;
    }): string;
    parseHttp({ attributes, kind }: ReadableSpan): HTTP | undefined;
}
