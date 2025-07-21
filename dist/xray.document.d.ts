export interface AWS {
    ecs?: {
        container?: string;
        container_name?: string;
        container_id?: string;
        availability_zone?: string;
        container_arn?: string;
        cluster_arn?: string;
        task_arn?: string;
        task_family?: string;
        launch_type?: string;
    };
    ec2?: {
        instance_id?: string;
        availability_zone?: string;
        instance_size?: string;
        ami_id?: string;
    };
    elastic_beanstalk?: {
        environment?: string;
        version_label?: string;
        deployment_id?: number;
    };
    eks?: {
        cluster_name?: string;
        pod?: string;
        container_id?: string;
    };
    cloudwatch_logs?: Log[];
    xray: {
        sdk?: string;
        sdk_version?: string;
        auto_instrumentation?: boolean;
    };
    tracing?: {
        sdk?: string;
    };
    account_id?: string;
    retries?: number;
    region?: string;
    operation?: string;
    request_id?: string;
    id_2?: string;
    bucket_name?: string;
    key?: string;
    table_name?: string;
    resource_names?: string[];
    message_id?: string;
    queue_url?: string;
}
export interface Request {
    url?: string;
    method?: string;
    user_agent?: string;
    client_ip?: string;
    x_forwarded_for?: boolean;
}
export interface Response {
    status?: number;
    content_length?: number;
}
export interface Log {
    log_group: string;
    arn?: string;
}
export interface Link {
    id: string;
    trace_id: string;
    attributes: {
        [key: string]: unknown | undefined;
    };
}
export interface Service {
    version: string;
    runtime?: string;
    runtime_version?: string;
    name?: string;
}
export interface HTTP {
    request?: Request;
    response?: Response;
}
export interface Cause {
    working_directory?: string;
    exceptions?: Exception[];
}
export interface Exception {
    id: string;
    message?: string;
    type?: string;
    remote?: boolean;
    truncated?: number;
    skipped?: number;
    cause?: string;
    stack?: Stack[];
}
export interface Stack {
    path?: string;
    line?: number;
    label?: string;
}
export interface SQL {
    connection_string?: string;
    url?: string;
    sanitized_query?: string;
    database_type?: string;
    database_version?: string;
    driver_version?: string;
    user?: string;
    preparation?: 'call' | 'statement' | 'unknown';
}
export interface XrayTraceDataSegmentDocument {
    id: string;
    name: string;
    start_time: number;
    end_time?: number;
    in_progress?: boolean;
    trace_id?: string;
    subsegments?: XrayTraceDataSegmentDocument[];
    parent_id?: string;
    origin?: string;
    aws?: AWS;
    error?: boolean;
    fault?: boolean;
    throttle?: boolean;
    namespace?: 'aws' | 'remote';
    user?: string;
    http?: HTTP;
    cause?: Cause;
    annotations?: {
        [key: string]: string | number | boolean;
    };
    metadata?: {
        [key: string]: {
            [key: string]: unknown;
        };
    };
    sql?: SQL;
    service?: Service;
    type?: 'subsegment';
    links?: Link[];
}
