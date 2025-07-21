"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedReadableSpan = void 0;
const api_1 = require("@opentelemetry/api");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const constants_1 = require("./constants");
const util_1 = require("./util");
class EnhancedReadableSpan {
    span;
    DBS = [
        'db2',
        'derby',
        'hive',
        'mariadb',
        'mssql',
        'mysql',
        'oracle',
        'postgresql',
        'sqlite',
        'teradata',
        'other_sql',
    ];
    constructor(span) {
        this.span = span;
        //
    }
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
    getNamespace() {
        if ((0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_RPC_SYSTEM]) === 'aws-api') {
            return 'aws';
        }
        else if (this.span.attributes[constants_1.XSEMATTRS_AWS_SERVICE]) {
            return 'aws';
        }
        else if (this.span.kind === api_1.SpanKind.CLIENT) {
            return 'remote';
        }
        else {
            return undefined;
        }
    }
    /**
     * Determines if the span is throttled based on the HTTP status code.
     *
     * @returns {boolean} True if the span is throttled, otherwise false.
     */
    isThrottled() {
        if (Number(this.span.attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE]) === 429) {
            return true;
        }
        else {
            return undefined;
        }
    }
    /**
     * Determines if the span represents a fault based on the status code and HTTP
     * status code.
     *
     * @returns {boolean} True if the span represents a fault, otherwise false.
     */
    isFault() {
        if (Number(this.span.attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE] || 0) >= 500) {
            return (Number(this.span.attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE] || 0) <= 599 ||
                undefined);
        }
        else {
            return this.span.status?.code === api_1.SpanStatusCode.ERROR ? true : undefined;
        }
    }
    /**
     * Determines if the span represents an error based on the status code and
     * HTTP status code.
     *
     * @returns {boolean} True if the span represents an error, otherwise false.
     */
    isError() {
        if (Number(this.span.attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE] || 0) >= 400) {
            return (Number(this.span.attributes[semantic_conventions_1.SEMATTRS_HTTP_STATUS_CODE] || 0) <= 499 ||
                undefined);
        }
        else {
            return undefined;
        }
    }
    /**
     * Determines the service data for the span.
     *
     * The service data is derived from the resource attributes. The method looks
     * for the service version or container image tag to set the service version.
     *
     * @returns {Service} The service data
     * if no relevant attributes are found.
     */
    getService() {
        return {
            version: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_VERSION]) ||
                (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CONTAINER_IMAGE_TAG]) ||
                'unknown',
            runtime: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_PROCESS_RUNTIME_NAME]) ||
                'unknown',
            runtime_version: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_PROCESS_RUNTIME_VERSION]) || 'unknown',
            name: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_NAME]) ||
                'unknown',
        };
    }
    /**
     * Determines the origin of the span based on resource attributes.
     *
     * @returns {string | undefined} The determined origin, or undefined if no
     * relevant attributes are found.
     */
    getOrigin(originParser) {
        return originParser.getOrigin(this.span);
    }
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
    getEndTime() {
        return (0, util_1.hrt)(this.span.endTime);
    }
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
    getStartTime() {
        return (0, util_1.hrt)(this.span.startTime);
    }
    getCause(causeParser) {
        return causeParser.getCause(this.span);
    }
    getName(nameParser) {
        return nameParser.parseName(this.span);
    }
    getSpanId() {
        return this.span.spanContext().spanId;
    }
    getParentId() {
        return this.span.parentSpanContext?.spanId;
    }
    getType() {
        if (this.span.kind !== api_1.SpanKind.SERVER &&
            this.getParentId() !== undefined) {
            return 'subsegment';
        }
        else {
            return undefined;
        }
    }
    /**
     * Unsure what this function does as this has been blindly ported over.
     * {@link https://github.com/open-telemetry/opentelemetry-collector-contrib/pull/20313#issuecomment-2201988954}
     *
     * @param idParser
     */
    getLinks(idParser) {
        return (0, util_1.undef)(this.span.links?.map((link) => {
            return {
                id: link.context.spanId,
                trace_id: idParser.parseId(link.context.traceId),
                attributes: Object.fromEntries(Object.entries(link.attributes || {})
                    .filter(([, value]) => value !== undefined)
                    .map(([key, value]) => {
                    return [key, value];
                })),
            };
        }));
    }
    getUser() {
        return (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_ENDUSER_ID]);
    }
    getHttp(httpParser) {
        return httpParser.parseHttp(this.span);
    }
    /**
     * 	Despite what the X-Ray documents say, having the DB connection string
     * 	set as the URL value of the segment is not useful. So let's use the
     * 	current span name instead
     */
    getSql() {
        if (this.DBS.includes((0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_DB_SYSTEM]) || '')) {
            return {
                url: this.span.name,
                connection_string: `${this.span.attributes[semantic_conventions_1.SEMATTRS_DB_CONNECTION_STRING] || 'localhost'}/${this.span.attributes[semantic_conventions_1.SEMATTRS_DB_NAME] || ''}`,
                database_type: (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_DB_SYSTEM]),
                user: (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_DB_USER]),
                sanitized_query: (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_DB_STATEMENT]),
            };
        }
        else {
            return undefined;
        }
    }
    getAWS() {
        return {
            account_id: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_ACCOUNT]),
            operation: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_OPERATION] ||
                this.span.attributes[semantic_conventions_1.SEMATTRS_RPC_METHOD]),
            region: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_REGION]),
            request_id: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_REQUEST_ID] ||
                this.span.attributes[constants_1.XSEMATTRS_AWS_REQUEST_ID_2]),
            id_2: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_XREQUEST_ID]),
            queue_url: (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_MESSAGING_URL] ||
                this.span.attributes[constants_1.XSEMATTRS_AWS_QUEUE_URL] ||
                this.span.attributes[constants_1.XSEMATTRS_AWS_QUEUE_URL_2]),
            message_id: (0, util_1.str)(this.span.attributes[semantic_conventions_1.SEMATTRS_MESSAGING_MESSAGE_ID]),
            bucket_name: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_BUCKET_NAME]),
            key: (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_BUCKET_KEY]),
            table_name: Array.isArray(this.span.attributes[semantic_conventions_1.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES])
                ? this.span.attributes[semantic_conventions_1.SEMATTRS_AWS_DYNAMODB_TABLE_NAMES].find((val) => typeof val === 'string')
                : (0, util_1.str)(this.span.attributes[constants_1.XSEMATTRS_AWS_TABLE_NAME] ||
                    this.span.attributes[constants_1.XSEMATTRS_AWS_TABLE_NAME_2]),
            cloudwatch_logs: (this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_LOG_GROUP_NAMES] ||
                []).map((name, index) => {
                return {
                    log_group: name,
                    arn: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_LOG_GROUP_NAMES][index],
                };
            }),
            xray: {
                sdk: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_LANGUAGE] ||
                    '?') +
                    '/' +
                    (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION]),
                sdk_version: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_TELEMETRY_SDK_VERSION]),
                auto_instrumentation: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_TELEMETRY_AUTO_VERSION] !==
                    undefined,
            },
            eks: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PLATFORM] ===
                semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_EKS
                ? {
                    container_id: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CONTAINER_ID]),
                    cluster_name: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_K8S_CLUSTER_NAME]),
                    pod: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_K8S_POD_NAME]),
                }
                : undefined,
            elastic_beanstalk: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PLATFORM] ===
                semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK ||
                this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_INSTANCE_ID] !==
                    undefined
                ? {
                    environment: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]),
                    deployment_id: Number(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_INSTANCE_ID] || '0'),
                    version_label: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_SERVICE_VERSION]),
                }
                : undefined,
            ecs: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PLATFORM] ===
                semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_ECS
                ? {
                    container_name: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CONTAINER_NAME]),
                    container_id: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CONTAINER_ID]),
                    availability_zone: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE]),
                    container_arn: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_CONTAINER_ARN]),
                    cluster_arn: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_CLUSTER_ARN]),
                    task_arn: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_TASK_ARN]),
                    task_family: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_TASK_FAMILY]),
                    launch_type: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_LAUNCHTYPE]),
                }
                : undefined,
            ec2: this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PLATFORM] ===
                semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_EC2 ||
                this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_HOST_ID] !== undefined
                ? {
                    instance_id: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_HOST_ID]),
                    availability_zone: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_AVAILABILITY_ZONE]),
                    instance_size: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_HOST_TYPE]),
                    ami_id: (0, util_1.str)(this.span.resource.attributes[semantic_conventions_1.SEMRESATTRS_HOST_IMAGE_ID]),
                }
                : undefined,
        };
    }
    getTraceId(idParser) {
        return idParser.parseId(this.span.spanContext().traceId);
    }
    getAnnotations(indexedAttributes) {
        const attributes = this.span.attributes;
        const annotations = {};
        for (const key of Object.keys(attributes)) {
            if (attributes[key] === undefined ||
                attributes[key] === null ||
                Array.isArray(attributes[key])) {
                continue;
            }
            if (!indexedAttributes.includes(key)) {
                continue;
            }
            annotations[key] = attributes[key];
        }
        return annotations;
    }
    getMetadata() {
        return undefined; //TODO: Implement this
    }
}
exports.EnhancedReadableSpan = EnhancedReadableSpan;
//# sourceMappingURL=super.span.js.map