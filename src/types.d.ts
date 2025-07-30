export type Safe<T> = NonNullable<Required<Readonly<T>>>;
export type Defined<T> = NonNullable<Required<T>>;
export type MayNull<T> = Readonly<T | null>;
export type MayUndefined<T> = Readonly<T | undefined>;
export type StructuredHeaders = Record<string, string>;

export interface PostRequestCfg {
    path: Safe<string>;
    body: Safe<string | Buffer>;
    contentType?: MayUndefined<string>;
}

export interface SessionData {
    status: Safe<number>;
    userId: Safe<string>;
    ipAddress: Safe<string>;
    timestamp: Safe<number>;
    hash: Safe<string>;
}

export interface CryptoKeys {
    PREFIX: Safe<Uint8Array>;
    SIGNATURE_KEY: Safe<Uint8Array>;
    DEVICE_ID_KEY: Safe<Uint8Array>;
    DEVICE_LENGTH: Safe<number>;
};
