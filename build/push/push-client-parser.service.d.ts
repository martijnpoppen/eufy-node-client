/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class PushClientParser extends EventEmitter {
    private static proto;
    private state;
    private data;
    private isWaitingForData;
    private sizePacketSoFar;
    private messageSize;
    private messageTag;
    private handshakeComplete;
    private constructor();
    resetState(): void;
    static init(): Promise<PushClientParser>;
    handleData(newData: Buffer): void;
    private waitForData;
    private handleFullMessage;
    private onGotVersion;
    private onGotMessageTag;
    private onGotMessageSize;
    private onGotMessageBytes;
    private getNextMessage;
    private getMinBytesNeeded;
    private buildProtobufFromTag;
}
