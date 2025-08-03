import { BASE_HEADERS, BASE_URL, SUCCESS_STATUS_CODES } from '../constants';
import { Defined, MayUndefined, PostRequestCfg, Safe, StructuredHeaders, RawRequestCfg } from '../types';
import { BasicResponse } from '../types/responses';
import { generateECDSA, generateHMAC, generateHMACFromBuffer } from '../utils/helpers';

export class HttpWorkflow {
    private __localHeaders: Defined<StructuredHeaders> = BASE_HEADERS;

    constructor(additionalHeaders?: MayUndefined<StructuredHeaders>) {
        if (additionalHeaders) this.__localHeaders = { ...this.__localHeaders, ...additionalHeaders };
    }

    public addAdditionalHeaders = (additionalHeaders: Safe<StructuredHeaders>) => this.__localHeaders = { ...this.__localHeaders, ...additionalHeaders };

    private __configureHeaders = async (body: Safe<string | Buffer>, contentType: MayUndefined<string>): Promise<Defined<StructuredHeaders>> => {
        const configuredHeaders = structuredClone(this.__localHeaders);

        configuredHeaders['Content-Length'] = body.length.toString();
        configuredHeaders['NDC-MSG-SIG'] = typeof body === 'string' ? generateHMAC(body) : generateHMACFromBuffer(body);
        if (this.__localHeaders['AUID'] && typeof body === 'string') configuredHeaders['NDC-MESSAGE-SIGNATURE'] = await generateECDSA(body, configuredHeaders['AUID']);
        if (contentType) configuredHeaders['Content-Type'] = contentType;

        return configuredHeaders;
    };

    public sendRaw = async <T extends BasicResponse>(config: RawRequestCfg) => {
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'GET',
            body: config.body,
            headers: {
                ...this.__localHeaders,
                ...config.additionalHeaders
            }
        });

        try {
            return (await response.json()) as T;
        } catch {
            throw new Error(await response.text());
        }
    };

    public sendGet = async <T extends BasicResponse>(config: Pick<PostRequestCfg, 'path'>) =>{
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'GET',
            headers: this.__localHeaders
        });

        if (!SUCCESS_STATUS_CODES.includes(response.status)) throw new Error(await response.text());

        return (await response.json()) as T;
    };

    public sendDelete = async <T extends BasicResponse>(config: Pick<PostRequestCfg, 'path'>) => {
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'DELETE',
            headers: this.__localHeaders
        });

        if (!SUCCESS_STATUS_CODES.includes(response.status)) throw new Error(await response.text());

        return (await response.json()) as T;
    }

    public sendPost = async <T extends BasicResponse>(config: PostRequestCfg) => {
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'POST',
            headers: await this.__configureHeaders(config.body, config.contentType),
            body: config.body
        });

        if (!SUCCESS_STATUS_CODES.includes(response.status)) throw new Error(await response.text());

        return (await response.json()) as T;
    };

    public sendPostWithoutBody = async <T extends BasicResponse>(config: Omit<PostRequestCfg, 'body'>) => {
        const configuredHeaders = structuredClone(this.__localHeaders);

        if (config.contentType) configuredHeaders['Content-Type'] = config.contentType;
        configuredHeaders['Content-Length'] = '0';

        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'POST',
            headers: configuredHeaders
        });

        if (!SUCCESS_STATUS_CODES.includes(response.status)) throw new Error(await response.text());
        
        return (await response.json()) as T;
    };
};