import fs from 'fs'

const data: string = fs.readFileSync('data.txt', 'utf8')
let stones = data.trim().split(" ").map(Number);

const main = () => {

    const blink = (stones: number[]): number[] => {
        let newStones = stones
        for (let i = 0; i < newStones.length; i++) {
            if (newStones[i] === 0) {
                newStones[i] = 1;
            }
            else if (newStones[i].toString().length % 2 === 0) {
                const half = String(newStones[i]).substring(0, String(newStones[i]).length / 2);
                const otherHalf = String(newStones[i]).substring(String(newStones[i]).length / 2);

                newStones = newStones.slice(0, i).concat([Number(half), Number(otherHalf)]).concat(newStones.slice(i + 1));
                i++;
            }
            else {
                newStones[i] = newStones[i] * 2024;
            }
        }
        return newStones;
    }


    for (let i = 0; i < 25; i++) {
        console.log("blink", i + 1, stones = blink(stones));
    }

    return stones.length;
}

const main2 = () => {
    let countMap = new Map<number, bigint>();

    for (const stone of stones) {
        countMap.set(stone, (countMap.get(stone) || 0n) + 1n);
    }

    const blink = (currentMap: Map<number, bigint>): Map<number, bigint> => {
        const newMap = new Map<number, bigint>();

        for (const [stone, count] of currentMap.entries()) {
            if (stone === 0) {
                newMap.set(1, (newMap.get(1) || 0n) + count);
            } else if (Math.floor(Math.log10(stone) + 1) % 2 === 0) {
                const digits = Math.floor(Math.log10(stone) + 1);
                const divisor = 10 ** (digits / 2);
                const leftHalf = Math.floor(stone / divisor);
                const rightHalf = stone % divisor;

                newMap.set(leftHalf, (newMap.get(leftHalf) || 0n) + count);
                newMap.set(rightHalf, (newMap.get(rightHalf) || 0n) + count);
            } else {
                const newStone = stone * 2024;
                newMap.set(newStone, (newMap.get(newStone) || 0n) + count);
            }
        }

        return newMap;
    };

    for (let i = 0; i < 75; i++) {
        console.log(`Blink ${i + 1}: ${[...countMap.values()].reduce((acc, val) => acc + val, 0n)} stones`);
        countMap = blink(countMap);
    }

    return `${[...countMap.values()].reduce((acc, val) => acc + val, 0n)}`;
}

console.log(main2());