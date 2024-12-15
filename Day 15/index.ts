import fs from 'fs';

const data = fs.readFileSync('data.txt', 'utf8');
const lines = data.split('\n');

const solve = () => {
    const splits = lines.join('\n').split('\n\n');
    const map = splits[0].split('\n').map((line) => line.split(''));
    const data = splits[1].replace(/\n/g, '');

    let { x: rx, y: ry } = getMapPoints(map, '@')[0];

    for (const c of data) {
        const { dx, dy } = getDirection(c);

        let nx = rx + dx;
        let ny = ry + dy;
        while (map[ny][nx] === 'O') {
            nx += dx;
            ny += dy;
        }

        if (map[ny][nx] === '#') continue;

        map[ry][rx] = '.';
        rx += dx;
        ry += dy;
        map[ny][nx] = 'O';
        map[ry][rx] = '@';
    }

    let part1 = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'O') {
                part1 += y * 100 + x;
            }
        }
    }

    let newMap = splits[0].split('\n').map((line) =>
        line
            .split('')
            .map((char) =>
                char === '#' ? '##' : char === 'O' ? '[]' : char === '.' ? '..' : '@.'
            )
            .join('')
    );

    map.splice(0, map.length, ...newMap.map((line) => line.split('')));

    ({ x: rx, y: ry } = getMapPoints(map, '@')[0]);

    let nextPoints: { x: number; y: number }[] = [];
    let scratch: { x: number; y: number }[] = [];
    const boxes: { x: number; y: number }[] = [];

    for (const c of data) {
        const { dx, dy } = getDirection(c);

        if (dy === 0) {
            if (map[ry][rx + dx] === '.') {
                map[ry][rx] = '.';
                rx += dx;
                map[ry][rx] = '@';
                continue;
            }

            let nx = rx + dx;
            let ny = ry;
            while (map[ny][nx] === '[' || map[ny][nx] === ']') {
                nx += dx;
            }

            if (map[ny][nx] === '#') continue;

            map[ry][rx] = '.';
            rx += dx;
            let temp = map[ry][rx];
            map[ry][rx] = '@';

            nx = rx + dx;
            ny = ry;
            while (map[ny][nx] !== '.') {
                const temp2 = map[ny][nx];
                map[ny][nx] = temp;
                temp = temp2;
                nx += dx;
            }

            map[ny][nx] = temp;
        } else {
            if (map[ry + dy][rx] === '#') continue;

            if (map[ry + dy][rx] === '.') {
                map[ry][rx] = '.';
                ry += dy;
                map[ry][rx] = '@';
                continue;
            }

            boxes.length = 0;
            nextPoints.length = 0;
            nextPoints.push({ x: rx, y: ry + dy });

            let flag = true;
            while (nextPoints.length > 0) {
                scratch.length = 0;

                for (const { x: px, y: py } of nextPoints) {
                    if (map[py][px] === '#') {
                        flag = false;
                        scratch.length = 0;
                        break;
                    }

                    if (map[py][px] === '[') {
                        boxes.push({ x: px, y: py });
                        scratch.push({ x: px, y: py + dy });
                        scratch.push({ x: px + 1, y: py + dy });
                    } else if (map[py][px] === ']') {
                        boxes.push({ x: px - 1, y: py });
                        scratch.push({ x: px, y: py + dy });
                        scratch.push({ x: px - 1, y: py + dy });
                    }
                }

                [scratch, nextPoints] = [nextPoints, scratch];
            }

            if (!flag) continue;

            for (let i = boxes.length - 1; i >= 0; i--) {
                const { x: bx, y: by } = boxes[i];
                map[by + dy][bx] = '[';
                map[by][bx] = '.';
                map[by + dy][bx + 1] = ']';
                map[by][bx + 1] = '.';
            }

            map[ry][rx] = '.';
            ry += dy;
            map[ry][rx] = '@';
        }
    }

    let part2 = 0;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '[') {
                part2 += y * 100 + x;
            }
        }
    }

    return [part1.toString(), part2.toString()];
}

const getDirection = (c: string): { dx: number; dy: number } => {
    switch (c) {
        case '<':
            return { dx: -1, dy: 0 };
        case '>':
            return { dx: 1, dy: 0 };
        case '^':
            return { dx: 0, dy: -1 };
        case 'v':
        default:
            return { dx: 0, dy: 1 };
    }
}

const getMapPoints = (
    map: string[][],
    item: string
): { x: number; y: number }[] => {
    const points: { x: number; y: number }[] = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === item) {
                points.push({ x, y });
            }
        }
    }
    return points;
}

const main = () => {
    const [part1, part2] = solve();
    console.log("Part 1:", part1);
    console.log("Part 2:", part2);
}

main();
