import { SocksProxies } from 'fetch-socks';
import { UTC } from '../constants';

export const getTimezone = () => UTC[new Date().getUTCMinutes() % UTC.length];

export const formatMediaList = (rawMediaList: string[]) => rawMediaList.map((media) => [100, media, null]);

export const formatMedia = (media?: string) => media ? [[100, media, null]] : null;

export const convertProxy = (proxy: string): SocksProxies => {
    const [host, port] = proxy.slice(9).split(':');
    return {
        host,
        type: Number(proxy.slice(5, 6)) as 5 | 4,
        port: Number(port)
    };
};