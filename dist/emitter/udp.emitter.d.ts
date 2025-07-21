import { SegmentEmitter } from './segment.emitter';
import { XrayTraceDataSegmentDocument } from '../xray.document';
import * as dgram from 'node:dgram';
/**
 * UDP-based implementation of the SegmentEmitter interface that sends trace
 * data to the X-Ray daemon using UDP. It has been mercilessly cannibalised from
 * {@link https://github.com/aws/aws-xray-sdk-node/blob/aws-xray-sdk-node%403.9.0/packages/core/lib/segment_emitter.js}
 *
 * By default, segments are sent to localhost:2000, but you can configure this
 * using the `AWS_XRAY_DAEMON_ADDRESS` environment variable
 *
 * The X-Ray daemon is a software application that listens for traffic on
 * UDP port 2000 and relays trace data to the X-Ray service. It is always running
 * on Lambda and is faster as it uses a UDP-based transport.
 *
 * For more details, see the
 * {@link https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html AWS X-Ray Daemon documentation}.
 */
export declare class UDPDaemonSegmentEmitter implements SegmentEmitter {
    private readonly socket;
    private daemonConfig;
    /**
     * Constructs a new UDPDaemonSegmentEmitter.
     */
    constructor(socket?: dgram.Socket);
    shutdown(): void;
    /**
     * Emits the provided trace data segments using UDP.
     * @param trace - The trace data segments to emit.
     */
    emit(trace: XrayTraceDataSegmentDocument[]): Promise<void>;
    /**
     * Processes and sets the daemon address from the provided address string.
     * @param address - The address string to process.
     * @throws Error if the address format is invalid.
     */
    private processAddress;
}
