import { Message } from 'frida';
import { Account, Blog, ChatThread, Community, InviteCode, Item, LotteryLog, TransactionData, UserInfoInCommunity, UserProfile, Wallet } from './additional';

export interface BasicResponse {
    ['api:statuscode']: number;
    ['api:duration']: string;
    ['api:message']: string;
    ['api:timestamp']: string;
};

export namespace ImplementaryResponses {
    export interface GetUserInfoResponse extends BasicResponse {
        userProfile: UserProfile;
    }

    export interface GetChatThreadsResponse extends BasicResponse {
        threadList: ChatThread[];
    };

    export interface GetChatThreadRespones extends BasicResponse {
        thread: ChatThread;
    }

    export interface GetChatThreadUsersResponse extends BasicResponse {
        memberList: UserProfile[];
    }

    export interface GetChatThreadMessagesResponse extends BasicResponse {
        messageList: Message[];
        paging: {
            nextPageToken: string;
            prevPageToken: string;
        };
    };
};

export namespace GlobalResponses {
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
                linkInfo: LinkInfo;
            };
        };
    };

    export interface UploadMediaResponse extends BasicResponse {
        mediaValue: string;
    };

    export interface GetCommunitiesResponse extends BasicResponse {
        communityList: Community[];
        userInfoInCommunities: Record<number, UserInfoInCommunity>;
    };

    export interface SearchCommunityResponse extends BasicResponse {
        resultList: {
            objectType: number;
            refObject: Community;
            aminoId: string;
            objectId: string;
            ndcId: number;
        }[];
    };

    export interface GetWalletInfoResponse extends BasicResponse {
        wallet: Wallet;
    };

    export interface GetWalletHistoryResponse extends BasicResponse {
        coinHistoryList: TransactionData[];
    };
};

export namespace NDCResponses {
    export interface GetInviteCodesResponse extends BasicResponse {
        communityInvitationList: InviteCode[];
    };

    export interface CreateInviteCodeResponse extends BasicResponse {
        communityInvitation: InviteCode;
    };

    export interface GetUserProfilesResponse extends BasicResponse {
        userProfileList: UserProfile[]
    };

    export interface CreateBlogResponse extends BasicResponse {
        blog: Blog;
    };

    export interface CreateWikiResponse extends BasicResponse {
        item: Item;
    };

    export interface PlayLotteryResponse extends BasicResponse {
        lotteryLog: LotteryLog;
        wallet: Wallet;
    };

    export interface GetBlogsResponse extends BasicResponse {
        blogList: Blog[];
    };

    export interface GetWikiResponse extends BasicResponse {
        itemList: Item[];
    };

    export interface GetOnlineUsersResponse extends GetUserProfilesResponse {
        userProfileCount: number;
    }
};
