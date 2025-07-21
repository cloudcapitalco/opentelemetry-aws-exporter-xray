"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCauseParser = void 0;
const node_crypto_1 = require("node:crypto");
const util_1 = require("./util");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const api_1 = require("@opentelemetry/api");
const ErrorStackParser = __importStar(require("error-stack-parser"));
class DefaultCauseParser {
    idGen;
    constructor(idGen = () => (0, node_crypto_1.randomBytes)(8).toString('hex')) {
        this.idGen = idGen;
        //
    }
    /**
     * Parses the span events to identify the cause of an error, including
     * detailed information about exceptions.
     *
     * Indicate the cause of the error by including a cause object in the
     * segment or subsegment.
     *
     * The cause can be either a 16-character exception ID or an object with the
     * following fields:
     * - working_directory: The full path of the working directory when the
     *   exception occurred.
     * - paths: An array of paths to libraries or modules in use when the
     *   exception occurred.
     * - exceptions: An array of exception objects.
     *
     * Each exception object can include the following optional fields:
     * - id: A 64-bit identifier for the exception, unique among segments in the
     *   same trace, in 16 hexadecimal digits.
     * - message: The exception message.
     * - type: The exception type.
     * - remote: A boolean indicating that the exception was caused by an error
     *   returned by a downstream service.
     * - truncated: An integer indicating the number of stack frames that are
     *   omitted from the stack.
     * - skipped: An integer indicating the number of exceptions that were skipped
     *   between this exception and its child, i.e., the exception that it caused.
     * - cause: Exception ID of the exception's parent, i.e., the exception that
     *   caused this exception.
     * - stack: An array of stackFrame objects.
     *
     * Each stackFrame object can include the following optional fields:
     * - path: The relative path to the file.
     * - line: The line in the file.
     * - label: The function or method name.
     *
     * @returns An object representing the cause of the error, including an array
     *   of parsed exceptions.
     */
    getCause(span) {
        return span.events.some((event) => event.name === 'exception')
            ? {
                exceptions: (0, util_1.undef)(span.events
                    .filter((event) => event.name === 'exception')
                    .map((event) => ({
                    id: this.idGen(),
                    type: (0, util_1.str)(event.attributes?.[semantic_conventions_1.SEMATTRS_EXCEPTION_TYPE]),
                    message: (0, util_1.str)(event.attributes?.[semantic_conventions_1.SEMATTRS_EXCEPTION_MESSAGE]),
                    remote: [api_1.SpanKind.PRODUCER, api_1.SpanKind.CLIENT].includes(span.kind),
                    stack: ErrorStackParser.parse({
                        stack: event.attributes?.[semantic_conventions_1.SEMATTRS_EXCEPTION_STACKTRACE],
                    }).map((stack) => {
                        return {
                            label: stack.functionName || 'anonymous',
                            line: stack.lineNumber,
                            path: stack.fileName,
                        };
                    }),
                }))),
            }
            : undefined;
    }
}
exports.DefaultCauseParser = DefaultCauseParser;
//# sourceMappingURL=cause.parser.js.map