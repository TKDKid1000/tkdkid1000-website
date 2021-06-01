import fs from "fs"

function writeJson(file:fs.PathLike, json:any): void {
    fs.writeFileSync(file, JSON.stringify(json))
}

function readJson(file:fs.PathLike): any {
    return JSON.parse(fs.readFileSync(file, "utf8"))
}

export default {writeJson, readJson}