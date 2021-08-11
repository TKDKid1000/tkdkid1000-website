"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var marked_1 = __importDefault(require("marked"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var utils_js_1 = __importDefault(require("../utils.js"));
var config_json_1 = __importDefault(require("../config.json"));
function default_1(app) {
    app.get("/pages/:page", function (req, res) {
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
        var content = "";
        try {
            content = marked_1.default(fs_1.default.readFileSync("./pages/" + req.params.page + ".md", 'utf-8'));
        }
        catch (e) {
            content = "# That page does not exist!\nNot a 404 error, just the site owner didn't add this page.";
        }
        res.render("custompage", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], pageContent: marked_1.default(content), custompages: files });
    });
    app.get("/pages", function (req, res) {
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
        res.render("custompage", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files });
    });
}
exports.default = default_1;
