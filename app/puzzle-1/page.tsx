"use client";
import { useEffect, useState } from "react";
import { Puzzle } from "../puzzle.tsx";

const checkHash = '33652293d7d4e489befba58ed28ed1c59d7b133ccd71c48ff6332fdcc3d2da49'; // FatalMistake02

function ValidPage() {
    return <><h1>Yippie!</h1><span>You found the puzzle!</span></>;
}

function ErrorPage(error: Error) {
    return <><h1>Error: {error.message}</h1><div>Don't worry! Our devs are on it!</div></>;
}

function LoadingPage() {
    return <><h1>Loading . . .</h1></>
}

function InvalidPage() {
    return <><h1>Nice try! Invalid key.</h1></>
}

export default function Puzzle1() {
    return Puzzle(ValidPage, InvalidPage, LoadingPage, ErrorPage, checkHash);
}
