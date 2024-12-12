import fs from 'fs'

const data = fs.readFileSync('data.txt', 'utf8')
const grid: string[][] = data.split('\n').map((row) => row.split(''))

const main = () => {

    const bfs = (searchLetter: string) => {
        const visited = new Set<string>();
        const results: { area: number, perimeter: number }[] = [];

        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        const bfsFromCell = (startX: number, startY: number) => {
            const queue: [number, number][] = [[startX, startY]];
            visited.add(startX + ',' + startY);
            let area = 1;
            let perimeter = 0;

            while (queue.length) {
                const [x, y] = queue.shift()!;
                for (const [dx, dy] of directions) {
                    const newX = x + dx;
                    const newY = y + dy;
                    if (newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[newX].length) {
                        if (grid[newX][newY] === searchLetter && !visited.has(newX + ',' + newY)) {
                            queue.push([newX, newY]);
                            visited.add(newX + ',' + newY);
                            area++;
                        } else if (grid[newX][newY] !== searchLetter) {
                            perimeter++;
                        }
                    } else {
                        perimeter++;
                    }
                }
            }

            results.push({ area, perimeter });
        };

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === searchLetter && !visited.has(i + ',' + j)) {
                    bfsFromCell(i, j);
                }
            }
        }

        return results;
    }

    let totalPrice = 0
    let regionLettersExist = new Set()

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            regionLettersExist.add(grid[i][j])
        }
    }

    for (const letter of regionLettersExist) {
        const result = bfs(String(letter))
        result.forEach(({ area, perimeter }) => {
            totalPrice += area * perimeter
        })


    }
    return totalPrice
}

const main2 = () => {
    interface Region {
        char: string;
        points: Set<string>;
    }

    type Grid = {
        data: string[][];
        width: number;
        height: number;
    };

    const pointToString = (p: { x: number, y: number }): string => {
        return `${p.x},${p.y}`;
    }

    const stringToPoint = (s: string): { x: number, y: number } => {
        const [x, y] = s.split(',').map(Number);
        return { x, y };
    }

    const findRegions = (grid: Grid): Region[] => {
        const visited = new Set<string>();
        const regions: Region[] = [];

        const flood = (start: { x: number, y: number }, char: string): Set<string> => {
            const points = new Set<string>();
            const queue: { x: number, y: number }[] = [start];

            while (queue.length > 0) {
                const p = queue.shift()!;
                const key = pointToString(p);

                if (visited.has(key)) continue;
                if (p.y < 0 || p.y >= grid.height || p.x < 0 || p.x >= grid.width) continue;
                if (grid.data[p.y][p.x] !== char) continue;

                visited.add(key);
                points.add(key);

                queue.push(
                    { x: p.x + 1, y: p.y },
                    { x: p.x - 1, y: p.y },
                    { x: p.x, y: p.y + 1 },
                    { x: p.x, y: p.y - 1 }
                );
            }

            return points;
        }

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const point = { x, y };
                const key = pointToString(point);

                if (!visited.has(key)) {
                    const char = grid.data[y][x];
                    const points = flood(point, char);
                    if (points.size > 0) {
                        regions.push({ char, points });
                    }
                }
            }
        }

        return regions;
    }

    const countStraightSections = (region: Region): number => {
        const points = Array.from(region.points).map(stringToPoint);
        const directions = [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: -1, y: 0 }
        ];

        let sideCount = 0;

        for (const dir of directions) {
            const side = new Set<string>();

            for (const p of points) {
                const neighbor = { x: p.x + dir.x, y: p.y + dir.y };
                if (!region.points.has(pointToString(neighbor))) {
                    side.add(pointToString(neighbor));
                }
            }

            const toRemove = new Set<string>();
            const perpDir = { x: dir.y, y: dir.x };

            for (const pointStr of side) {
                const p = stringToPoint(pointStr);
                let temp = { x: p.x + perpDir.x, y: p.y + perpDir.y };

                while (side.has(pointToString(temp))) {
                    toRemove.add(pointToString(temp));
                    temp = { x: temp.x + perpDir.x, y: temp.y + perpDir.y };
                }
            }

            sideCount += side.size - toRemove.size;
        }

        return sideCount;
    }

    const regions = findRegions({ data: grid, width: grid[0].length, height: grid.length });

    let totalPrice = 0;
    regions.forEach((region) => {
        const straightSections = countStraightSections(region);
        totalPrice += region.points.size * straightSections;
    });

    return totalPrice;
}

console.log(main2());