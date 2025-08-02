import { MayUndefined, Safe } from '../types';
import { ChatThreadStatus } from './types';

export enum MessageTypes {
  General = 0,
  Strike = 1,
  ShareExurl = 50,
  ShareUser = 51
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
    mentionedArray?: string[];
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

export interface Embed {
    objectId?: string;
    objectType?: number;
    link?: string;
    title: string;
    content: string;
    mediaList?: string;
};

export interface EditChatThreadBuilder {
    title?: string;
    content?: string;
    icon?: string;
    keywords?: string;
    extensions?: {
        announcement?: string;
        pinAnnouncement?: boolean;
    };
};

export interface EditChatArguments {
    threadId: Safe<string>;
    status: Safe<ChatThreadStatus>;
};

export interface EditProfileBuilder {
    nickname?: string;
    icon?: string;
    content?: string;
    extensions?: {
        style?: {
            backgroundMediaList?: string;
            backgroundColor?: string;
        },
        defaultBubbleId?: string;
    };
}
