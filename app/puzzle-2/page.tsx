"use client";
import { Puzzle, PWBox } from "../puzzle";

const checkHash = 'd7914fe546b684688bb95f4f888a92dfc680603a75f23eb823658031fff766d9'; // FatalMistake02

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
