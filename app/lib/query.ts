export function parseParams(params: string): string | object {
    if (!params.includes("=")) {
        return params;
    }

    let paramList: Array<string> = params.split("=");
    if (paramList.length % 2) {
        console.warn(`Goofy query params: '${params}'`);
        return params;
    }

    let ret: { [key: string]: any } = {};
    for (var i = 0; i < paramList.length; i += 2) {
        ret[paramList[i]] = paramList[i+1];
    }

    return ret;
}
