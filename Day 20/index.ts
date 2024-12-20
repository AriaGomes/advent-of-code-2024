import fs from 'fs'

const data = fs.readFileSync('./data.txt', 'utf-8')

const main = () => {
    type Point = { x: number; y: number };
    type CameFrom = Map<string, Point>;

    const parse = (data: string): { walls: Set<string>; start: Point; end: Point } => {
        const walls = new Set<string>();
        let start: Point | null = null;
        let end: Point | null = null;

        data.split("\n").forEach((line, y) => {
            line.split("").forEach((char, x) => {
                if (char === "S") start = { x, y };
                else if (char === "E") end = { x, y };
                else if (char === "#") walls.add(`${x},${y}`);
            });
        });

        if (!start || !end) throw new Error("Invalid input: Missing start or end");

        return { walls, start, end };
    }

    const neighbors4 = (x: number, y: number): Point[] => {
        return [
            { x, y: y - 1 }, // Up
            { x, y: y + 1 }, // Down
            { x: x - 1, y }, // Left
            { x: x + 1, y }, // Right
        ];
    }

    const dijkstra = (
        start: Point,
        neighborsFn: (n: Point) => Point[]
    ): { cameFrom: CameFrom; cost: Map<string, number> } => {
        const cameFrom = new Map<string, Point>();
        const cost = new Map<string, number>();
        const queue: [Point, number][] = [[start, 0]];

        cost.set(`${start.x},${start.y}`, 0);

        while (queue.length > 0) {
            const [current, currentCost] = queue.shift()!;
            const currentKey = `${current.x},${current.y}`;

            for (const neighbor of neighborsFn(current)) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                const newCost = currentCost + 1;

                if (!cost.has(neighborKey) || newCost < cost.get(neighborKey)!) {
                    cost.set(neighborKey, newCost);
                    cameFrom.set(neighborKey, current);
                    queue.push([neighbor, newCost]);
                }
            }
        }

        return { cameFrom, cost };
    }

    const part1 = (walls: Set<string>, start: Point, end: Point): number => {
        const neighbors = (n: Point): Point[] => {
            return neighbors4(n.x, n.y).filter(
                (point) => !walls.has(`${point.x},${point.y}`)
            );
        }

        const { cameFrom } = dijkstra(start, neighbors);

        const path: Point[] = [];
        let pos = end;
        while (pos.x !== start.x || pos.y !== start.y) {
            path.push(pos);
            pos = cameFrom.get(`${pos.x},${pos.y}`)!;
        }
        path.push(start);
        path.reverse();

        let sum = 0;
        for (let i = 0; i < path.length; i++) {
            for (let j = i + 102; j < path.length; j++) {
                const dist =
                    Math.abs(path[j].x - path[i].x) + Math.abs(path[j].y - path[i].y);
                if (dist === 2) {
                    sum++;
                }
            }
        }
        return sum;
    }

    const part2 = (walls: Set<string>, start: Point, end: Point): number => {
        function neighbors(n: Point): Point[] {
            return neighbors4(n.x, n.y).filter(
                (point) => !walls.has(`${point.x},${point.y}`)
            );
        }

        const { cameFrom } = dijkstra(start, neighbors);

        const path: Point[] = [];
        let pos = end;
        while (pos.x !== start.x || pos.y !== start.y) {
            path.push(pos);
            pos = cameFrom.get(`${pos.x},${pos.y}`)!;
        }
        path.push(start);
        path.reverse();

        let sum = 0;
        for (let i = 0; i < path.length; i++) {
            for (let j = i + 102; j < path.length; j++) {
                const dist =
                    Math.abs(path[j].x - path[i].x) + Math.abs(path[j].y - path[i].y);
                if (dist <= 20 && j - i - dist >= 100) {
                    sum++;
                }
            }
        }
        return sum;
    }

    const { walls, start, end } = parse(data);
    console.log("Part 1:", part1(walls, start, end));
    console.log("Part 2:", part2(walls, start, end));
}

main();