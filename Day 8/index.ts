import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const grid = data.split("\n").map((line) => line.split(""));

const main = () => {
    type Position = { x: number, y: number };
    const parseGrid = (grid: string[][]): Map<string, Position[]> => {
        const antennas = new Map<string, Position[]>();
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const char = grid[y][x];
                if (char !== '.') {
                    if (!antennas.has(char)) {
                        antennas.set(char, []);
                    }
                    antennas.get(char)!.push({ x, y });
                }
            }
        }
        return antennas;
    }

    const calculateAntinodes = (antennas: Map<string, Position[]>): Set<string> => {
        const antinodes = new Set<string>();

        antennas.forEach((positions) => {
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const p1 = positions[i];
                    const p2 = positions[j];

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;

                    const antinode1 = { x: p1.x - dx, y: p1.y - dy };
                    const antinode2 = { x: p2.x + dx, y: p2.y + dy };

                    if (isWithinBounds(antinode1, grid)) {
                        antinodes.add(`${antinode1.x},${antinode1.y}`);
                    }
                    if (isWithinBounds(antinode2, grid)) {
                        antinodes.add(`${antinode2.x},${antinode2.y}`);
                    }
                }
            }
        });

        return antinodes;
    }

    const isWithinBounds = (position: Position, grid: string[][]): boolean => {
        return position.x >= 0 && position.x < grid[0].length && position.y >= 0 && position.y < grid.length;
    }

    const countUniqueAntinodes = (grid: string[][]): number => {
        const antennas = parseGrid(grid);
        const antinodes = calculateAntinodes(antennas);
        return antinodes.size;
    }

    return countUniqueAntinodes(grid);
};

const main2 = () => {
    type Position = { x: number, y: number };

    const parseGrid = (grid: string[][]): Map<string, Position[]> => {
        const antennas = new Map<string, Position[]>();
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const char = grid[y][x];
                if (char !== '.') {
                    if (!antennas.has(char)) {
                        antennas.set(char, []);
                    }
                    antennas.get(char)!.push({ x, y });
                }
            }
        }
        return antennas;
    }

    const calculateAntinodes = (antennas: Map<string, Position[]>): Set<string> => {
        const antinodes = new Set<string>();

        antennas.forEach((positions) => {
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const p1 = positions[i];
                    const p2 = positions[j];

                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;

                    for (let k = 1; k <= Math.max(grid[0].length, grid.length); k++) {
                        const antinode1 = { x: p1.x - k * dx, y: p1.y - k * dy };
                        const antinode2 = { x: p2.x + k * dx, y: p2.y + k * dy };

                        if (isWithinBounds(antinode1, grid)) {
                            antinodes.add(`${antinode1.x},${antinode1.y}`);
                        }
                        if (isWithinBounds(antinode2, grid)) {
                            antinodes.add(`${antinode2.x},${antinode2.y}`);
                        }
                    }
                }
            }

            if (positions.length >= 2) {
                positions.forEach((pos) => {
                    antinodes.add(`${pos.x},${pos.y}`);
                });
            }
        });

        return antinodes;
    }

    const isWithinBounds = (position: Position, grid: string[][]): boolean => {
        return position.x >= 0 && position.x < grid[0].length && position.y >= 0 && position.y < grid.length;
    }

    const countUniqueAntinodes = (grid: string[][]): number => {
        const antennas = parseGrid(grid);
        const antinodes = calculateAntinodes(antennas);
        return antinodes.size;
    }

    return countUniqueAntinodes(grid);
};

console.log(main2());