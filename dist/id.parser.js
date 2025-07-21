"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIdParser = void 0;
/**
 * Default implementation of IdParser that converts a trace ID into AWS X-Ray
 * trace ID format.
 *
 * AWS X-Ray trace IDs consist of three parts:
 * - Version number (fixed to '1').
 * - Unix epoch time of the original request in 8 hexadecimal digits.
 * - Globally unique 96-bit identifier for the trace in 24 hexadecimal digits.
 *
 * Example: '1-58406520-a006649127e371903a2de979'
 *
 * @see {@link https://docs.aws.amazon.com/xray/latest/devguide/aws-xray-api.html}
 */
class DefaultIdParser {
    maxAge;
    maxSkew;
    constructor(maxAge = 60 * 60 * 24 * 28, maxSkew = 60 * 5) {
        this.maxAge = maxAge;
        this.maxSkew = maxSkew;
        //
    }
    /**
     * Parses the given trace ID into AWS X-Ray trace ID format.
     * @param id The trace ID to parse.
     * @returns The trace ID formatted as AWS X-Ray trace ID.
     * @throws Error if the trace ID is invalid or out of allowed age/skew range.
     */
    parseId(id) {
        const epochNow = Math.floor(Date.now() / 1000);
        // Extract and parse the epoch time from the trace ID
        const epoch = parseInt(id.substring(0, 8), 16);
        // Validate the epoch time against maximum age and skew limits
        if (isNaN(epoch) ||
            epoch < epochNow - this.maxAge ||
            epoch > epochNow + this.maxSkew) {
            throw new Error(`Invalid X-Ray trace ID: ${id}`);
        }
        // Format the trace ID into AWS X-Ray trace ID format
        return `1-${id.substring(0, 8)}-${id.substring(8)}`;
    }
}
exports.DefaultIdParser = DefaultIdParser;
//# sourceMappingURL=id.parser.js.map