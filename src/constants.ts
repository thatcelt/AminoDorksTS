import { CryptoKeys, Defined, Safe, StructuredHeaders } from './types';

export const BASE_URL: Safe<string> = 'https://service.aminoapps.com/api/v1';
export const GENERATORS_URL: Safe<string> = 'https://qfhmflnp-3000.euw.devtunnels.ms';

export const BASE_HEADERS: Defined<StructuredHeaders> = {
    'Accept-Encoding': 'gzip',
    'Accept-Language': 'en-US',
    'Host': 'service.aminoapps.com',
    'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; M2006C3MNG Build/QP1A.190711.020;com.narvii.amino.master/4.3.3121)',
    'NDCLANG': 'en',
    'CONNECTION': 'Keep-Alive',
    'Content-Type': 'application/json; charset=utf8'
};

export const CRYPTO_KEYS: Safe<CryptoKeys> = {
    PREFIX: Uint8Array.from(Buffer.from('52', 'hex')),
    SIGNATURE_KEY: Uint8Array.from(Buffer.from('EAB4F1B9E3340CD1631EDE3B587CC3EBEDF1AFA9', 'hex')),
    DEVICE_ID_KEY: Uint8Array.from(Buffer.from('AE49550458D8E7C51D566916B04888BFB8B3CA7D', 'hex')),
    DEVICE_LENGTH: 20
};

export const INVITE_CODE_DEFAULT_DURATION = 259200;
export const GLOBAL_TIMEZONE = Math.floor(10800 / 1000);
export const SIGNATURE_STUB = 'viva la aminodorks ;3';
