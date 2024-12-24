import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf8');

const main = () => {
    const [table, instructions] = data.split('\n\n');

    const tableMap = new Map(
        table.split('\n').map(row => {
            const [key, value] = row.split(': ');
            return [key, Number(value)];
        })
    );

    const instructionsArray = instructions.split('\n').map(instruction => {
        const operation = instruction.split(' ');
        return operation.filter(item => item !== '->');
    });

    while (true) {
        let progress = false;

        for (let i = 0; i < instructionsArray.length; i++) {
            const [firstIndex, operator, secondIndex, resultIndex] = instructionsArray[i];

            if (tableMap.has(resultIndex)) continue;

            const firstValue = tableMap.get(firstIndex);
            const secondValue = tableMap.get(secondIndex);

            if (firstValue === undefined || secondValue === undefined) continue;

            let result;
            if (operator === 'AND') {
                result = firstValue & secondValue;
            } else if (operator === 'OR') {
                result = firstValue | secondValue;
            } else if (operator === 'XOR') {
                result = firstValue ^ secondValue;
            } else {
                console.error('Invalid operator');
                continue;
            }

            tableMap.set(resultIndex, result);
            progress = true;
        }

        if (!progress) break;
    }

    const zWires = Array.from(tableMap.entries())
        .filter(([key]) => key.startsWith('z'))
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, value]) => value);

    const binary = zWires.reverse().join('');
    return parseInt(binary, 2);
};

interface Instruction {
    a: string;
    b: string;
    c: string;
    operation: string;
}

const main2 = () => {
    const [_, instructionsInput] = data.trim().split('\n\n');
    const instructionsArray: Instruction[] = instructionsInput.split('\n').map(line => {
        const [a, operation, b, , c] = line.split(' ');
        return { a, b, c, operation };
    });

    const BIT_LENGTH = 45;
    const incorrect: string[] = [];

    for (let i = 0; i < BIT_LENGTH; i++) {
        const id = i.toString().padStart(2, '0');

        const xorInstruction = instructionsArray.find(
            instr =>
                ((instr.a === `x${id}` && instr.b === `y${id}`) ||
                    (instr.a === `y${id}` && instr.b === `x${id}`)) &&
                instr.operation === 'XOR'
        );

        const andInstruction = instructionsArray.find(
            instr =>
                ((instr.a === `x${id}` && instr.b === `y${id}`) ||
                    (instr.a === `y${id}` && instr.b === `x${id}`)) &&
                instr.operation === 'AND'
        );

        const zInstruction = instructionsArray.find(instr => instr.c === `z${id}`);

        if (!xorInstruction || !andInstruction || !zInstruction) continue;

        if (zInstruction.operation !== 'XOR') incorrect.push(zInstruction.c);

        const orInstruction = instructionsArray.find(
            instr => instr.a === andInstruction.c || instr.b === andInstruction.c
        );
        if (orInstruction && orInstruction.operation !== 'OR' && i > 0) {
            incorrect.push(andInstruction.c);
        }

        const afterInstruction = instructionsArray.find(
            instr => instr.a === xorInstruction.c || instr.b === xorInstruction.c
        );
        if (afterInstruction && afterInstruction.operation === 'OR') {
            incorrect.push(xorInstruction.c);
        }
    }

    const invalidXors = instructionsArray
        .filter(instr =>
            instr.operation === 'XOR' &&
            !instr.a.startsWith('x') &&
            !instr.a.startsWith('y') &&
            !instr.b.startsWith('x') &&
            !instr.b.startsWith('y') &&
            !instr.c.startsWith('z')
        )
        .map(instr => instr.c);

    incorrect.push(...invalidXors);

    return incorrect.sort().join(',');
};

console.log(main2());
