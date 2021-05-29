import fs from "fs"

function writeJson(file, json) {
    fs.writeFileSync(file, JSON.stringify(json))
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file))
}

export default {writeJson, readJson}