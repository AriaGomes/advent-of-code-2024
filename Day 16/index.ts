import fs from 'fs';

const data = fs.readFileSync('data.txt', 'utf8');
const grid = data.split('\n').filter(Boolean).map((line) => line.split(''));

const directions: [number, number][] = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1]
];

const main = () => {
    let start: [number, number] = [0, 0];
    let end: [number, number] = [0, 0];

    class PriorityQueue<T> {
        private items: { value: T, priority: number }[] = [];

        enqueue(value: T, priority: number) {
            this.items.push({ value, priority });
            this.items.sort((a, b) => a.priority - b.priority);
        }

        dequeue(): T | undefined {
            return this.items.shift()?.value;
        }

        get length(): number {
            return this.items.length;
        }
    }

    const dijkstra = (start: [number, number], end: [number, number]) => {
        const queue = new PriorityQueue<{ x: number, y: number, dir: number, cost: number }>();

        const visited: boolean[][][] = Array.from({ length: grid.length }, () =>
            Array.from({ length: grid[0].length }, () => Array(4).fill(false))
        );

        queue.enqueue({ x: start[0], y: start[1], dir: 0, cost: 0 }, 0);

        while (queue.length) {
            const current = queue.dequeue();
            if (!current) continue;

            const { x, y, dir, cost } = current;

            if (x === end[0] && y === end[1]) {
                return cost;
            }

            if (visited[y][x][dir]) continue;
            visited[y][x][dir] = true;

            const [dx, dy] = directions[dir];
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < grid[0].length && ny < grid.length &&
                grid[ny][nx] !== '#' &&
                !visited[ny][nx][dir]
            ) {
                queue.enqueue({ x: nx, y: ny, dir, cost: cost + 1 }, cost + 1);
            }

            const clockwiseDir = (dir + 1) % 4;
            if (!visited[y][x][clockwiseDir]) {
                queue.enqueue({ x, y, dir: clockwiseDir, cost: cost + 1000 }, cost + 1000);
            }

            const counterClockwiseDir = (dir + 3) % 4;
            if (!visited[y][x][counterClockwiseDir]) {
                queue.enqueue({ x, y, dir: counterClockwiseDir, cost: cost + 1000 }, cost + 1000);
            }
        }

        return Infinity;
    };

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 'S') start = [x, y];
            if (grid[y][x] === 'E') end = [x, y];
        }
    }

    const result = dijkstra(start, end);
    return result;
};



