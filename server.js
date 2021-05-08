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

// app.get("/", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     res.render("index", {title: config.title, "config": config, "user": session.attributes.user, alerts: []})
// })

// app.get("/login", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     res.render("login", {title: config.title, "config": config, "user": session.attributes.user})
// })

// app.post("/login", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     const users = utils.readJson("./data/users.json")
//     const params = req.body
//     var alerts = []
//     if (users[params.email] !== undefined) {
//         if (alerts.length == 0) {
//             if (users[params.email]["password"] == params.password) {
//                 session.attributes.user = {"email": params.email, "password": params.password}
//                 res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: [{text: "Succesfully logged in.", type: "success"}]})
//             } else {
//                 alerts.push({text: "An incorrect password was specified!", type: "danger"})
//             }
//         }
//     } else {
//         alerts.push({text: "No user is registered with that email!", type: "danger"})
//     }
//     res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts})
// })

// app.get("/register", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     res.render("register", {title: config.title, "config": config, "user": session.attributes.user})
// })

// app.post("/register", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     const users = utils.readJson("./data/users.json")
//     const params = req.body
//     var alerts = []
//     if (users[params.email] === undefined) {
//         res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: {"text": "Succesfully registered! Please login.", "type": "success"}})
//         users[params.email] = {password: params.password, cart: []}
//         utils.writeJson("./data/users.json", users)
//     } else {
//         alerts.push({text: "There is already an account registered with that email!", type: "danger"})
//         res.render("register", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts})
//     }
// })

// app.get("/logout", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     res.render("logout", {title: config.title, "config": config, "user": session.attributes.user, alerts: []})
//     delete session.attributes.user
// })

// app.get("/pages/:page", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     var content = ""
//     try {
//         content = marked(fs.readFileSync(`./pages/${req.params.page}.md`, 'utf-8'))
//     } catch (e) {
//         content = "# That page does not exist!\nNot a 404 error, just the site owner didn't add this page."
//     }
//     res.render("custompage", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], pageContent: marked(content)})
// })

// app.get("/pages", (req, res) => {
//     var session = req.session;
//     if (session.attributes === undefined) {
//         session.attributes = {}
//     }
//     var files = []
//     fs.readdirSync("./pages").forEach(file => {
//         if (path.extname(file) == ".md") {
//             files.push(file.replace(".md",""))
//         }
//     })
//     res.render("custompages", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
// })

app.get("*", (req, res) => {
    var session = req.session;
    if (session.attributes === undefined) {
        session.attributes = {}
    }
    res.render("error/404", {title: config.title, "config": config, "user": session.attributes.user, alerts: []})
})

app.listen(config.server.port, config.server.hostname, () => {
    console.log("Server listening")
})