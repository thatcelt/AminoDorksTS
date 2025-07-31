export type MediaTypes = 'audio/aac' | 'image/jpg';
export type CommentsSorting = 'newest' | 'oldest' | 'vote';
export type PostTypes = 'blog' | 'item';
export type MembersType = 'recent' | 'banned' | 'featured' | 'leaders' | 'curators';
export type ChatThreadTypes = 'recommended' | 'hidden'

export enum MessageTypes {
    Default = 0
};

export enum OnlineStatus {
    Online = 1,
    Offline = 2
};

export enum Strikes {
    THREE_HOURS = 10800,
    SIX_HOURS = 21600,
    TWELVE_HOURS = 43200,
    ONE_DAY = 86400
};

export interface ChatThreadSettings {
    title: MayUndefined<string>;
    content: MayUndefined<string>;
    invitedUserIds: Safe<string[]>
};

export interface MessageSettings {
    mentionedArray: MayUndefined<string[]>;
    embed: MayUndefined<string>;
    repliedMessageId: MayUndefined<string>;
};

export interface FollowingArguments {
    userId: Safe<string>;
    start: Safe<number>;
    size: Safe<number>;
};

export interface MediaArguments {
    threadId: Safe<string>;
    file: Safe<Buffer>;
};

interface BlogExtensions {
    fansOnly: MayUndefined<boolean>;
    style: {
        backgroundColor: MayUndefined<string>;
    };
};

export interface BlogBuilder {
    mediaList: string[];
    extensions?: BlogExtensions;
};

export interface WikiBuilder extends BlogBuilder {
    icon?: string;
};

export interface Timer {
    start: Safe<number>;
    end: Safe<number>;
};

