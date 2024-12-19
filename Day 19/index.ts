import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8').trim();
const [inventoryBlock, instructionsBlock] = data.split('\n\n').map(block => block.trim());
const inventoryArray = inventoryBlock.split(',').map(pattern => pattern.trim());
const instructions = instructionsBlock.split('\n').map(instruction => instruction.trim());

const main = () => {
    let validInstructions = [];

    const canFormInstruction = (instruction: string): boolean => {
        const length = instruction.length;
        const dp: boolean[] = Array(length + 1).fill(false);
        dp[0] = true;

        for (let i = 1; i <= length; i++) {
            for (const pattern of inventoryArray) {
                const patternLen = pattern.length;

                if (i >= patternLen && dp[i - patternLen]) {
                    if (instruction.slice(i - patternLen, i) === pattern) {
                        dp[i] = true;
                    }
                }
            }
        }

        if (dp[length]) {
            return true;
        }
        return false;
    };

    for (const instruction of instructions) {
        console.log(`Processing instruction: ${instruction}`);
        if (canFormInstruction(instruction)) {
            console.log(`Instruction ${instruction} is possible`);
            validInstructions.push(true);
        } else {
            console.log(`Instruction ${instruction} is NOT possible`);
            validInstructions.push(false);
        }
    }

    return validInstructions.filter(Boolean).length;
};

const main2 = () => {
    const countWaysToFormInstruction = (instruction: string): number => {
        const length = instruction.length;
        const dp: number[] = Array(length + 1).fill(0);
        dp[0] = 1;

        for (let i = 1; i <= length; i++) {
            for (const pattern of inventoryArray) {
                const patternLen = pattern.length;

                if (i >= patternLen && instruction.slice(i - patternLen, i) === pattern) {
                    dp[i] += dp[i - patternLen];
                }
            }
        }

        return dp[length];
    };

    let totalWays = 0;

    for (const instruction of instructions) {
        console.log(`Processing instruction: ${instruction}`);
        const ways = countWaysToFormInstruction(instruction);
        console.log(`Instruction ${instruction} can be formed in ${ways} ways`);
        totalWays += ways;
    }

    return totalWays;

}

console.log(main2());
