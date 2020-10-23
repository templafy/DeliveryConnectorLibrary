export function generateRegExpFromUrls(urls: string[]): RegExp {
    let urlsRegex = "";
    for (let i = 0; i < urls.length; i++) {
        const isFirst = i === 0;
        urlsRegex += isFirst ? "" : "|";
        urlsRegex += generateRegExpFromUrl(urls[i]);
    }
    return new RegExp(urlsRegex);
}

export function generateRegExpFromUrl(url: string): string {
    let urlRegex = "";
    const urlParts = url.split(".");
    for (let i = 0; i < urlParts.length; i++) {
        const validSubdomainPartRegex = urlParts[i].replace("*", "[^/^.]+");
        const isFirst = i === 0;
        urlRegex += isFirst ? "" : "[.]";
        urlRegex += validSubdomainPartRegex;
    }
    return `^${urlRegex}$`;
}
