import fs from 'fs'

interface PosVel {
    pos: { X: number, Y: number };
    vel: { X: number, Y: number };
    PosVel?: PosVel[];
}

const data = fs.readFileSync('data.txt', 'utf8')
const lines = data.split('\n')
const array: PosVel[] = lines.map(line => {
    const [X, Y, VX, VY] = line.match(/-?\d+/g)!.map(Number)
    return {
        pos: { X, Y },
        vel: { X: VX, Y: VY }
    }
})
const GRID_ROWS = 103 // 11
const GRID_COLS = 101 // 7
const grid: PosVel[][] = Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLS }, () => ({} as PosVel)))

const main = () => {
    const placePoints = (array: PosVel[]) => {
        array.forEach(point => {
            const { pos: { X, Y } } = point
            if (grid[Y] && grid[Y][X]) {
                if (grid[Y][X] instanceof Object) {
                    if (grid[Y][X].PosVel) {
                        grid[Y][X].PosVel.push(point)
                    } else {
                        grid[Y][X].PosVel = [point]
                    }
                } else {
                    grid[Y][X] = { pos: { X, Y }, vel: { X: 0, Y: 0 }, PosVel: [point] }
                }
            }
        })
    }

    const printGrid = () => {
        grid.forEach(row => {
            let str = ''
            row.forEach(cell => {
                if (cell instanceof Object) {
                    if (cell.PosVel && cell.PosVel.length > 0) {
                        str += cell.PosVel.length
                    } else {
                        str += '.'
                    }
                } else {
                    str += '.'
                }
            })
            console.log(str)
        })
    }

    const movePoints = () => {
        array.forEach(point => {
            const { pos: { X, Y }, vel: { X: VX, Y: VY } } = point
            if (grid[Y][X].PosVel) {
                const index = grid[Y][X].PosVel.indexOf(point)
                if (index > -1) {
                    grid[Y][X].PosVel.splice(index, 1)
                }
                if (grid[Y][X].PosVel.length === 0) {
                    delete grid[Y][X].PosVel
                }
            }

            point.pos.X = (X + VX + GRID_COLS) % GRID_COLS
            point.pos.Y = (Y + VY + GRID_ROWS) % GRID_ROWS

            const newX = point.pos.X
            const newY = point.pos.Y

            if (grid[newY] && grid[newY][newX]) {
                if (grid[newY][newX] instanceof Object) {
                    if (grid[newY][newX].PosVel) {
                        grid[newY][newX].PosVel.push(point)
                    } else {
                        grid[newY][newX].PosVel = [point]
                    }
                } else {
                    grid[newY][newX] = { pos: { X: newX, Y: newY }, vel: { X: 0, Y: 0 }, PosVel: [point] }
                }
            }
        })
    }

    const getQuadrantRobots = () => {
        const quadrants = Array.from({ length: 4 }, () => 0)
        const middleRow = Math.floor(GRID_ROWS / 2)
        const middleCol = Math.floor(GRID_COLS / 2)

        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.PosVel) {
                    cell.PosVel.forEach(point => {
                        const { pos: { X, Y } } = point

                        if (X === middleCol || Y === middleRow) {
                            return
                        }

                        if (X < middleCol && Y < middleRow) {
                            quadrants[0]++
                        } else if (X >= middleCol && Y < middleRow) {
                            quadrants[1]++
                        } else if (X < middleCol && Y >= middleRow) {
                            quadrants[2]++
                        } else {
                            quadrants[3]++
                        }
                    })
                }
            })
        })
        return quadrants
    }

    placePoints(array)

    for (let i = 0; i < 100; i++) {
        movePoints()
    }

    printGrid()

    const quadrants = getQuadrantRobots()
    const safteyFactor = quadrants.reduce((acc, curr) => acc * curr, 1)

    return safteyFactor
}

