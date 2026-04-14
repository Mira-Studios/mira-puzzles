"use client";
import { Puzzle, PWBox, Hint, sha256Keyed } from "../puzzle";

const checkHash = 'a365dc409e66c383ba3a11fca85770664145fd9270c993de6eb44f20c2366762';

async function handleSubmit(pw: string) {
    const currentURL =  new URL(window.location.href);
    const base = currentURL.origin;
    const hash = await sha256Keyed(pw);
    window.location.href = `${base}/puzzle-4#key=${encodeURIComponent(hash)}&returnto=${encodeURIComponent(window.location.href)}`;
}

function Clue() {
    return (<>
        <span>Uif qbttxpse jt "qvaamft"</span>
        <span>.eno yb gnitfihs rettel yrT :tniH</span>
    </>)
}

function ValidPage() {
    return (
        <div className="centered">
            <span>Congratulations! You've reached the 4th puzzle.</span>
            <h1>Enter the password!</h1>
            <h1/>
            <PWBox placeholder="Hmm . . . If only you had a hint . . ." onSubmit={handleSubmit} />
            <Hint>
                <Clue />
            </Hint>
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

export default function Puzzle2() {
    return (
        <Puzzle
            ValidPage={ValidPage}
            InvalidPage={InvalidPage}
            LoadingPage={LoadingPage}
            ErrorPage={ErrorPage}
            checkHash={checkHash}
        />
    );
}
