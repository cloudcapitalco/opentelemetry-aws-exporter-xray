"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultOriginParser = void 0;
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
class DefaultOriginParser {
    /**
     * Determines the origin of the span based on resource attributes.
     *
     * @returns {string | undefined} The determined origin, or undefined if no
     * relevant attributes are found.
     */
    getOrigin(span) {
        if (!span.resource?.attributes) {
            return undefined;
        }
        else {
            if (span.resource?.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PROVIDER] !==
                semantic_conventions_1.CLOUDPROVIDERVALUES_AWS) {
                return undefined;
            }
            else {
                switch (span.resource?.attributes[semantic_conventions_1.SEMRESATTRS_CLOUD_PLATFORM]) {
                    case 'aws_app_runner':
                        return 'AWS::AppRunner::Service';
                    case semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_EKS:
                        return 'AWS::EKS::Container';
                    case semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_ELASTIC_BEANSTALK:
                        return 'AWS::ElasticBeanstalk::Environment';
                    case semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_ECS:
                        if (!span.resource?.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_LAUNCHTYPE]) {
                            return 'AWS::ECS::Container';
                        }
                        switch (span.resource?.attributes[semantic_conventions_1.SEMRESATTRS_AWS_ECS_LAUNCHTYPE]) {
                            case semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_EC2:
                                return 'AWS::ECS::EC2';
                            case 'fargate':
                                return 'AWS::ECS::Fargate';
                            default:
                                return 'AWS::ECS::Container';
                        }
                    case semantic_conventions_1.CLOUDPLATFORMVALUES_AWS_EC2:
                        return 'AWS::EC2::Instance';
                    default:
                        return undefined;
                }
            }
        }
    }
}
exports.DefaultOriginParser = DefaultOriginParser;
//# sourceMappingURL=origin.parser.js.map