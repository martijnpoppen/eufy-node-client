import { Address } from './models';
export declare class CloudLookupService {
    private readonly addressTimeoutInMs;
    private addresses;
    private bind;
    private close;
    lookup(p2pDid: string, dskKey: string): Promise<Array<Address>>;
    private lookupByAddress;
}
