"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultNameParser = void 0;
const api_1 = require("@opentelemetry/api");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const util_1 = require("./util");
class DefaultNameParser {
    parseName(span) {
        return (this.getSpanName(span) ||
            this.getLocalServiceName(span) ||
            this.getRemoteServiceName(span) ||
            this.getPeerService(span) ||
            this.getAwsService(span) ||
            this.getDatabaseName(span) ||
            this.getResourceServiceName(span) ||
            this.getRpcService(span) ||
            this.getHttpHost(span) ||
            this.getNetPeerName(span) ||
            'span')
            .replace(/[^ 0-9\p{L}N_.:/%&#=+\-@]/gu, '')
            .slice(0, 200);
    }
    getLocalServiceName({ attributes, kind, }) {
        if ([api_1.SpanKind.SERVER, api_1.SpanKind.INTERNAL].includes(kind) &&
            (0, util_1.str)(attributes['aws.span.kind']) === 'local_root') {
            return (0, util_1.str)(attributes['aws.local.service']);
        }
        return undefined;
    }
    getRemoteServiceName({ attributes, kind, }) {
        if ([api_1.SpanKind.CLIENT, api_1.SpanKind.PRODUCER, api_1.SpanKind.CONSUMER].includes(kind)) {
            let name = (0, util_1.str)(attributes['aws.remote.service']);
            if (name) {
                name =
                    (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_RPC_SYSTEM]) === 'aws-api' &&
                        name.startsWith('AWS.SDK.')
                        ? name.slice(8)
                        : name;
                return name;
            }
        }
        return undefined;
    }
    getPeerService({ attributes }) {
        return (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_PEER_SERVICE]);
    }
    getAwsService({ attributes }) {
        return (0, util_1.str)(attributes['aws.service']);
    }
    getDatabaseName({ attributes }) {
        let name = (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_DB_NAME]);
        if (name) {
            const dbURL = (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_DB_CONNECTION_STRING]);
            if (dbURL) {
                const dbURLStr = dbURL.startsWith('jdbc:') ? dbURL.slice(5) : dbURL;
                try {
                    const parsed = new URL(dbURLStr);
                    if (parsed.hostname) {
                        name += `@${parsed.hostname}`;
                    }
                }
                catch {
                    // Ignore URL parsing errors
                }
            }
        }
        return name;
    }
    getResourceServiceName({ resource, kind, }) {
        return [api_1.SpanKind.SERVER].includes(kind)
            ? (0, util_1.str)(resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_NAME])
            : undefined;
    }
    getRpcService({ attributes }) {
        return (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_RPC_SERVICE]);
    }
    getHttpHost({ attributes }) {
        return (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_HOST]);
    }
    getNetPeerName({ attributes }) {
        return (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_NET_PEER_NAME]);
    }
    getSpanName({ name }) {
        return name;
    }
}
exports.DefaultNameParser = DefaultNameParser;
//# sourceMappingURL=name.parser.js.map