"use client";
import { Puzzle, PWBox } from "../puzzle";

const checkHash = '4b88c5155f1c388aaa3cbd1cec87590eb6f039e5d54a28720bfa430d2d349f7e';

function ValidPage() {
    return (
        <div className="centered">
            <span>Congratulations! You've reached the 3rd puzzle.</span>
            <span>Unfortunately, we haven't made any more, so it doesn't matter if you . . .</span>
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
