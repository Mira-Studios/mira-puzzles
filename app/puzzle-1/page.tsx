"use client";
import { useEffect, useState } from "react";
import { checkParams } from "../puzzle.ts";

const checkHash = '33652293d7d4e489befba58ed28ed1c59d7b133ccd71c48ff6332fdcc3d2da49'; // FatalMistake02

function Puzzle() {
    return <div><h1>Yippie!</h1><span>You found the puzzle!</span></div>;
}

export default function Puzzle1() {
    const [valid, setValid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | any>(null);

    useEffect(() => {
        (async () => {
            try {
                setValid(await checkParams(checkHash));
                setLoading(false);
            } catch (e) {
                setLoading(false);
                setValid(false);
                setError(e);
            }
        })();
    });

    if (error) {
        return <h1>{error.message}</h1>;
    }

    if (loading) {
        return <h1>Loading . . .</h1>;
    }

    if (!valid) {
        return <h1>Nice try! Invalid key.</h1>;
    }

    // valid
    return Puzzle();

}
