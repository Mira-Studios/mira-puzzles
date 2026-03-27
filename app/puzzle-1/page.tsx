"use client";
import { Puzzle, PWBox, sha256Keyed } from "../puzzle";

const checkHash = '33652293d7d4e489befba58ed28ed1c59d7b133ccd71c48ff6332fdcc3d2da49'; // FatalMistake02

async function handleSubmit(pw: string) {
    const currentURL =  new URL(window.location.href);
    const base = new URL(window.location.href).origin;
    const hash = await sha256Keyed(pw);
    window.location.href = `${base}/puzzle-2?key=${hash}`;
}

function ValidPage() {
    return (
        <div className="centered">
            <h1>Enter the password!</h1>
            <h1/>
            <PWBox placeholder="Hmm . . . If only you had a hint . . ." onSubmit={handleSubmit} />
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
