#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_session_1 = __importDefault(require("cookie-session"));
var liquidjs_1 = require("liquidjs");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var utils_1 = __importDefault(require("./utils"));
var config_json_1 = __importDefault(require("./config.json"));
var app = express_1.default();
var engine = new liquidjs_1.Liquid();
app.engine("liquid", engine.express());
app.set("views", "./views");
app.set("view engine", "liquid");
app.use("/assets", express_1.default.static("./assets"));
app.use(cookie_session_1.default({
    name: "session",
    keys: ["7ffe99ff16650c9f4c08"],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(require("serve-favicon")("./assets/head.png"));
app.use("/marked", express_1.default.static("node_modules/marked"));
app.use("/index.md", express_1.default.static("./index.md"));
var index_1 = __importDefault(require("./routes/index"));
index_1.default(app);
var login_1 = __importDefault(require("./routes/login"));
login_1.default(app);
var register_1 = __importDefault(require("./routes/register"));
register_1.default(app);
var logout_1 = __importDefault(require("./routes/logout"));
logout_1.default(app);
var pages_1 = __importDefault(require("./routes/pages"));
pages_1.default(app);
var forums_1 = __importDefault(require("./routes/forums/forums"));
forums_1.default(app);
var post_1 = __importDefault(require("./routes/forums/post"));
post_1.default(app);
var create_1 = __importDefault(require("./routes/forums/create"));
create_1.default(app);
var category_1 = __importDefault(require("./routes/forums/category"));
category_1.default(app);
var forum_1 = __importDefault(require("./routes/forums/forum"));
forum_1.default(app);
var admin_1 = __importDefault(require("./routes/admin"));
admin_1.default(app);
if (!fs_1.default.existsSync("./data/"))
    fs_1.default.mkdirSync("./data");
if (!fs_1.default.existsSync("./data/users.json"))
    utils_1.default.writeJson("./data/users.json", {});
if (!fs_1.default.existsSync("./data/forums.json"))
    utils_1.default.writeJson("./data/forums.json", {});
if (!fs_1.default.existsSync("./pages/"))
    fs_1.default.mkdirSync("./pages");
if (!fs_1.default.existsSync("./index.md"))
    fs_1.default.writeFileSync("./index.md", "# Your stuff here!");
app.get("*", function (req, res) {
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
    res.render("error/404", { title: config_json_1.default.title, "config": config_json_1.default, "user": session.attributes.user, alerts: [], custompages: files });
});
exports.default = app;
