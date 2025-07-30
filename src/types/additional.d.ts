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
}

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
}
