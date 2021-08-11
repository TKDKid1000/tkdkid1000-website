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
    app.get("/register", function (req, res) {
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
        res.render("register", { title: config_json_1.default.title, "config": config_json_1.default, "user": session.attributes.user, custompages: files });
    });
    app.post("/register", function (req, res) {
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
        var usernameTaken = false;
        for (var email in users) {
            if (users[email]["username"].toLowerCase() == params.username.toLowerCase()) {
                usernameTaken = true;
            }
            if (users[params.email.toLowerCase()]) {
                usernameTaken = true;
            }
        }
        if (!usernameTaken) {
            res.render("login", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: [{ "text": "Succesfully registered! Please login.", "type": "success" }], custompages: files });
            users[params.email] = { password: params.password, username: params.username };
            utils_js_1.default.writeJson("./data/users.json", users);
        }
        else {
            alerts.push({ text: "There is already an account registered with that email/username!", type: "danger" });
            res.render("register", { title: config_json_1.default.title, users: utils_js_1.default.readJson("./data/users.json"), "config": config_json_1.default, "user": session.attributes.user, alerts: alerts, custompages: files });
        }
    });
}
exports.default = default_1;
