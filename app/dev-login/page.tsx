"use client";
import { Puzzle, Hint, PWBox, sha256Keyed } from "../puzzle";

async function handleSubmit(pw: string) {
    const currentURL =  new URL(window.location.href);
    const base = currentURL.origin;
    const hash = await sha256Keyed(pw);
    window.location.href = `${base}/puzzle-2#key=${encodeURIComponent(hash)}`;
}

function ValidPage() {
    return (
        <div className="centered">
            <h1>Enter the password</h1>
            <PWBox placeholder="If only you had a hint . . ." onSubmit={handleSubmit} />
            <Hint>Hello</Hint>
        </div>
    );
}

function ErrorPage({ error }: { error: Error }) {
    return <><h1>Error: {error.message}</h1><div>Don't worry! Our devs are on it!</div></>;
}

function LoadingPage() {
    return <><h1>Loading . . .</h1></>
}

function InvalidPage() {
    return <><h1>Nice try! Invalid key.</h1></>
}

export default function Puzzle1() {
    return (
        <Puzzle
            ValidPage={ValidPage}
            InvalidPage={InvalidPage}
            LoadingPage={LoadingPage}
            ErrorPage={ErrorPage}
        />
    );
}
