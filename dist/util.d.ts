/**
 * Converts a high-resolution time (HrTime) tuple into seconds.
 * @param { [number, number] } timestamp - The high-resolution time tuple
 * [seconds, nanoseconds].
 * @returns { number } The timestamp converted to seconds.
 */
export declare function hrt(timestamp: [number, number]): number;
/**
 * Converts an unknown object to its stringified version.
 * @param { unknown } aValue - The object to convert to string.
 * @returns { string | undefined } The object converted to string.
 */
export declare function str(aValue: unknown): string | undefined;
/**
 * Validates an IP address.
 * @param { string } [ip] - The IP address to validate.
 * @returns { string | undefined } The validated IP address, or undefined
 * if invalid.
 */
export declare function ip(ip?: string): string | undefined;
/**
 * Returns the array if it contains elements, otherwise undefined.
 * @template T
 * @param {T[]} arr - The array to check.
 * @returns {T[]|undefined} The array if not empty, otherwise undefined.
 */
export declare function undef<T>(arr: T[]): T[] | undefined;
/**
 * Converts an unknown input to a number if possible, otherwise returns undefined.
 * @param {unknown} num - The input to convert.
 * @returns {number|undefined} The number if it is a valid number, otherwise undefined.
 */
export declare function num(num: unknown): undefined | number;
