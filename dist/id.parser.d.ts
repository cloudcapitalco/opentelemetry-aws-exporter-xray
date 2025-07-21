/**
 * Interface for parsing IDs into a specific format.
 */
export interface IdParser {
    /**
     * Parses the given ID into a specific format.
     * @param id The ID to parse.
     * @returns The parsed ID in a specific format.
     * @throws Error if the ID is invalid based on validation rules.
     */
    parseId(id: string): string;
}
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
export declare class DefaultIdParser implements IdParser {
    private readonly maxAge;
    private readonly maxSkew;
    constructor(maxAge?: number, maxSkew?: number);
    /**
     * Parses the given trace ID into AWS X-Ray trace ID format.
     * @param id The trace ID to parse.
     * @returns The trace ID formatted as AWS X-Ray trace ID.
     * @throws Error if the trace ID is invalid or out of allowed age/skew range.
     */
    parseId(id: string): string;
}
