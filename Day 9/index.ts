import fs from 'fs'

const data: string = fs.readFileSync('data.txt', 'utf8')

const main = () => {
    const parseDiskMap = (input: string): string[] => {
        const disk: string[] = [];
        let isFile = true;
        let fileId = 0;

        for (const char of input) {
            const length = parseInt(char, 10);
            if (isFile) {
                disk.push(...Array(length).fill(fileId.toString()));
                fileId++;
            } else {
                disk.push(...Array(length).fill("."));
            }
            isFile = !isFile;
        }

        return disk;
    }

    const compactDisk = (disk: string[]): string[] => {
        let pointer = disk.length - 1;

        while (pointer >= 0) {
            if (disk[pointer] !== ".") {
                const freeSpaceIndex = disk.indexOf(".");
                if (freeSpaceIndex < pointer) {
                    disk[freeSpaceIndex] = disk[pointer];
                    disk[pointer] = ".";
                }
            }
            pointer--;
        }

        return disk;
    }

    const calculateChecksum = (disk: string[]): number => {
        return disk.reduce((checksum, block, index) => {
            if (block !== ".") {
                return checksum + parseInt(block, 10) * index;
            }
            return checksum;
        }, 0);
    }

    const disk = parseDiskMap(data);
    const compactedDisk = compactDisk(disk);
    const checksum = calculateChecksum(compactedDisk);
    return checksum;

}

const main2 = () => {
    const parseDiskMap = (input: string): string[] => {
        const disk: string[] = [];
        let isFile = true;
        let fileId = 0;

        for (const char of input) {
            const length = parseInt(char, 10);
            if (isFile) {
                disk.push(...Array(length).fill(fileId.toString()));
                fileId++;
            } else {
                disk.push(...Array(length).fill("."));
            }
            isFile = !isFile;
        }

        return disk;
    }

    const compactDiskWholeFiles = (disk: string[]): string[] => {
        const fileIds = [...new Set(disk)].filter((id) => id !== ".").map(Number).sort((a, b) => b - a);

        for (const fileId of fileIds) {
            const start = disk.indexOf(fileId.toString());
            const end = disk.lastIndexOf(fileId.toString());

            const fileSize = end - start + 1;

            let freeSpaceStart = -1;
            for (let i = 0; i <= disk.length - fileSize; i++) {
                if (disk.slice(i, i + fileSize).every((block) => block === ".")) {
                    freeSpaceStart = i;
                    break;
                }
            }

            if (freeSpaceStart !== -1 && freeSpaceStart < start) {
                for (let i = start; i <= end; i++) {
                    disk[i] = ".";
                }
                for (let i = 0; i < fileSize; i++) {
                    disk[freeSpaceStart + i] = fileId.toString();
                }
            }
        }

        return disk;
    }

    const calculateChecksum = (disk: string[]): number => {
        return disk.reduce((checksum, block, index) => {
            if (block !== ".") {
                return checksum + parseInt(block, 10) * index;
            }
            return checksum;
        }, 0);
    }

    const disk = parseDiskMap(data);
    const compactedDisk = compactDiskWholeFiles(disk);
    const checksum = calculateChecksum(compactedDisk);
    return checksum;
}

console.log(main2())