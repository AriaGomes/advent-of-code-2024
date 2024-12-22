import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');

const MODULO = BigInt(16777216);

const main = () => {
    const lines = data.split('\n').map(line => BigInt(line.trim()));

    const evolveNumber = (num: bigint) => {
        let result: bigint = num;

        for (let i = 0; i < 2000; i++) {
            result = (result ^ (result * BigInt(64))) % MODULO;
            result = (result ^ (result / BigInt(32))) % MODULO;
            result = (result ^ (result * BigInt(2048))) % MODULO;
        }

        return result;
    }

    let sum = BigInt(0);
    for (let i = 0; i < lines.length; i++) {
        sum += evolveNumber(lines[i]);
    }

    return sum;
}

const main2 = () => {

    const randomNumber = (seed: bigint) => {
        seed = ((seed << 6n) ^ seed) % MODULO;
        seed = ((seed >> 5n) ^ seed) % MODULO;
        seed = ((seed << 11n) ^ seed) % MODULO;

        return seed;
    }

    const ranges: { [key: string]: number[] } = {};
    data.split('\n').map(num => BigInt(num)).forEach(num => {
        let seed = num;
        const visited = new Set<string>();
        const changes: number[] = [];
        for (let i = 0; i < 2000; i++) {
            const nextSeed = randomNumber(seed);
            changes.push(Number((nextSeed % 10n) - (seed % 10n)));
            seed = nextSeed;

            if (changes.length === 4) {
                const key = changes.join(',');
                if (!visited.has(key)) {
                    if (ranges[key] === undefined) ranges[key] = [];
                    ranges[key].push(Number((nextSeed % 10n)));
                    visited.add(key);
                }
                changes.shift();
            }
        }
    });

    return Math.max(...Object.values(ranges).map(range => range.reduce((sum, num) => sum + num, 0)));
}

console.log(main2());