import fs from 'fs'

type Coord = {
    x: number,
    y: number
}

const data = fs.readFileSync('./data.txt', 'utf-8')
const coords: Coord[] = data.split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
});

const main = () => {
    const BYTES = 1024; // 12
    const GRID_SIZE = 71 // 7
    const grid: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('.'));
    const ExitCoords: Coord = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

    const printGrid = (grid: string[][]) => {
        for (let i = 0; i < grid.length; i++) {
            console.log(grid[i].join(''));
        }
    }

    for (let i = 0; i < BYTES; i++) {
        const { x, y } = coords[i];
        grid[y][x] = '#'
    }

    const bfs = () => {
        const queue: { coord: Coord, path: Coord[] }[] = [{ coord: { x: 0, y: 0 }, path: [{ x: 0, y: 0 }] }];
        const visited: boolean[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
        visited[0][0] = true;

        while (queue.length) {
            const { coord: current, path } = queue.shift() as { coord: Coord, path: Coord[] };
            const { x, y } = current;

            if (x === ExitCoords.x && y === ExitCoords.y) {
                for (const { x, y } of path) {
                    grid[y][x] = 'O';
                }
                return path;
            }

            const directions: Coord[] = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            ];

            for (const dir of directions) {
                const { x, y } = dir;
                if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE || visited[y][x] || grid[y][x] === '#') {
                    continue;
                }
                visited[y][x] = true;
                queue.push({ coord: { x, y }, path: [...path, { x, y }] });
            }
        }
        return null;
    }

    const path = bfs();
    if (!path) {
        console.log("No path found");
        return;
    }


    printGrid(grid);
    return path.length - 1;
}

const main2 = () => {
    let BYTES = 1024
    const GRID_SIZE = 71
    const grid: string[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('.'));
    const ExitCoords: Coord = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };


    const printGrid = (grid: string[][]) => {
        for (let i = 0; i < grid.length; i++) {
            console.log(grid[i].join(''));
        }
    }

    const placeBytes = (bytes: number) => {
        for (let i = 0; i < bytes; i++) {
            const { x, y } = coords[i];
            grid[y][x] = '#'
        }
    }

    const bfs = () => {
        const queue: { coord: Coord, path: Coord[] }[] = [{ coord: { x: 0, y: 0 }, path: [{ x: 0, y: 0 }] }];
        const visited: boolean[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
        visited[0][0] = true;

        while (queue.length) {
            const { coord: current, path } = queue.shift() as { coord: Coord, path: Coord[] };
            const { x, y } = current;

            if (x === ExitCoords.x && y === ExitCoords.y) {
                for (const { x, y } of path) {
                    grid[y][x] = 'O';
                }
                return path;
            }

            const directions: Coord[] = [
                { x: x + 1, y },
                { x: x - 1, y },
                { x, y: y + 1 },
                { x, y: y - 1 }
            ];

            for (const dir of directions) {
                const { x, y } = dir;
                if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE || visited[y][x] || grid[y][x] === '#') {
                    continue;
                }
                visited[y][x] = true;
                queue.push({ coord: { x, y }, path: [...path, { x, y }] });
            }
        }
        return null;
    }

    while (true) {
        const path = bfs();
        if (!path) {
            return coords[BYTES - 1];
        }
        BYTES += 1;
        placeBytes(BYTES);
        printGrid(grid);
    }
}

console.log(main2())