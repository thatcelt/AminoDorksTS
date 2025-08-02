import { GLOBAL_TIMEZONE, INVITE_CODE_DEFAULT_DURATION, SIGNATURE_STUB, STATIC_CLIENT_REFERENCE_ID } from '../constants';
import { MayUndefined, Safe } from '../types';
import { InviteCode, UserProfile } from '../types/additional';
import { BasicResponse, ImplementaryResponses, NDCResponses } from '../types/responses';
import { AllowRejoin, BlogBuilder, ChatThreadSettings, EditChatArguments, EditChatThreadBuilder, EditProfileBuilder, Embed, FollowingArguments, MediaArguments, MessageSettings, MessageTypes, OnlineStatus, Timer, WikiBuilder } from '../types/other';
import { HttpWorkflow } from './httpworkflow';
import { ChatThreadTypes, CommentsSorting, MembersType, PostTypes } from '../types/types';
import { BasicClient } from './basicClient';
import { generateTransactionId } from '../utils/helpers';

export class AminoDorksNDC implements BasicClient {
    private readonly __httpWorkflow: Safe<HttpWorkflow>;
    private readonly __accountInfo: Safe<UserProfile>;
    private readonly __ndcId: Safe<number>;

    constructor(httpWorkflow: Safe<HttpWorkflow>, accountInfo: Safe<UserProfile>, ndcId: Safe<number>) {
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

    public getInfluencers = async (): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/${this.__ndcId}/s/influencer`
        });
    };

    public createBlog = async (title: Safe<string>, content: Safe<string>, builder: BlogBuilder = { mediaList: [] }): Promise<ImplementaryResponses.GetCreateBlogResponse> => {        
        const dataToDump = {
            address: null,
            content: content,
            title: title,
            latitude: 0,
            longitude: 0,
            eventSource: 'GlobalComposeMenu',
            timestamp: Date.now(),
            mediaList: builder.mediaList.map(mediaUrl => {
                return [100, mediaUrl, null]
            }),
            extensions: {}
        };

        if (builder.extensions) dataToDump['extensions'] = builder.extensions;

        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetCreateBlogResponse>({
            path: `/x${this.__ndcId}/s/blog`,
            body: JSON.stringify(dataToDump)
        });
    };

    public createWiki = async (label: Safe<string>, content: Safe<string>, builder: WikiBuilder = { mediaList: [] }, keywords: Safe<string> = SIGNATURE_STUB): Promise<ImplementaryResponses.GetCreateWikiResponse> => {
        const dataToDump = {
            label: label,
            content: content,
            icon: builder.icon,
            eventSource: 'GlobalComposeMenu',
            timestamp: Date.now(),
            keywords: keywords,
            mediaList: builder.mediaList.map(mediaUrl => {
                return [100, mediaUrl, null]
            }),
            extensions: {}
        };

        if (builder.extensions) dataToDump['extensions'] = builder.extensions;

        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetCreateWikiResponse>({
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

    public getOnlineUsers = async (start: Safe<number> = 0, size: Safe<number> = 25): Promise<NDCResponses.GetOnlineUsersResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetOnlineUsersResponse>({
            path: `/x${this.__ndcId}/s/live-layer?topic=ndtopic:x${this.__ndcId}:online-members&start=${start}&size=${size}`
        });
    };

    public getUserBlogs = async (userId: Safe<string>, start: Safe<number> = 0, size: Safe<number> = 25): Promise<NDCResponses.GetBlogsResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetBlogsResponse>({
            path: `/x${this.__ndcId}/s/blog?type=user&q=${userId}&start=${start}&size=${size}`
        });
    };

    public getUserWikis = async (userId: Safe<string>, start: Safe<number> = 0, size: Safe<number> = 25): Promise<NDCResponses.GetWikisResponse> => {
        return await this.__httpWorkflow.sendGet<NDCResponses.GetWikisResponse>({
            path: `/x${this.__ndcId}/s/item?type=user-all&start=${start}&size=${size}&cv=1.2&uid=${userId}`
        });
    };

    public getPublicChatThreads = async (start: Safe<number> = 0, size: Safe<number> = 25, type: Safe<ChatThreadTypes> = 'recommended'): Promise<ImplementaryResponses.GetChatThreadsResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadsResponse>({
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

    public getUserInfo = async (userId: Safe<string>): Promise<ImplementaryResponses.GetUserInfoResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserInfoResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}`
        });
    };

    public getChatThreads = async (start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadsResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadsResponse>({
            path: `/x${this.__ndcId}/s/chat/thread?type=joined-me&start=${start}&size=${size}`
        });
    };

    public getChatThread = async (threadId: Safe<string>): Promise<ImplementaryResponses.GetChatThreadResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}`
        });
    };

    public getChatThreadUsers = async (threadId: Safe<string>, start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadUsersResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadUsersResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member?start=${start}&size=${size}&type=default&cv=1.2`
        });
    }

    public joinChatThread = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member/${this.__accountInfo.uid}`
        });
    };

    public leaveChatThread = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member/${this.__accountInfo.uid}`
        });
    };

    public createChatThread = async (startMessage: Safe<string>, chatThreadSettings: ChatThreadSettings): Promise<ImplementaryResponses.GetChatThreadResponse> => {        
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetChatThreadResponse>({
            path: `/x${this.__ndcId}/s/chat/thread`,
            body: JSON.stringify({
                title: chatThreadSettings.title,
                inviteeUids: chatThreadSettings.invitedUserIds,
                initialMessageContent: startMessage,
                content: chatThreadSettings.content,
                timestamp: Date.now(),
                type: 0,
                publishToGlobal: 0
            })
        });
    };

    public inviteToChatThread = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member/invite`,
            body: JSON.stringify({
                uids: userIds,
                timestamp: Date.now()
            })
        });
    };

    public kickFromChatThread = async (threadId: Safe<string>, userId: Safe<string>, allowRejoin: Safe<AllowRejoin> = AllowRejoin.Yes): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member/${userId}?allowRejoin=${allowRejoin}`
        });
    };

    public getChatThreadMessages = async (threadId: Safe<string>, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadMessagesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadMessagesResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message?v=2&pagingType=t&size=${size}`
        });
    };

    public getChatThreadMessagesAfter = async (threadId: Safe<string>, size: Safe<number>, pageToken: Safe<string>): Promise<ImplementaryResponses.GetChatThreadMessagesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadMessagesResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message?v=2&pagingType=t&pageToken=${pageToken}&size=${size}`
        });
    };

    public getUserFollowing = async (followingArguments: FollowingArguments): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${followingArguments.userId}/joined?start=${followingArguments.start}&size=${followingArguments.size}`
        });
    };

    public getUserFollowers = async (followingArguments: FollowingArguments): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${followingArguments.userId}/member?start=${followingArguments.start}&size=${followingArguments.size}`
        });   
    };

    public getBlogInfo = async (blogId: Safe<string>): Promise<ImplementaryResponses.GetCreateBlogResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetCreateBlogResponse>({
            path: `/x${this.__ndcId}/s/blog/${blogId}`
        });
    };

    public getWikiInfo = async (itemId: Safe<string>): Promise<ImplementaryResponses.GetCreateWikiResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetCreateWikiResponse>({
            path: `/x${this.__ndcId}/s/item/${itemId}`
        });
    };

    public getWallComments = async (userId: Safe<string>, sorting: Safe<CommentsSorting> = 'newest', start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetCommentsResponse> => {
        return this.__httpWorkflow.sendGet<ImplementaryResponses.GetCommentsResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/comment?sort=${sorting}&start=${start}&size=${size}`
        });
    };

    public sendMessage = async (threadId: Safe<string>, content: Safe<string>, messageType: Safe<MessageTypes> = 0, messageSettings?: MessageSettings): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: messageType,
                content: content,
                attachedObject: null,
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now(),
                uid: this.__accountInfo.uid,
                extensions: {mentionedArray: messageSettings?.mentionedArray},
                replyMessageId: messageSettings?.repliedMessageId
            })
        });
    };

    public sendEmbededMessage = async (threadId: Safe<string>, content: Safe<string>, embed: Embed, messageSettings?: MessageSettings): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: 0,
                content: content,
                attachedObject: {
                    objectId: embed.objectId,
                    objecttype: embed.objectType,
                    link: embed.link,
                    title: embed.title,
                    content: embed.content,
                    mediaList: embed.mediaList ? [100, embed.mediaList, null] : null
                },
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now(),
                uid: this.__accountInfo.uid,
                extensions: {mentionedArray: messageSettings?.mentionedArray},
                replyMessageId: messageSettings?.repliedMessageId
            })
        });
    };

    public sendSticker = async (threadId: Safe<string>, stickerId: Safe<string>): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: 3,
                stickerId: stickerId,
                content: null,
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now()
            })
        });
    };
    
    public sendImage = async (mediaArguments: MediaArguments): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${mediaArguments.threadId}/message`,
            body: JSON.stringify({
                type: 0,
                mediaType: 100,
                mediaUploadValueContentType: 'image/jpg',
                mediaUhqEnabled: true,
                mediaUploadValue: mediaArguments.file.toString('base64'),
                content: null,
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now()
            })
        });
    };

    public sendAudio = async (mediaArguments: MediaArguments): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${mediaArguments.threadId}/message`,
            body: JSON.stringify({
                type: 2,
                mediaType: 110,
                mediaUploadValue: mediaArguments.file.toString('base64'),
                content: null,
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now()
            })
        });
    };

    public deleteMessage = async (threadId: Safe<string>, messageId: Safe<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message/${messageId}`
        });
    };

    public deleteMessageAsAdmin = async (threadId: Safe<string>, messageId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/message/${messageId}/admin`,
            body: JSON.stringify({
                adminOpName: 102,
                adminOpNote: {content: reason},
                timestamp: Date.now()
            })
        });
    };

    public editChatThread = async (threadId: Safe<string>, builder: EditChatThreadBuilder): Promise<ImplementaryResponses.GetChatThreadResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetChatThreadResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}`,
            body: JSON.stringify({
                timestamp: Date.now(),
                title: builder.title,
                content: builder.content,
                icon: builder.icon,
                keywords: builder.keywords,
                extensions: builder.extensions
            })
        });
    };

    public setChatThreadBackground = async (threadId: Safe<string>, background: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/member/${this.__accountInfo.uid}/background`,
            body: JSON.stringify({
                media: [100, background, null],
                timestamp: Date.now()
            })
        });
    };

    public addCoHosts = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/co-host`,
            body: JSON.stringify({
                uidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public setViewOnly = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${editingArguments.threadId}/view-only/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public setCanInvite = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${editingArguments.threadId}/members-can-invite/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public setCanTip = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${editingArguments.threadId}/tipping-perm-status/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public tipCoinsBlog = async (coins: Safe<number>, blogId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/blog/${blogId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        });
    };

    public tipCoinsChatThread = async (coins: Safe<number>, threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        });
    };

    public follow = async (userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${this.__accountInfo.uid}/joined`,
            body: JSON.stringify({
                targetUidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public unfollow = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${this.__accountInfo.uid}/joined/${userId}`
        })
    };

    public editProfile = async (builder: EditProfileBuilder): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${this.__accountInfo.uid}`,
            body: JSON.stringify({
                timestamp: Date.now(),
                nickname: builder.nickname,
                icon: builder.icon,
                content: builder.content,
                extensions: {
                    style: {
                        backgroundMediaList: [[100, builder.extensions?.style?.backgroundMediaList, null, null, null]],
                        backgroundColor: builder.extensions?.style?.backgroundColor
                    },
                    defaultBubbleId: builder.extensions?.defaultBubbleId
                }
            })
        });
    };

    public sendWallComment = async (content: Safe<string>, userId: Safe<string>, repliedCommentId?: MayUndefined<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/user-profile/${userId}/comment`,
            body: JSON.stringify({
                content: content,
                type: 0,
                eventSource: 'UserProfileView',
                respondTo: repliedCommentId,
                timestamp: Date.now()
            })
        });
    };

    public sendPostComment = async (content: Safe<string>, objectId: Safe<string>, postType: Safe<PostTypes>, repliedCommentId: MayUndefined<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/${postType}/${objectId}/comment`,
            body: JSON.stringify({
                content: content,
                type: 0,
                eventSource: 'PostDetailView',
                respondTo: repliedCommentId,
                timestamp: Date.now()
            })
        });
    };

    public likeMultipleBlogs = async (blogIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/feed/vote`,
            body: JSON.stringify({
                value: 4,
                targetIdList: blogIds,
                timestamp: Date.now()
            })
        });
    };

    public getAllUsers = async (usersType: Safe<MembersType> = 'recent', start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/x${this.__ndcId}/s/user-profile?type=${usersType}&start=${start}&size=${size}`
        });
    };

    public transferHostRequest = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/transfer-organizer`,
            body: JSON.stringify({
                uidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public transferHostAccept(threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse> {
        return this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/x${this.__ndcId}/s/chat/thread/${threadId}/transfer-organizer/${requestId}/accept`
        });
    };
};