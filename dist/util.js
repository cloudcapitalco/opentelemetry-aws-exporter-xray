"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hrt = hrt;
exports.str = str;
exports.ip = ip;
exports.undef = undef;
exports.num = num;
const node_net_1 = __importDefault(require("node:net"));
/**
 * Converts a high-resolution time (HrTime) tuple into seconds.
 * @param { [number, number] } timestamp - The high-resolution time tuple
 * [seconds, nanoseconds].
 * @returns { number } The timestamp converted to seconds.
 */
function hrt(timestamp) {
    return timestamp[0] + timestamp[1] / 1e9;
}
/**
 * Converts an unknown object to its stringified version.
 * @param { unknown } aValue - The object to convert to string.
 * @returns { string | undefined } The object converted to string.
 */
function str(aValue) {
    return aValue ? aValue?.toString() : undefined;
}
/**
 * Validates an IP address.
 * @param { string } [ip] - The IP address to validate.
 * @returns { string | undefined } The validated IP address, or undefined
 * if invalid.
 */
function ip(ip) {
    return node_net_1.default.isIP(ip || '') ? ip : undefined;
}
/**
 * Returns the array if it contains elements, otherwise undefined.
 * @template T
 * @param {T[]} arr - The array to check.
 * @returns {T[]|undefined} The array if not empty, otherwise undefined.
 */
function undef(arr) {
    return arr?.length > 0 ? arr : undefined;
}
/**
 * Converts an unknown input to a number if possible, otherwise returns undefined.
 * @param {unknown} num - The input to convert.
 * @returns {number|undefined} The number if it is a valid number, otherwise undefined.
 */
function num(num) {
    return num ? (isNaN(Number(num)) ? undefined : Number(num)) : undefined;
}
//# sourceMappingURL=util.js.map