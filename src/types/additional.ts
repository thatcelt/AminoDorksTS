export interface LinkInfo {
    objectId?: string;
    targetCode: number;
    ndcId: number;
    fullPath: string;
    shortCode: string;
    objectIdType: number;
};

export interface UserProfile {
    status: number;
    itemsCount: number;
    consecutiveCheckInDays: number | null;
    uid: string;
    modifiedTime: string;
    followingStatus: number;
    onlineStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    reputation: number;
    postsCount: number;
    membersCount: number;
    nickname: string;
    icon: string | null;
    isNicknameVerified: boolean;
    mood: string | null;
    level: number;
    notificationSubscriptionStatus: number;
    pushEnabled: boolean;
    membershipStatus: number;
    joinedCount: number;
    role: number;
    commentsCount: number;
    aminoId: string;
    ndcId: number;
    createdTime: string;
    storiesCount: number;
    blogsCount: number;
};

export interface Account {
    username: string | null;
    status: number;
    uid: string;
    modifiedTime: string;
    twitterID: string | null;
    activation: number;
    phoneNumberActivation: number;
    emailActivation: number;
    appleID: string | null;
    facebookID: string | null;
    nickname: string;
    googleID: string | null;
    icon: string | null;
    securityLevel: number;
    phoneNumber: string | null;
    advancedSettings: { analyticsEnabled: number };
    role: number;
    aminoIdEditable: boolean;
    aminoId: string;
    createdTime: string;
    extensions: {
        contentLanguage: string;
        adsFlags: number;
        adsLevel: number;
        adsEnabled: boolean;
        mediaLabAdsMigrationAugust2020: boolean;
    };
    email: string;
};

export interface Agent {
    status?: number;
    isNicknameVerified: boolean;
    uid: string;
    level: number;
    followingStatus: number;
    accountMembershipStatus: number;
    isGlobal: boolean;
    membershipStatus: number;
    reputation: number;
    ndcId?: number;
    membersCount: number;
    nickname?: string;
    icon?: string;
};

export interface Topic {
    topicId: number;
    style: object;
    name: string;
};

export interface ThemePack {
    themeColor: string;
    themePackHash: string;
    themePackRevision: number;
    themePackUrl: string;
};

export interface Community {
  userAddedTopicList: null | Topic[];
  agent?: Agent;
  listedStatus: number;
  probationStatus: number;
  membersCount: number;
  primaryLanguage: string;
  communityHeat: number;
  strategyInfo: string;
  tagline: string;
  joinType: number;
  status: number;
  themePack: ThemePack;
  modifiedTime: string;
  ndcId: number;
  link: string;
  icon: string;
  updatedTime: string;
  endpoint: string;
  name: string;
  templateId: number;
  createdTime: string;
};

export interface UserInfoInCommunity {
    userProfile: UserProfile;
};

export interface Wallet {
    totalCoinsFloat: number;
    adsEnabled: boolean;
    adsFlags: number;
    totalCoins: number;
    businessCoinsEnabled: boolean;
    totalBusinessCoins: number;
    totalBusinessCoinsFloat: number;
};

export interface TransactionData {
  bonusCoins?: number;
  bonusCoinsFloat?: number;
  changedCoins: number;
  changedCoinsFloat: number;
  createdTime: string;
  extData: {
    description: string;
    icon: string;
    objectDeeplinkUrl?: string;
    otherHumanUid?: string;
    subtitle?: string;
  };
  isPositive: boolean;
  originCoins: number;
  originCoinsFloat: number;
  sourceType: number;
  taxCoins: number | null;
  taxCoinsFloat: number | null;
  totalCoins: number;
  totalCoinsFloat: number;
  uid: string;
};

export interface InviteCode {
    status: number;
    duration: number;
    invitationId: string;
    link: string;
    modifiedTime: string;
    ndcId: number;
    createdTime: string;
    inviteCode: string;
    author: UserProfile;
};

export interface Blog {
    globalVotesCount: number;
  globalVotedValue: number;
  votedValue: number;
  keywords: string;
  mediaList: null | [number, string, null][];
  style: number;
  totalQuizPlayCount: number;
  title: string;
  tipInfo: {
    tipMaxCoin: number;
    tippersCount: number;
    tippable: boolean;
    tipMinCoin: number;
    tippedCoins: number;
  };
  contentRating: number;
  content: string;
  needHidden: boolean;
  guestVotesCount: number;
  type: number;
  status: number;
  globalCommentsCount: number;
  modifiedTime: string;
  totalPollVoteCount: number;
  blogId: string;
  viewCount: number;
  language: null | string;
  author: UserProfile;
  votesCount: number;
  ndcId: number;
  createdTime: string;
  endTime: null | string;
  commentsCount: number;
};

export interface Item {
  itemId: string;
  status: number;
  style: number;
  globalCommentsCount: number;
  modifiedTime: string;
  votedValue: number;
  globalVotesCount: number;
  globalVotedValue: number;
  author: UserProfile;
  contentRating: number;
  label: string;
  content: string;
  keywords: string;
  needHidden: boolean;
  guestVotesCount: number;
  votesCount: number;
  createdTime: string;
  mediaList: [number, string, null][]; // or mediaList: Array<Array<any>>;
  commentsCount: number;
};

export interface LotteryLog {
    awardValue: number;
    parentType: null;
    objectId: null;
    parentId: null;
    createdTime: string; 
    awardType: number;
    refObject: null;
    objectType: null;
};

export interface ChatThread {
  uid: string;
  membersQuota: number;
  membersSummary: {uid: string, role: number, nickname: string, icon: string}[];
  threadId: string;
  keywords: null | string;
  membersCount: number;
  strategyInfo: string;
  title: string;
  membershipStatus: number;
  content: null | string;
  needHidden: boolean;
  alertOption: number;
  lastReadTime: null | string;
  type: number;
  status: number;
  publishToGlobal: number;
  modifiedTime: null | string;
  lastMessageSummary: {
    includedSummary: boolean;
    uid: string;
    isHidden: boolean;
    mediaType: number;
    content?: string;
    threadId: string;
    createdTime: string;
    type: number;
  };
  condition: number;
  icon: string;
  latestActivityTime: string;
  author: UserProfile;
  extensions: {
    fansOnly: boolean;
    lastMembersSummaryUpdateTime: number;
    vvChatJoinType: number;
    visibility: number;
    language: string;
  };
  ndcId: number;
  createdTime: null | string;
};

export interface Message {
  includedInSummary: boolean;
  uid: string;
  author: UserProfile;
  isHiddden: boolean;
  messageId: string;
  mediaType: number;
  content?: string;
  clientRefId: number;
  threadId: string;
  createdTime: string;
  type: number;
  mediaValue: string;
};

export interface Comment {
  modifiedTime: string;
  ndcId: number;
  votedValue: number;
  parentType: number;
  commentId: string;
  parentNdcId: number;
  votesSum: number;
  author: UserProfile;
  content: string;
  parentId: string;
  createdTime: string;
  subcommentsCount: number;
  type: number;
};
