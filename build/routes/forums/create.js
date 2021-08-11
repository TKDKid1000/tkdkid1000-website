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
    app.get("/forums/create", function (req, res) {
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
        if (!session.attributes.user) {
            res.status(403).render("error/403", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files });
            return;
        }
        var forums = utils_js_1.default.readJson("./data/forums.json");
        res.render("forums/create", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files, forums: forums });
    });
    app.post("/forums/create", function (req, res) {
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
        if (session.attributes.user) {
            var forums = utils_js_1.default.readJson("./data/forums.json");
            var params = req.body;
            var channelPath = params["channel"].split("/");
            forums[channelPath[0]]["channels"][channelPath[1]]["posts"].push({
                title: params.title,
                timestamp: new Date().getTime(),
                content: params.content,
                author: session.attributes.user.email,
                comments: []
            });
            forums[channelPath[0]]["channels"][channelPath[1]]["lastpost"] = forums[channelPath[0]]["channels"][channelPath[1]]["posts"].length - 1;
            utils_js_1.default.writeJson("./data/forums.json", forums);
            res.render("forums/forums", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [{ text: "Successfully posted to the forums!", type: "success" }], custompages: files, forums: forums });
        }
        else {
            res.status(403).render("error/403");
        }
    });
}
exports.default = default_1;
