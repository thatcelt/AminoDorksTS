import { UTC } from "../constants";

export const getTimezone = () => UTC[new Date().getUTCMinutes() % UTC.length];

export const formatMediaList = (rawMediaList: string[]) => rawMediaList.map((media) => [100, media, null]);

export const formatMedia = (media?: string) => media ? [[100, media, null]] : null;