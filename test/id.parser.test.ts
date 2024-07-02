import { DefaultIdParser } from '../src/id.parser';
import { AWSXRayIdGenerator } from '@opentelemetry/id-generator-aws-xray';

describe('DefaultIdParser', () => {
  const parser = new DefaultIdParser();
  const idGenerator: AWSXRayIdGenerator = new AWSXRayIdGenerator();

  test('should correctly parse a valid trace ID', () => {
    const traceId = idGenerator.generateTraceId();
    const epochPart = traceId.substring(0, 8);
    const expected = `1-${epochPart}-${traceId.substring(8)}`;
    expect(parser.parseId(traceId)).toBe(expected);
  });

  test('should throw an error for an invalid trace ID (invalid format)', () => {
    const invalidId = 'invalidtraceid';
    expect(() => parser.parseId(invalidId)).toThrow(
      'Invalid X-Ray trace ID: invalidtraceid',
    );
  });

  test('should throw an error for a trace ID with an epoch time too old', () => {
    const oldEpoch = (Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 29)
      .toString(16)
      .padStart(8, '0');
    const invalidId = `${oldEpoch}a0b1c0d1e2f3a45678abcdef`;
    expect(() => parser.parseId(invalidId)).toThrow(
      `Invalid X-Ray trace ID: ${invalidId}`,
    );
  });

  test('should throw an error for a trace ID with an epoch time too far in the future', () => {
    const futureEpoch = (Math.floor(Date.now() / 1000) + 60 * 6)
      .toString(16)
      .padStart(8, '0');
    const invalidId = `${futureEpoch}a0b1c0d1e2f3a45678abcdef`;
    expect(() => parser.parseId(invalidId)).toThrow(
      `Invalid X-Ray trace ID: ${invalidId}`,
    );
  });

  test('should throw an error for a trace ID with a non-numeric epoch', () => {
    const invalidId = 'invalid1a0b1c0d1e2f3a45678abcdef';
    expect(() => parser.parseId(invalidId)).toThrow(
      `Invalid X-Ray trace ID: ${invalidId}`,
    );
  });
});
