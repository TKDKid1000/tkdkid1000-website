const express = require("express")
const session = require("express-session")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("./utils")
const config = require("./config")

const app = express()
const engine = new Liquid()

app.engine("liquid", engine.express())
app.set("views", "./views")
app.set("view engine", "liquid")
app.use(express.static("static"))
app.use(session({secret: '947084975',saveUninitialized: true,resave: true}));
app.use(express.urlencoded({
    extended: true
}))

require("./routes/index")(app)
require("./routes/login")(app)
require("./routes/register")(app)
require("./routes/logout")(app)
require("./routes/pages")(app)

try {
    fs.mkdirSync("./data")
    utils.writeJson("./data/users.json", {})
} catch (e) {

}

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

app.listen(config.server.port, config.server.hostname, () => {
    console.log("Server listening")
})