import * as fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const lines = data.trim().split('\n');
const linesArray: string[][] = lines.map(line => line.trim().split(''));

const main = () => {
    const searchWord = "XMAS";
    let searchWordFound = 0;

    const searchNormal = (line: string[]) => {
        for (let i = 0; i <= line.length - searchWord.length; i++) {
            let found = true;
            for (let j = 0; j < searchWord.length; j++) {
                if (line[i + j] !== searchWord[j]) {
                    found = false;
                    break;
                }
            }
            if (found) searchWordFound++;
        }
    }

    const searchBackwards = (line: string[]) => {
        for (let i = line.length - 1; i >= searchWord.length - 1; i--) {
            let found = true;
            for (let j = 0; j < searchWord.length; j++) {
                if (line[i - j] !== searchWord[j]) {
                    found = false;
                    break;
                }
            }
            if (found) searchWordFound++;
        }
    }

    const searchNormalVertical = (wordArray: string[][]) => {
        for (let col = 0; col < wordArray[0].length; col++) {
            for (let row = 0; row <= wordArray.length - searchWord.length; row++) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[row + k][col] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    }

    const searchBackwardsVertical = (wordArray: string[][]) => {
        for (let col = 0; col < wordArray[0].length; col++) {
            for (let row = wordArray.length - 1; row >= searchWord.length - 1; row--) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[row - k][col] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    }

    const searchDiagonalDownRight = (wordArray: string[][]) => {
        for (let i = 0; i <= wordArray.length - searchWord.length; i++) {
            for (let j = 0; j <= wordArray[i].length - searchWord.length; j++) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[i + k][j + k] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    };

    const searchDiagonalDownLeft = (wordArray: string[][]) => {
        for (let i = 0; i <= wordArray.length - searchWord.length; i++) {
            for (let j = searchWord.length - 1; j < wordArray[i].length; j++) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[i + k][j - k] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    };

    const searchDiagonalUpRight = (wordArray: string[][]) => {
        for (let i = searchWord.length - 1; i < wordArray.length; i++) {
            for (let j = 0; j <= wordArray[i].length - searchWord.length; j++) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[i - k][j + k] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    };

    const searchDiagonalUpLeft = (wordArray: string[][]) => {
        for (let i = searchWord.length - 1; i < wordArray.length; i++) {
            for (let j = searchWord.length - 1; j < wordArray[i].length; j++) {
                let found = true;
                for (let k = 0; k < searchWord.length; k++) {
                    if (wordArray[i - k][j - k] !== searchWord[k]) {
                        found = false;
                        break;
                    }
                }
                if (found) searchWordFound++;
            }
        }
    };

    for (let i = 0; i < linesArray.length; i++) {
        searchNormal(linesArray[i]);
        searchBackwards(linesArray[i]);
    }

    searchNormalVertical(linesArray);
    searchBackwardsVertical(linesArray);
    searchDiagonalDownRight(linesArray);
    searchDiagonalDownLeft(linesArray);
    searchDiagonalUpRight(linesArray);
    searchDiagonalUpLeft(linesArray);

    return searchWordFound;
}


const main2 = () => {
    const s1 = (x: number, y: number): boolean => {
        if (!linesArray[x - 1] || !linesArray[x + 1]) return false;
        return (linesArray[x - 1][y - 1] === 'M' && linesArray[x - 1][y + 1] === 'M') &&
            (linesArray[x + 1][y - 1] === 'S' && linesArray[x + 1][y + 1] === 'S');
    }

    const s2 = (x: number, y: number): boolean => {
        if (!linesArray[x - 1] || !linesArray[x + 1]) return false;
        return (linesArray[x - 1][y - 1] === 'M' && linesArray[x + 1][y - 1] === 'M') &&
            (linesArray[x - 1][y + 1] === 'S' && linesArray[x + 1][y + 1] === 'S');
    }

    const s3 = (x: number, y: number): boolean => {
        if (!linesArray[x - 1] || !linesArray[x + 1]) return false;
        return (linesArray[x + 1][y - 1] === 'M' && linesArray[x + 1][y + 1] === 'M') &&
            (linesArray[x - 1][y - 1] === 'S' && linesArray[x - 1][y + 1] === 'S');
    }

    const s4 = (x: number, y: number): boolean => {
        if (!linesArray[x - 1] || !linesArray[x + 1]) return false;
        return (linesArray[x - 1][y + 1] === 'M' && linesArray[x + 1][y + 1] === 'M') &&
            (linesArray[x - 1][y - 1] === 'S' && linesArray[x + 1][y - 1] === 'S');
    }

    let validXMasThings = 0;
    for (let i = 0; i < linesArray.length; i++) {
        for (let j = 0; j < linesArray[i].length; j++) {
            if (linesArray[i][j] === 'A') {
                const valid = s1(i, j) || s2(i, j) || s3(i, j) || s4(i, j);
                if (valid) {
                    validXMasThings++;
                }
            }
        }
    }
    return validXMasThings;
}

console.log(main2());