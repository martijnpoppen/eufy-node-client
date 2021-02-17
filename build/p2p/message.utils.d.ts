/// <reference types="node" />
import { Socket } from 'dgram';
export declare class RequestMessageType {
    static readonly LOOKUP_WITH_DSK: Buffer;
    static readonly LOCAL_LOOKUP: Buffer;
    static readonly CHECK_CAM: Buffer;
    static readonly PING: Buffer;
    static readonly PONG: Buffer;
    static readonly DATA: Buffer;
    static readonly ACK: Buffer;
}
export declare class ResponseMessageType {
    static readonly STUN: Buffer;
    static readonly LOOKUP_RESP: Buffer;
    static readonly LOOKUP_ADDR: Buffer;
    static readonly LOCAL_LOOKUP_RESP: Buffer;
    static readonly END: Buffer;
    static readonly PONG: Buffer;
    static readonly PING: Buffer;
    static readonly CAM_ID: Buffer;
    static readonly ACK: Buffer;
    static readonly DATA: Buffer;
}
export declare const sendMessage: (socket: Socket, address: {
    host: string;
    port: number;
}, msgID: Buffer, payload?: Buffer | undefined) => Promise<number>;
export declare const hasHeader: (msg: Buffer, searchedType: Buffer) => boolean;
