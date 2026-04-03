export function parseParams(params: string): { [key: string]: string } {
    // if (!params.includes("=")) {
    //     return params;
    // }

    const search = params.startsWith("#") ? params.slice(1) : params;
    const ret: { [key: string]: any } = {};
    const sp = new URLSearchParams(search);
    for (const [key, value] of sp.entries()) {
        ret[key] = value;
    }

    return ret;
}
