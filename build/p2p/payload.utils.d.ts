/// <reference types="node" />
import { Socket } from 'dgram';
import { CommandType } from './command.model';
export declare const MAGIC_WORD = "XZYH";
export declare const buildLookupWithKeyPayload: (socket: Socket, p2pDid: string, dskKey: string) => Buffer;
export declare const buildCheckCamPayload: (p2pDid: string) => Buffer;
export declare const buildIntCommandPayload: (value: number, actor: string, channel?: number) => Buffer;
export declare const buildStringTypeCommandPayload: (strValue: string, actor: string, channel?: number) => Buffer;
export declare const buildIntStringCommandPayload: (value: number, strValue: string, channel?: number, strValueSub?: string) => Buffer;
export declare const buildCommandHeader: (seqNumber: number, commandType: CommandType) => Buffer;
export declare const intToBufferBE: (inp: string | number, bufferLength?: number | null) => Buffer;
export declare const intToBufferLE: (inp: string | number, bufferLength?: number | null) => Buffer;
