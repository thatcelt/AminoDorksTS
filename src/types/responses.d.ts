import { Account, UserProfile } from './additional';

export interface BasicResponse {
    ['api:statuscode']: number;
    ['api:duration']: string;
    ['api:message']: string;
    ['api:timestamp']: string;
};

export interface AuthenticateResponse extends BasicResponse {
    auid: string;
    account: Account;
    secret: string;
    sid: string;
    userProfile: UserProfile;
};

export interface LinkResolutionResponse extends BasicResponse {
    linkInfoV2: {
        path: string;
        extensions: {
            linkInfo: {
                objectId?: string;
                targetCode: number;
                ndcId: number;
                fullPath: string;
                shortCode: string;
                objectIdType: number;
            };
        };
    };
};

export interface UploadMediaResponse extends BasicResponse {
    mediaValue: string;
};
