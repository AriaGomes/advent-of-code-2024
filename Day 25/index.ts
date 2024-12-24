import fs from 'fs';

const data = fs.readFileSync('./data.txt', 'utf8')

const main = () => {
    return data
}

console.log(main())