"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTraceFilter = void 0;
class DefaultTraceFilter {
    doFilter(trace) {
        return !trace.http?.request?.user_agent?.includes('aws-sdk-js');
    }
}
exports.DefaultTraceFilter = DefaultTraceFilter;
//# sourceMappingURL=trace.filter.js.map