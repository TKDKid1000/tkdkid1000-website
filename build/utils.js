"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function writeJson(file, json) {
    fs_1.default.writeFileSync(file, JSON.stringify(json));
}
function readJson(file) {
    return JSON.parse(fs_1.default.readFileSync(file, "utf8"));
}
exports.default = { writeJson: writeJson, readJson: readJson };