const main2 = () => {
    const placePoints = (array: PosVel[]) => {
        array.forEach(point => {
            const { pos: { X, Y } } = point
            if (grid[Y] && grid[Y][X]) {
                if (grid[Y][X] instanceof Object) {
                    if (grid[Y][X].PosVel) {
                        grid[Y][X].PosVel.push(point)
                    } else {
                        grid[Y][X].PosVel = [point]
                    }
                } else {
                    grid[Y][X] = { pos: { X, Y }, vel: { X: 0, Y: 0 }, PosVel: [point] }
                }
            }
        })
    }

    const printGrid = () => {
        grid.forEach(row => {
            let str = ''
            row.forEach(cell => {
                if (cell instanceof Object) {
                    if (cell.PosVel && cell.PosVel.length > 0) {
                        str += cell.PosVel.length
                    } else {
                        str += '.'
                    }
                } else {
                    str += '.'
                }
            })
            console.log(str)
        })
    }

    const movePoints = () => {
        array.forEach(point => {
            const { pos: { X, Y }, vel: { X: VX, Y: VY } } = point
            if (grid[Y][X].PosVel) {
                const index = grid[Y][X].PosVel.indexOf(point)
                if (index > -1) {
                    grid[Y][X].PosVel.splice(index, 1)
                }
                if (grid[Y][X].PosVel.length === 0) {
                    delete grid[Y][X].PosVel
                }
            }

            point.pos.X = (X + VX + GRID_COLS) % GRID_COLS
            point.pos.Y = (Y + VY + GRID_ROWS) % GRID_ROWS

            const newX = point.pos.X
            const newY = point.pos.Y

            if (grid[newY] && grid[newY][newX]) {
                if (grid[newY][newX] instanceof Object) {
                    if (grid[newY][newX].PosVel) {
                        grid[newY][newX].PosVel.push(point)
                    } else {
                        grid[newY][newX].PosVel = [point]
                    }
                } else {
                    grid[newY][newX] = { pos: { X: newX, Y: newY }, vel: { X: 0, Y: 0 }, PosVel: [point] }
                }
            }
        })
    }

    const getQuadrantRobots = () => {
        const quadrants = Array.from({ length: 4 }, () => 0)
        const middleRow = Math.floor(GRID_ROWS / 2)
        const middleCol = Math.floor(GRID_COLS / 2)

        grid.forEach(row => {
            row.forEach(cell => {
                if (cell.PosVel) {
                    cell.PosVel.forEach(point => {
                        const { pos: { X, Y } } = point

                        if (X === middleCol || Y === middleRow) {
                            return
                        }

                        if (X < middleCol && Y < middleRow) {
                            quadrants[0]++
                        } else if (X >= middleCol && Y < middleRow) {
                            quadrants[1]++
                        } else if (X < middleCol && Y >= middleRow) {
                            quadrants[2]++
                        } else {
                            quadrants[3]++
                        }
                    })
                }
            })
        })
        return quadrants
    }

    const part2FindAnomaly = () => {
        let largestArea = 0
        let area = 0
        const visited = Array.from({ length: GRID_ROWS }, () => Array.from({ length: GRID_COLS }, () => false))

        const dfs = (row: number, col: number) => {
            if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS || visited[row][col]) {
                return
            }
            visited[row][col] = true
            if (grid[row][col].PosVel) {
                area++

                dfs(row - 1, col)
                dfs(row + 1, col)
                dfs(row, col - 1)
                dfs(row, col + 1)
            }
        }

        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.PosVel && !visited[i][j]) {
                    area = 0
                    dfs(i, j)
                    largestArea = Math.max(largestArea, area)
                }
            })
        })

        return largestArea
    }

    placePoints(array)

    for (let i = 0; i < 100000; i++) {
        movePoints()
        if (part2FindAnomaly() >= 50) {
            console.log("Anomaly found at second: ", i + 1)
            printGrid()
        }
    }

    const quadrants = getQuadrantRobots()
    const safteyFactor = quadrants.reduce((acc, curr) => acc * curr, 1)

    return safteyFactor
}

console.log(main2())