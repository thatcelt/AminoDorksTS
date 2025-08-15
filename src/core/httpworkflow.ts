import { Dispatcher, Pool } from 'undici';
import { z } from 'zod';
import BodyReadable from 'undici/types/readable';

import { API_HEADERS, BASE_URL, EMPTY_BODY, GENERATORS_HEADERS, GENERATORS_URL } from '../constants';
import { HeadersType, Safe } from '../private';
import { generateHMAC } from '../utils/crypt';
import { BufferRequestConfig, DeleteRequestConfig, GenerateECDSAResponse, GenerateECDSAResponseSchema, GetElapsedRealtime, GetElapsedRealtimeSchema, GetPublicKeyCredentialsResponse, GetPublicKeyCredentialsResponseSchema, GetRequestConfig, PostRequestConfig, RawRequestConfig, UrlEncodedRequestConfig } from '../schemas/httpworkflow';
import { BasicResponse } from '../schemas/responses/basic';
import { LOGGER } from '../utils/logger';

export class HttpWorkflow {
    private __headers: HeadersType = API_HEADERS;
    private __generatorsHeaders: HeadersType = GENERATORS_HEADERS;

    private readonly __httpPool: Pool;
    private readonly __generatorsPool: Pool;

    constructor(apiKey: string, deviceId: string, options: Pool.Options = {}) {
        this.__generatorsHeaders['Authorization'] = apiKey;
        this.headers = { NDCDEVICEID: deviceId };

        this.__httpPool = new Pool(BASE_URL, options);
        this.__generatorsPool = new Pool(GENERATORS_URL, options);
    };

    set headers(headers: HeadersType) {
        this.__headers = {
            ...this.__headers,
            ...headers
        };
    };

    private __generateECDSA = async (payloadBody: Safe<string>): Promise<GenerateECDSAResponse> => {
        const { body } = await this.__generatorsPool.request({
            path: '/api/v1/signature/ecdsa',
            method: 'POST',
            headers: this.__generatorsHeaders,
            body: JSON.stringify({
                payload: payloadBody,
                userId: this.__headers['AUID']
            })
        });

        return GenerateECDSAResponseSchema.parse(await body.json());
    };

    private __configureHeaders = (body: Buffer, contentType?: string): HeadersType => {
        const mergedHeaders: HeadersType = JSON.parse(JSON.stringify(this.__headers));

        mergedHeaders['Content-Length'] = `${body.length}`;
        mergedHeaders['NDC-MSG-SIG'] = generateHMAC(body);

        if (contentType) mergedHeaders['Content-Type'] = contentType;

        return mergedHeaders;
    };

    private __configurePostHeaders = async (body: Buffer, contentType?: string): Promise<HeadersType> => {
        const configuredHeaders = this.__configureHeaders(body, contentType);

        configuredHeaders['NDC-MESSAGE-SIGNATURE'] = (await this.__generateECDSA(body.toString('utf-8'))).ECDSA;

        return configuredHeaders;
    };

    private __handleResponse = async <T>(fullPath: string, body: BodyReadable & Dispatcher.BodyMixin, schema: z.ZodSchema): Promise<T> => {
        const responseSchema = schema.parse(await body.json()) as BasicResponse;
        LOGGER.child({ path: fullPath }).info(responseSchema['api:statuscode']);

        return responseSchema as T;
    };

    public getHeader = (header: string): string => {
        return this.__headers[header];
    };

    public getPublicKeyCredentials = async (userId: Safe<string>): Promise<GetPublicKeyCredentialsResponse> => {
        const { body } = await this.__generatorsPool.request({
            path: `/api/v1/signature/credentials/${userId}`,
            method: 'GET',
            headers: this.__generatorsHeaders
        });

        return GetPublicKeyCredentialsResponseSchema.parse(await body.json());
    };

    public getElapsedRealtime = async (): Promise<GetElapsedRealtime> => {
        const { body } = await this.__generatorsPool.request({
            path: `/api/v1/signature/getElapsed`,
            method: 'GET',
            headers: this.__generatorsHeaders
        });

        return GetElapsedRealtimeSchema.parse(await body.json());
    };

    public sendRaw = async <T>(config: RawRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { body } = await this.__httpPool.request({
            path: `/api/v1${config?.path}`,
            method: config?.method || 'GET',
            headers: {
                ...this.__headers,
                ...config?.headers
            }
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config?.path}`, body, schema);
    };

    public sendGet = async <T>(config: GetRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const mergedHeaders: HeadersType = JSON.parse(JSON.stringify(this.__headers));

        if (config.contentType) mergedHeaders['Content-Type'] = config.contentType
        
        const { body } = await this.__httpPool.request({
            path: `/api/v1${config.path}`,
            method: 'GET',
            headers: mergedHeaders
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendDelete = async <T>(config: DeleteRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { body } = await this.__httpPool.request({
            path: `/api/v1${config.path}`,
            method: 'DELETE',
            headers: this.__headers
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { body } = await this.__httpPool.request({
            path: `/api/v1${config.path}`,
            method: 'POST',
            headers: await this.__configurePostHeaders(Buffer.from(config.body), config.contentType),
            body: config.body
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendEarlyPost = async <T>(config: PostRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const bufferedBody = Buffer.from(config.body);

        const { body } = await this.__httpPool.request({
            path: `/api/v1${config.path}`,
            method: 'POST',
            headers: this.__configureHeaders(bufferedBody, config.contentType),
            body: bufferedBody
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
    };

    public sendUrlEncoded = async <T>(config: UrlEncodedRequestConfig, schema: z.ZodSchema): Promise<T> => {
        return this.sendEarlyPost<T>({
            path: config.path,
            body: EMPTY_BODY,
            contentType: config.contentType
        }, schema);
    };

    public sendBuffer = async <T>(config: BufferRequestConfig, schema: z.ZodSchema): Promise<T> => {
        const { body } = await this.__httpPool.request({
            path: `/api/v1${config.path}`,
            method: 'POST',
            headers: this.__configureHeaders(config.body, config.contentType),
            body: config.body
        });

        return await this.__handleResponse<T>(`${BASE_URL}/api/v1${config.path}`, body, schema);
    };
};