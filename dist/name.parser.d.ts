import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
export interface NameParser {
    parseName(span: ReadableSpan): string;
}
export declare class DefaultNameParser implements NameParser {
    parseName(span: ReadableSpan): string;
    private getLocalServiceName;
    private getRemoteServiceName;
    private getPeerService;
    private getAwsService;
    private getDatabaseName;
    private getResourceServiceName;
    private getRpcService;
    private getHttpHost;
    private getNetPeerName;
    private getSpanName;
}
