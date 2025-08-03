import { cacheManager, INVALID_SESSION_STATUS_CODE, SIGNATURE_STUB, STATIC_CLIENT_REFERENCE_ID } from '../constants';
import { CacheEntity, MayNull, MayUndefined, Safe } from '../types';
import { LinkInfo, UserProfile } from '../types/additional';
import { AllowRejoin, ChatThreadSettings, EditChatArguments, EditChatThreadBuilder, EditProfileBuilder, Embed, FollowingArguments, MediaArguments, MessageSettings, MessageTypes } from '../types/other';
import { GlobalResponses, BasicResponse, ImplementaryResponses } from '../types/responses';
import { CommentsSorting, MediaTypes, MembersType, PostTypes } from '../types/types';
import { decodeSession, generateDeviceId, generateTransactionId, getPublicKeyCredentials } from '../utils/helpers';
import { AminoDorksNDC } from './aminodorksNdc';
import { BasicClient } from './basicClient';
import { HttpWorkflow } from './httpworkflow';

export class AminoDorks implements BasicClient {
    private __deviceId: Safe<string> = generateDeviceId();

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

    get accountInfo(): Safe<UserProfile> {
        if (!this.__accountInfo) { throw new Error('Account info is not defined'); }

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

    private __checkSessionIsValid = async (cacheEntity: Safe<CacheEntity>): Promise<boolean> => {
        const response = await this.__httpWorkflow.sendRaw<BasicResponse>({
            method: 'GET',
            path: `/g/s/user-profile/${cacheEntity.userProfile.uid}`,
            additionalHeaders: {
                AUID: cacheEntity.userProfile.uid,
                NDCAUTH: `sid=${cacheEntity.sessionId}`
            }
        });
        return response['api:statuscode'] != INVALID_SESSION_STATUS_CODE;
    };

    public setNdcId = (ndcId: Safe<number>): Readonly<AminoDorksNDC> => {
        this.__aminodorksNdc = new AminoDorksNDC(this.__httpWorkflow, this.accountInfo, ndcId);

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

    public authenticate = async (email: Safe<string>, password: Safe<string>): Promise<UserProfile> => {
        const cachedUserData = cacheManager.getFromKey(`${email}-${password}`)
        
        if (cachedUserData && await this.__checkSessionIsValid(cachedUserData)) {
            this.__deviceId = cachedUserData.deviceId;
            this.__httpWorkflow.addAdditionalHeaders({
                AUID: cachedUserData.userProfile.uid,
                NDCAUTH: `sid=${cachedUserData.sessionId}`,
                NDCDEVICEID: cachedUserData.deviceId
            });
            this.__accountInfo = cachedUserData.userProfile;
            await this.__remadePublicKey(cachedUserData.userProfile.uid);
            return cachedUserData.userProfile;
        }

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

        this.__httpWorkflow.addAdditionalHeaders({ AUID: response.auid, NDCAUTH: `sid=${response.sid}` });
        this.__accountInfo = response.userProfile;
        cacheManager.addToCache(`${email}-${password}`, { sessionId: response.sid, userProfile: response.userProfile, deviceId: this.__deviceId });
        await this.__remadePublicKey(response.account.uid);

        return response.userProfile;
    };

    public authenticateSession = async (sessionId: Safe<string>, deviceId: Safe<string>): Promise<BasicResponse> => {
        const sessionData = decodeSession(sessionId);

        if (!sessionData) { throw new Error('Invalid session'); }
        
        this.__deviceId = deviceId;
        this.__httpWorkflow.addAdditionalHeaders({ AUID: sessionData.userId, NDCAUTH: `sid=${sessionId}`, NDCDEVICEID: deviceId });
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

    public joinCommunity = async (ndcId: Safe<number>, invitationId?: MayUndefined<string>): Promise<BasicResponse> => {
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
            path: `/x${ndcId}/s/community/leave`,
            contentType: 'application/x-www-form-urlencoded'
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

    public getChatThreads = async (start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadsResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadsResponse>({
            path: `/g/s/chat/thread?type=joined-me&start=${start}&size=${size}`
        });
    };

    public getChatThread = async (threadId: Safe<string>): Promise<ImplementaryResponses.GetChatThreadResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadResponse>({
            path: `/g/s/chat/thread/${threadId}`
        });
    };

    public getChatThreadUsers = async (threadId: Safe<string>, start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadUsersResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadUsersResponse>({
            path: `/g/s/chat/thread/${threadId}/member?start=${start}&size=${size}&type=default&cv=1.2`
        });
    }

    public joinChatThread = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/member/${this.accountInfo.uid}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public leaveChatThread = async (threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/member/${this.accountInfo.uid}`
        });
    };

    public createChatThread = async (startMessage: Safe<string>, chatThreadSettings: ChatThreadSettings): Promise<ImplementaryResponses.GetChatThreadResponse> => {        
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetChatThreadResponse>({
            path: `/g/s/chat/thread`,
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
            path: `/g/s/chat/thread/${threadId}/member/invite`,
            body: JSON.stringify({
                uids: userIds,
                timestamp: Date.now()
            })
        });
    };

    public kickFromChatThread = async (threadId: Safe<string>, userId: Safe<string>, allowRejoin: Safe<AllowRejoin> = AllowRejoin.Yes): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/member/${userId}?allowRejoin=${allowRejoin}`
        });
    };

    public getChatThreadMessages = async (threadId: Safe<string>, size: Safe<number> = 25): Promise<ImplementaryResponses.GetChatThreadMessagesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadMessagesResponse>({
            path: `/g/s/chat/thread/${threadId}/message?v=2&pagingType=t&size=${size}`
        });
    };

