import { MayUndefined, Safe } from "../types";

export enum MessageTypes {
    Default = 0
};

export enum OnlineStatus {
    Online = 1,
    Offline = 2
};

export enum AllowRejoin {
    Yes = 1,
    No = 2
};

export interface ChatThreadSettings {
    title?: string;
    content?: string;
    invitedUserIds: string[];
};

export interface MessageSettings {
    mentionedArray?: MayUndefined<string[]>;
    embed?: MayUndefined<string>;
    repliedMessageId?: MayUndefined<string>;
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
    fansOnly?: MayUndefined<boolean>;
    style?: {
        backgroundColor?: MayUndefined<string>;
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

