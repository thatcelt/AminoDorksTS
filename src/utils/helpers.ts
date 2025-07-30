import { randomBytes, createHash, createHmac } from 'crypto';

import { CRYPTO_KEYS, GENERATORS_URL } from '../constants';
import { Safe } from '../types';

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

export const generateHMAC = async (body: Safe<string>) => {
    if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

    const response = await fetch(`${GENERATORS_URL}/api/v1/signature/hmac`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.API_KEY
        },
        body: JSON.stringify({ payload: body })
    });
    console.log(JSON.stringify({ payload: body }))

    return (await response.json()).hmac;
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

    return (await response.json()).ecdsa;
}

export const getPublicKeyCredentials = async (userId: Safe<string>) => {
    if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

    const response = await fetch(`${GENERATORS_URL}/api/v1/signature/credentials/${userId}`, {
        method: 'GET'
    });

    return (await response.json()).credentials;
}
