#!/usr/bin/env node

const express = require("express")
const session = require("express-session")
const favicon = require("serve-favicon")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("./utils")
const config = require("../config")

const app = express()
const engine = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./src/views")
app.set("view engine", "liquid")
app.use("/assets", express.static("./assets"))
app.use(session({secret: '947084975',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({
    extended: true
}))
app.use(favicon("./assets/head.png"))
app.use("/marked", express.static("node_modules/marked"))
app.use("/index.md", express.static("./index.md"))

require("./routes/index")(app)
require("./routes/login")(app)
require("./routes/register")(app)
require("./routes/logout")(app)
require("./routes/pages")(app)
require("./routes/forums/forums")(app)
require("./routes/forums/post")(app)
require("./routes/forums/create")(app)

if (!fs.existsSync("./data/")) fs.mkdirSync("./data")
if (!fs.existsSync("./data/users.json")) utils.writeJson("./data/users.json", {})
if (!fs.existsSync("./data/forums.json")) utils.writeJson("./data/forums.json", {})
if (!fs.existsSync("./pages/")) fs.mkdirSync("./pages")
if (!fs.existsSync("./index.md")) fs.writeFileSync("./index.md", "# Your stuff here!")
app.get("*", (req, res) => {
    var session = req.session;
    if (session.attributes === undefined) {
        session.attributes = {}
    }
    var files = []
    fs.readdirSync("./pages").forEach(file => {
        if (path.extname(file) == ".md") {
            files.push(file.replace(".md",""))
        }
    })
    res.render("error/404", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
})


module.exports = app