import { INVITE_CODE_DEFAULT_DURATION } from '../constants';
import { Safe } from '../types';
import { Account, InviteCode } from '../types/additional';
import { BasicResponse, NDCResponses } from '../types/responses';
import { HttpWorkflow } from './httpworkflow';

export class AminoDorksNDC {
    private readonly __httpWorkflow: Safe<HttpWorkflow>;
    private readonly __accountInfo: Safe<Account>;
    private readonly __ndcId: Safe<number>;

    constructor(httpWorkflow: Safe<HttpWorkflow>, accountInfo: Safe<Account>, ndcId: Safe<number>) {
        this.__httpWorkflow = httpWorkflow;
        this.__accountInfo = accountInfo;
        this.__ndcId = ndcId;
    };

    public getInviteCodes = async (start: Safe<number> = 0, size: Safe<number> = 10): Promise<NDCResponses.GetInviteCodesResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetInviteCodesResponse>({
            path: `/g/s-x${this.__ndcId}/community/invitation?status=normal&start=${start}&size=${size}`
        });
    };

    public createInviteCode = async (duration: Safe<number> = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode> => {
        return (await this.__httpWorkflow.sendPost<NDCResponses.CreateInviteCodeResponse>({
            path: `/g/s-x${this.__ndcId}/community/invitation`,
            body: JSON.stringify({
                duration: duration,
                force: true,
                timestamp: Date.now()
            })
        })).communityInvitation;
    };

    public deleteInviteCode = async (invitationId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/g/s-x${this.__ndcId}/community/invitation/${invitationId}`
        });
    };
};