"use client";
import { useState, useEffect } from "react";
import { Puzzle, Hint, PWBox, sha256Keyed, deleteHashParam, ValidPageProps } from "../puzzle";

async function handleSubmit(pw: string) {
    const currentURL =  new URL(window.location.href);
    const base = currentURL.origin;
    const hash = await sha256Keyed(pw);
    window.location.href = `${base}/puzzle-2#key=${encodeURIComponent(hash)}&returnto=${encodeURIComponent(window.location.href)}`;
}

function Acrostic() {
    return (<>
        <span><span className="special-highlight">I</span>n order to access this section, you don't have to be bright</span>
        <span><span className="special-highlight">N</span>ever forget that the answer's in plain sight.</span>
        <span><span className="special-highlight">T</span>esting your knowledge isn't so hard</span>
        <span><span className="special-highlight">E</span>xplore all your clues, and your path won't be barred</span>
        <span><span className="special-highlight">R</span>ealize -- the answer's right in front of you.</span>
        <span><span className="special-highlight">N</span>othing tricky here—just a straightforward clue</span>
        <span><span className="special-highlight">A</span>ll you need is to type it exactly (all lowercase).</span>
        <span><span className="special-highlight">L</span>ook carefully, it's in front of your face</span>
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
