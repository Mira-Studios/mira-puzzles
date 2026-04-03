"use client";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { sha256Hex, keyedSha256Hex, mask } from "./lib/hash";
import { parseParams } from "./lib/query";
import { ObjectEncodingOptions } from "node:fs";

let currentKey: number | undefined;

let parsedParams: { [key: string]: string };
let currentParams: { [key: string]: string };

function getHashParams() {
    const hashParams = getParams();
    storeHash(hashParams);
    parsedParams = parseParams(hashParams);
}

getHashParams();

function getCurrentHashParams() {
    if (typeof window === 'undefined') return ""
    const hashParams = (window.location.href.includes("#") ? window.location.href.split("#")[1] : "")
    currentParams = parseParams(hashParams);
}

getCurrentHashParams();

export function deleteHashParam(key: string) {
    if (typeof window === 'undefined') return;
    // 1. Get the current hash (stripping the leading '#')
    const hashParams = new URLSearchParams(window.location.hash.substring(1));

    // 2. Remove the specific key
    hashParams.delete(key);

    // 3. Construct the new URL
    // If the list is empty, 'newHash' will be an empty string
    const newHash = hashParams.toString();
    const finalUrl = newHash ? `#${newHash}` : window.location.pathname + window.location.search;

    // 4. Update the address bar without a page refresh
    window.history.replaceState(null, '', finalUrl);

    delete currentParams[key];
}

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
            <section className="hero animate-fade-up">{content}</section>
        </main>
    );
}

export type ValidPageProps = {
    showIncorrectMessage?: boolean;
}

type PuzzleProps = {
    ValidPage: ComponentType<ValidPageProps>;
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
            if (typeof window !== 'undefined' && currentParams["returnto"]) {
                console.log(currentParams["returnto"]);
                const returnUrl = new URL(decodeURIComponent(currentParams["returnto"]));
                const hashParams = new URLSearchParams(returnUrl.hash.substring(1));
                hashParams.set("badnextpw", "true");
                returnUrl.hash = hashParams.toString();
                console.warn("jimbob", returnUrl.hash);
                window.location.href = returnUrl.toString();
            } else {
                content = <InvalidPage />;
            }
        } else {
            content = <ValidPage showIncorrectMessage={currentParams.badnextpw === "true"}/>;
        }
    } else {
        content = <ValidPage showIncorrectMessage={currentParams.badnextpw === "true"}/>;
    }

    return wrapPage(content);
}

type HintProps = {
    children: ReactNode
}

export function Hint({ children }: HintProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                className="hint-btn"
                aria-label={open ? "Close hint" : "Open hint"}
                onClick={() => setOpen(!open)}
            >
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M9 18h6" />
                    <path d="M9.5 20h5" />
                    <path d="M10 22h4" />
                    <path d="M7.5 12.5a4.5 5.2 0 1 1 9 0c0 1.8-.8 3.4-2.2 4.3L13.2 17h-2.4l-1.1-.2A5.1 5.1 0 0 1 7.5 12.5z" />
                    <path d="M12 2v2" />
                    <path d="M4.9 4.9l1.4 1.4" />
                    <path d="M19.1 4.9l-1.4 1.4" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                </svg>
            </button>
            {open ? children : <></>}
        </>
    );
}

type PWBoxProps = {
    placeholder?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
};

export function PWBox({ placeholder, onChange, onSubmit }: PWBoxProps) {
    const [text, setText] = useState("");
    const conditionalOnSubmit = () => {if (onSubmit) onSubmit?.(text);}
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
            onKeyDown={(e) => {
                if (e.key === 'Enter') conditionalOnSubmit();
            }}
        />
        <button className="continue-btn" onClick={conditionalOnSubmit}>Continue</button>
    </div>);
}
