import { writeFileSync, readFileSync } from "fs"

function writeJson(file, json) {
    writeFileSync(file, JSON.stringify(json))
}

function readJson(file) {
    return JSON.parse(readFileSync(file))
}

export default {writeJson, readJson}