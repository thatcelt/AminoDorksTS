import { GLOBAL_TIMEZONE, INVITE_CODE_DEFAULT_DURATION, SIGNATURE_STUB } from '../constants';
import { Safe } from '../types';
import { Account, InviteCode } from '../types/additional';
import { BasicResponse, NDCResponses } from '../types/responses';
import { BlogBuilder, ChatThreadTypes, OnlineStatus, PostTypes, Strikes, Timer, WikiBuilder } from '../types/types';
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

    public createWiki = async (label: Safe<string>, content: Safe<string>, builder: WikiBuilder = { mediaList: [] }, keywords: Safe<string> = SIGNATURE_STUB): Promise<NDCResponses.CreateWikiResponse> => {
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

    public sendActivityTime = async (timers: Safe<Timer[]>, timezone: Safe<number> = GLOBAL_TIMEZONE): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/community/stats/user-active-time`,
            body: JSON.stringify({
                userActiveTimeChunkList: timers,
                optInAdsFlags: 2147483647,
                timezone: timezone,
                timestamp: Date.now()
            })
        });
    };
    
    public setOnlineStatus = async (status: Safe<OnlineStatus>, duration: Safe<number> = 86400): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${this.__accountInfo.uid}/online-status`,
            body: JSON.stringify({
                onlineStatus: status,
                duration: duration,
                timestamp: Date.now()
            })
        });
    };

    public getOnlineUsers = async (start: Safe<number>, size: Safe<number>): Promise<NDCResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetUserProfilesResponse>({
            path: `/x${this.__ndcId}/s/live-layer?topic=ndtopic:x${this.__ndcId}:online-members&start=${start}&size=${size}`
        });
    };

    public getUserBlogs = async (userId: Safe<string>, start: Safe<number>, size: Safe<number>): Promise<NDCResponses.GetBlogsResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetBlogsResponse>({
            path: `/x${this.__ndcId}/s/blog?type=user&q=${userId}&start=${start}&size=${size}`
        });
    };

    public getUserWikis = async (userId: Safe<string>, start: Safe<number>, size: Safe<number>): Promise<NDCResponses.GetWikiResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetWikiResponse>({
            path: `/x${this.__ndcId}/s/item?type=user-all&start=${start}&size=${size}&cv=1.2&uid=${userId}`
        });
    };

    public getPublicChatThreads = async (start: Safe<number> = 0, size: Safe<number> = 25, type: Safe<ChatThreadTypes> = 'recommended'): Promise<NDCResponses.GetChatThreadsResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetChatThreadsResponse>({
            path: `/x${this.__ndcId}/s/chat/thread?type=public-all&filterType=${type}&start=${start}&size=${size}`
        });
    };

    public hideUser = async (userId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 18,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public hideChatThread = async (threadId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public hidePost = async (objectId: Safe<string>, postType: Safe<PostTypes>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public unhideUser = async (userId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 19,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public unhideChatThread = async (threadId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public unhidePost = async (objectId: Safe<string>, postType: Safe<PostTypes>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public warnUser = async (userId: Safe<number>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/notice`,
            body: JSON.stringify({
                uid: userId,
                title: "Custom",
                content: reason,
                attachedObject: {
                    objectId: userId,
                    objectType: 0
                },
                penaltyType: 0,
                adminOpNote: {},
                noticeType: 7,
                timestamp: Date.now()
            })
        });
    };

    public strikeUser = async (userId: Safe<string>, duration: Safe<Strikes> = Strikes.ONE_DAY, reason: Safe<string> = SIGNATURE_STUB, title: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/notice`,
            body: JSON.stringify({
                uid: userId,
                title: title,
                content: reason,
                attachedObject: {
                    objectId: userId,
                    objectType: 0
                },
                penaltyType: 1,
                penaltyValue: duration,
                adminOpNote: {},
                noticeType: 4,
                timestamp: Date.now()
            })
        });
    };

    public banUser = async (userId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/ban`,
            body: JSON.stringify({
                reasonType: null,
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };

    public unbanUser = async (userId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/unban`,
            body: JSON.stringify({
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        });
    };
};