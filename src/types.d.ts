export type Safe<T> = NonNullable<Required<Readonly<T>>>;
export type Defined<T> = NonNullable<Required<T>>;
export type MayNull<T> = Readonly<T | null>;
export type MayUndefined<T> = Readonly<T | undefined>;
export type StructuredHeaders = Record<string, string>;

export interface PostRequestCfg {
    path: Safe<string>;
    body: Safe<string | Buffer>;
    contentType?: MayUndefined<string>;
};

export interface SessionData {
    status: Safe<number>;
    userId: Safe<string>;
    ipAddress: Safe<string>;
    timestamp: Safe<number>;
    hash: Safe<string>;
};

export interface CryptoKeys {
    PREFIX: Safe<Uint8Array>;
    SIGNATURE_KEY: Safe<Uint8Array>;
    DEVICE_ID_KEY: Safe<Uint8Array>;
    DEVICE_LENGTH: Safe<number>;
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
}

export interface BlogBuilder {
    mediaList: string[];
    extensions?: BlogExtensions;
};

export interface WikiBuilder extends BlogBuilder {
    icon?: string;
}

