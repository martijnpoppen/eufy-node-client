import { Hub, DeviceRequest, FullDevice, DskKey, Stream, ResultWrapper } from './http-response.models';
import { HistoryRecordRequest, StreamRequest } from './http-request.models';
export declare class HttpService {
    private username;
    private password;
    private baseUrl;
    private currentLoginResult;
    private headers;
    constructor(username: string, password: string);
    listHubs(): Promise<Array<Hub>>;
    listDevices(deviceRequest?: Partial<DeviceRequest>): Promise<Array<FullDevice>>;
    stationDskKeys(station_sns: string): Promise<DskKey>;
    voiceList(station_sn: string): Promise<DskKey>;
    allHistoryRecord(historyRecord?: HistoryRecordRequest): Promise<any>;
    startStream(startStreamRequest: StreamRequest): Promise<Stream>;
    stopStream(stopStreamRequest: StreamRequest): Promise<void>;
    pushTokenCheck(): Promise<ResultWrapper>;
    registerPushToken(pushToken: string): Promise<ResultWrapper>;
    private requestWithToken;
    private getWithToken;
    private getToken;
    private isTokenOutdated;
    private login;
}
