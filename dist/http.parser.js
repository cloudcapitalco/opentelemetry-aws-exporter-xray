"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultHttpParser = void 0;
const api_1 = require("@opentelemetry/api");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const util_1 = require("./util");
/**
 * TODO: also parse the content length from the events
 *
 * {@link https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/6dd3baea75a38706ff2611659d3ae8ad92720df1/exporter/awsxrayexporter/internal/translator/http.go}
 */
class DefaultHttpParser {
    toURL(url) {
        return new URL(`${url.scheme}://${url.host}${url.port ? `:${url.port}` : ''}${url.path}`).toString();
    }
    parseHttp({ attributes, kind }) {
        return [
            semantic_conventions_1.SEMATTRS_HTTP_METHOD,
            'http.request.method',
            semantic_conventions_1.SEMATTRS_HTTP_CLIENT_IP,
            semantic_conventions_1.SEMATTRS_HTTP_USER_AGENT,
            'user_agent.original',
            semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE,
            'http.response.status_code',
            semantic_conventions_1.SEMATTRS_HTTP_URL,
            'url.full',
            semantic_conventions_1.SEMATTRS_HTTP_SCHEME,
            'url.scheme',
            semantic_conventions_1.SEMATTRS_HTTP_HOST,
            semantic_conventions_1.SEMATTRS_HTTP_TARGET,
            semantic_conventions_1.SEMATTRS_HTTP_SERVER_NAME,
            semantic_conventions_1.SEMATTRS_NET_HOST_PORT,
            'host.name',
            'server.address',
            'server.port',
            semantic_conventions_1.SEMATTRS_NET_PEER_NAME,
            semantic_conventions_1.SEMATTRS_NET_PEER_PORT,
            semantic_conventions_1.SEMATTRS_NET_PEER_IP,
            'network.peer.address',
            'client.address',
            'url.path',
        ].some((key) => attributes[key] !== undefined)
            ? {
                request: {
                    method: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_METHOD] ||
                        attributes['http.request.method']),
                    client_ip: (0, util_1.str)((0, util_1.ip)((0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_CLIENT_IP])) ||
                        (0, util_1.ip)((0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_NET_PEER_IP])) ||
                        (0, util_1.ip)((0, util_1.str)(attributes['network.peer.address'])) ||
                        (0, util_1.ip)((0, util_1.str)(attributes['client.address']))),
                    user_agent: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_USER_AGENT] ||
                        attributes['user_agent.original']),
                    x_forwarded_for: !attributes[semantic_conventions_1.SEMATTRS_HTTP_CLIENT_IP] &&
                        attributes[semantic_conventions_1.SEMATTRS_NET_PEER_IP]
                        ? true
                        : undefined,
                    url: [
                        semantic_conventions_1.SEMATTRS_HTTP_URL,
                        'url.full',
                        semantic_conventions_1.SEMATTRS_HTTP_HOST,
                        semantic_conventions_1.SEMATTRS_HTTP_SERVER_NAME,
                        semantic_conventions_1.SEMATTRS_NET_HOST_NAME,
                        'host.name',
                        'server.address',
                    ].some((attr) => attributes[attr] !== undefined)
                        ? kind === api_1.SpanKind.SERVER
                            ? (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_URL] || attributes['url.full']) ||
                                this.toURL({
                                    scheme: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_SCHEME] ||
                                        attributes['url.scheme']) || 'http',
                                    host: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_HOST] ||
                                        attributes[semantic_conventions_1.SEMATTRS_HTTP_SERVER_NAME] ||
                                        attributes[semantic_conventions_1.SEMATTRS_NET_HOST_NAME] ||
                                        attributes['host.name'] ||
                                        attributes['server.address']) || 'host',
                                    port: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_NET_HOST_PORT] ||
                                        attributes['server.port']),
                                    path: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_TARGET] ||
                                        attributes['url.path']) || '/',
                                })
                            : (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_URL] || attributes['url.full']) ||
                                this.toURL({
                                    scheme: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_SCHEME] ||
                                        attributes['url.scheme']) || 'http',
                                    host: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_HOST] ||
                                        attributes[semantic_conventions_1.SEMATTRS_NET_PEER_NAME] ||
                                        attributes[semantic_conventions_1.SEMATTRS_NET_PEER_IP]) || 'host',
                                    port: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_NET_PEER_PORT]),
                                    path: (0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_TARGET]) || '/',
                                })
                        : undefined,
                },
                response: {
                    status: (0, util_1.num)((0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE]) ||
                        (0, util_1.str)(attributes['http.response.status_code'])),
                    content_length: attributes[semantic_conventions_1.SEMATTRS_MESSAGE_TYPE] === 'RECEIVED'
                        ? (0, util_1.num)((0, util_1.str)(attributes[semantic_conventions_1.SEMATTRS_MESSAGING_MESSAGE_PAYLOAD_SIZE_BYTES]))
                        : undefined,
                },
            }
            : undefined;
    }
}
exports.DefaultHttpParser = DefaultHttpParser;
//# sourceMappingURL=http.parser.js.map