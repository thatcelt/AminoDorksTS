import { Account, UserProfile } from "./additional";

export interface BasicResponse {
    ['api:statuscode']: number;
    ['api:duration']: string;
    ['api:message']: string;
    ['api:timestamp']: string;
}

export interface AuthenticateResponse extends BasicResponse {
    auid: string;
    account: Account;
    secret: string;
    sid: string;
    userProfile: UserProfile;
}
