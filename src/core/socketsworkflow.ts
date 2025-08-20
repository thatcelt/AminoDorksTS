import WebSocket from 'ws';

import { Safe } from '../private';
import { SOCKET_TOPICS, WEBSOCKET_HEADERS, WEBSOCKET_RECONNECT_TIME, WEBSOCKET_URL } from '../constants';
import { generateHMAC } from '../utils/crypt';
import { BasicEvent, CommandArgsCallback, CommandCallback, ElapsedRealtimeObject, EventMap, EventName, MessageEvent, WebSocketCallback } from '../schemas/sockets/sockets';
import { LOGGER } from '../utils/logger';
import { AminoDorks } from './aminodorks';
import { ArgImpl } from '../schemas/sockets/args';

export class SocketWorkflow {
    private readonly __client: AminoDorks;
    private __websocket?: WebSocket;
    private __elapsedTimestamp?: ElapsedRealtimeObject;
    
    private __listeners: Map<Safe<EventName>, Set<WebSocketCallback>> = new Map<Safe<EventName>, Set<WebSocketCallback>>();
    private __ndcs: Map<Safe<number>, AminoDorks> = new Map<Safe<number>, AminoDorks>();
    private __connectedVoiceThreads: string[] = [];

    constructor(client: AminoDorks) {
        this.__client = client;
        this.__reconnect();
    };

    private __getElapsedRealtime = async (): Promise<{ elapsedRealtime: string; timestamp: number; }> => {
        if (!this.__elapsedTimestamp) {
            return this.__elapsedTimestamp = {
                elapsedRealtime: await this.__client.getElapsedRealtime(),
                timestamp: Date.now(),
            };
        };

        return this.__elapsedTimestamp = {
            elapsedRealtime: (Number(this.__elapsedTimestamp.elapsedRealtime) + (Date.now() - this.__elapsedTimestamp.timestamp)).toString(),
            timestamp: Date.now(),
        };
    };

    private __runVoiceChat = (ndcId: number, threadId: string): void => {
        const intervalId = setInterval(async () => {
            if (!this.__connectedVoiceThreads.includes(threadId)) {
                clearInterval(intervalId);
                return;
            };
            this.send(JSON.stringify({
                o: {
                    ndcId: ndcId,
                    threadId: threadId,
                    joinRole: 1,
                    id: (await this.__getElapsedRealtime()).elapsedRealtime
                },
                t: 112
            }));
        }, 60000);
    }

    private __reconnect = (): void => {
        if (this.__websocket) this.__websocket.close();
        const signData = this.__client.account.deviceId.concat(`|${Date.now()}`);
        this.__websocket = new WebSocket(`${WEBSOCKET_URL}/?signbody=${signData.replace(/\|/g, '%7C')}`, {
        headers: {
            ...WEBSOCKET_HEADERS,
            'AUID': this.__client.account.user.uid,
            'NDCAUTH': `sid=${this.__client.account.sessionId}`,
            'NDCDEVICEID': this.__client.account.deviceId,
            'NDC-MSG-SIG': generateHMAC(Buffer.from(signData))
        }
        });
        LOGGER.info({ url: this.__websocket.url }, 'Socket connected.');
        this.__setupSocketWorkflow();
    }

    private __getCreateNdc = (ndcId: number): AminoDorks => this.__ndcs.get(ndcId) || (this.__ndcs.set(ndcId, this.__client.as(ndcId)).get(ndcId) as AminoDorks);

    private __setupSocketWorkflow = (): void => {
        this.__websocket?.on('message', (data: WebSocket.RawData) => {
            const message: BasicEvent = JSON.parse(data.toLocaleString());
            let topicName: string | undefined;

            if (message.t == 1000) {
                topicName = SOCKET_TOPICS[`${message.t}_${(message.o as MessageEvent).chatMessage.type}` as keyof typeof SOCKET_TOPICS]
                if (!topicName) topicName = SOCKET_TOPICS['1000_0'];
            } else topicName = SOCKET_TOPICS[`${message.t}` as keyof typeof SOCKET_TOPICS];

            LOGGER.info({ type: topicName, t: message.t }, 'Received data.');
            const handler = this.__listeners.get(topicName as EventName);
            if (handler) handler.forEach(async (callback) => await callback(this.__getCreateNdc((message.o as MessageEvent).ndcId), message.o));
        });

        setTimeout(this.__reconnect, WEBSOCKET_RECONNECT_TIME);
    };

    public open = (callback: () => void): void => {
        this.__websocket?.on('open', () => {
            LOGGER.info({ url: this.__websocket?.url }, 'Socket opened.');
            callback();
        });
    };

