import { MayUndefined, Safe } from '../types';
import { LinkInfo, UserProfile } from '../types/additional';
import { GlobalResponses, BasicResponse, ImplementaryResponses } from '../types/responses';
import { MediaTypes } from '../types/types';
import { decodeSession, generateDeviceId, getPublicKeyCredentials } from '../utils/helpers';
import { AminoDorksNDC } from './aminodorksNdc';
import { HttpWorkflow } from './httpworkflow';

export class AminoDorks {
    private readonly __deviceId: Safe<string> = generateDeviceId();
    private __accountInfo: MayUndefined<UserProfile>;
    public __aminodorksNdc: AminoDorksNDC | undefined;

    private readonly __httpWorkflow: Safe<HttpWorkflow>;

    constructor(apiKey: Safe<string>) {
        this.apiKey = apiKey;
        this.__httpWorkflow = new HttpWorkflow({ NDCDEVICEID: this.__deviceId });
    };

    get apiKey(): Safe<string> {
        if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

        return process.env.API_KEY;
    };

    set apiKey(apiKey: Safe<string>) {
        process.env.API_KEY = apiKey;
    };

    get accountInfo(): MayUndefined<UserProfile> {
        return this.__accountInfo;
    };

    get aminodorksNDC(): Readonly<AminoDorksNDC> {
        if (!this.__aminodorksNdc) { throw new Error('AminoDorksNDC is not defined'); }

        return this.__aminodorksNdc;
    };

    private __remadePublicKey = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/security/public_key',
            body: JSON.stringify(
                await getPublicKeyCredentials(userId)
            )
        });
    };

    public setNdcId = (ndcId: Safe<number>): Readonly<AminoDorksNDC> => {
        if (!this.__accountInfo) { throw new Error('Account info is not defined'); }

        this.__aminodorksNdc = new AminoDorksNDC(this.__httpWorkflow, this.__accountInfo, ndcId);

        return this.__aminodorksNdc;
    }

    public uploadMedia = async (file: Safe<Buffer>, type: Safe<MediaTypes>): Promise<GlobalResponses.UploadMediaResponse> => {
        return await this.__httpWorkflow.sendPost<GlobalResponses.UploadMediaResponse>({
            path: '/g/s/media/upload',
            body: file,
            contentType: type
        });
    };

    public getLinkResolution = async (link: string): Promise<LinkInfo> => {
        return (await this.__httpWorkflow.sendGet<GlobalResponses.LinkResolutionResponse>({
            path: `/g/s/link-resolution?q=${link.split('/')[4]}`
        })).linkInfoV2.extensions.linkInfo;
    };

    public authenticate = async (email: Safe<string>, password: Safe<string>): Promise<GlobalResponses.AuthenticateResponse> => {
        const response = await this.__httpWorkflow.sendPost<GlobalResponses.AuthenticateResponse>({
            path: '/g/s/auth/login',
            body: JSON.stringify({
                email: email,
                v: 2,
                secret: `0 ${password}`,
                deviceID: this.__deviceId,
                clientType: 100,
                action: 'normal',
                timestamp: Date.now()
            })
        });
        if (response.sid == undefined) { throw new Error(`Authentication failed: ${response['api:message']}`); }

        this.__httpWorkflow.addAdditionalHeaders({ AUID: response.auid, NDCAUTH: `sid=${response.sid}` });
        this.__accountInfo = response.userProfile;
        await this.__remadePublicKey(response.account.uid);

        return response;
    };

    public authenticateSession = async (sessionId: Safe<string>): Promise<BasicResponse> => {
        const sessionData = decodeSession(sessionId);

        if (!sessionData) { throw new Error('Invalid session'); }
        
        this.__httpWorkflow.addAdditionalHeaders({ AUID: sessionData.userId, NDCAUTH: `sid=${sessionId}` });
        this.__accountInfo = (await this.getUserInfo(sessionData.userId)).userProfile;
        return await this.__remadePublicKey(sessionData.userId);

    };

    public requestResetPassword = async (email: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/auth/request-security-validation',
            body: JSON.stringify({
                identity: email,
                deviceID: this.__deviceId,
                type: 1,
                level: 2,
                purpose: 'reset-password'
            })
        });
    };

    public requestVerifyAccount = async (email: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/auth/request-security-validation',
            body: JSON.stringify({
                identity: email,
                deviceID: this.__deviceId,
                type: 1
            })
        });
    };

    public resetPassword = async (email: Safe<string>, code: Safe<string>, newPassword: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/auth/reset-password',
            body: JSON.stringify({
                updateSecret: `0 ${newPassword}`,
                emailValidationContext: {
                    data: {
                        code: code
                    },
                    type: 1,
                    identity: email,
                    level: 2,
                    deviceID: this.__deviceId
                },
                phoneNumberValidationContext: null,
                deviceID: this.__deviceId
            })
        });
    };

    public verifyAccount = async (email: Safe<string>, code: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/auth/check-security-validation',
            body: JSON.stringify({
                validationContext: {
                    type: 1,
                    identity: email,
                    data: { code: code }
                },
                deviceID: this.__deviceId,
                timestamp: Date.now()

            })
        });
    };

    public deleteAccount = async (password: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/account/delete-request',
            body: JSON.stringify({
                deviceID: this.__deviceId,
                secret: `0 ${password}`
            })
        });
    };

    public getCommunities = async (start: Safe<number> = 0, size: Safe<number> = 25): Promise<GlobalResponses.GetCommunitiesResponse> => {
        return await this.__httpWorkflow.sendGet<GlobalResponses.GetCommunitiesResponse>({
            path: `/g/s/community/joined?v=1&start=${start}&size=${size}`
        });
    };

    public searchCommunity = async (title: Safe<string>): Promise<GlobalResponses.SearchCommunityResponse> => {
        return await this.__httpWorkflow.sendGet<GlobalResponses.SearchCommunityResponse>({
            path: `/g/s/search/amino-id-and-link?q=${title}`
        });
    };

    public joinCommunity = async (ndcId: Safe<number>, invitationId: MayUndefined<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${ndcId}/s/community/join`,
            body: JSON.stringify({
                timestamp: Date.now(),
                invitationId: invitationId
            })
        });
    };

    public leaveCommunity = async (ndcId: Safe<number>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${ndcId}/s/community/leave`
        });
    };

    public membershipRequest = async (ndcId: Safe<number>, message: MayUndefined<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${ndcId}/s/community/membership-request`,
            body: JSON.stringify({
                message: message,
                timestamp: Date.now()
            })
        });
    };

    public changeAminoId = async (aminoId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: '/g/s/account/change-amino-id',
            body: JSON.stringify({
                aminoId: aminoId,
                timestamp: Date.now()
            })
        });
    };

    public getWalletInfo = async (): Promise<GlobalResponses.GetWalletInfoResponse> => {
        return await this.__httpWorkflow.sendGet<GlobalResponses.GetWalletInfoResponse>({
            path: '/g/s/wallet'
        });
    };

    public getWalletHistory = async (start: Safe<number> = 0, size: Safe<number> = 25): Promise<GlobalResponses.GetWalletHistoryResponse> => {
        return await this.__httpWorkflow.sendGet<GlobalResponses.GetWalletHistoryResponse>({
            path: `/g/s/wallet/coin/history?start=${start}&size=${size}`
        });
    };

    public getUserInfo = async (userId: Safe<string>): Promise<ImplementaryResponses.GetUserInfoResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserInfoResponse>({
            path: `/g/s/user-profile/${userId}`
        });
    };
};