import * as fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const lines = data.trim().split('\n');
let firstColumn: number[] = [];
let secondColumn: number[] = [];

// Read file and split columns into two arrays
lines.forEach(line => {
    const [first, second] = line.trim().split(/\s+/).map(Number);
    firstColumn.push(first);
    secondColumn.push(second);
});

// Sort arrays
firstColumn = firstColumn.sort((a, b) => a - b);
secondColumn = secondColumn.sort((a, b) => a - b);

const main = () => {
    // Part 1
    let totalDistance = 0;

    for (let i = 0; i < firstColumn.length; i++) {
        totalDistance += Math.abs(firstColumn[i] - secondColumn[i]);
    }

    return totalDistance;
}

const main2 = () => {
    // Part 2
    let totalSimilarity = 0;

    firstColumn.forEach(element => {
        let similarity = 0;
        secondColumn.forEach(secondElement => {
            if (element === secondElement) {
                similarity++;
            }
        });
        totalSimilarity += element * similarity;
    });

    return totalSimilarity;
}

console.log(main2());