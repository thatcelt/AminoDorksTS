import fs from 'fs';

import { CacheEntity, Safe } from '../types';

export class CacheManager {
    private __cache: Record<Safe<string>, Safe<CacheEntity>> = {};

    private readonly __cachePath: Safe<string>;

    constructor(fileName: Safe<string> = 'cache') {
        this.__cachePath = `${fileName}.json`;
    };

    public initCache = () => {
        if (!fs.existsSync(this.__cachePath)) {
            fs.writeFileSync(this.__cachePath, '{}')
            return;
        };

        this.__cache = JSON.parse(fs.readFileSync(this.__cachePath, 'utf-8'));
    };

    public addToCache = (key: Safe<string>, value: Safe<CacheEntity>) => {
        this.__cache[key] = value;

        fs.writeFileSync(this.__cachePath, JSON.stringify(this.__cache));
    };

    public getFromKey = (key: Safe<string>): Safe<CacheEntity | undefined> => {
        return this.__cache[key];
    };

    public getFromSessionId = (sessionId: Safe<string>): Safe<CacheEntity | undefined> => {
        return Object.values(this.__cache).find((value) => value.sessionId === sessionId);
    };

    public deleteFromCache = (key: Safe<string>) => {
        // i don't care
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete this.__cache[key];
        fs.writeFileSync(this.__cachePath, JSON.stringify(this.__cache));
    };
}