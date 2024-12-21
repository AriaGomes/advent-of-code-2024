import { readFileSync } from "fs";

const lines = readFileSync("./data.txt", "utf8").trim().split("\n");
const codes = lines.filter((line) => /\d{3}A/.test(line));

const positions: Record<string, [number, number]> = {
    "7": [0, 0],
    "8": [0, 1],
    "9": [0, 2],
    "4": [1, 0],
    "5": [1, 1],
    "6": [1, 2],
    "1": [2, 0],
    "2": [2, 1],
    "3": [2, 2],
    "0": [3, 1],
    "A": [3, 2],
    "^": [0, 1],
    "a": [0, 2],
    "<": [1, 0],
    "v": [1, 1],
    ">": [1, 2],
};

const directions: Record<string, [number, number]> = {
    "^": [-1, 0],
    "v": [1, 0],
    "<": [0, -1],
    ">": [0, 1],
};

const subtract = (a: [number, number], b: [number, number]): [number, number] => [a[0] - b[0], a[1] - b[1]];

const add = (a: [number, number], b: [number, number]): [number, number] => [a[0] + b[0], a[1] + b[1]];

const generatePermutations = (chars: string[]): string[][] => {
    if (chars.length === 0) return [[]];
    const result: string[][] = [];
    chars.forEach((char, index) => {
        const remaining = chars.slice(0, index).concat(chars.slice(index + 1));
        const permutations = generatePermutations(remaining);
        permutations.forEach((perm) => result.push([char, ...perm]));
    });
    return result;
}

const seToMoveset = (
    start: [number, number],
    fin: [number, number],
    avoid: [number, number] = [0, 0]
): string[] => {
    const delta = subtract(fin, start);
    let string = "";
    const dx = delta[0];
    const dy = delta[1];

    if (dx < 0) {
        string += "^".repeat(Math.abs(dx));
    } else {
        string += "v".repeat(dx);
    }
    if (dy < 0) {
        string += "<".repeat(Math.abs(dy));
    } else {
        string += ">".repeat(dy);
    }

    const chars = [...string];
    const permutations = generatePermutations(chars);
    const uniquePermutations = Array.from(
        new Set(permutations.map((perm) => perm.join("")))
    );

    const validMovesets = uniquePermutations.filter((s) => {
        const path = s.split("").reduce<[number, number][]>(
            (acc, dir) => [...acc, add(acc[acc.length - 1], directions[dir])],
            [start]
        );
        return !path.some((pos) => pos[0] === avoid[0] && pos[1] === avoid[1]);
    });

    return validMovesets.length > 0 ? validMovesets.map((s) => s + "a") : ["a"];
}

const mlMemos = new Map<string, number>();

const minLength = (str: string, lim = 2, depth = 0): number => {
    const memoKey = `${str}-${depth}-${lim}`;
    if (mlMemos.has(memoKey)) {
        return mlMemos.get(memoKey)!;
    }

    const avoid: [number, number] = depth === 0 ? [3, 0] : [0, 0];
    let cur: [number, number] = depth === 0 ? positions["A"] : positions["a"];
    let length = 0;

    for (const char of str) {
        const nextCur = positions[char];
        const moveset = seToMoveset(cur, nextCur, avoid);
        if (depth === lim) {
            length += (moveset[0] || "a").length;
        } else {
            length += Math.min(...moveset.map((move) => minLength(move, lim, depth + 1)));
        }
        cur = nextCur;
    }

    mlMemos.set(memoKey, length);
    return length;
}

let complexityA = 0;
let complexityB = 0;

codes.forEach((code) => {
    const lengthA = minLength(code);
    const lengthB = minLength(code, 25);
    const numeric = parseInt(code.slice(0, 3), 10);

    complexityA += lengthA * numeric;
    complexityB += lengthB * numeric;
});

console.log(`Part 1: ${complexityA}`);
console.log(`Part 2: ${complexityB}`);
