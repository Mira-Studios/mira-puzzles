import { sha256Hex } from "./lib/hash.ts";
import { parseParams } from "./lib/query.ts";

export async function checkParams(doubleHash: string) {
    const queryParams: string = window.location.href.includes("?") ? window.location.href.split("?")[1] : "";
    const parsedParams: string | { [key: string]: any } = parseParams(queryParams);
    const hashParam: string = (typeof parsedParams == "string") ? parsedParams : parsedParams["key"];

    return (await sha256Hex(hashParam)) === doubleHash;
}
