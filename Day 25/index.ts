import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf8')
const rawGrids = data.split("\n\n");

const main = () => {
    let keyArrArr: number[][] = []
    let lockArrArr: number[][] = []

    const processGrid = (grid: string[][]) => {
        const isKey = () => {
            for (let i = 0; i < grid.length; i++) {
                if (grid[0].every(([arr]) => "." === arr[0])) {
                    return true
                }
                else if (grid[grid.length - 1].every(([arr]) => "." === arr[0])) {
                    return false
                }
                else {
                    throw new Error("Invalid grid");
                }
            }
        }

        const CountLockHeights = () => {
            let lockArr: number[] = []
            for (let x = 0; x < grid[0].length; x++) {
                let count = 0;
                for (let i = 0; i < grid.length; i++) {
                    if (grid[i][x] === "#") {
                        count++;
                    } else {
                        if (count > 0) {
                            lockArr.push(count - 1);
                        }
                        count = 0;
                    }
                }
            }
            return lockArr
        }

        const CountKeyHeights = () => {
            let keyArr: number[] = []
            for (let x = 0; x < grid[0].length; x++) {
                let count = 0;
                for (let i = grid.length - 1; i >= 0; i--) {
                    if (grid[i][x] === "#") {
                        count++;
                    } else {
                        if (count > 0) {
                            keyArr.push(count - 1);
                        }
                        count = 0;
                    }
                }
            }
            return keyArr
        }

        const key = isKey()
        if (key) {
            keyArrArr.push(CountKeyHeights())
        }
        else {
            lockArrArr.push(CountLockHeights())
        }
    }

    rawGrids.forEach(rawGrid => {
        const grid = rawGrid.split("\n").map(row => row.split(""));
        processGrid(grid);
    })

    let fittingKeys = 0;
    for (const lock of lockArrArr) {
        for (const key of keyArrArr) {
            const check = key.map((x, index) => x + lock[index]).filter(sum => sum <= 5);
            if (check.length === 5) {
                fittingKeys += 1;
            }
        }
    }

    return fittingKeys
}

console.log(main())