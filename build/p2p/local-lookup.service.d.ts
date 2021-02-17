import { Address } from './models';
export declare class LocalLookupService {
    private readonly LOCAL_PORT;
    private readonly addressTimeoutInMs;
    private bind;
    private close;
    lookup(host: string): Promise<Address>;
}