    public getChatThreadMessagesPage = async (threadId: Safe<string>, size: Safe<number>, pageToken: Safe<string>): Promise<ImplementaryResponses.GetChatThreadMessagesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetChatThreadMessagesResponse>({
            path: `/g/s/chat/thread/${threadId}/message?v=2&pagingType=t&pageToken=${pageToken}&size=${size}`
        });
    };

    public getUserFollowing = async (followingArguments: FollowingArguments): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/g/s/user-profile/${followingArguments.userId}/joined?start=${followingArguments.start}&size=${followingArguments.size}`
        });
    };

    public getUserFollowers = async (followingArguments: FollowingArguments): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/g/s/user-profile/${followingArguments.userId}/member?start=${followingArguments.start}&size=${followingArguments.size}`
        });   
    };

    public getBlogInfo = async (blogId: Safe<string>): Promise<ImplementaryResponses.GetCreateBlogResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetCreateBlogResponse>({
            path: `/g/s/blog/${blogId}`
        });
    };

    public getWikiInfo = async (itemId: Safe<string>): Promise<ImplementaryResponses.GetCreateWikiResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetCreateWikiResponse>({
            path: `/g/s/item/${itemId}`
        });
    };

    public getWallComments = async (userId: Safe<string>, sorting: Safe<CommentsSorting> = 'newest', start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetCommentsResponse> => {
        return this.__httpWorkflow.sendGet<ImplementaryResponses.GetCommentsResponse>({
            path: `/g/s/user-profile/${userId}/comment?sort=${sorting}&start=${start}&size=${size}`
        });
    };

    public sendMessage = async (threadId: Safe<string>, content: Safe<string>, messageType: Safe<MessageTypes> = 0, messageSettings?: MessageSettings): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/g/s/chat/thread/${threadId}/message`,
            body: JSON.stringify({
                type: messageType,
                content: content,
                attachedObject: null,
                clientRefId: STATIC_CLIENT_REFERENCE_ID,
                timestamp: Date.now(),
                uid: this.accountInfo.uid,
                extensions: {mentionedArray: messageSettings?.mentionedArray},
                replyMessageId: messageSettings?.repliedMessageId
            })
        });
    };

    public sendEmbededMessage = async (threadId: Safe<string>, content: Safe<string>, embed: Embed, messageSettings?: MessageSettings): Promise<ImplementaryResponses.SendMessageResponse> => {        
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/g/s/chat/thread/${threadId}/message`,
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
                uid: this.accountInfo.uid,
                extensions: {mentionedArray: messageSettings?.mentionedArray},
                replyMessageId: messageSettings?.repliedMessageId
            })
        });
    };

    public sendSticker = async (threadId: Safe<string>, stickerId: Safe<string>): Promise<ImplementaryResponses.SendMessageResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.SendMessageResponse>({
            path: `/g/s/chat/thread/${threadId}/message`,
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
            path: `/g/s/chat/thread/${mediaArguments.threadId}/message`,
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
            path: `/g/s/chat/thread/${mediaArguments.threadId}/message`,
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
            path: `/g/s/chat/thread/${threadId}/message/${messageId}`
        });
    };

    public deleteMessageAsAdmin = async (threadId: Safe<string>, messageId: Safe<string>, reason: Safe<string> = SIGNATURE_STUB): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/message/${messageId}/admin`,
            body: JSON.stringify({
                adminOpName: 102,
                adminOpNote: {content: reason},
                timestamp: Date.now()
            })
        });
    };

    public editChatThread = async (threadId: Safe<string>, builder: EditChatThreadBuilder): Promise<ImplementaryResponses.GetChatThreadResponse> => {
        return await this.__httpWorkflow.sendPost<ImplementaryResponses.GetChatThreadResponse>({
            path: `/g/s/chat/thread/${threadId}`,
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
            path: `/g/s/chat/thread/${threadId}/member/${this.accountInfo.uid}/background`,
            body: JSON.stringify({
                media: [100, background, null],
                timestamp: Date.now()
            })
        });
    };

    public addCoHosts = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/co-host`,
            body: JSON.stringify({
                uidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public setViewOnly = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/g/s/chat/thread/${editingArguments.threadId}/view-only/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public setCanInvite = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/g/s/chat/thread/${editingArguments.threadId}/members-can-invite/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public setCanTip = async (editingArguments: Safe<EditChatArguments>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/g/s/chat/thread/${editingArguments.threadId}/tipping-perm-status/${editingArguments.status}`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public tipCoinsBlog = async (coins: Safe<number>, blogId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/blog/${blogId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        });
    };

    public tipCoinsChatThread = async (coins: Safe<number>, threadId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        });
    };

    public follow = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPostWithoutBody({
            path: `/g/s/user-profile/${userId}/member`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };

    public followMultiple = async (userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/user-profile/${this.accountInfo.uid}/joined`,
            body: JSON.stringify({
                targetUidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public unfollow = async (userId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `/g/s/user-profile/${this.accountInfo.uid}/joined/${userId}`
        });
    };

    public editProfile = async (builder: EditProfileBuilder): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/user-profile/${this.accountInfo.uid}`,
            body: JSON.stringify({
                timestamp: Date.now(),
                nickname: builder.nickname,
                icon: builder.icon,
                content: builder.content,
                extensions: {
                    style: {
                        backgroundMediaList: builder.extensions?.style?.backgroundMediaList ? [[100, builder.extensions?.style?.backgroundMediaList, null, null, null]] : null,
                        backgroundColor: builder.extensions?.style?.backgroundColor
                    },
                    defaultBubbleId: builder.extensions?.defaultBubbleId
                }
            })
        });
    };

    public sendWallComment = async (content: Safe<string>, userId: Safe<string>, repliedCommentId: MayNull<string> = null): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/user-profile/${userId}/comment`,
            body: JSON.stringify({
                content: content,
                type: 0,
                eventSource: 'UserProfileView',
                respondTo: repliedCommentId,
                timestamp: Date.now()
            })
        });
    };

    public sendPostComment = async (content: Safe<string>, objectId: Safe<string>, postType: Safe<PostTypes>, repliedCommentId: MayNull<string> = null): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/${postType}/${objectId}/comment`,
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
            path: `/g/s/feed/vote`,
            body: JSON.stringify({
                value: 4,
                targetIdList: blogIds,
                timestamp: Date.now()
            })
        });
    };

    public getAllUsers = async (usersType: Safe<MembersType> = 'recent', start: Safe<number> = 0, size: Safe<number> = 25): Promise<ImplementaryResponses.GetUserProfilesResponse> => {
        return await this.__httpWorkflow.sendGet<ImplementaryResponses.GetUserProfilesResponse>({
            path: `/g/s/user-profile?type=${usersType}&start=${start}&size=${size}`
        });
    };

    public transferHostRequest = async (threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/transfer-organizer`,
            body: JSON.stringify({
                uidList: userIds,
                timestamp: Date.now()
            })
        });
    };

    public transferHostAccept(threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse> {
        return this.__httpWorkflow.sendPostWithoutBody<BasicResponse>({
            path: `/g/s/chat/thread/${threadId}/transfer-organizer/${requestId}/accept`,
            contentType: 'application/x-www-form-urlencoded'
        });
    };
};