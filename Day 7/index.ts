import fs from 'fs'
const data = fs.readFileSync('./data.txt', 'utf-8')
const testValues: number[] = [];
const numberSequences: number[][] = [];

data.split("\n").forEach(line => {
    const [left, right] = line.split(":");
    if (left && right) {
        testValues.push(Number(left.trim()));
        numberSequences.push(right.trim().split(" ").map(Number));
    }
});

const main = () => {
    let sum = 0;

    const generateCombinations = (n: number) => {
        const results: string[][] = [];
        const generate = (current: string[], length: number) => {
            if (length === n) {
                results.push([...current]);
                return;
            }
            generate([...current, '+'], length + 1);
            generate([...current, '*'], length + 1);
        };
        generate([], 0);
        return results;
    };

    const evaluateExpression = (sequence: number[], operators: string[]) => {
        let result = sequence[0];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '+') {
                result += sequence[i + 1];
            } else if (operators[i] === '*') {
                result *= sequence[i + 1];
            }
        }
        return result;
    };

    for (let i = 0; i < testValues.length; i++) {
        const index = testValues[i];
        const sequence = numberSequences[i];
        const combinations = generateCombinations(sequence.length - 1);
        let found = false;

        for (let j = 0; j < combinations.length; j++) {
            const operators = combinations[j];
            if (evaluateExpression(sequence, operators) === index) {
                found = true;
                break;
            }
        }

        if (found) {
            sum += testValues[i];
        }
    }

    return sum;
};

const main2 = () => {
    let sum = 0;

    const generateCombinations = (n: number) => {
        const results: string[][] = [];
        const generate = (current: string[], length: number) => {
            if (length === n) {
                results.push([...current]);
                return;
            }
            generate([...current, '+'], length + 1);
            generate([...current, '*'], length + 1);
            generate([...current, '||'], length + 1);
        };
        generate([], 0);
        return results;
    };

    const evaluateExpression = (sequence: number[], operators: string[]) => {
        let result = sequence[0];
        for (let i = 0; i < operators.length; i++) {
            if (operators[i] === '+') {
                result += sequence[i + 1];
            } else if (operators[i] === '*') {
                result *= sequence[i + 1];
            } else if (operators[i] === '||') {
                result = Number(String(result) + String(sequence[i + 1]));
            }
        }
        return result;
    };

    for (let i = 0; i < testValues.length; i++) {
        const index = testValues[i];
        const sequence = numberSequences[i];
        const combinations = generateCombinations(sequence.length - 1);
        let found = false;

        for (let j = 0; j < combinations.length; j++) {
            const operators = combinations[j];
            if (evaluateExpression(sequence, operators) === index) {
                found = true;
                break;
            }
        }

        if (found) {
            sum += testValues[i];
        }
    }

    return sum;
};

console.log(main2())