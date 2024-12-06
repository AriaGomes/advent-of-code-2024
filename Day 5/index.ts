import * as fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const [rulesSection, updatesSection] = data.trim().split("\n\n");

function main(): number {

    const rules: [number, number][] = rulesSection.split("\n").map((line) => {
        const [x, y] = line.split("|").map(Number);
        return [x, y];
    });

    const updates: number[][] = updatesSection.split("\n").map((line) =>
        line.split(",").map(Number)
    );

    const isValidUpdate = (update: number[]): boolean => {
        for (const [x, y] of rules) {
            const indexX = update.indexOf(x);
            const indexY = update.indexOf(y);

            if (indexX !== -1 && indexY !== -1 && indexX > indexY) {
                return false;
            }
        }
        return true;
    };

    const middlePages: number[] = updates
        .filter(isValidUpdate)
        .map((update) => {
            const middleIndex = Math.floor(update.length / 2);
            return update[middleIndex];
        });

    return middlePages.reduce((sum, page) => sum + page, 0);
}


const main2 = () => {

    const rules: [number, number][] = rulesSection.split("\n").map((line) => {
        const [x, y] = line.split("|").map(Number);
        return [x, y];
    });

    const updates: number[][] = updatesSection.split("\n").map((line) =>
        line.split(",").map(Number)
    );

    const isValidUpdate = (update: number[]): boolean => {
        for (const [x, y] of rules) {
            const indexX = update.indexOf(x);
            const indexY = update.indexOf(y);

            if (indexX !== -1 && indexY !== -1 && indexX > indexY) {
                return false;
            }
        }
        return true;
    };

    const sortUpdate = (update: number[]): number[] => {

        return update.sort((a, b) => {
            for (const [x, y] of rules) {
                if (a === x && b === y) return -1;
                if (a === y && b === x) return 1;
            }
            return 0;
        });
    };

    const middlePages: number[] = updates
        .filter((update) => !isValidUpdate(update))
        .map((update) => sortUpdate(update))
        .map((update) => {
            const middleIndex = Math.floor(update.length / 2);
            return update[middleIndex];
        });


    return middlePages.reduce((sum, page) => sum + page, 0);
}

console.log(main2());