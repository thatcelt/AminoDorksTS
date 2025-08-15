import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { Safe } from '../private';
import { PostType } from '../public';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';

export class AdminManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __httpWorkflow: HttpWorkflow;

    constructor(ndcId: Safe<number>, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/x${ndcId}/s`;
        this.__httpWorkflow = httpWorkflow;
    };

    public banUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/ban`,
            body: JSON.stringify({
                reasonType: null,
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unbanUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/unban`,
            body: JSON.stringify({
                note: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hideUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 18,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhideUser = async (userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/user-profile/${userId}/admin`,
            body: JSON.stringify({
                adminOpName: 19,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hideThread = async (threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhideThread = async (threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public hidePost = async (objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 9,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public unhidePost = async (objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/${postType}/${objectId}/admin`,
            body: JSON.stringify({
                adminOpName: 110,
                adminOpValue: 0,
                adminOpNote: {
                    content: reason
                },
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};