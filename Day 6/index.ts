import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const map = data.split("\n").map((line) => line.split(""));
const rows = map.length;
const cols = map[0].length;
const directions: { [key: string]: [number, number] } = {
    "^": [-1, 0],
    ">": [0, 1],
    "v": [1, 0],
    "<": [0, -1],
};
let guardRow = 0, guardCol = 0, direction = "^";

const directionOrder = ["^", ">", "v", "<"];

const main = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (["^", ">", "v", "<"].includes(map[r][c])) {
                guardRow = r;
                guardCol = c;
                direction = map[r][c];
            }
        }
    }

    const visited = new Set<string>();
    visited.add(`${guardRow},${guardCol}`);
    console.log(visited);


    while (true) {
        const [rowOffset, colOffset] = directions[direction];
        const nextRow = guardRow + rowOffset;
        const nextCol = guardCol + colOffset;

        if (
            nextRow < 0 ||
            nextRow >= rows ||
            nextCol < 0 ||
            nextCol >= cols
        ) {
            break; // boundary 
        }

        if (map[nextRow][nextCol] !== "#") {
            guardRow = nextRow;
            guardCol = nextCol;
            visited.add(`${guardRow},${guardCol}`);
        } else {
            const currentDirIndex = directionOrder.indexOf(direction);
            direction = directionOrder[(currentDirIndex + 1) % 4];
        }
    }

    return visited.size;
}

const main2 = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (["^", ">", "v", "<"].includes(map[r][c])) {
                guardRow = r;
                guardCol = c;
                direction = map[r][c];
            }
        }
    }

    const simulateGuardMovement = (map: string[][]): boolean => {
        const visitedStates = new Set<string>();

        let r = guardRow;
        let c = guardCol;
        let dir = direction;

        while (true) {
            const stateKey = `${r},${c},${dir}`;
            // Check if the guard is in a loop
            if (visitedStates.has(stateKey)) {
                return true;
            }
            visitedStates.add(stateKey);

            const [rowOffset, colOffset] = directions[dir];
            const nextRow = r + rowOffset;
            const nextCol = c + colOffset;

            if (
                nextRow < 0 ||
                nextRow >= rows ||
                nextCol < 0 ||
                nextCol >= cols
            ) {
                return false;
            }

            if (map[nextRow][nextCol] !== "#" && map[nextRow][nextCol] !== "O") {
                r = nextRow;
                c = nextCol;
            } else {
                const currentDirIndex = directionOrder.indexOf(dir);
                dir = directionOrder[(currentDirIndex + 1) % 4];
            }
        }
    };

    const validPositions: Set<string> = new Set();

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (map[r][c] === "." && (r !== guardRow || c !== guardCol)) {

                const newMap = map.map((row) => row.slice());
                newMap[r][c] = "O";

                const isLoop = simulateGuardMovement(newMap);

                if (isLoop) {
                    validPositions.add(`${r},${c}`);
                }
            }
        }
    }

    return validPositions.size;
};

console.log(main2());