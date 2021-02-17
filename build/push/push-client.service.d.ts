/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class PushClient extends EventEmitter {
    private pushClientParser;
    private auth;
    private readonly HOST;
    private readonly PORT;
    private readonly MCS_VERSION;
    private readonly HEARTBEAT_INTERVAL;
    private loggedIn;
    private streamId;
    private lastStreamIdReported;
    private currentDelay;
    private client?;
    private heartbeatTimeout?;
    private reconnectTimeout?;
    private persistentIds;
    private static proto;
    private callback;
    private constructor();
    static init(auth: {
        androidId: string;
        securityToken: string;
    }): Promise<PushClient>;
    private initialize;
    setPersistentIds(ids: Array<string>): void;
    connect(callback?: (msg: any) => void, persistentIds?: Array<string>): void;
    updateCallback(callback: (msg: any) => void): void;
    private buildLoginRequest;
    private buildHeartbeatPingRequest;
    private buildHeartbeatAckRequest;
    private onSocketData;
    private onSocketConnect;
    private onSocketClose;
    private onSocketError;
    private handleParsedMessage;
    private handleHeartbeatPing;
    private handleHeartbeatAck;
    private convertPayloadMessage;
    private getStreamId;
    private newStreamIdAvailable;
    private scheduleHeartbeat;
    private sendHeartbeat;
    isConnected(): boolean;
    private getCurrentDelay;
    private resetCurrentDelay;
    private scheduleReconnect;
}
