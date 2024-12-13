import fs from 'fs';

interface Section {
    "Button A": {
        X: string;
        Y: string;
    },
    "Button B": {
        X: string;
        Y: string;
    },
    Prize: {
        X: string;
        Y: string;
    }
}

const data = fs.readFileSync('data.txt', 'utf8');
const sections = data.split('\n\n');
const array = sections.map(section => {
    const lines = section.split('\n');
    const obj: Section = {
        "Button A": {
            X: '',
            Y: ''
        },
        "Button B": {
            X: '',
            Y: ''
        },
        Prize: {
            X: '',
            Y: ''
        }
    };
    lines.forEach(line => {
        const [key, value] = line.split(': ');
        const [X, Y] = value.split(', ');
        if (key === 'Prize') {
            obj.Prize.X = X.replace('X=', '');
            obj.Prize.Y = Y.replace('Y=', '');
        } else if (key in obj) {
            obj[key as keyof Section].X = X.replace('X+', '');
            obj[key as keyof Section].Y = Y.replace('Y+', '');
        }
    });
    return obj;
});

const main = () => {
    const checkSectionPresses = (section: Section) => {
        const PrizeX = parseInt(section.Prize.X);
        const PrizeY = parseInt(section.Prize.Y);
        const ButtonAX = parseInt(section['Button A'].X);
        const ButtonAY = parseInt(section['Button A'].Y);
        const ButtonBX = parseInt(section['Button B'].X);
        const ButtonBY = parseInt(section['Button B'].Y);

        for (let aPresses = 0; aPresses <= PrizeX / ButtonAX; aPresses++) {
            for (let bPresses = 0; bPresses <= PrizeY / ButtonBY; bPresses++) {
                const currentX = aPresses * ButtonAX + bPresses * ButtonBX;
                const currentY = aPresses * ButtonAY + bPresses * ButtonBY;
                if (currentX === PrizeX && currentY === PrizeY) {
                    return { aPresses, bPresses };
                }
            }
        }
        return null;
    };

    let totalLowestTokens = 0;
    for (let i = 0; i < array.length; i++) {
        const section = array[i];
        const result = checkSectionPresses(section);
        if (result) {
            console.log(`Section ${i + 1}: A presses ${result.aPresses}, B presses ${result.bPresses}`);
            const totalTokens = result.aPresses * 3 + result.bPresses * 1;
            totalLowestTokens += totalTokens;
        } else {
            console.log(`Section ${i + 1}: No solution found`);
        }
    };

    return totalLowestTokens;
}


const main2 = () => {
    const OFFSET = 10000000000000;

    const checkSectionPresses = (section: Section) => {
        const PrizeX = parseInt(section.Prize.X) + OFFSET;
        const PrizeY = parseInt(section.Prize.Y) + OFFSET;
        const ButtonAX = parseInt(section['Button A'].X);
        const ButtonAY = parseInt(section['Button A'].Y);
        const ButtonBX = parseInt(section['Button B'].X);
        const ButtonBY = parseInt(section['Button B'].Y);

        const timesB = (PrizeY * ButtonAX - PrizeX * ButtonAY) / (ButtonBY * ButtonAX - ButtonBX * ButtonAY);
        const timesA = (PrizeX - ButtonBX * timesB) / ButtonAX;

        if (Number.isInteger(timesA) && Number.isInteger(timesB)) {
            return { aPresses: timesA, bPresses: timesB };
        }

        return null;
    };

    let totalLowestTokens = 0;
    for (let i = 0; i < array.length; i++) {
        const section = array[i];
        const result = checkSectionPresses(section);
        if (result) {
            console.log(`Section ${i + 1}: A presses ${result.aPresses}, B presses ${result.bPresses}`);
            const totalTokens = result.aPresses * 3 + result.bPresses * 1;
            totalLowestTokens += totalTokens;
        } else {
            console.log(`Section ${i + 1}: No solution found`);
        }
    }

    return totalLowestTokens;
};

console.log(main2());