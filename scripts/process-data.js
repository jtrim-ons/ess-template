import fs from "fs";
import { csvParse } from "d3-dsv";
import { autoType } from "@onsvisual/robo-utils";

export function getData(path) {
    let str = fs.readFileSync(path).toString();
    return csvParse(str, autoType);
}

//let aaa = getData(`.static/data/csv-preprocess`);

let areasLookup = getData('./static/data/csv/areas.csv');

let fileNames = fs.readdirSync('./static/data/csv-preprocess/');

console.log(areasLookup[0])