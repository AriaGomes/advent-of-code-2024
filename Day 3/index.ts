import * as fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');

const main = () => {
    const regex: RegExp = /mul\((\d+),(\d+)\)/g;
    const matches = Array.from(data.matchAll(regex));
    const results = matches.map(match => [match[1], match[2]]);
    let mulResult = 0;

    for (let i = 0; i < results.length; i++) {
        const [a, b] = results[i];
        mulResult += parseInt(a) * parseInt(b);
    }

    return mulResult;
}

const main2 = () => {
    const regex: RegExp = /mul\((\d+),(\d+)\)/;

    const instructions = data.split(/(mul\(\d+,\d+\)|do\(\)|don't\(\))/);

    let enabled = true;
    let mulResult = 0;

    instructions.forEach(instruction => {
        if (instruction === "do()") {
            enabled = true;
        } else if (instruction === "don't()") {
            enabled = false;
        } else {
            const match = instruction.match(regex);
            if (match && enabled) {
                const a = parseInt(match[1]);
                const b = parseInt(match[2]);
                mulResult += a * b;
            }
        }
    });

    return mulResult;
};

console.log(main2());