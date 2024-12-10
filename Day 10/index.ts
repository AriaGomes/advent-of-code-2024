import fs from 'fs'

const data: string = fs.readFileSync('data.txt', 'utf8')
const map: number[][] = data.trim().split("\n").map(line => line.split("").map(Number));
type Position = [number, number];

const main = () => {
    const findTrailheads = (grid: number[][]): Position[] => {
        const trailheads: Position[] = [];
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                if (grid[r][c] === 0) {
                    trailheads.push([r, c]);
                }
            }
        }
        return trailheads;
    }

    const bfs = (grid: number[][], start: Position): number => {
        const rows = grid.length;
        const cols = grid[0].length;
        const directions: Position[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const queue: Position[] = [start];
        const visited = new Set<string>();
        const reachableNines = new Set<string>();

        const positionToString = (pos: Position) => `${pos[0]},${pos[1]}`;

        while (queue.length > 0) {
            const [r, c] = queue.shift()!;
            const posKey = positionToString([r, c]);

            if (visited.has(posKey)) continue;
            visited.add(posKey);

            if (grid[r][c] === 9) {
                reachableNines.add(posKey);
                continue;
            }

            for (const [dr, dc] of directions) {
                const nr = r + dr, nc = c + dc;
                if (
                    nr >= 0 && nr < rows &&
                    nc >= 0 && nc < cols &&
                    grid[nr][nc] === grid[r][c] + 1
                ) {
                    queue.push([nr, nc]);
                }
            }
        }

        return reachableNines.size;
    }

    const trailheads = findTrailheads(map);
    let totalScore = 0;

    for (const trailhead of trailheads) {
        totalScore += bfs(map, trailhead);
    }

    return totalScore;
}

const main2 = () => {
    const rows = map.length;
    const cols = map[0].length;
    const paths: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
    const directions: Position[] = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (map[r][c] === 9) {
                paths[r][c] = 1;
            }
        }
    }

    for (let h = 9; h >= 1; h--) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (map[r][c] === h) {
                    for (const [dr, dc] of directions) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (
                            nr >= 0 && nr < rows &&
                            nc >= 0 && nc < cols &&
                            map[nr][nc] === h - 1
                        ) {
                            paths[nr][nc] += paths[r][c];
                        }
                    }
                }
            }
        }
    }

    let totalRating = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (map[r][c] === 0) {
                totalRating += paths[r][c];
            }
        }
    }

    return totalRating;
}

console.log(main2());