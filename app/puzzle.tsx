"use client";
import { useState, useEffect, type ReactNode } from "react";
import { sha256Hex, keyedSha256Hex, mask } from "./lib/hash.ts";
import { parseParams } from "./lib/query.ts";

let currentKey: number;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function storeKey(val: number) {
    window.localStorage.setItem("hashKey", String(val));
}

function getKey() {
    return Number(window.localStorage.getItem("hashKey"));
}

function genKey() {
    const key = randInt(0, 256);
    storeKey(key);
    return key;
}

export function sha256Keyed(data: string | Uint8Array): Promise<string> {
    if (currentKey === undefined) {
        currentKey = getKey() || genKey();
    }
    return keyedSha256Hex(data, currentKey);
}

export function keyedHashHash(data: string) {
    if (currentKey === undefined) {
        currentKey = getKey() || genKey();
    }
    return sha256Hex(mask(data, currentKey));
}

export async function checkParams(doubleHash: string) {
    if (currentKey === undefined) {
        currentKey = getKey() || genKey();
    }
    const queryParams: string = window.location.href.includes("?") ? window.location.href.split("?")[1] : "";
    const parsedParams: string | { [key: string]: any } = parseParams(queryParams);
    const hashParam: string = (typeof parsedParams == "string") ? parsedParams : parsedParams["key"];

    return (await keyedHashHash(hashParam)) === doubleHash;
}

function wrapPage(content: ReactNode) {
    return (
        <main className="page-enter">
            <section className="hero">{content}</section>
        </main>
    );
}

export function Puzzle(ValidPage: Function, InvalidPage: Function, LoadingPage: Function, ErrorPage: Function, checkHash: string) {
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | any>(null);

    useEffect(() => {
        (async () => {
            try {
                setValid(await checkParams(checkHash));
                setLoading(false);
            } catch (e) {
                setLoading(false);
                setValid(false);
                setError(e);
            }
        })();
    });

    let content: ReactNode;

    if (error) {
        console.error(error);
        content = ErrorPage(error);
    } else if (loading) {
        content = LoadingPage();
    } else if (!valid) {
        content = InvalidPage();
    } else {
        content = ValidPage();
    }

    return wrapPage(content);
}
