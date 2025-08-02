import { randomBytes, createHash, createHmac } from 'crypto';

import { CRYPTO_KEYS, GENERATORS_URL } from '../constants';
import { MayNull, Safe, SessionData } from '../types';
import { v4 } from 'uuid';

export const generateTransactionId = () => {
    return v4({ random: Uint8Array.from(Buffer.from(randomBytes(16).toString('hex'), 'hex')) })
}

export const decodeSession = (session: Safe<string>): MayNull<SessionData> => {
    let base64Str = session.replace(/[-+]/g, (m) => m === '-' ? '+' : '-');
    base64Str = base64Str.replace(/[_/]/g, (m) => m === '_' ? '/' : '_');
    base64Str = base64Str.padEnd(base64Str.length + (-base64Str.length % 4), '=');

    const decoded = Buffer.from(base64Str, 'base64');

    const jsonString = decoded.subarray(1, decoded.length - 20).toString('utf-8');

    try {
        const parsedString = JSON.parse(jsonString);

        return {
            status: parsedString['0'],
            userId: parsedString['2'],
            ipAddress: parsedString['4'],
            timestamp: parsedString['5'],
            hash: parsedString['7']
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
    };
};

export const generateDeviceId = () => {
    const sha1Hash = Uint8Array.from(
        createHash(
            'sha1'
        ).update(randomBytes(CRYPTO_KEYS.DEVICE_LENGTH).toString('hex'), 'utf-8').digest()
    );

    const data = Buffer.concat([CRYPTO_KEYS.PREFIX, sha1Hash]);

    const hmacHash = createHmac('sha1', CRYPTO_KEYS.DEVICE_ID_KEY)
                            .update(Uint8Array.from(data))
                            .digest('hex');

    return (data.toString('hex') + hmacHash).toUpperCase();
};

export const generateHMAC = (body: Safe<string>) => {
    const hmac = createHmac('sha1', CRYPTO_KEYS.SIGNATURE_KEY);
    hmac.update(Uint8Array.from(Buffer.from(body, 'utf-8')));
    const digest = hmac.digest();
    const signatureArray: number[] = [CRYPTO_KEYS.PREFIX[0], ...Array.from(digest)];
    const signatureBuffer: Buffer = Buffer.from(signatureArray);

    return signatureBuffer.toString('base64');
};

export const generateHMACFromBuffer = (buffer: Safe<Buffer>) => {
    const hmac = createHmac('sha1', CRYPTO_KEYS.SIGNATURE_KEY);
    hmac.update(Uint8Array.from(buffer));
    const digest = hmac.digest();
    const signatureArray: number[] = [CRYPTO_KEYS.PREFIX[0], ...Array.from(digest)];
    const signatureBuffer: Buffer = Buffer.from(signatureArray);

    return signatureBuffer.toString('base64');
};

export const generateECDSA = async (body: Safe<string>, userId: Safe<string>) => {
    if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

    const response = await fetch(`${GENERATORS_URL}/api/v1/signature/ecdsa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_KEY
        },
        body: JSON.stringify({ payload: body, userId: userId })
    });

    return (await response.json()).ECDSA;
};

export const getPublicKeyCredentials = async (userId: Safe<string>) => {
    if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

    const response = await fetch(`${GENERATORS_URL}/api/v1/signature/credentials/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_KEY
        },
    });

    return (await response.json()).credentials;
};
