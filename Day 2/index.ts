import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf-8');
const lines = data.trim().split('\n');
const linesArray = lines.map(line => line.trim().split(/\s+/).map(Number));

const main = () => {
    let safeReports = 0;

    linesArray.map(report => {
        let isReportSafe = true;
        let decreasingChanged = false;
        let increasingChanged = false;
        let lastLevel = -1;
        report.forEach((level, index) => {
            if (index === 0) {
                lastLevel = level;
            } else {
                if ((Math.abs(lastLevel - level) > 3) || (lastLevel === level)) {
                    isReportSafe = false;
                }
                if (lastLevel > level) {
                    decreasingChanged = true;
                }
                if (lastLevel < level) {
                    increasingChanged = true;
                }
                lastLevel = level;
            }
        }
        );
        if (decreasingChanged && increasingChanged) {
            isReportSafe = false;
        }
        if (isReportSafe) {
            safeReports++;
        }
    });

    return safeReports;
}

const main2 = () => {
    let safeReports = 0;
    const isSafe = (report: number[]) => {
        let decreasingChanged = false;
        let increasingChanged = false;
        let lastLevel = -1;
        for (let i = 0; i < report.length; i++) {
            const level = report[i];
            if (i === 0) {
                lastLevel = level;
            } else {
                if ((Math.abs(lastLevel - level) > 3) || (lastLevel === level)) {
                    return false;
                }
                if (lastLevel > level) {
                    decreasingChanged = true;
                }
                if (lastLevel < level) {
                    increasingChanged = true;
                }
                if (decreasingChanged && increasingChanged) {
                    return false;
                }
                lastLevel = level;
            }
        }
        return true;
    };

    linesArray.map(report => {
        let isReportSafe = isSafe(report);

        if (!isReportSafe) {
            for (let i = 0; i < report.length; i++) {
                const modifiedReport = report.slice(0, i).concat(report.slice(i + 1));
                if (isSafe(modifiedReport)) {
                    isReportSafe = true;
                    break;
                }
            }
        }

        if (isReportSafe) {
            safeReports++;
        }
    });
    return safeReports;
}



console.log(main2());