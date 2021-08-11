"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var utils_js_1 = __importDefault(require("../utils.js"));
var config_json_1 = __importDefault(require("../config.json"));
function default_1(app) {
    app.get("/admin", function (req, res) {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {};
        }
        var files = [];
        fs_1.default.readdirSync("./pages").forEach(function (file) {
            if (path_1.default.extname(file) == ".md") {
                files.push(file.replace(".md", ""));
            }
        });
        var forums = utils_js_1.default.readJson("./data/forums.json");
        res.render("admin", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files, forums: forums });
    });
    app.post("/admin", function (req, res) {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {};
        }
        var files = [];
        fs_1.default.readdirSync("./pages").forEach(function (file) {
            if (path_1.default.extname(file) == ".md") {
                files.push(file.replace(".md", ""));
            }
        });
        var forums = utils_js_1.default.readJson("./data/forums.json");
        var params = req.body;
        var alerts = [];
        switch (params["editor-type"]) {
            case "forums": {
                alerts.push({ "text": "Saved forums layout.", "type": "success" });
                console.log(JSON.parse(params["json-input"]));
            }
        }
        res.render("admin", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: alerts, custompages: files, forums: forums });
    });
}
exports.default = default_1;
