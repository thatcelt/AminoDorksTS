import { GLOBAL_TIMEZONE, INVITE_CODE_DEFAULT_DURATION } from '../constants';
import { BlogBuilder, Safe, WikiBuilder } from '../types';
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

    public getInfluencers = async (): Promise<NDCResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetUserProfilesResponse>({
            path: `/${this.__ndcId}/s/influencer`
        });
    };

    public createBlog = async (title: Safe<string>, content: Safe<string>, builder: BlogBuilder = { mediaList: [] }): Promise<NDCResponses.CreateBlogResponse> => {        
        const dataToDump = {
            address: null,
            content: content,
            title: title,
            latitude: 0,
            longitude: 0,
            eventSource: "GlobalComposeMenu",
            timestamp: Date.now(),
            mediaList: builder.mediaList.map(mediaUrl => {
                return [100, mediaUrl, null]
            }),
            extensions: {}
        };

        if (builder.extensions) dataToDump['extensions'] = builder.extensions;

        return await this.__httpWorkflow.sendPost<NDCResponses.CreateBlogResponse>({
            path: `/x${this.__ndcId}/s/blog`,
            body: JSON.stringify(dataToDump)
        });
    };

    public createWiki = async (label: Safe<string>, content: Safe<string>, builder: WikiBuilder = { mediaList: [] }, keywords: Safe<string> = 'aminodorks'): Promise<NDCResponses.CreateWikiResponse> => {
        const dataToDump = {
            label: label,
            content: content,
            icon: builder.icon,
            eventSource: "GlobalComposeMenu",
            timestamp: Date.now(),
            keywords: keywords,
            mediaList: builder.mediaList.map(mediaUrl => {
                return [100, mediaUrl, null]
            }),
            extensions: {}
        };

        if (builder.extensions) dataToDump['extensions'] = builder.extensions;

        return await this.__httpWorkflow.sendPost<NDCResponses.CreateWikiResponse>({
            path: `/x${this.__ndcId}/s/item`,
            body: JSON.stringify(dataToDump)
        });
    };

    public deleteBlog = async (blogId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/blog/${blogId}`
        });
    };

    public deleteWiki = async (itemId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/item/${itemId}`
        });
    };

    public playLottery = async (timezone: Safe<number> = GLOBAL_TIMEZONE): Promise<NDCResponses.PlayLotteryResponse> => {
        return await this.__httpWorkflow.sendPost<NDCResponses.PlayLotteryResponse>({
            path: `/x${this.__ndcId}/s/check-in/lottery`,
            body: JSON.stringify({
                timezone: timezone,
                timestamp: Date.now()
            })
        });
    };
};