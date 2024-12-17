import fs from 'fs';
type Register = {
    "Register A": number,
    "Register B": number,
    "Register C": number,
}

const data = fs.readFileSync('./data.txt', 'utf-8')

const main = () => {
    const [registers, instructions] = data.split('\n\n').map(line => line.split('\n'))
    const instructionsArray = instructions[0].split(': ')[1].split(',').map(Number);

    let registersObj: Register = registers.reduce((acc, register) => {
        const [key, value] = register.split(':')
        acc[key.trim() as keyof Register] = Number(value)
        return acc
    }, {} as Register)

    const combo = (regs: Register, val: number): number => {
        if (val < 4) return val;
        if (val === 4) return regs['Register A'];
        if (val === 5) return regs['Register B'];
        if (val === 6) return regs['Register C'];
        return 0;
    };

    const outArray: number[] = [];
    for (let i = 0; i < instructionsArray.length; i += 2) {
        const operand = Number(instructionsArray[i + 1]);
        console.log(`Step: ${i}, Opcode: ${instructionsArray[i]}, Operand: ${operand}`);
        console.log(registersObj);
        switch (Number(instructionsArray[i])) {
            case 0: // adv
                registersObj['Register A'] = Math.floor(registersObj['Register A'] / Math.pow(2, combo(registersObj, operand)));
                break;
            case 1: // bxl
                registersObj['Register B'] = registersObj['Register B'] ^ operand;
                break;
            case 2: // bst
                registersObj['Register B'] = combo(registersObj, operand) % 8;
                break;
            case 3: // jnz
                if (registersObj['Register A'] !== 0) {
                    i = operand - 2;
                }
                break;
            case 4: // bxc
                registersObj['Register B'] = registersObj['Register B'] ^ registersObj['Register C'];
                break;
            case 5: // out
                outArray.push(combo(registersObj, operand) % 8);
                break;
            case 6: // bdv
                registersObj['Register B'] = Math.floor(registersObj['Register A'] / Math.pow(2, combo(registersObj, operand)));
                break;
            case 7: // cdv
                registersObj['Register C'] = Math.floor(registersObj['Register A'] / Math.pow(2, combo(registersObj, operand)));
                break;
        }
    }
    return outArray.join(',');
};

const main2 = () => {
    type Input = ReturnType<typeof parse>
    type RegisterName = 'a' | 'b' | 'c'

    function parse(input: string) {
        const [registers, program] = input.split('\n\n')
        const [a, b, c] = registers
            .split('\n')
            .map(line => BigInt(line.substring(12)))
        return {
            registers: { a, b, c } as Record<RegisterName, bigint>,
            instructions: program
                .substring(9)
                .split(',')
                .map(n => BigInt(n))
        }
    }

    const memoryKeys: RegisterName[] = ['a', 'b', 'c']

    function runProgram({ registers, instructions }: Input) {
        const output: bigint[] = []
        for (let i = 0; i < instructions.length;) {
            const op = instructions[i]
            const literal = instructions[i + 1]
            const combo =
                instructions[i + 1] <= 3
                    ? instructions[i + 1]
                    : registers[memoryKeys[Number(instructions[i + 1]) - 4]]

            switch (op) {
                case 0n:
                    registers.a = registers.a / 2n ** combo
                    break
                case 1n:
                    registers.b ^= literal
                    break
                case 2n:
                    registers.b = combo % 8n
                    break
                case 3n:
                    if (registers.a !== 0n) {
                        i = Number(literal)
                        continue
                    }
                    break
                case 4n:
                    registers.b ^= registers.c
                    break
                case 5n:
                    output.push(combo % 8n)
                    break
                case 6n:
                    registers.b = registers.a / 2n ** combo
                    break
                case 7n:
                    registers.c = registers.a / 2n ** combo
                    break
            }

            i += 2
        }
        return { registers, output }
    }

    function partTwo({ registers, instructions }: Input) {
        const expected = instructions.join(',')
        let i = 1n

        while (true) {
            const result = runProgram({
                registers: { ...registers, a: i },
                instructions
            })

            const test = result.output.join(',')
            if (test === expected) {
                return i
            }

            if (expected.endsWith(test)) {
                i = i * 8n
            } else {
                i++
            }

            console.log(i, test)
        }
    }

    const input = parse(data)
    return partTwo(input);
}

console.log(main());

// Old pt2 bruteforce slow 
// const main2 = () => {
//     const combo = (operand: number, registers: number[]): number => {
//         return operand < 4 ? operand : registers[operand - 4];
//     }

//     // Memoize previously calculated outputs to avoid redundant calculations
//     const simulateProgramMemoized = (registerA: number, memo: Map<number, number[]>): number[] => {
//         // Check if result is already memoized
//         if (memo.has(registerA)) {
//             return memo.get(registerA)!;
//         }

//         const registers: number[] = [registerA, 0, 0];
//         const outputs: number[] = [];
//         const instructions = instructionsArray;

//         for (let i = 0; i < instructions.length; i += 2) {
//             const opcode = instructions[i];
//             const operand = instructions[i + 1] ?? 0;
//             const comboResult = combo(operand, registers);

//             let divResult: number;
//             switch (opcode) {
//                 case 0: // adv
//                     divResult = 1 << comboResult;
//                     registers[0] = Math.floor(registers[0] / divResult);
//                     break;
//                 case 1: // bxl
//                     registers[1] ^= operand;
//                     break;
//                 case 2: // bst
//                     registers[1] = comboResult % 8;
//                     break;
//                 case 3: // jnz
//                     if (registers[0] !== 0) {
//                         i = operand - 2;
//                     }
//                     break;
//                 case 4: // bxc
//                     registers[1] ^= registers[2];
//                     break;
//                 case 5: // out
//                     outputs.push(comboResult % 8);
//                     break;
//                 case 6: // bdv
//                     divResult = 1 << comboResult;
//                     registers[1] = Math.floor(registers[0] / divResult);
//                     break;
//                 case 7: // cdv
//                     divResult = 1 << comboResult;
//                     registers[2] = Math.floor(registers[0] / divResult);
//                     break;
//             }
//         }

//         // Memoize the result before returning
//         memo.set(registerA, outputs);
//         return outputs;
//     }

//     const findLowestRegisterA = (): number => {
//         const targetOutput = instructionsArray;
//         let registerA = 1;
//         const memo: Map<number, number[]> = new Map(); // Memoization cache

//         // Linear search optimization (can be made more advanced with heuristics)
//         while (true) {
//             const outputs = simulateProgramMemoized(registerA, memo);

//             // Early exit if outputs match
//             if (arraysEqual(outputs, targetOutput)) {
//                 return registerA;
//             }

//             registerA++;
//             console.log(outputs.join(",") + " " + registerA);
//         }
//     }

//     const arraysEqual = (a: number[], b: number[]): boolean => {
//         // Compare arrays quickly by stopping early if a mismatch is found
//         if (a.length !== b.length) return false;
//         for (let i = 0; i < a.length; i++) {
//             if (a[i] !== b[i]) return false;
//         }
//         return true;
//     }

//     return findLowestRegisterA();
// }

// console.log(main2());
