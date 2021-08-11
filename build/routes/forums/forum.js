"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var utils_js_1 = __importDefault(require("../../utils.js"));
var config_json_1 = __importDefault(require("../../config.json"));
function default_1(app) {
    app.get("/forums/:c/:f", function (req, res) {
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
        try {
            res.render("forums/forum", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, cat: req.params.c, forum: req.params.f });
        }
        catch (e) {
            res.render("forums/forum", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, cat: false, forum: false });
        }
    });
}
exports.default = default_1;