    public error = (callback: (error: Error) => void): void => {
        this.__websocket?.on('error', (error: Error) => {
            LOGGER.error({ url: this.__websocket?.url, error }, 'Socket error.');
            callback(error);
        });
    };

    public close = (callback: (code: number) => void): void => {
        this.__websocket?.on('close', (code: number) => {
            LOGGER.info({ url: this.__websocket?.url, code }, 'Socket closed.');
            callback(code);
        });
    };

    public on = <T extends EventName>(eventName: T, callback: (ndc: AminoDorks, data: EventMap[T]) => Promise<void>): void => {
        if (!this.__listeners.has(eventName)) this.__listeners.set(eventName, new Set());
        this.__listeners.get(eventName)?.add(callback as WebSocketCallback);
    };

    public command = (commandName: Safe<string>, callback: CommandCallback): void => {
        if (!this.__listeners.has('message')) this.__listeners.set('message', new Set());

        const preCallback = (ndc: AminoDorks, data: MessageEvent) => {
            if (
                !data.chatMessage.content || 
                !data.chatMessage.content.startsWith(commandName)
            ) return;

            callback(
                ndc,
                { message: data.chatMessage, ndcId: data.ndcId }
            );
        };
        this.__listeners.get('message')?.add(preCallback as WebSocketCallback);
    };

    public commandArgs = (commandName: Safe<string>, callback: CommandArgsCallback): void => {
        if (!this.__listeners.has('message')) this.__listeners.set('message', new Set());

        const preCallback = (ndc: AminoDorks, data: MessageEvent) => {
            if (
                !data.chatMessage.content || 
                !data.chatMessage.content.startsWith(commandName)
            ) return;

            callback(
                ndc,
                { message: data.chatMessage, ndcId: data.ndcId },
                data.chatMessage.content
                    .split(`${commandName} `)[1]
                    .split(' ')
                    .map(item => new ArgImpl(item))
            );
        };
        this.__listeners.get('message')?.add(preCallback as WebSocketCallback);
    };

    public send = (data: WebSocket.Data): void => {
        LOGGER.info({ url: this.__websocket?.url, data: data.toString() }, 'Sending data.');
        this.__websocket?.send(data, (error) => error && console.error(error));
    }

        public joinVoiceThread = async (ndcId: number, threadId: string): Promise<void> => {
        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                joinRole: 1,
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 112
        }));
    };

    public joinVideoThread = async (ndcId: number, threadId: string): Promise<void> => {
        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                joinRole: 1,
                channelType: 5,
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 108
        }));
    };

    public joinVideoThreadAsViewer = async (ndcId: number, threadId: string): Promise<void> => {
        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                joinRole: 2,
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 112
        }));
    };

    public startVoiceChat = async (ndcId: number, threadId: string): Promise<void> => {
        const { elapsedRealtime } = await this.__getElapsedRealtime();

        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                joinRole: 1,
                id: elapsedRealtime
            },
            t: 112
        }));

        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                channelType: 1,
                id: elapsedRealtime
            },
            t: 108
        }));
        this.__connectedVoiceThreads.push(threadId);
        this.__runVoiceChat(ndcId, threadId);
    };

    public endVoiceChat = async (ndcId: number, threadId: string): Promise<void> => {
        this.send(JSON.stringify({
            o: {
                ndcId: ndcId,
                threadId: threadId,
                joinRole: 2,
                id: '2154531'
            },
            t: 112
        }));
        this.__connectedVoiceThreads.splice(this.__connectedVoiceThreads.indexOf(threadId), 1);
    };

    public sendTyping = async (ndcId: number, threadId: string): Promise<void> => {
        this.send(JSON.stringify({
            o: {
                actions: ['Typing'],
                target: `ndc://x${ndcId}/chat-thread/${threadId}`,
                ndcId: ndcId,
                params: {
                    threadType: 2
                },
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 304
        }));
    };

    public sendRecording = async (ndcId: Safe<number>, threadId: Safe<string>) => {
        this.send(JSON.stringify({
            o: {
                actions: ['Recording'],
                target: `ndc://x${ndcId}/chat-thread/${threadId}`,
                ndcId: ndcId,
                params: {
                    threadType: 0
                },
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 304
        }));
    };

    public sendEndRecording = async (ndcId: Safe<number>, threadId: Safe<string>, duration: Safe<number>) => {
        this.send(JSON.stringify({
            o: {
                actions: ['Recording'],
                target: `ndc://x${ndcId}/chat-thread/${threadId}`,
                ndcId: ndcId,
                params: {
                    threadType: 0,
                    duration: duration
                },
                id: (await this.__getElapsedRealtime()).elapsedRealtime
            },
            t: 306
        }));
    };
};