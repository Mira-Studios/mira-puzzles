"use client";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { sha256Hex, keyedSha256Hex, mask } from "./lib/hash";
import { parseParams } from "./lib/query";

let currentKey: number | undefined;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function storeKey(val: number) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("hashKey", String(val));
}

function getKey(): number | undefined {
    if (typeof window === "undefined") return 0;
    const raw = window.localStorage.getItem("hashKey");
    if (!raw) return undefined;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : undefined;
}

function genKey() {
    const key = randInt(0, 256);
    storeKey(key);
    return key;
}

function ensureKey(): number {
    if (typeof window === "undefined") return 0;
    if (currentKey === undefined) {
        currentKey = getKey() ?? genKey();
    }
    return currentKey;
}

function storeHash(hash: string) {
    if (typeof window === "undefined") return;
    const currentUrl = new URL(window.location.href);
    // store based on the url path
    window.sessionStorage.setItem(`Hash:${currentUrl.pathname}`, hash);
}

function getHash(): string {
    if (typeof window === "undefined") return "";
    const currentUrl = new URL(window.location.href);
    return window.sessionStorage.getItem(`Hash:${currentUrl.pathname}`) ?? "";
}

export function sha256Keyed(data: string | Uint8Array): Promise<string> {
    const key = ensureKey();
    return keyedSha256Hex(data, key);
}

export async function keyedHashHash(data: string): Promise<string> {
    const key = ensureKey();
    return sha256Hex(mask(data, key));
}

function getParams(): string {
    // check url hash params, if they aren't there, use sessionStorage
    if (typeof window === "undefined") return "";
    return (window.location.href.includes("#") ? window.location.href.split("#")[1] : "") || getHash();
}

export async function checkParams(doubleHash: string) {
    if (typeof window === "undefined") return false;
    ensureKey();
    const hashParams = getParams();
    storeHash(hashParams);
    const parsedParams = parseParams(hashParams);
    const hashParam =
        typeof parsedParams === "string"
            ? parsedParams
            : (parsedParams as Record<string, string>)["key"];
    if (!hashParam) return false;


    // Get rid of the hash params on the url
    let cleanUrl = window.location.href.split('#')[0];
    window.history.replaceState({}, document.title, cleanUrl);

    return (await keyedHashHash(hashParam)) === doubleHash;
}

function wrapPage(content: ReactNode) {
    return (
        <main className="page-enter">
            <section className="hero">{content}</section>
        </main>
    );
}

type PuzzleProps = {
    ValidPage: ComponentType;
    InvalidPage: ComponentType;
    LoadingPage: ComponentType;
    ErrorPage: ComponentType<{ error: Error }>;
    checkHash?: string;
};

export function Puzzle({ ValidPage, InvalidPage, LoadingPage, ErrorPage, checkHash }: PuzzleProps) {
    let content: ReactNode;

    if (checkHash) {
        const [valid, setValid] = useState(false);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState<Error | null>(null);

        useEffect(() => {
            let cancelled = false;
            (async () => {
                try {
                    const isValid = await checkParams(checkHash);
                    if (!cancelled) {
                        setValid(isValid);
                        setLoading(false);
                    }
                } catch (e) {
                    if (!cancelled) {
                        setLoading(false);
                        setValid(false);
                        setError(e instanceof Error ? e : new Error("Unknown error"));
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }, [checkHash]);


        if (error) {
            console.error(error);
            content = <ErrorPage error={error} />;
        } else if (loading) {
            content = <LoadingPage />;
        } else if (!valid) {
            content = <InvalidPage />;
        } else {
            content = <ValidPage />;
        }
    } else {
        content = <ValidPage />;
    }

    return wrapPage(content);
}

type PWBoxProps = {
    placeholder?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
};

export function PWBox({ placeholder, onChange, onSubmit }: PWBoxProps) {
    const [text, setText] = useState("");
    return (<div className="inline-centered">
        <input
            type="password"
            placeholder={placeholder}
            value={text}
            className="pw-input"
            onChange={(event) => {
                const value = event.target.value;
                setText(value);
                onChange?.(value);
            }}
        />
        <button className="continue-btn" onClick={() => {if (onSubmit) onSubmit?.(text);} }>Continue</button>
    </div>);
}
