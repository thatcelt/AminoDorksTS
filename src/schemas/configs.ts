import { z } from 'zod';

import { EnviromentContextSchema } from '../public';
import { HttpWorkflow } from '../core/httpworkflow';
import { AccountSchema } from './aminodorks';

export const AminoDorksConfigSchema = z.object({
    apiKey: z.string().min(32).max(32),
    context: EnviromentContextSchema,
    ndcId: z.number().optional(),
    enableLogging: z.boolean().optional(),
    deviceId: z.string().min(82).max(82).optional(),
    proxies: z.array(z.string()).optional(),
    undici: z.object({
        connections: z.number().int().positive().default(20),
        keepAliveTimeout: z.number().int().nonnegative().default(60_000),
        keepAliveMaxTimeout: z.number().int().nonnegative().default(60_000),
    }).optional(),
    httpWorkflow: z.instanceof(HttpWorkflow).optional(),
    account: AccountSchema.optional(),
    quicklru: z.object({
        maxAge: z.number().int().positive().optional(),
        maxSize: z.number().int().positive().optional()
    }).optional()
});

export type AminoDorksConfig = z.infer<typeof AminoDorksConfigSchema>;
