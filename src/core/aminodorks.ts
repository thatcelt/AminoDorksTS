import { Safe } from "../types";
import { AuthenticateResponse } from "../types/responses";
import { generateDeviceId } from "../utils/helpers";
import { HttpWorkFlow } from "./httpworkflow";

export class AminoDorks {
    private readonly __deviceId: Safe<string> = generateDeviceId();

    private readonly __httpWorkflow: Safe<HttpWorkFlow>;

    constructor(apiKey: Safe<string>) {
        this.apiKey = apiKey;
        this.__httpWorkflow = new HttpWorkFlow({ NDCDEVICEID: this.__deviceId });

    };

    get apiKey(): Safe<string> {
        if (!process.env.API_KEY) { throw new Error('API_KEY is not defined'); }

        return process.env.API_KEY;
    };

    set apiKey(apiKey: Safe<string>) {
        process.env.API_KEY = apiKey;
    };

    public authenticate = async (email: Safe<string>, password: Safe<string>): Promise<AuthenticateResponse> => {
        const response = await this.__httpWorkflow.sendPost<AuthenticateResponse>({
            path: '/g/s/auth/login',
            body: JSON.stringify({
                email: email,
                v: 2,
                secret: `0 ${password}`,
                deviceID: this.__deviceId,
                clientType: 100,
                action: "normal",
                timestamp: Date.now()
            })
        })
        this.__httpWorkflow.addAdditionalHeaders({ AUID: response.auid, NDCAUTH: `sid=${response.sid}` });

        return response;
    }
}