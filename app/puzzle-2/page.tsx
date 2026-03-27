"use client";
import { Puzzle, PWBox } from "../puzzle";

const checkHash = '33652293d7d4e489befba58ed28ed1c59d7b133ccd71c48ff6332fdcc3d2da49'; // FatalMistake02

function ValidPage() {
    return (
        <div className="centered">
            <h1>Enter the password!</h1>
            <h1/>
            <PWBox placeholder="Hmm . . . If only you had a hint . . ." />
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
