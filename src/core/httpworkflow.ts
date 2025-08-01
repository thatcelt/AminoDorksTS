import { BASE_HEADERS, BASE_URL } from '../constants';
import { Defined, MayUndefined, PostRequestCfg, Safe, StructuredHeaders } from '../types';
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

    public sendGet = async <T extends BasicResponse>(config: Pick<PostRequestCfg, 'path'>) =>{
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'GET',
            headers: this.__localHeaders
        });

        return (await response.json()) as T;
    };

    public sendDelete = async <T extends BasicResponse>(config: Pick<PostRequestCfg, 'path'>) => {
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'DELETE',
            headers: this.__localHeaders
        });

        return (await response.json()) as T;
    }

    public sendPost = async <T extends BasicResponse>(config: PostRequestCfg) => {
        const response = await fetch(`${BASE_URL}${config.path}`, {
            method: 'POST',
            headers: await this.__configureHeaders(config.body, config.contentType),
            body: config.body
        });

        return (await response.json()) as T;
    };
};