const main2 = () => {
    type Position = [number, number];
    type Direction = [number, number];

    class PriorityQueue<T> {
        private heap: { cost: number, data: T }[] = [];

        enqueue(item: T, cost: number) {
            this.heap.push({ cost, data: item });
            this.heapifyUp();
        }

        dequeue(): T | undefined {
            if (this.isEmpty()) return undefined;
            const root = this.heap[0];
            const last = this.heap.pop();
            if (this.heap.length > 0 && last) {
                this.heap[0] = last;
                this.heapifyDown();
            }
            return root?.data;
        }

        isEmpty(): boolean {
            return this.heap.length === 0;
        }

        peek(): T | undefined {
            return this.heap[0]?.data;
        }

        private heapifyUp() {
            let idx = this.heap.length - 1;
            while (idx > 0) {
                const parentIdx = Math.floor((idx - 1) / 2);
                if (this.heap[idx].cost >= this.heap[parentIdx].cost) break;
                [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
                idx = parentIdx;
            }
        }

        private heapifyDown() {
            let idx = 0;
            while (2 * idx + 1 < this.heap.length) {
                let leftIdx = 2 * idx + 1;
                let rightIdx = 2 * idx + 2;
                let smallest = idx;

                if (leftIdx < this.heap.length && this.heap[leftIdx].cost < this.heap[smallest].cost) {
                    smallest = leftIdx;
                }
                if (rightIdx < this.heap.length && this.heap[rightIdx].cost < this.heap[smallest].cost) {
                    smallest = rightIdx;
                }
                if (smallest === idx) break;

                [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
                idx = smallest;
            }
        }
    }

    const neighbors = ([y, x]: Position): Position[] => {
        const rows = grid.length;
        const cols = grid[0].length;
        const validNeighbors: Position[] = [];

        for (let [dy, dx] of directions) {
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < rows && nx >= 0 && nx < cols && grid[ny][nx] !== '#') {
                validNeighbors.push([ny, nx]);
            }
        }

        return validNeighbors;
    };

    const getDirection = (from: Position, to: Position): Direction => {
        const [fy, fx] = from;
        const [ty, tx] = to;
        const dy = Math.sign(ty - fy);
        const dx = Math.sign(tx - fx);
        return [dy, dx];
    };

    const bestPath = (start: Position, initialDir: Direction): number => {
        const stop = findEnd();
        const pq = new PriorityQueue<{ pos: Position; cost: number; dir: Direction | null }>();
        const visited: Set<string> = new Set();
        pq.enqueue({ pos: start, cost: 0, dir: initialDir }, 0);
        visited.add(start.toString());

        while (!pq.isEmpty()) {
            const { pos, cost, dir } = pq.dequeue()!;
            if (pos[0] === stop[0] && pos[1] === stop[1]) return cost;

            for (const neighbor of neighbors(pos)) {
                const newDir = getDirection(pos, neighbor);
                if (!visited.has(neighbor.toString())) {
                    const newCost = cost + (dir && newDir[0] === dir[0] && newDir[1] === dir[1] ? 1 : 1001);
                    visited.add(neighbor.toString());
                    pq.enqueue({ pos: neighbor, cost: newCost, dir: newDir }, newCost);
                }
            }
        }
        return Infinity;
    };

    const findEnd = (): Position => {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x] === 'E') {
                    return [y, x];
                }
            }
        }
        return [0, 0];
    };

    const findStart = (): Position => {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                if (grid[y][x] === 'S') {
                    return [y, x];
                }
            }
        }
        return [0, 0];
    };

    const dist: Map<string, number> = new Map();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== '#') {
                const min = directions.map(dir => bestPath([y, x], dir))
                    .reduce((minDist, curr) => Math.min(minDist, curr), Infinity);
                dist.set(`${y},${x}`, min);
            }
        }
    }

    const start = findStart();
    const end = findEnd();
    const pq = new PriorityQueue<{ pos: Position; cost: number; dir: Direction | null; seen: Set<string> }>();
    const bestScore = bestPath(start, [0, 1]);
    const scores: Set<string>[] = [];

    pq.enqueue({ pos: start, cost: 0, dir: [0, 1], seen: new Set([start.toString()]) }, 0);

    while (!pq.isEmpty()) {
        const { pos, cost, dir, seen } = pq.dequeue()!;
        if (pos[0] === end[0] && pos[1] === end[1]) {
            scores.push(seen);
            const allSeen = new Set<string>();
            scores.forEach(score => score.forEach(val => allSeen.add(val)));
            continue;
        }

        const canGet = cost + (dist.get(pos.toString()) || 0);
        if (canGet > bestScore) continue;

        for (const neighbor of neighbors(pos)) {
            if (!seen.has(neighbor.toString())) {
                const newSeen = new Set(seen);
                newSeen.add(neighbor.toString());
                const newDir = getDirection(pos, neighbor);
                const newCost = cost + (dir && newDir[0] === dir[0] && newDir[1] === dir[1] ? 1 : 1001);
                pq.enqueue({ pos: neighbor, cost: newCost, dir: newDir, seen: newSeen }, newCost);
            }
        }
    }

    const allSeen = new Set<string>();
    scores.forEach(score => score.forEach(val => allSeen.add(val)));
    return allSeen.size;
};

console.log(main2());
