import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../config.json"

export default function (app: express.Application) {
    app.get("/register", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files: any = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        res.render("register", {title: config.title, "config": config, "user": session.attributes.user, custompages: files})
    })
    
    app.post("/register", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files: any = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        const users: any = utils.readJson("./data/users.json")
        const params: any = req.body
        var alerts: any = []
        var usernameTaken: boolean = false
        for (var email in users) {
            if (users[email]["username"].toLowerCase() == params.username.toLowerCase()) {
                usernameTaken = true
            }
            if (users[params.email.toLowerCase()]) {
                usernameTaken = true
            }
        }
        if (!usernameTaken) {
            res.render("login", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [{"text": "Succesfully registered! Please login.", "type": "success"}], custompages: files})
            users[params.email] = {password: params.password, username: params.username}
            utils.writeJson("./data/users.json", users)
        } else {
            alerts.push({text: "There is already an account registered with that email/username!", type: "danger"})
            res.render("register", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: alerts, custompages: files})
        }
    })
}
