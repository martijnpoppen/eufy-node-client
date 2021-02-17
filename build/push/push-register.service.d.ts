import { CheckinResponse, FidInstallationResponse, FidTokenResponse, GcmRegisterResponse } from './fid.model';
export declare class PushRegisterService {
    private readonly APP_PACKAGE;
    private readonly APP_ID;
    private readonly APP_SENDER_ID;
    private readonly APP_CERT_SHA1;
    private readonly FCM_PROJECT_ID;
    private readonly GOOGLE_API_KEY;
    private readonly AUTH_VERSION;
    registerFid(fid: string): Promise<FidInstallationResponse>;
    private buildExpiresAt;
    renewFidToken(fid: string, refreshToken: string): Promise<FidTokenResponse>;
    createPushCredentials(): Promise<{
        fidResponse: FidInstallationResponse;
        checkinResponse: CheckinResponse;
        gcmResponse: GcmRegisterResponse;
    }>;
    executeCheckin(): Promise<CheckinResponse>;
    registerGcm(fidInstallationResponse: FidInstallationResponse, checkinResponse: CheckinResponse): Promise<GcmRegisterResponse>;
}
