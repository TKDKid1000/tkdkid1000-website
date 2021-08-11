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
    app.get("/login", function (req, res) {
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
        res.render("login", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, custompages: files });
    });
    app.post("/login", function (req, res) {
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
        var users = utils_js_1.default.readJson("./data/users.json");
        var params = req.body;
        var alerts = [];
        if (users[params.email] !== undefined) {
            if (alerts.length == 0) {
                if (users[params.email]["password"] == params.password) {
                    session.attributes.user = { "email": params.email, "password": params.password };
                    res.redirect("/");
                    return;
                }
                else {
                    alerts.push({ text: "An incorrect password was specified!", type: "danger" });
                }
            }
        }
        else {
            alerts.push({ text: "No user is registered with that email!", type: "danger" });
        }
        res.render("login", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: alerts, custompages: files });
    });
}
exports.default = default_1;
