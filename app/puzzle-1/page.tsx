"use client";
import { useState, useEffect } from "react";
import { Puzzle, Hint, PWBox, sha256Keyed, deleteHashParam, ValidPageProps } from "../puzzle";

async function handleSubmit(pw: string) {
    const currentURL =  new URL(window.location.href);
    const base = currentURL.origin;
    const hash = await sha256Keyed(pw);
    window.location.href = `${base}/puzzle-abc#key=${encodeURIComponent(hash)}&returnto=${encodeURIComponent(window.location.href)}`;
}

function Acrostic() {
    return (<>
        <span>The password might be exactly what you think it is.</span>
    </>)
}

function IncorrectMessage() {
    const [showing, setShowing] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setShowing(false);
            deleteHashParam("badnextpw");
        }, 1000);
    });
    return (<>
        {showing ? <span className="nice-try">Nice try, but that's the wrong password!</span> : <></>}
    </>);
}

function ValidPage({ showIncorrectMessage }: ValidPageProps) {
    console.log("Invalid pw :", showIncorrectMessage);
    return (
        <div className="centered">
            {showIncorrectMessage ? <IncorrectMessage /> : <></>}
            <h1>Enter the password</h1>
            <PWBox placeholder="If only you had a hint . . ." onSubmit={handleSubmit} />
            <Hint><Acrostic/></Hint>
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
