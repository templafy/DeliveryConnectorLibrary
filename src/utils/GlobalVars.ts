import {generateRegExpFromUrls} from "./OriginValidation";

export const getValidOriginRegExp = () => validOriginRegExp;
export const setAllowedOrigins = (origins: string[]) => {
    validOriginRegExp = generateRegExpFromUrls(origins);
};

const defaultAllowedOrigins = [
    "https://*.templafy.com",
    "https://*.hive.templafy.com"
];
let validOriginRegExp: RegExp = generateRegExpFromUrls(defaultAllowedOrigins);

export const windowMap = new Map<Window, string>();
windowMap.set(window, window.location.origin);

export function updateRelationship(source: Window | MessagePort | ServiceWorker | null, origin: string) {
    windowMap.set(source as Window, origin);
}

